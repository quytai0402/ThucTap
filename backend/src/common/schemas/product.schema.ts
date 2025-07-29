import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  originalPrice: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ type: String, enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ required: true })
  brand: string;

  // Thông số kỹ thuật laptop
  @Prop({ type: Object })
  specifications: {
    cpu: string;
    ram: string;
    storage: string;
    gpu: string;
    screen: string;
    screenSize: string;
    resolution: string;
    battery: string;
    weight: string;
    os: string;
    ports: string[];
    features: string[];
  };

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  sold: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  isOnSale: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
