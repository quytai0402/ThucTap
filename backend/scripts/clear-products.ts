import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../src/common/schemas/product.schema';

async function clearProducts() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const productModel = app.get<Model<ProductDocument>>('ProductModel');
  
  try {
    const result = await productModel.deleteMany({});
    console.log('✅ Deleted', result.deletedCount, 'products');
  } catch (error) {
    console.error('❌ Error clearing products:', error);
  }

  await app.close();
}

clearProducts().catch(console.error);
