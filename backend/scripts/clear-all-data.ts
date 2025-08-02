import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../src/common/schemas/category.schema';
import { Product } from '../src/common/schemas/product.schema';
import { User } from '../src/common/schemas/user.schema';
import { Order } from '../src/common/schemas/order.schema';
import { Review } from '../src/common/schemas/review.schema';
import { GuestCustomer } from '../src/common/schemas/guest-customer.schema';

async function main() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // Get models
    const categoryModel = app.get<Model<Category>>('CategoryModel');
    const productModel = app.get<Model<Product>>('ProductModel');
    const userModel = app.get<Model<User>>('UserModel');
    const orderModel = app.get<Model<Order>>('OrderModel');
    const reviewModel = app.get<Model<Review>>('ReviewModel');
    const guestCustomerModel = app.get<Model<GuestCustomer>>('GuestCustomerModel');

    console.log('🗑️ Bắt đầu xóa toàn bộ dữ liệu...');

    // Xóa toàn bộ dữ liệu (trừ admin)
    console.log('📦 Xóa tất cả đơn hàng...');
    const deletedOrders = await orderModel.deleteMany({});
    console.log(`   ✅ Đã xóa ${deletedOrders.deletedCount} đơn hàng`);

    console.log('⭐ Xóa tất cả đánh giá...');
    const deletedReviews = await reviewModel.deleteMany({});
    console.log(`   ✅ Đã xóa ${deletedReviews.deletedCount} đánh giá`);

    console.log('👤 Xóa tất cả guest customers...');
    const deletedGuests = await guestCustomerModel.deleteMany({});
    console.log(`   ✅ Đã xóa ${deletedGuests.deletedCount} guest customers`);

    console.log('💻 Xóa tất cả sản phẩm...');
    const deletedProducts = await productModel.deleteMany({});
    console.log(`   ✅ Đã xóa ${deletedProducts.deletedCount} sản phẩm`);

    console.log('📁 Xóa tất cả danh mục...');
    const deletedCategories = await categoryModel.deleteMany({});
    console.log(`   ✅ Đã xóa ${deletedCategories.deletedCount} danh mục`);

    console.log('👥 Xóa tất cả customers (giữ lại admin)...');
    const deletedCustomers = await userModel.deleteMany({ 
      email: { $ne: 'admin@admin.com' } 
    });
    console.log(`   ✅ Đã xóa ${deletedCustomers.deletedCount} customers`);

    // Kiểm tra admin còn lại
    const remainingAdmin = await userModel.findOne({ email: 'admin@admin.com' });
    if (remainingAdmin) {
      console.log(`   ✅ Giữ lại admin: ${remainingAdmin.fullName || remainingAdmin.email}`);
    } else {
      console.log('   ⚠️  Không tìm thấy admin@admin.com');
    }

    console.log('\n🎯 Tóm tắt xóa dữ liệu:');
    console.log(`   📦 Đơn hàng: ${deletedOrders.deletedCount}`);
    console.log(`   ⭐ Đánh giá: ${deletedReviews.deletedCount}`);
    console.log(`   👤 Guest customers: ${deletedGuests.deletedCount}`);
    console.log(`   💻 Sản phẩm: ${deletedProducts.deletedCount}`);
    console.log(`   📁 Danh mục: ${deletedCategories.deletedCount}`);
    console.log(`   👥 Customers: ${deletedCustomers.deletedCount}`);

    console.log('\n✅ Hoàn thành xóa dữ liệu! Database đã được reset về trạng thái ban đầu.');
    console.log('🔐 Chỉ còn lại admin: admin@admin.com');

    await app.close();
  } catch (error) {
    console.error('❌ Lỗi khi xóa dữ liệu:', error);
    process.exit(1);
  }
}

main();
