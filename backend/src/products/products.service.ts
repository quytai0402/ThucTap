import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product, ProductDocument, ProductStatus } from '../common/schemas/product.schema';
import { Category, CategoryDocument } from '../common/schemas/category.schema';

export interface CreateProductDto {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  brand: string;
  images?: string[];
  specifications?: any;
  tags?: string[];
  isFeatured?: boolean;
  isOnSale?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  originalPrice?: number;
  stock?: number;
  status?: ProductStatus;
  category?: string;
  brand?: string;
  images?: string[];
  specifications?: any;
  tags?: string[];
  isFeatured?: boolean;
  isOnSale?: boolean;
}

export interface ProductFilter {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  cpu?: string;
  ram?: string;
  storage?: string;
  gpu?: string;
  screenSize?: string;
  tags?: string[];
  isFeatured?: boolean;
  isOnSale?: boolean;
  status?: ProductStatus;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    console.log('🚀 Creating product with data:', createProductDto);
    
    // Find category by ID or name
    let category;
    if (Types.ObjectId.isValid(createProductDto.category)) {
      // If it's a valid ObjectId, search by _id
      category = await this.categoryModel.findById(createProductDto.category);
    } else {
      // Otherwise, search by name
      category = await this.categoryModel.findOne({ name: createProductDto.category });
    }
    
    if (!category) {
      throw new NotFoundException(`Category "${createProductDto.category}" not found`);
    }
    
    // Generate slug from name
    const slug = createProductDto.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    console.log('📝 Generated slug:', slug);
    console.log('📂 Found category:', category.name, 'with ID:', category._id);

    const product = new this.productModel({
      ...createProductDto,
      category: category._id, // Use ObjectId instead of string
      slug,
    });

    console.log('💾 Product object before save:', product.toObject());

