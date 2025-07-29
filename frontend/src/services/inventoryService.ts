import api from '../utils/api';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export interface StockAdjustment {
  id: string;
  product: {
    _id: string;
    name: string;
    sku: string;
  };
  oldQuantity: number;
  newQuantity: number;
  adjustmentQuantity: number;
  adjustmentType: 'add' | 'subtract' | 'set';
  reason: string;
  adjustedBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export interface UpdateStockData {
  productId: string;
  quantity: number;
  type: 'add' | 'subtract' | 'set';
  reason?: string;
}

export interface StockReport {
  categoryName: string;
  totalProducts: number;
  totalStock: number;
  averageStock: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface InventoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  lowStock?: boolean;
}

class InventoryService {
  // Get inventory overview
  async getInventory(filters?: InventoryFilters) {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.lowStock) params.append('lowStock', 'true');

      const response = await api.get(`/inventory?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  }

  // Get low stock products
  async getLowStockProducts(threshold: number = 10) {
    try {
      const response = await api.get(`/inventory/low-stock?threshold=${threshold}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw error;
    }
  }

  // Get out of stock products
  async getOutOfStockProducts() {
    try {
      const response = await api.get('/inventory/out-of-stock');
      return response.data;
    } catch (error) {
      console.error('Error fetching out of stock products:', error);
      throw error;
    }
  }

  // Get stock adjustments
  async getStockAdjustments(page: number = 1, limit: number = 10, productId?: string) {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (productId) params.append('productId', productId);

      const response = await api.get(`/inventory/adjustments?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock adjustments:', error);
      throw error;
    }
  }

  // Adjust stock
  async adjustStock(adjustmentData: UpdateStockData) {
    try {
      const response = await api.post('/inventory/adjust', adjustmentData);
      return response.data;
    } catch (error) {
      console.error('Error adjusting stock:', error);
      throw error;
    }
  }

  // Get stock levels report
  async getStockLevelsReport() {
    try {
      const response = await api.get('/inventory/reports/stock-levels');
      return response.data;
    } catch (error) {
      console.error('Error fetching stock levels report:', error);
      throw error;
    }
  }

  // Get stock movements report
  async getStockMovementsReport(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(`/inventory/reports/stock-movements?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock movements report:', error);
      throw error;
    }
  }

  // Get inventory alerts
  async getInventoryAlerts() {
    try {
      const response = await api.get('/inventory/alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory alerts:', error);
      throw error;
    }
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;
