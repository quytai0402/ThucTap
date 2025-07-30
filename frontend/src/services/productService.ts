import api, { publicApi } from '../utils/api';
import { Product } from '../types';

export interface CreateProductData {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  specifications?: {
    cpu?: string;
    ram?: string;
    storage?: string;
    gpu?: string;
    screen?: string;
    screenSize?: string;
    resolution?: string;
    battery?: string;
    weight?: string;
    os?: string;
    ports?: string[];
    features?: string[];
  };
  tags?: string[];
  isFeatured?: boolean;
  isOnSale?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  status?: 'active' | 'inactive' | 'out_of_stock';
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
}

class ProductService {
  // ===== PUBLIC ENDPOINTS (No auth required) =====

  // Get all products with filtering (for customers)
  async getProducts(filters: ProductFilters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      
      const response = await publicApi.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get single product by ID
  async getProduct(id: string): Promise<Product> {
    try {
      const response = await publicApi.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Get product by slug
  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await publicApi.get(`/products/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    try {
      const response = await publicApi.get(`/products/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Get products on sale
  async getOnSaleProducts(limit = 8): Promise<Product[]> {
    try {
      const response = await publicApi.get(`/products/on-sale?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching on-sale products:', error);
      throw error;
    }
  }

  // Get best sellers
  async getBestSellers(limit = 8): Promise<Product[]> {
    try {
      const response = await publicApi.get(`/products/best-sellers?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      throw error;
    }
  }

  // Get related products
  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    try {
      const response = await publicApi.get(`/products/${productId}/related?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }
  }

  // Get all brands
  async getBrands(): Promise<string[]> {
    try {
      const response = await publicApi.get('/products/brands');
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }

  // ===== ADMIN ENDPOINTS (Auth required) =====

  // Get all products for admin (with different filtering)
  async getAdminProducts(filters: ProductFilters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/admin/products?${params.toString()}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error('Failed to fetch admin products');
      }
    } catch (error) {
      console.error('Error fetching admin products:', error);
      throw error;
    }
  }

  // Get admin product by ID
  async getAdminProduct(id: string): Promise<Product> {
    try {
      const response = await api.get(`/admin/products/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to fetch admin product');
      }
    } catch (error) {
      console.error('Error fetching admin product:', error);
      throw error;
    }
  }

  // Create new product (Admin only)
  async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      console.log('🚀 Frontend creating product:', productData);
      const response = await api.post('/admin/products', productData);
      console.log('📝 Backend response:', response.data);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product (Admin only)
  async updateProduct(id: string, productData: UpdateProductData): Promise<Product> {
    try {
      const response = await api.patch(`/admin/products/${id}`, productData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Update product status (Admin only)
  async updateProductStatus(id: string, status: 'active' | 'inactive' | 'out_of_stock') {
    try {
      const response = await api.patch(`/admin/products/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating product status:', error);
      throw error;
    }
  }

  // Delete product (Admin only)
  async deleteProduct(id: string) {
    try {
      await api.delete(`/admin/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Bulk delete products (Admin only)
  async bulkDeleteProducts(productIds: string[]) {
    try {
      const response = await api.delete('/admin/products/bulk/delete', {
        data: { productIds }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      throw error;
    }
  }

  // Bulk update product status (Admin only)
  async bulkUpdateStatus(productIds: string[], status: 'active' | 'inactive' | 'out_of_stock') {
    try {
      const response = await api.patch('/admin/products/bulk/status', {
        productIds,
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating product status:', error);
      throw error;
    }
  }

  // Get admin statistics
  async getAdminStats() {
    try {
      const response = await api.get('/admin/products/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  // Get categories (for product creation/editing)
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get admin brands list
  async getAdminBrands() {
    try {
      const response = await api.get('/admin/products/brands/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin brands:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  // Upload product image
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.url || response.data.data?.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Helper method to map backend product to frontend format
  mapProductForDisplay(product: any): Product {
    return {
      _id: product._id,
      id: product._id, // For backward compatibility
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images || [],
      image: product.images?.[0], // For backward compatibility
      category: product.category,
      brand: product.brand,
      rating: product.rating,
      reviews: product.reviewCount || 0,
      reviewCount: product.reviewCount,
      stock: product.stock,
      stockQuantity: product.stock, // For backward compatibility
      inStock: product.stock > 0, // For backward compatibility
      status: product.status,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale,
      isNew: product.isFeatured, // For backward compatibility
      isHot: false, // For backward compatibility
      isSale: product.isOnSale, // For backward compatibility
      views: product.views,
      sold: product.sold,
      tags: product.tags,
      specifications: product.specifications,
      specs: product.specifications ? { // For backward compatibility
        processor: product.specifications.cpu,
        ram: product.specifications.ram,
        storage: product.specifications.storage,
        graphics: product.specifications.gpu,
        display: product.specifications.screen,
        battery: product.specifications.battery,
        weight: product.specifications.weight,
      } : undefined,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}

export const productService = new ProductService();
export default productService; 