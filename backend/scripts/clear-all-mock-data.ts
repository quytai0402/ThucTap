import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../src/common/schemas/product.schema';
import { Category, CategoryDocument } from '../src/common/schemas/category.schema';
import { Order, OrderDocument } from '../src/common/schemas/order.schema';
import { User, UserDocument } from '../src/common/schemas/user.schema';
import { GuestCustomer, GuestCustomerDocument } from '../src/common/schemas/guest-customer.schema';
import { Review, ReviewDocument } from '../src/common/schemas/review.schema';

async function clearAllMockData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const productModel = app.get<Model<ProductDocument>>('ProductModel');
  const categoryModel = app.get<Model<CategoryDocument>>('CategoryModel');
  const orderModel = app.get<Model<OrderDocument>>('OrderModel');
  const userModel = app.get<Model<UserDocument>>('UserModel');
  const guestCustomerModel = app.get<Model<GuestCustomerDocument>>('GuestCustomerModel');
  const reviewModel = app.get<Model<ReviewDocument>>('ReviewModel');
  
  console.log('🧹 Starting database cleanup...');
  
  try {
    // Count current data
    const counts = {
      products: await productModel.countDocuments(),
      categories: await categoryModel.countDocuments(),
      orders: await orderModel.countDocuments(),
      users: await userModel.countDocuments(),
      guestCustomers: await guestCustomerModel.countDocuments(),
      reviews: await reviewModel.countDocuments(),
    };
    
    console.log('📊 Current data counts:');
    console.log(`   - Products: ${counts.products}`);
    console.log(`   - Categories: ${counts.categories}`);
    console.log(`   - Orders: ${counts.orders}`);
    console.log(`   - Users: ${counts.users}`);
    console.log(`   - Guest Customers: ${counts.guestCustomers}`);
    console.log(`   - Reviews: ${counts.reviews}`);
    
    // Clear all collections
    console.log('\n🗑️ Clearing all collections...');
    
    console.log('   Deleting reviews...');
    const reviewResult = await reviewModel.deleteMany({});
    console.log(`   ✅ Deleted ${reviewResult.deletedCount} reviews`);
    
    console.log('   Deleting orders...');
    const orderResult = await orderModel.deleteMany({});
    console.log(`   ✅ Deleted ${orderResult.deletedCount} orders`);
    
    console.log('   Deleting products...');
    const productResult = await productModel.deleteMany({});
    console.log(`   ✅ Deleted ${productResult.deletedCount} products`);
    
    console.log('   Deleting categories...');
    const categoryResult = await categoryModel.deleteMany({});
    console.log(`   ✅ Deleted ${categoryResult.deletedCount} categories`);
    
    console.log('   Deleting guest customers...');
    const guestResult = await guestCustomerModel.deleteMany({});
    console.log(`   ✅ Deleted ${guestResult.deletedCount} guest customers`);
    
    // Keep admin users, only delete customer users
    console.log('   Deleting customer users (keeping admins)...');
    const userResult = await userModel.deleteMany({ role: 'customer' });
    console.log(`   ✅ Deleted ${userResult.deletedCount} customer users`);
    
    // Final count
    const finalCounts = {
      products: await productModel.countDocuments(),
      categories: await categoryModel.countDocuments(),
      orders: await orderModel.countDocuments(),
      users: await userModel.countDocuments(),
      guestCustomers: await guestCustomerModel.countDocuments(),
      reviews: await reviewModel.countDocuments(),
    };
    
    console.log('\n📊 Final data counts:');
    console.log(`   - Products: ${finalCounts.products}`);
    console.log(`   - Categories: ${finalCounts.categories}`);
    console.log(`   - Orders: ${finalCounts.orders}`);
    console.log(`   - Users: ${finalCounts.users} (admin users preserved)`);
    console.log(`   - Guest Customers: ${finalCounts.guestCustomers}`);
    console.log(`   - Reviews: ${finalCounts.reviews}`);
    
    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('💡 All mock/sample data has been removed.');
    console.log('🔒 Admin users have been preserved.');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
  
  await app.close();
}

clearAllMockData().catch(console.error);
