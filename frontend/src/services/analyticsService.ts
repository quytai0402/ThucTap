import api from '../utils/api';

export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}

export interface RecentOrder {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface TopProduct {
  _id: string;
  name: string;
  totalSold: number;
  image?: string;
}

export interface SalesAnalytics {
  _id: string;
  totalSales: number;
  orderCount: number;
}

export interface ProductAnalytics {
  _id: string;
  name: string;
  totalSold: number;
  totalRevenue: number;
  image?: string;
}

export interface CustomerAnalytics {
  newCustomers: number;
  totalCustomers: number;
  topCustomers: TopCustomer[];
}

export interface TopCustomer {
  _id: string;
  name: string;
  email: string;
  totalSpent: number;
  orderCount: number;
}

export interface RevenueAnalytics {
  _id: string;
  revenue: number;
}

export interface OrderStatusDistribution {
  _id: string;
  count: number;
}

export interface CategoryPerformance {
  _id: string;
  categoryName: string;
  totalSales: number;
  productsSold: number;
}

export interface AnalyticsFilters {
  period?: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
  limit?: number;
}

class AnalyticsService {
  // ===== DASHBOARD ANALYTICS =====

  // Get main dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // ===== SALES ANALYTICS =====

  // Get sales analytics with period filtering
  async getSalesAnalytics(filters: AnalyticsFilters = {}): Promise<SalesAnalytics[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters.period) params.append('period', filters.period);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await api.get(`/analytics/sales?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      throw error;
    }
  }

  // ===== PRODUCT ANALYTICS =====

  // Get product performance analytics
  async getProductAnalytics(limit = 10): Promise<ProductAnalytics[]> {
    try {
      const response = await api.get(`/analytics/products?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      throw error;
    }
  }

  // ===== CUSTOMER ANALYTICS =====

