import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../common/schemas/order.schema';
import { Product } from '../common/schemas/product.schema';
import { User } from '../common/schemas/user.schema';
import { Category } from '../common/schemas/category.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async getDashboardStats() {
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      this.orderModel.countDocuments(),
      this.productModel.countDocuments(),
      this.userModel.countDocuments({ role: 'customer' }),
      this.getTotalRevenue(),
      this.orderModel.countDocuments({ status: 'pending' }),
      this.productModel.countDocuments({ stock: { $lt: 10 } }),
      this.getRecentOrders(5),
      this.getTopProducts(5),
    ]);

    return {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      topProducts,
    };
  }

  async getSalesAnalytics(period: string, startDate?: string, endDate?: string) {
    const matchStage: any = { 
      status: 'delivered' // Chỉ tính doanh thu từ đơn hàng đã giao
    };
    
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchStage.createdAt = { $gte: thirtyDaysAgo };
    }

    const groupFormat = this.getGroupFormat(period);

    const salesData = await this.orderModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    return salesData;
  }

  async getProductAnalytics(limit: number) {
    const topSellingProducts = await this.orderModel.aggregate([
      { $match: { status: 'delivered' } }, // Chỉ tính từ đơn hàng đã giao
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 1,
          name: '$product.name',
          totalSold: 1,
          totalRevenue: 1,
          image: '$product.image',
        },
      },
    ]);

    return topSellingProducts;
  }

  async getCustomerAnalytics() {
    const [newCustomers, totalCustomers, topCustomers] = await Promise.all([
      this.getNewCustomersCount(),
      this.userModel.countDocuments({ role: 'customer' }),
      this.getTopCustomers(10),
    ]);

    return {
      newCustomers,
      totalCustomers,
      topCustomers,
    };
  }

  async getRevenueAnalytics(period: string) {
    const groupFormat = this.getGroupFormat(period);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueData = await this.orderModel.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: 'delivered' } },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    return revenueData;
  }

  async getOrderStatusDistribution() {
    const statusDistribution = await this.orderModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return statusDistribution;
  }

  async getCategoryPerformance() {
    const categoryPerformance = await this.orderModel.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.name' },
          totalSales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          productsSold: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalSales: -1 } },
    ]);

    return categoryPerformance;
  }

  async getTotalRevenue(): Promise<number> {
    const result = await this.orderModel.aggregate([
      {
        $match: {
          status: 'delivered'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' }
        }
      }
    ]);

    return result.length > 0 ? result[0].totalRevenue : 0;
  }

  private async getRecentOrders(limit: number) {
    return this.orderModel
      .find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('orderNumber totalAmount status createdAt customer');
  }

  private async getTopProducts(limit: number) {
    return this.orderModel.aggregate([
      { $match: { status: 'delivered' } }, // Chỉ tính từ đơn hàng đã giao
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          image: '$product.image',
        },
      },
    ]);
  }

  private async getNewCustomersCount(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return this.userModel.countDocuments({
      role: 'customer',
      createdAt: { $gte: thirtyDaysAgo },
    });
  }

  private async getTopCustomers(limit: number) {
    return this.orderModel.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: '$customer',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },
      {
        $project: {
          name: '$customer.name',
          email: '$customer.email',
          totalSpent: 1,
          orderCount: 1,
        },
      },
    ]);
  }

  private getGroupFormat(period: string): string {
    switch (period) {
      case 'day':
        return '%Y-%m-%d';
      case 'week':
        return '%Y-%U';
      case 'month':
        return '%Y-%m';
      case 'year':
        return '%Y';
      default:
        return '%Y-%m-%d';
    }
  }
}
