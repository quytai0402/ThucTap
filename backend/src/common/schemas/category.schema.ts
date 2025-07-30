import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  parent: Types.ObjectId;

  @Prop({ default: 0 })
  sort: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  productCount: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
