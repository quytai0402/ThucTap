import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GuestCustomer, GuestCustomerDocument } from '../common/schemas/guest-customer.schema';
import { CustomerLevel } from '../common/schemas/user.schema';
import { OrderDocument } from '../common/schemas/order.schema';

export interface GuestCustomerInfo {
  phone: string;
  fullName: string;
  email?: string;
  address?: {
    address: string;
    city: string;
    district: string;
    ward: string;
  };
}

@Injectable()
export class GuestCustomerService {
  constructor(
    @InjectModel(GuestCustomer.name) private guestCustomerModel: Model<GuestCustomerDocument>,
  ) {}

  async findByPhone(phone: string): Promise<GuestCustomerDocument | null> {
    return this.guestCustomerModel.findOne({ phone });
  }

  async findById(id: string): Promise<GuestCustomerDocument | null> {
    return this.guestCustomerModel.findById(id);
  }

  async createOrUpdate(
    guestInfo: GuestCustomerInfo, 
    order: OrderDocument
  ): Promise<GuestCustomerDocument> {
    // Try to find existing guest customer with the same phone number
    let guestCustomer = await this.findByPhone(guestInfo.phone);
    
    // Calculate amount from order
    const orderAmount = order.total || 0;
    
    if (guestCustomer) {
      // Update existing guest customer
      guestCustomer.fullName = guestInfo.fullName || guestCustomer.fullName;
      guestCustomer.email = guestInfo.email || guestCustomer.email;
      
      // Update address if provided
      if (guestInfo.address) {
        guestCustomer.lastAddress = {
          address: guestInfo.address.address,
          city: guestInfo.address.city,
          district: guestInfo.address.district,
          ward: guestInfo.address.ward,
        };
      }
      
      // Update order statistics
      guestCustomer.totalOrders += 1;
      guestCustomer.totalSpent += orderAmount;
      
      // Add order ID to list if not already present
      if (!guestCustomer.orderIds.includes(order._id.toString())) {
        guestCustomer.orderIds.push(order._id.toString());
      }
      
      // Update last order info
      guestCustomer.lastOrder = {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        orderDate: new Date(),
        amount: orderAmount,
      };
      
      // Update customer level based on total spent
      guestCustomer.customerLevel = this.calculateCustomerLevel(guestCustomer.totalSpent);
      
      return guestCustomer.save();
    } else {
      // Create new guest customer
      const newGuestCustomer = new this.guestCustomerModel({
        phone: guestInfo.phone,
        fullName: guestInfo.fullName,
        email: guestInfo.email,
        totalOrders: 1,
        totalSpent: orderAmount,
        successfulOrders: 0, // Will be updated when order is delivered
        customerLevel: CustomerLevel.BRONZE,
        orderIds: [order._id.toString()],
        lastOrder: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          orderDate: new Date(),
          amount: orderAmount,
        }
      });
      
      // Set address if provided
      if (guestInfo.address) {
        newGuestCustomer.lastAddress = {
          address: guestInfo.address.address,
          city: guestInfo.address.city,
          district: guestInfo.address.district,
          ward: guestInfo.address.ward,
        };
      }
      
      return newGuestCustomer.save();
    }
  }
  
  async updateOrderSuccess(orderId: string, phone: string, amount: number): Promise<GuestCustomerDocument | null> {
    const guestCustomer = await this.findByPhone(phone);
    
    if (!guestCustomer) {
      return null;
    }
    
    // Increment successful orders counter
    guestCustomer.successfulOrders += 1;
    
    // Add loyalty points (1 point for every 100k spent)
    const pointsToAdd = Math.floor(amount / 100000);
    guestCustomer.loyaltyPoints += pointsToAdd;
    
    return guestCustomer.save();
  }
  
  private calculateCustomerLevel(totalSpent: number): CustomerLevel {
    if (totalSpent >= 30000000) { // 30 million VND
      return CustomerLevel.VIP;
    } else if (totalSpent >= 10000000) { // 10 million VND
      return CustomerLevel.GOLD;
    } else if (totalSpent >= 3000000) { // 3 million VND
      return CustomerLevel.SILVER;
    } else {
      return CustomerLevel.BRONZE;
    }
  }
  
  async getAllGuestCustomers(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ 
    customers: GuestCustomerDocument[],
    total: number,
    totalPages: number
  }> {
    const query: any = {};
    
    if (search) {
      query.$or = [
        { phone: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [customers, total] = await Promise.all([
      this.guestCustomerModel
        .find(query)
        .sort({ totalOrders: -1 })
        .skip(skip)
        .limit(limit),
      this.guestCustomerModel.countDocuments(query)
    ]);
    
    return {
      customers,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getAllGuestCustomersWithRealStats(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ 
    customers: any[],
    total: number,
    totalPages: number
  }> {
    const query: any = {};
    
    if (search) {
      query.$or = [
        { phone: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    // Get guest customers with real order statistics from delivered orders
    const customersWithStats = await this.guestCustomerModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'orders',
          let: { customerPhone: '$phone' },
          pipeline: [
            { 
              $match: { 
                $expr: { 
                  $and: [
                    { $eq: ['$shippingAddress.phone', '$$customerPhone'] },
                    { $eq: ['$isGuestOrder', true] }
                  ]
                }
              }
            },
            {
              $facet: {
                // All orders stats
                allOrders: [
                  {
                    $group: {
                      _id: null,
                      totalOrders: { $sum: 1 },
                      lastOrderDate: { $max: '$createdAt' }
                    }
                  }
                ],
                // Delivered orders stats (for revenue calculation)
                deliveredOrders: [
                  { $match: { status: 'delivered' } },
                  {
                    $group: {
                      _id: null,
                      successfulOrders: { $sum: 1 },
                      totalSpent: { 
                        $sum: { 
                          $cond: [
                            { $and: [
                              { $ne: ['$total', null] },
                              { $isNumber: '$total' }
                            ]},
                            '$total',
                            0
                          ]
                        }
                      }
                    }
                  }
                ]
              }
            }
          ],
          as: 'orderStats'
        }
      },
      {
        $addFields: {
          realTotalOrders: { 
            $ifNull: [
              { $arrayElemAt: ['$orderStats.allOrders.totalOrders', 0] }, 
              0
            ]
          },
          realSuccessfulOrders: { 
            $ifNull: [
              { $arrayElemAt: ['$orderStats.deliveredOrders.successfulOrders', 0] }, 
              0
            ]
          },
          realTotalSpent: { 
            $ifNull: [
              { $arrayElemAt: ['$orderStats.deliveredOrders.totalSpent', 0] }, 
              0
            ]
          },
          realLastOrderDate: { 
            $ifNull: [
              { $arrayElemAt: ['$orderStats.allOrders.lastOrderDate', 0] }, 
              '$lastOrder.orderDate'
            ]
          }
        }
      },
      { $project: { orderStats: 0 } },
      { $sort: { realTotalOrders: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);
    
    const total = await this.guestCustomerModel.countDocuments(query);
    
    return {
      customers: customersWithStats,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }
  
  async getGuestCustomerById(id: string): Promise<GuestCustomerDocument> {
    return this.guestCustomerModel.findById(id);
  }
  
  async convertToRegisteredUser(phone: string, userId: string): Promise<GuestCustomerDocument | null> {
    const guestCustomer = await this.findByPhone(phone);
    
    if (!guestCustomer) {
      return null;
    }
    
    guestCustomer.convertedToUser = true;
    guestCustomer.convertedUserId = userId;
    
    return guestCustomer.save();
  }
}
