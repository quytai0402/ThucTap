import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { Category } from '../src/common/schemas/category.schema';
import { Product } from '../src/common/schemas/product.schema';
import { getModelToken } from '@nestjs/mongoose';

async function syncCategoryProductCounts() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const categoryModel = app.get<Model<Category>>(getModelToken(Category.name));
  const productModel = app.get<Model<Product>>(getModelToken(Product.name));

  console.log('🔄 Starting category product count sync...');

  const categories = await categoryModel.find({});
  
  for (const category of categories) {
    const productCount = await productModel.countDocuments({ 
      category: category._id 
    });
    
    await categoryModel.findByIdAndUpdate(
      category._id,
      { productCount }
    );
    
    console.log(`📊 Updated "${category.name}": ${productCount} products`);
  }

  console.log('✅ Category product count sync completed!');
  await app.close();
}

syncCategoryProductCounts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error syncing category counts:', error);
    process.exit(1);
  });
