import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../common/schemas/user.schema';
import { Category, CategoryDocument } from '../common/schemas/category.schema';
import { Product, ProductDocument } from '../common/schemas/product.schema';
import { Order, OrderDocument } from '../common/schemas/order.schema';
import { Review, ReviewDocument } from '../common/schemas/review.schema';

@Injectable()
export class ClearDataService {
  private readonly logger = new Logger(ClearDataService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async clearAllData() {
    try {
      this.logger.log('🧹 Starting database cleanup...');
      
      // Clear all collections
      await this.reviewModel.deleteMany({});
      this.logger.log('✅ Reviews cleared');
      
      await this.orderModel.deleteMany({});
      this.logger.log('✅ Orders cleared');
      
      await this.productModel.deleteMany({});
      this.logger.log('✅ Products cleared');
      
      await this.categoryModel.deleteMany({});
      this.logger.log('✅ Categories cleared');
      
      await this.userModel.deleteMany({});
      this.logger.log('✅ Users cleared');
      
      this.logger.log('🎉 Database cleanup completed successfully!');
      
      return {
        success: true,
        message: 'All data cleared successfully'
      };
    } catch (error) {
      this.logger.error('❌ Error clearing database:', error);
      throw error;
    }
  }

  async cleanUpUnrealisticData() {
    try {
      this.logger.log('🧹 Starting cleanup of unrealistic data...');
      
      // Clean up orders with unrealistic totals (> 1 billion VND)
      const unrealisticOrders = await this.orderModel.find({ 
        total: { $gt: 1000000000 } 
      });
      
      this.logger.log(`Found ${unrealisticOrders.length} unrealistic orders`);
      
      for (const order of unrealisticOrders) {
        // Reset total to a realistic amount (1-50 million VND)
        const realisticTotal = Math.floor(Math.random() * 50000000) + 1000000;
        await this.orderModel.updateOne(
          { _id: order._id },
          { 
            total: realisticTotal,
            subtotal: realisticTotal,
            updatedAt: new Date()
          }
        );
        this.logger.log(`Reset order ${order.orderNumber} total from ${order.total} to ${realisticTotal}`);
      }
      
      this.logger.log('🎉 Unrealistic data cleanup completed!');
      
      return {
        success: true,
        message: `Cleaned up ${unrealisticOrders.length} unrealistic orders`,
        cleanedOrders: unrealisticOrders.length
      };
    } catch (error) {
      this.logger.error('❌ Error cleaning unrealistic data:', error);
      throw error;
    }
  }

  async getDataStats() {
    try {
      const stats = {
        users: await this.userModel.countDocuments(),
        categories: await this.categoryModel.countDocuments(),
        products: await this.productModel.countDocuments(),
        orders: await this.orderModel.countDocuments(),
        reviews: await this.reviewModel.countDocuments(),
      };
      
      this.logger.log('📊 Database stats:', stats);
      return stats;
    } catch (error) {
      this.logger.error('❌ Error getting stats:', error);
      throw error;
    }
  }
}
