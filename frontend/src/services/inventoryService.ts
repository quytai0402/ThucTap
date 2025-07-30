import api from '../utils/api';

export interface StockAdjustment {
  _id: string;
  product: {
    _id: string;
    name: string;
    sku?: string;
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
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryProduct {
  _id: string;
  name: string;
  sku?: string;
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

export interface UpdateStockData {
  productId: string;
  quantity: number;
  type: 'add' | 'subtract' | 'set';
  reason?: string;
}

export interface InventoryAlert {
  type: 'low_stock' | 'out_of_stock';
  message: string;
  product: string;
  severity: 'warning' | 'error';
}

export interface InventoryFilters {
  page?: number;
  limit?: number;
  lowStock?: boolean;
  outOfStock?: boolean;
  search?: string;
}

export interface StockLevelReport {
  _id: string;
  categoryName: string;
  totalProducts: number;
  totalStock: number;
  averageStock: number;
  lowStockCount: number;
  outOfStockCount: number;
}

class InventoryService {
  // ===== INVENTORY STATUS & LISTING =====

  // Get inventory status with filtering
  async getInventoryStatus(filters: InventoryFilters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/inventory?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory status:', error);
      throw error;
    }
  }

  // Get low stock products
  async getLowStockProducts(threshold = 10): Promise<InventoryProduct[]> {
    try {
      const response = await api.get(`/inventory/low-stock?threshold=${threshold}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw error;
    }
  }

  // Get out of stock products
  async getOutOfStockProducts(): Promise<InventoryProduct[]> {
    try {
      const response = await api.get('/inventory/out-of-stock');
      return response.data;
    } catch (error) {
      console.error('Error fetching out of stock products:', error);
      throw error;
    }
  }

  // ===== STOCK ADJUSTMENTS =====

  // Adjust product stock
  async adjustStock(adjustmentData: UpdateStockData) {
    try {
      const response = await api.post('/inventory/adjust', adjustmentData);
      return response.data;
    } catch (error) {
      console.error('Error adjusting stock:', error);
      throw error;
    }
  }

  // Get stock adjustment history
  async getStockAdjustments(page = 1, limit = 20, productId?: string) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (productId) {
        params.append('productId', productId);
      }
      
      const response = await api.get(`/inventory/adjustments?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock adjustments:', error);
      throw error;
    }
  }

  // ===== INVENTORY REPORTS =====

  // Get stock levels report
  async getStockLevelsReport(): Promise<StockLevelReport[]> {
    try {
      const response = await api.get('/inventory/reports/stock-levels');
      return response.data;
    } catch (error) {
      console.error('Error fetching stock levels report:', error);
      throw error;
    }
  }

  // Get stock movements report
  async getStockMovementsReport(startDate?: string, endDate?: string): Promise<StockAdjustment[]> {
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

  // ===== ALERTS & NOTIFICATIONS =====

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

  // ===== UTILITY METHODS =====

  // Bulk stock adjustment
  async bulkAdjustStock(adjustments: UpdateStockData[]) {
    try {
      const promises = adjustments.map(adjustment => this.adjustStock(adjustment));
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      return {
        successful,
        failed,
        total: adjustments.length,
        results
      };
    } catch (error) {
      console.error('Error in bulk stock adjustment:', error);
      throw error;
    }
  }

  // Get inventory summary
  async getInventorySummary() {
    try {
      const [
        inventoryStatus,
        lowStockProducts,
        outOfStockProducts,
        alerts
      ] = await Promise.all([
        this.getInventoryStatus({ limit: 1 }),
        this.getLowStockProducts(),
        this.getOutOfStockProducts(),
        this.getInventoryAlerts()
      ]);

      return {
        totalProducts: inventoryStatus.pagination?.total || 0,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        alertsCount: alerts.alerts?.length || 0,
        lowStockProducts: lowStockProducts.slice(0, 5), // Top 5
        outOfStockProducts: outOfStockProducts.slice(0, 5), // Top 5
        recentAlerts: alerts.alerts?.slice(0, 5) || []
      };
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
      throw error;
    }
  }

  // Format stock adjustment for display
  formatStockAdjustment(adjustment: StockAdjustment) {
    const changeAmount = adjustment.newQuantity - adjustment.oldQuantity;
    const changeType = changeAmount > 0 ? 'increase' : 'decrease';
    const changeIcon = changeAmount > 0 ? '↗️' : '↘️';
    
    return {
      ...adjustment,
      changeAmount: Math.abs(changeAmount),
      changeType,
      changeIcon,
      formattedDate: new Date(adjustment.createdAt).toLocaleDateString(),
      formattedTime: new Date(adjustment.createdAt).toLocaleTimeString(),
    };
  }

  // Calculate reorder levels (simple algorithm)
  calculateReorderLevel(product: InventoryProduct, averageDailySales = 1) {
    const leadTimeDays = 7; // Assume 7 days lead time
    const safetyStock = averageDailySales * 3; // 3 days safety stock
    const reorderLevel = (averageDailySales * leadTimeDays) + safetyStock;
    
    return {
      reorderLevel: Math.ceil(reorderLevel),
      isLowStock: product.stock <= reorderLevel,
      daysRemaining: Math.floor(product.stock / averageDailySales),
      recommendation: product.stock <= reorderLevel ? 'reorder_now' : 'sufficient'
    };
  }

  // Export inventory data
  async exportInventoryData(format: 'csv' | 'excel' = 'csv') {
    try {
      const response = await api.get(`/inventory/export?format=${format}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Inventory data exported successfully' };
    } catch (error) {
      console.error('Error exporting inventory data:', error);
      throw error;
    }
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;
