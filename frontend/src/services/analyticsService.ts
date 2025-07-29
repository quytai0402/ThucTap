import api from '../utils/api';

export interface AnalyticsData {
  dashboard: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    newCustomers: number;
    pendingOrders: number;
    lowStockProducts: number;
    averageOrderValue: number;
  };
  sales: {
    period: string;
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    topSellingProducts: Array<{
      productId: string;
      productName: string;
      totalSold: number;
      revenue: number;
    }>;
  };
  revenue: {
    period: string;
    totalRevenue: number;
    monthlyRevenue: Array<{
      month: string;
      revenue: number;
      orders: number;
    }>;
  };
}

class AnalyticsService {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Get sales analytics
  async getSalesAnalytics(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/analytics/sales?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      throw error;
    }
  }

  // Get product analytics
  async getProductAnalytics() {
    try {
      const response = await api.get('/analytics/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      throw error;
    }
  }

  // Get customer analytics
  async getCustomerAnalytics() {
    try {
      const response = await api.get('/analytics/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      throw error;
    }
  }

  // Get revenue analytics
  async getRevenueAnalytics(period?: string) {
    try {
      const params = period ? `?period=${period}` : '';
      const response = await api.get(`/analytics/revenue${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  }

  // Get order status distribution
  async getOrderStatusDistribution() {
    try {
      const response = await api.get('/analytics/orders/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching order status distribution:', error);
      throw error;
    }
  }

  // Get category performance
  async getCategoryPerformance() {
    try {
      const response = await api.get('/analytics/categories/performance');
      return response.data;
    } catch (error) {
      console.error('Error fetching category performance:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
