import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductStatus } from '../common/schemas/product.schema';
import { StockAdjustment } from '../common/schemas/stock-adjustment.schema';

export class UpdateStockDto {
  productId: string;
  quantity: number;
  type: 'add' | 'subtract' | 'set';
  reason?: string;
  adjustedBy?: string;
}

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(StockAdjustment.name) private stockAdjustmentModel: Model<StockAdjustment>,
  ) {}

  async getInventoryStatus(
    page: number = 1,
    limit: number = 20,
    lowStock: boolean = false,
    outOfStock: boolean = false,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (lowStock) {
      filter.stock = { $lt: 10, $gt: 0 };
    }

    if (outOfStock) {
      filter.stock = { $eq: 0 };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate('category', 'name')
        .select('name sku stock price images category status')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.productModel.countDocuments(filter),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getLowStockProducts(threshold: number = 10) {
    return this.productModel
      .find({ stock: { $lt: threshold, $gt: 0 }, status: ProductStatus.ACTIVE })
      .populate('category', 'name')
      .select('name sku stock price images category')
      .sort({ stock: 1 });
  }

  async getOutOfStockProducts() {
    return this.productModel
      .find({ stock: 0, status: ProductStatus.OUT_OF_STOCK })
      .populate('category', 'name')
      .select('name sku stock price images category')
      .sort({ updatedAt: -1 });
  }

  async adjustStock(updateStockDto: UpdateStockDto) {
    const { productId, quantity, type, reason, adjustedBy } = updateStockDto;

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const oldQuantity = product.stock;
    let newQuantity: number;

    switch (type) {
      case 'add':
        newQuantity = oldQuantity + quantity;
        break;
      case 'subtract':
        newQuantity = Math.max(0, oldQuantity - quantity);
        break;
      case 'set':
        newQuantity = quantity;
        break;
      default:
        throw new Error('Invalid adjustment type');
    }

    // Update product stock
    product.stock = newQuantity;
    product.status = newQuantity > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK;
    await product.save();

    // Create stock adjustment record
    const adjustment = new this.stockAdjustmentModel({
      product: productId,
      oldQuantity,
      newQuantity,
      adjustmentQuantity: Math.abs(newQuantity - oldQuantity),
      adjustmentType: type,
      reason: reason || 'Manual adjustment',
      adjustedBy: adjustedBy || 'system',
    });

    await adjustment.save();

    return {
      product: {
        id: product._id,
        name: product.name,
        oldQuantity,
        newQuantity,
      },
      adjustment: adjustment._id,
    };
  }

  async getStockAdjustments(page: number = 1, limit: number = 20, productId?: string) {
    const skip = (page - 1) * limit;
    const filter = productId ? { product: productId } : {};

    const [adjustments, total] = await Promise.all([
      this.stockAdjustmentModel
        .find(filter)
        .populate('product', 'name sku')
        .populate('adjustedBy', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.stockAdjustmentModel.countDocuments(filter),
    ]);

    return {
      adjustments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getStockLevelsReport() {
    const pipeline = [
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          averageStock: { $avg: '$stock' },
          lowStockCount: {
            $sum: { 
              $cond: [
                { $and: [{ $lt: ['$stock', 10] }, { $gt: ['$stock', 0] }] }, 
                1, 
                0
              ] 
            },
          },
          outOfStockCount: {
            $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          categoryName: '$category.name',
          totalProducts: 1,
          totalStock: 1,
          averageStock: { $round: ['$averageStock', 2] },
          lowStockCount: 1,
          outOfStockCount: 1,
        },
      },
      { $sort: { totalStock: -1 } },
    ];

    return this.productModel.aggregate(pipeline as any);
  }

  async getStockMovementsReport(startDate?: string, endDate?: string) {
    const filter: any = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filter.createdAt = { $gte: thirtyDaysAgo };
    }

    return this.stockAdjustmentModel
      .find(filter)
      .populate('product', 'name sku')
      .populate('adjustedBy', 'name')
      .sort({ createdAt: -1 });
  }

  async getInventoryAlerts() {
    const [lowStock, outOfStock, recentAdjustments] = await Promise.all([
      this.getLowStockProducts(10),
      this.getOutOfStockProducts(),
      this.stockAdjustmentModel
        .find()
        .populate('product', 'name')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    return {
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      recentAdjustments: recentAdjustments.length,
      alerts: [
        ...lowStock.map(product => ({
          type: 'low_stock',
          message: `${product.name} is running low (${product.stock} left)`,
          product: product._id,
          severity: 'warning',
        })),
        ...outOfStock.map(product => ({
          type: 'out_of_stock',
          message: `${product.name} is out of stock`,
          product: product._id,
          severity: 'error',
        })),
      ],
    };
  }
}
