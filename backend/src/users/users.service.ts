import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from '../common/schemas/user.schema';
import { Order } from '../common/schemas/order.schema';

export interface CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  phone: string; // Required phone number
  role?: UserRole;
}

export interface UpdateUserDto {
  fullName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  addresses?: Array<{
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    isDefault: boolean;
  }>;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Check if phone number already exists
    const existingPhone = await this.userModel.findOne({
      phone: createUserDto.phone,
    });

    if (existingPhone) {
      throw new ConflictException('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return user.save();
  }

  async getCustomersWithOrderStats(page = 1, limit = 10): Promise<{
    users: any[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    // Get users with order statistics
    const usersWithStats = await this.userModel.aggregate([
      { $match: { role: 'customer' } },
      {
        $lookup: {
          from: 'orders',
          let: { userId: '$_id' },
          pipeline: [
            { $match: { 
              $expr: { $eq: ['$customer', '$$userId'] }
            }},
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                successfulOrders: { 
                  $sum: { 
                    $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] 
                  }
                },
                totalSpent: { 
                  $sum: { 
                    $cond: [{ $eq: ['$status', 'delivered'] }, '$total', 0] 
                  }
                },
                lastOrderDate: { $max: '$createdAt' }
              }
            }
          ],
          as: 'orderStats'
        }
      },
      {
        $addFields: {
          totalOrders: { $arrayElemAt: ['$orderStats.totalOrders', 0] },
          successfulOrders: { $arrayElemAt: ['$orderStats.successfulOrders', 0] },
          totalSpent: { $arrayElemAt: ['$orderStats.totalSpent', 0] },
          lastOrderDate: { $arrayElemAt: ['$orderStats.lastOrderDate', 0] }
        }
      },
      { $project: { password: 0, orderStats: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);
    
    const total = await this.userModel.countDocuments({ role: 'customer' });
    
    return {
      users: usersWithStats,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCustomersWithRealOrderStats(page = 1, limit = 10): Promise<{
    users: any[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    // Get users with REAL order statistics - only from delivered orders
    const usersWithStats = await this.userModel.aggregate([
      { $match: { role: 'customer' } },
      {
        $lookup: {
          from: 'orders',
          let: { userId: '$_id' },
          pipeline: [
            { $match: { 
              $expr: { $eq: ['$customer', '$$userId'] }
            }},
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
                      totalSpent: { $sum: '$total' }
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
          totalOrders: { 
            $ifNull: [
              { $arrayElemAt: ['$orderStats.allOrders.totalOrders', 0] }, 
              0
            ]
          },
          successfulOrders: { 
            $ifNull: [
              { $arrayElemAt: ['$orderStats.deliveredOrders.successfulOrders', 0] }, 
              0
            ]
          },
          totalSpent: { 
            $ifNull: [
              { $arrayElemAt: ['$orderStats.deliveredOrders.totalSpent', 0] }, 
              0
            ]
          },
          lastOrderDate: { 
            $ifNull: [
              { $arrayElemAt: ['$orderStats.allOrders.lastOrderDate', 0] }, 
              null
            ]
          }
        }
      },
      { $project: { password: 0, orderStats: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);
    
    const total = await this.userModel.countDocuments({ role: 'customer' });
    
    return {
      users: usersWithStats,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(page = 1, limit = 10, role?: UserRole): Promise<{
    users: User[];
    total: number;
    totalPages: number;
  }> {
    const query = role ? { role } : {};
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.userModel.countDocuments(query),
    ]);

    return {
      users,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
