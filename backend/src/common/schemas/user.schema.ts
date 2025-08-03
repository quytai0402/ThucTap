import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum CustomerLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  VIP = 'vip',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop()
  avatar: string;

  @Prop()
  dateOfBirth: Date;

  @Prop({ type: [Object] })
  addresses: Array<{
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    isDefault: boolean;
  }>;

  @Prop({ default: Date.now })
  lastLogin: Date;

  @Prop({ default: false })
  emailVerified: boolean;

  // Customer specific fields
  @Prop({ type: String, enum: CustomerLevel, default: CustomerLevel.BRONZE })
  customerLevel: CustomerLevel;

  @Prop({ default: 0 })
  totalSpent: number;

  @Prop({ default: 0 })
  totalOrders: number;

  @Prop({ default: 0 })
  loyaltyPoints: number;

  @Prop()
  referralCode: string;

  @Prop()
  referredBy: string;

  @Prop({ type: [String] })
  wishlist: string[];

  @Prop({ type: Object })
  preferences: {
    newsletter: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    currency: string;
  };

  @Prop()
  notes: string; // Admin notes about customer
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create unique index for phone
UserSchema.index({ phone: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