    try {
    const savedProduct = await product.save();
    console.log('✅ Product saved successfully:', savedProduct._id);

    // Update category product count
    const categoryBefore = await this.categoryModel.findById(category._id);
    console.log('📊 Category before update:', categoryBefore?.productCount);
    
    const updateResult = await this.categoryModel.findByIdAndUpdate(
      category._id, 
      { $inc: { productCount: 1 } },
      { new: true } // Return updated document
    );
    console.log('📊 Category after update:', updateResult?.productCount);
    console.log('📊 Updated category product count for:', category.name);      return savedProduct;
    } catch (error) {
      console.error('❌ Error saving product:', error);
      throw error;
    }
  }

  async findAll(
    page = 1,
    limit = 12,
    filter: ProductFilter = {},
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    search?: string,
  ): Promise<{
    products: Product[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const query: any = { status: ProductStatus.ACTIVE };

    // Apply filters
    if (filter.category) {
      // Handle category filter
      if (typeof filter.category === 'string') {
        if (Types.ObjectId.isValid(filter.category)) {
          // If it's a valid ObjectId string, use it directly
          query.category = new Types.ObjectId(filter.category);
        } else {
          // Try to find category by name or slug
          const category = await this.categoryModel.findOne({ 
            $or: [
              { name: filter.category },
              { slug: filter.category }
            ]
          });
          if (category) {
            query.category = category._id;
          } else {
            // If category not found, return empty result
            console.warn(`Category not found: ${filter.category}`);
            return {
              products: [],
              total: 0,
              totalPages: 0,
              currentPage: page,
            };
          }
        }
      } else {
        query.category = filter.category;
      }
    }
    if (filter.brand) query.brand = new RegExp(filter.brand, 'i');
    if (filter.minPrice || filter.maxPrice) {
      query.price = {};
      if (filter.minPrice) query.price.$gte = filter.minPrice;
      if (filter.maxPrice) query.price.$lte = filter.maxPrice;
    }
    if (filter.isFeatured !== undefined) query.isFeatured = filter.isFeatured;
    if (filter.isOnSale !== undefined) query.isOnSale = filter.isOnSale;
    if (filter.tags && filter.tags.length > 0) query.tags = { $in: filter.tags };

    // Apply specifications filters
    if (filter.cpu) query['specifications.cpu'] = new RegExp(filter.cpu, 'i');
    if (filter.ram) query['specifications.ram'] = new RegExp(filter.ram, 'i');
    if (filter.storage) query['specifications.storage'] = new RegExp(filter.storage, 'i');
    if (filter.gpu) query['specifications.gpu'] = new RegExp(filter.gpu, 'i');
    if (filter.screenSize) query['specifications.screenSize'] = new RegExp(filter.screenSize, 'i');

    // Apply search
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [products, total] = await Promise.all([
      this.productModel
        .find(query)
        .populate('category', 'name slug')
        .skip(skip)
        .limit(limit)
        .sort(sort),
      this.productModel.countDocuments(query),
    ]);

    return {
      products,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findFeatured(limit = 8): Promise<Product[]> {
    return this.productModel
      .find({ status: ProductStatus.ACTIVE, isFeatured: true })
      .populate('category', 'name slug')
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async findOnSale(limit = 8): Promise<Product[]> {
    return this.productModel
      .find({ status: ProductStatus.ACTIVE, isOnSale: true })
      .populate('category', 'name slug')
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async findBestSellers(limit = 8): Promise<Product[]> {
    return this.productModel
      .find({ status: ProductStatus.ACTIVE })
      .populate('category', 'name slug')
      .limit(limit)
      .sort({ sold: -1 });
  }

  async findOne(id: string): Promise<Product> {
    // Check if id is valid ObjectId
    if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid product ID');
    }
    
    const product = await this.productModel
      .findById(id)
      .populate('category', 'name slug');
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    // Increment views
    await this.productModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
    
    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productModel
      .findOne({ slug, status: ProductStatus.ACTIVE })
      .populate('category', 'name slug');
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    // Increment views
    await this.productModel.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
    
    return product;
  }

  async findRelated(productId: string, limit = 4): Promise<Product[]> {
    const product = await this.productModel.findById(productId);
    if (!product) return [];

    return this.productModel
      .find({
        _id: { $ne: productId },
        $or: [
          { category: product.category },
          { brand: product.brand },
          { tags: { $in: product.tags } },
        ],
        status: ProductStatus.ACTIVE,
      })
      .populate('category', 'name slug')
      .limit(limit)
      .sort({ rating: -1 });
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    let updateData: any = { ...updateProductDto };

    // Regenerate slug if name is updated
    if (updateProductDto.name) {
      updateData.slug = updateProductDto.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const product = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('category', 'name slug');

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { 
        $inc: { stock: quantity },
        $set: { 
          status: quantity > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK 
        }
      },
      { new: true }
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateRating(id: string, rating: number, reviewCount: number): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { rating, reviewCount },
      { new: true }
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async remove(id: string): Promise<void> {
    // Get product first to access its category
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const result = await this.productModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }

    // Update category product count
    await this.categoryModel.findByIdAndUpdate(
      product.category,
      { $inc: { productCount: -1 } }
    );
    console.log('📊 Updated category product count after deletion');
  }

  async getBrands(): Promise<string[]> {
    return this.productModel.distinct('brand');
  }

  async getCategories(): Promise<any[]> {
    return this.productModel.find().distinct('category').populate('category', 'name slug');
  }

  async getAdminStats(): Promise<any> {
    const totalProducts = await this.productModel.countDocuments();
    const activeProducts = await this.productModel.countDocuments({ status: ProductStatus.ACTIVE });
    const inactiveProducts = await this.productModel.countDocuments({ status: ProductStatus.INACTIVE });
    const outOfStockProducts = await this.productModel.countDocuments({ status: ProductStatus.OUT_OF_STOCK });
    const featuredProducts = await this.productModel.countDocuments({ isFeatured: true });
    const saleProducts = await this.productModel.countDocuments({ isOnSale: true });

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      outOfStockProducts,
      featuredProducts,
      saleProducts,
    };
  }

  async bulkDelete(productIds: string[]): Promise<{ deletedCount: number }> {
    const result = await this.productModel.deleteMany({ _id: { $in: productIds } });
    return { deletedCount: result.deletedCount };
  }

  async bulkUpdateStatus(productIds: string[], status: ProductStatus): Promise<{ modifiedCount: number }> {
    const result = await this.productModel.updateMany(
      { _id: { $in: productIds } },
      { $set: { status } }
    );
    return { modifiedCount: result.modifiedCount };
  }

  async getSpecificationValues(field: string): Promise<string[]> {
    const fieldPath = `specifications.${field}`;
    return this.productModel.distinct(fieldPath);
  }

  async clear(): Promise<{ deletedCount: number }> {
    const result = await this.productModel.deleteMany({});
    return { deletedCount: result.deletedCount };
  }
}
