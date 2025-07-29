import api from '../utils/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  sold: number;
  isNew?: boolean;
  isHot?: boolean;
  isSale?: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  specs?: {
    processor?: string;
    ram?: string;
    storage?: string;
    graphics?: string;
    display?: string;
    battery?: string;
    weight?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  stock?: number;
  stockQuantity?: number; // Support both fields for compatibility
  isFeatured?: boolean;
  isOnSale?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isSale?: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  specifications?: {
    processor?: string;
    ram?: string;
    storage?: string;
    graphics?: string;
    display?: string;
    battery?: string;
    weight?: string;
    screenSize?: string;
    resolution?: string;
    os?: string;
    ports?: string[];
    features?: string[];
  };
  specs?: { // Support both field names
    processor?: string;
    ram?: string;
    storage?: string;
    graphics?: string;
    display?: string;
    battery?: string;
    weight?: string;
    screenSize?: string;
    resolution?: string;
    os?: string;
    ports?: string[];
    features?: string[];
  };
  tags?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  status?: string;
  page?: number;
  limit?: number;
}

class ProductService {
  // Get all products with filters
  async getProducts(filters?: ProductFilters) {
    try {
      const params = new URLSearchParams();
      
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.brand) params.append('brand', filters.brand);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get(`/admin/products?${params.toString()}`);
      
      // Handle NestJS response format
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get single product by ID
  async getProduct(id: string) {
    try {
      const response = await api.get(`/admin/products/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Create new product
  async createProduct(productData: CreateProductData) {
    try {
      // Map specifications field names from frontend to backend
      let mappedSpecifications = {};
      const specs = productData.specifications || productData.specs;
      
      if (specs) {
        const specsAny = specs as any;
        mappedSpecifications = {
          cpu: specsAny.processor || specsAny.cpu || '',
          ram: specsAny.ram || '',
          storage: specsAny.storage || '',
          gpu: specsAny.graphics || specsAny.gpu || '',
          screen: specsAny.display || specsAny.screen || '',
          screenSize: specsAny.screenSize || '',
          resolution: specsAny.resolution || '',
          battery: specsAny.battery || '',
          weight: specsAny.weight || '',
          os: specsAny.os || '',
          ports: specsAny.ports || [],
          features: specsAny.features || []
        };
      }

      // Map frontend data to backend format
      const backendData = {
        name: productData.name,
        description: productData.description,
        shortDescription: productData.description.substring(0, 100),
        price: productData.price,
        originalPrice: productData.originalPrice,
        stock: productData.stockQuantity || productData.stock || 0,
        category: productData.category,
        brand: productData.brand,
        images: productData.images || (productData.image ? [productData.image] : []),
        specifications: mappedSpecifications,
        tags: productData.tags || [],
        isFeatured: productData.isNew || false,
        isOnSale: productData.isSale || false,
      };

      const response = await api.post('/admin/products', backendData);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(id: string, productData: Partial<CreateProductData>) {
    try {
      // Map frontend data to backend format
      const backendData: any = {};
      
      if (productData.name) backendData.name = productData.name;
      if (productData.description) {
        backendData.description = productData.description;
        backendData.shortDescription = productData.description.substring(0, 100);
      }
      if (productData.price) backendData.price = productData.price;
      if (productData.originalPrice) backendData.originalPrice = productData.originalPrice;
      if (productData.stockQuantity !== undefined || productData.stock !== undefined) {
        backendData.stock = productData.stockQuantity || productData.stock;
      }
      if (productData.category) backendData.category = productData.category;
      if (productData.brand) backendData.brand = productData.brand;
      if (productData.images) backendData.images = productData.images;
      else if (productData.image) backendData.images = [productData.image];
      if (productData.specifications || productData.specs) {
        const specs = productData.specifications || productData.specs;
        const specsAny = specs as any;
        backendData.specifications = {
          cpu: specsAny.processor || specsAny.cpu || '',
          ram: specsAny.ram || '',
          storage: specsAny.storage || '',
          gpu: specsAny.graphics || specsAny.gpu || '',
          screen: specsAny.display || specsAny.screen || '',
          screenSize: specsAny.screenSize || '',
          resolution: specsAny.resolution || '',
          battery: specsAny.battery || '',
          weight: specsAny.weight || '',
          os: specsAny.os || '',
          ports: specsAny.ports || [],
          features: specsAny.features || []
        };
      }
      if (productData.tags) backendData.tags = productData.tags;
      if (productData.isNew !== undefined) backendData.isFeatured = productData.isNew;
      if (productData.isSale !== undefined) backendData.isOnSale = productData.isSale;

      const response = await api.patch(`/admin/products/${id}`, backendData);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(id: string) {
    try {
      await api.delete(`/admin/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Bulk delete products
  async bulkDeleteProducts(ids: string[]) {
    try {
      await api.delete('/admin/products/bulk/delete', { 
        data: { productIds: ids }
      });
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      throw error;
    }
  }

  // Upload product image
  async uploadImage(file: File) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.url || response.data.data?.url || URL.createObjectURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      // Return a placeholder URL for demo
      return URL.createObjectURL(file);
    }
  }

  // Get categories
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get brands
  async getBrands() {
    try {
      const response = await api.get('/products/brands');
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();
export default productService;
