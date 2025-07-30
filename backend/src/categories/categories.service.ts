import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../common/schemas/category.schema';
import { Product, ProductDocument } from '../common/schemas/product.schema';

export interface CreateCategoryDto {
  name: string;
  description?: string;
  image?: string;
  parent?: string;
  sort?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  image?: string;
  parent?: string;
  sort?: number;
  isActive?: boolean;
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Generate slug from name
    const slug = createCategoryDto.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const category = new this.categoryModel({
      ...createCategoryDto,
      slug,
    });

    return category.save();
  }

  async findAll(isActive?: boolean): Promise<Category[]> {
    const query = isActive !== undefined ? { isActive } : {};
    const categories = await this.categoryModel
      .find(query)
      .populate('parent', 'name slug')
      .sort({ sort: 1, name: 1 });

    // Add product count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        // Use ObjectId for comparison with product.category field
        const productCount = await this.productModel.countDocuments({ 
          category: category._id 
        });
        
        return {
          ...category.toObject(),
          productCount,
        };
      }),
    );

    return categoriesWithCounts as any;
  }

  async findTree(): Promise<Category[]> {
    // Get all active categories
    const categories = await this.categoryModel
      .find({ isActive: true })
      .sort({ sort: 1, name: 1 });

    // Build tree structure
    const categoryMap = new Map();
    const tree = [];

    // First pass: create map
    categories.forEach(cat => {
      categoryMap.set(cat._id.toString(), { ...cat.toObject(), children: [] });
    });

    // Second pass: build tree
    categories.forEach(cat => {
      const categoryObj = categoryMap.get(cat._id.toString());
      if (cat.parent) {
        const parent = categoryMap.get(cat.parent.toString());
        if (parent) {
          parent.children.push(categoryObj);
        }
      } else {
        tree.push(categoryObj);
      }
    });

    return tree;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel
      .findById(id)
      .populate('parent', 'name slug');
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    return category;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    if (!slug) {
      return null;
    }
    
    const category = await this.categoryModel
      .findOne({ slug, isActive: true })
      .populate('parent', 'name slug');
    
    return category;
  }

  async findPopular(limit: number = 4): Promise<any[]> {
    // Get all active categories
    const categories = await this.categoryModel
      .find({ isActive: true })
      .sort({ sort: 1, name: 1 })
      .lean();

    // Count products for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await this.productModel.countDocuments({
          category: category._id,
          isActive: true
        });
        
        return {
          ...category,
          productCount
        };
      })
    );

    // Sort by product count (descending) and return top categories
    return categoriesWithCount
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, limit);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    let updateData: any = { ...updateCategoryDto };

    // Regenerate slug if name is updated
    if (updateCategoryDto.name) {
      updateData.slug = updateCategoryDto.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('parent', 'name slug');

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async remove(id: string): Promise<void> {
    // Check if category has children
    const hasChildren = await this.categoryModel.findOne({ parent: id });
    if (hasChildren) {
      throw new Error('Cannot delete category with subcategories');
    }

    const result = await this.categoryModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Category not found');
    }
  }
}
