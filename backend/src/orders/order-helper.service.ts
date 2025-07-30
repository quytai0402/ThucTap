import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../common/schemas/order.schema';

@Injectable()
export class OrderHelper {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async findOrdersByPhone(phone: string, page = 1, limit = 10): Promise<{
    orders: OrderDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const query = { 
      'shippingAddress.phone': phone,
      isGuestOrder: true
    };

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.orderModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.orderModel.countDocuments(query),
    ]);

    return {
      orders,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
}
