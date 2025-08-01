import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../src/common/schemas/product.schema';
import { Category, CategoryDocument } from '../src/common/schemas/category.schema';

async function fixInvalidCategoryReferences() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const productModel = app.get<Model<ProductDocument>>('ProductModel');
  const categoryModel = app.get<Model<CategoryDocument>>('CategoryModel');
  
  console.log('🔍 Looking for products with invalid category references...');
  
  try {
    // Find products where category field is not a valid ObjectId
    const products = await productModel.find({}).lean();
    
    let fixedCount = 0;
    let deletedCount = 0;
    
    for (const product of products) {
      const categoryValue = product.category;
      
      // Check if category is a valid ObjectId
      if (!Types.ObjectId.isValid(categoryValue)) {
        console.log(`❌ Found invalid category reference: ${categoryValue} for product: ${product.name}`);
        
        // Try to find category by name
        const category = await categoryModel.findOne({ 
          name: { $regex: new RegExp(categoryValue.toString(), 'i') } 
        });
        
        if (category) {
          // Update product with valid category ObjectId
          await productModel.updateOne(
            { _id: product._id },
            { category: category._id }
          );
          console.log(`✅ Fixed category reference for product: ${product.name} -> ${category.name}`);
          fixedCount++;
        } else {
          // Delete product with invalid category reference
          await productModel.deleteOne({ _id: product._id });
          console.log(`🗑️ Deleted product with invalid category: ${product.name}`);
          deletedCount++;
        }
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`- Fixed products: ${fixedCount}`);
    console.log(`- Deleted products: ${deletedCount}`);
    
    // Also check for any remaining issues
    const remainingIssues = await productModel.aggregate([
      {
        $addFields: {
          isValidObjectId: {
            $cond: {
              if: { $type: "$category" },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $match: { isValidObjectId: false }
      }
    ]);
    
    if (remainingIssues.length > 0) {
      console.log(`⚠️ Still ${remainingIssues.length} products with invalid category references`);
    } else {
      console.log(`✅ All category references are now valid`);
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
  
  await app.close();
}

fixInvalidCategoryReferences().catch(console.error);
