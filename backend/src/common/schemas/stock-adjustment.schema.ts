import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class StockAdjustment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true })
  oldQuantity: number;

  @Prop({ required: true })
  newQuantity: number;

  @Prop({ required: true })
  adjustmentQuantity: number;

  @Prop({ enum: ['add', 'subtract', 'set'], required: true })
  adjustmentType: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  adjustedBy: Types.ObjectId;

  @Prop()
  notes?: string;
}

export const StockAdjustmentSchema = SchemaFactory.createForClass(StockAdjustment);
