import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from '../common/schemas/brand.schema';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
  ) {}

  async create(createBrandDto: Partial<Brand>): Promise<Brand> {
    const slug = this.generateSlug(createBrandDto.name);
    const createdBrand = new this.brandModel({
      ...createBrandDto,
      slug,
    });
    return createdBrand.save();
  }

  async findAll(): Promise<Brand[]> {
    return this.brandModel.find({ isActive: true }).sort({ name: 1 }).exec();
  }

  async findAllNames(): Promise<string[]> {
    const brands = await this.brandModel.find({ isActive: true }, 'name').sort({ name: 1 }).exec();
    return brands.map(brand => brand.name);
  }

  async findByName(name: string): Promise<Brand | null> {
    return this.brandModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } }).exec();
  }

  async updateProductCount(brandName: string, increment: number = 1): Promise<void> {
    await this.brandModel.updateOne(
      { name: brandName },
      { $inc: { productCount: increment } }
    ).exec();
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
