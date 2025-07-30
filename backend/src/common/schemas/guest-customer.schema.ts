import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CustomerLevel } from './user.schema';

export type GuestCustomerDocument = GuestCustomer & Document;

@Schema({ timestamps: true })
export class GuestCustomer {
  @Prop({ required: true })
  phone: string;

  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop({ default: 0 })
  totalSpent: number;

  @Prop({ default: 0 })
  totalOrders: number;

  @Prop({ default: 0 })
  successfulOrders: number;

  @Prop({ type: String, enum: CustomerLevel, default: CustomerLevel.BRONZE })
  customerLevel: CustomerLevel;

  @Prop({ default: 0 })
  loyaltyPoints: number;

  @Prop({ type: [String], default: [] })
  orderIds: string[];

  @Prop({ type: Object })
  lastOrder: {
    orderId: string;
    orderNumber: string;
    orderDate: Date;
    amount: number;
  };

  @Prop({ type: Object })
  lastAddress: {
    address: string;
    city: string;
    district: string;
    ward: string;
  };

  @Prop({ type: Boolean, default: false })
  convertedToUser: boolean;

  @Prop()
  convertedUserId: string;
}

export const GuestCustomerSchema = SchemaFactory.createForClass(GuestCustomer);

// Create index on phone field for fast lookups
GuestCustomerSchema.index({ phone: 1 }, { unique: true });