  // Get customer analytics
  async getCustomerAnalytics(): Promise<CustomerAnalytics> {
    try {
      const response = await api.get('/analytics/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      throw error;
    }
  }

  // ===== REVENUE ANALYTICS =====

  // Get revenue analytics
  async getRevenueAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<RevenueAnalytics[]> {
    try {
      const response = await api.get(`/analytics/revenue?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  }

  // ===== ORDER ANALYTICS =====

  // Get order status distribution
  async getOrderStatusDistribution(): Promise<OrderStatusDistribution[]> {
    try {
      const response = await api.get('/analytics/orders/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching order status distribution:', error);
      throw error;
    }
  }

  // ===== CATEGORY ANALYTICS =====

  // Get category performance
  async getCategoryPerformance(): Promise<CategoryPerformance[]> {
    try {
      const response = await api.get('/analytics/categories/performance');
      return response.data;
    } catch (error) {
      console.error('Error fetching category performance:', error);
      throw error;
    }
  }

  // ===== COMPREHENSIVE ANALYTICS =====

  // Get all analytics data for dashboard
  async getComprehensiveAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'month') {
    try {
      const [
        dashboardStats,
        salesAnalytics,
        productAnalytics,
        customerAnalytics,
        revenueAnalytics,
        orderStatusDistribution,
        categoryPerformance
      ] = await Promise.all([
        this.getDashboardStats(),
        this.getSalesAnalytics({ period }),
        this.getProductAnalytics(10),
        this.getCustomerAnalytics(),
        this.getRevenueAnalytics(period),
        this.getOrderStatusDistribution(),
        this.getCategoryPerformance()
      ]);

      return {
        dashboardStats,
        salesAnalytics,
        productAnalytics,
        customerAnalytics,
        revenueAnalytics,
        orderStatusDistribution,
        categoryPerformance,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching comprehensive analytics:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  // Format currency for display
  formatCurrency(amount: number, currency = 'VND'): string {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Format numbers for display
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Calculate percentage change
  calculatePercentageChange(current: number, previous: number): {
    change: number;
    percentage: number;
    isIncrease: boolean;
  } {
    if (previous === 0) {
      return {
        change: current,
        percentage: 100,
        isIncrease: current > 0
      };
    }

    const change = current - previous;
    const percentage = Math.abs((change / previous) * 100);
    
    return {
      change,
      percentage: Math.round(percentage * 100) / 100,
      isIncrease: change > 0
    };
  }

  // Get date range for period
  getDateRange(period: 'day' | 'week' | 'month' | 'year'): { startDate: string; endDate: string } {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 30); // Last 30 days
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7 * 12); // Last 12 weeks
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 12); // Last 12 months
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 5); // Last 5 years
        break;
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  }

  // Process sales data for charts
  processSalesDataForChart(salesData: SalesAnalytics[]) {
    return {
      labels: salesData.map(item => item._id),
      datasets: [
        {
          label: 'Total Sales',
          data: salesData.map(item => item.totalSales),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Order Count',
          data: salesData.map(item => item.orderCount),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };
  }

  // Process revenue data for charts
  processRevenueDataForChart(revenueData: RevenueAnalytics[]) {
    return {
      labels: revenueData.map(item => item._id),
      datasets: [
        {
          label: 'Revenue',
          data: revenueData.map(item => item.revenue),
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }

  // Process order status for pie chart
  processOrderStatusForChart(statusData: OrderStatusDistribution[]) {
    const colors: Record<string, string> = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      processing: '#8b5cf6',
      shipped: '#06b6d4',
      delivered: '#10b981',
      cancelled: '#ef4444',
      refunded: '#6b7280'
    };

    return {
      labels: statusData.map(item => item._id),
      datasets: [
        {
          data: statusData.map(item => item.count),
          backgroundColor: statusData.map(item => colors[item._id] || '#6b7280'),
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      ]
    };
  }

  // Process category performance for bar chart
  processCategoryDataForChart(categoryData: CategoryPerformance[]) {
    return {
      labels: categoryData.map(item => item.categoryName),
      datasets: [
        {
          label: 'Total Sales',
          data: categoryData.map(item => item.totalSales),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        },
        {
          label: 'Products Sold',
          data: categoryData.map(item => item.productsSold),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    };
  }

  // Export analytics data
  async exportAnalyticsData(
    type: 'dashboard' | 'sales' | 'products' | 'customers' | 'revenue' | 'comprehensive',
    format: 'csv' | 'excel' | 'pdf' = 'csv',
    filters?: AnalyticsFilters
  ) {
    try {
      const params = new URLSearchParams({
        type,
        format
      });
      
      if (filters?.period) params.append('period', filters.period);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      
      const response = await api.get(`/analytics/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics_${type}_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Analytics data exported successfully' };
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      throw error;
    }
  }

  // Generate analytics insights
  generateInsights(data: any) {
    const insights = [];
    
    // Revenue trend analysis
    if (data.revenueAnalytics?.length >= 2) {
      const recent = data.revenueAnalytics[data.revenueAnalytics.length - 1];
      const previous = data.revenueAnalytics[data.revenueAnalytics.length - 2];
      const change = this.calculatePercentageChange(recent.revenue, previous.revenue);
      
      insights.push({
        type: 'revenue_trend',
        title: 'Revenue Trend',
        message: `Revenue ${change.isIncrease ? 'increased' : 'decreased'} by ${change.percentage}% compared to previous period`,
        impact: change.isIncrease ? 'positive' : 'negative',
        value: change.percentage
      });
    }
    
    // Top performing categories
    if (data.categoryPerformance?.length > 0) {
      const topCategory = data.categoryPerformance[0];
      insights.push({
        type: 'top_category',
        title: 'Top Performing Category',
        message: `${topCategory.categoryName} is your best performing category with ${this.formatCurrency(topCategory.totalSales)} in sales`,
        impact: 'positive',
        category: topCategory.categoryName
      });
    }
    
    // Customer growth
    if (data.customerAnalytics) {
      const { newCustomers, totalCustomers } = data.customerAnalytics;
      const growthRate = (newCustomers / Math.max(totalCustomers - newCustomers, 1)) * 100;
      
      insights.push({
        type: 'customer_growth',
        title: 'Customer Growth',
        message: `${newCustomers} new customers acquired (${growthRate.toFixed(1)}% growth rate)`,
        impact: growthRate > 5 ? 'positive' : 'neutral',
        value: growthRate
      });
    }
    
    return insights;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
