import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentMethodDocument = PaymentMethod & Document;

export enum PaymentMethodType {
  CARD = 'card',
  BANK_ACCOUNT = 'bank_account',
  EWALLET = 'ewallet',
}

@Schema({ timestamps: true })
export class PaymentMethod {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: PaymentMethodType })
  type: PaymentMethodType;

  @Prop({ required: true })
  name: string; // e.g., "Visa **** 1234"

  // For card payments
  @Prop()
  cardNumber: string; // Last 4 digits only

  @Prop()
  cardType: string; // Visa, MasterCard, etc.

  @Prop()
  expiryMonth: number;

  @Prop()
  expiryYear: number;

  @Prop()
  cardHolderName: string;

  // For bank account
  @Prop()
  bankName: string;

  @Prop()
  accountNumber: string; // Masked

  @Prop()
  accountHolderName: string;

  // For e-wallet
  @Prop()
  walletType: string; // MoMo, ZaloPay, etc.

  @Prop()
  walletId: string; // Masked

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  token: string; // Payment gateway token for actual payments
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);
