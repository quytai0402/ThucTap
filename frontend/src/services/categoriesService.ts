import api, { publicApi } from '../utils/api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: Category;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
  parentCategory?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  parentCategory?: string;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

class CategoriesService {
  // Create category
  async createCategory(categoryData: CreateCategoryData) {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Get all categories with filters
  async getCategories(filters?: CategoryFilters) {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters?.parentCategory) params.append('parentCategory', filters.parentCategory);

      const response = await publicApi.get(`/categories?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get category tree structure
  async getCategoryTree(): Promise<CategoryTree[]> {
    try {
      const response = await publicApi.get('/categories/tree');
      return response.data;
    } catch (error) {
      console.error('Error fetching category tree:', error);
      throw error;
    }
  }

  // Get single category
  async getCategory(categoryId: string) {
    try {
      const response = await publicApi.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  // Get category by slug
  async getCategoryBySlug(slug: string) {
    try {
      const response = await publicApi.get(`/categories/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw error;
    }
  }

  // Update category
  async updateCategory(categoryId: string, updateData: UpdateCategoryData) {
    try {
      const response = await api.patch(`/categories/${categoryId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  // Delete category
  async deleteCategory(categoryId: string) {
    try {
      await api.delete(`/categories/${categoryId}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Get active categories for dropdown/filter
  async getActiveCategories() {
    try {
      const response = await api.get('/categories?isActive=true&limit=100');
      return response.data.categories || response.data;
    } catch (error) {
      console.error('Error fetching active categories:', error);
      throw error;
    }
  }

  // Get parent categories only
  async getParentCategories() {
    try {
      const response = await api.get('/categories?parentCategory=null&isActive=true');
      return response.data.categories || response.data;
    } catch (error) {
      console.error('Error fetching parent categories:', error);
      throw error;
    }
  }

  // Get popular categories with product count
  async getPopularCategories(limit: number = 4) {
    try {
      const response = await publicApi.get(`/categories/popular?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular categories:', error);
      throw error;
    }
  }
}

export const categoriesService = new CategoriesService();
export default categoriesService;
