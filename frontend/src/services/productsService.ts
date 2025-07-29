import { Product } from '../types';

const API_BASE_URL = 'http://localhost:3001/api'; // Always use absolute URL

export const productsService = {
  // Get featured products for homepage
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/featured`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },

  // Get all products with pagination
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.brand) queryParams.append('brand', params.brand);
      if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params?.search) queryParams.append('search', params.search);

      const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return { products: [], total: 0, page: 1, totalPages: 0 };
    }
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Get product by slug
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      return null;
    }
  },

  // Get products on sale
  async getOnSaleProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/on-sale`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching on-sale products:', error);
      return [];
    }
  },

  // Get best sellers
  async getBestSellers(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/best-sellers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      return [];
    }
  },

  // Get related products
  async getRelatedProducts(productId: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/related`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
  },

  // Get brands
  async getBrands(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/brands`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  },
};
