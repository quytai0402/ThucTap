import api from '../utils/api';
import { Order } from '../types';

export interface CreateOrderData {
  customer: string;
  items: Array<{
    product: string;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  paymentMethod: 'cod' | 'bank_transfer' | 'vnpay' | 'momo';
  notes?: string;
  discountCode?: string;
}

export interface UpdateOrderData {
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  cancelReason?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  customer?: string;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface ShippingInfo {
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  status: string;
  trackingUrl?: string;
}

class OrdersService {
  // ===== ORDER CRUD OPERATIONS =====

  // Create new order
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get orders with filtering and pagination
  async getOrders(filters: OrderFilters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get single order by ID
  async getOrder(id: string): Promise<Order> {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  // Get order by order number
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    try {
      const response = await api.get(`/orders/number/${orderNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order by number:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(id: string, status: UpdateOrderData['status']): Promise<Order> {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Update payment status
  async updatePaymentStatus(id: string, paymentStatus: UpdateOrderData['paymentStatus'], transactionId?: string): Promise<Order> {
    try {
      const response = await api.patch(`/orders/${id}/payment-status`, { 
        paymentStatus,
        transactionId 
      });
      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Add tracking number
  async addTrackingNumber(id: string, trackingNumber: string): Promise<Order> {
    try {
      const response = await api.patch(`/orders/${id}/tracking`, { trackingNumber });
      return response.data;
    } catch (error) {
      console.error('Error adding tracking number:', error);
      throw error;
    }
  }

  // ===== CUSTOMER ORDER OPERATIONS =====

  // Get current user's orders
  async getMyOrders(page = 1, limit = 10) {
    try {
      const response = await api.get(`/orders/my-orders?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching my orders:', error);
      throw error;
    }
  }

  // Get customer orders by customer ID
  async getCustomerOrders(customerId: string, page = 1, limit = 10) {
    try {
      const response = await api.get(`/orders/customer/${customerId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  }

  // Get recent orders for current user
  async getRecentOrders(limit = 3) {
    try {
      const response = await api.get(`/orders/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  }

  // ===== ADMIN ORDER OPERATIONS =====

  // Get all orders for admin
  async getAdminOrders(filters: OrderFilters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/admin/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      throw error;
    }
  }

  // Get admin order by ID
  async getAdminOrder(id: string): Promise<Order> {
    try {
      const response = await api.get(`/admin/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin order:', error);
      throw error;
    }
  }

  // Update order (admin)
  async updateAdminOrder(id: string, updateData: UpdateOrderData): Promise<Order> {
    try {
      const response = await api.patch(`/admin/orders/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating admin order:', error);
      throw error;
    }
  }

  // Cancel order (admin)
  async cancelOrder(id: string, reason?: string): Promise<Order> {
    try {
      const response = await api.delete(`/admin/orders/${id}`, {
        data: { cancelReason: reason }
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  // ===== ORDER STATISTICS =====

  // Get order statistics
  async getOrderStats(dateFrom?: string, dateTo?: string): Promise<OrderStats> {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      
      const response = await api.get(`/orders/stats?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }

  // Get admin order statistics
  async getAdminOrderStats() {
    try {
      const response = await api.get('/admin/orders/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin order stats:', error);
      throw error;
    }
  }

  // Get customer statistics
  async getCustomerStats() {
    try {
      const response = await api.get('/orders/customer-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw error;
    }
  }

  // ===== ORDER TRACKING =====

  // Get order tracking information
  async getOrderTracking(id: string) {
    try {
      const response = await api.get(`/orders/${id}/tracking`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order tracking:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  // Calculate order totals
  calculateOrderTotals(items: Array<{ price: number; quantity: number }>, shippingFee = 0, discount = 0) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + shippingFee - discount;
    
    return {
      subtotal,
      shippingFee,
      discount,
      total
    };
  }

  // Format order status for display
  formatOrderStatus(status: string): { label: string; color: string; bgColor: string } {
    const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
      pending: { label: 'Chờ xử lý', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      confirmed: { label: 'Đã xác nhận', color: 'text-blue-600', bgColor: 'bg-blue-100' },
      processing: { label: 'Đang xử lý', color: 'text-purple-600', bgColor: 'bg-purple-100' },
      shipped: { label: 'Đã giao', color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
      delivered: { label: 'Đã nhận', color: 'text-green-600', bgColor: 'bg-green-100' },
      cancelled: { label: 'Đã hủy', color: 'text-red-600', bgColor: 'bg-red-100' },
      refunded: { label: 'Đã hoàn tiền', color: 'text-gray-600', bgColor: 'bg-gray-100' }
    };
    
    return statusMap[status] || { label: status, color: 'text-gray-600', bgColor: 'bg-gray-100' };
  }

  // Format payment status for display
  formatPaymentStatus(status: string): { label: string; color: string; bgColor: string } {
    const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
      pending: { label: 'Chờ thanh toán', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      paid: { label: 'Đã thanh toán', color: 'text-green-600', bgColor: 'bg-green-100' },
      failed: { label: 'Thanh toán thất bại', color: 'text-red-600', bgColor: 'bg-red-100' },
      refunded: { label: 'Đã hoàn tiền', color: 'text-gray-600', bgColor: 'bg-gray-100' }
    };
    
    return statusMap[status] || { label: status, color: 'text-gray-600', bgColor: 'bg-gray-100' };
  }

  // Format payment method for display
  formatPaymentMethod(method: string): string {
    const methodMap: Record<string, string> = {
      cod: 'Thanh toán khi nhận hàng',
      bank_transfer: 'Chuyển khoản ngân hàng',
      vnpay: 'VNPay',
      momo: 'MoMo'
    };
    
    return methodMap[method] || method;
  }

  // Generate order number (client-side preview)
  generateOrderNumber(): string {
    const today = new Date();
    const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${datePrefix}${randomSuffix}`;
  }

  // Validate order data before submission
  validateOrderData(orderData: CreateOrderData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate customer
    if (!orderData.customer) {
      errors.push('Customer is required');
    }
    
    // Validate items
    if (!orderData.items || orderData.items.length === 0) {
      errors.push('Order must have at least one item');
    }
    
    orderData.items?.forEach((item, index) => {
      if (!item.product) {
        errors.push(`Item ${index + 1}: Product is required`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
    });
    
    // Validate shipping address
    const requiredAddressFields = ['name', 'phone', 'address', 'city', 'district', 'ward'];
    requiredAddressFields.forEach(field => {
      if (!orderData.shippingAddress[field as keyof typeof orderData.shippingAddress]) {
        errors.push(`Shipping address: ${field} is required`);
      }
    });
    
    // Validate payment method
    const validPaymentMethods = ['cod', 'bank_transfer', 'vnpay', 'momo'];
    if (!validPaymentMethods.includes(orderData.paymentMethod)) {
      errors.push('Invalid payment method');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Export orders data
  async exportOrdersData(filters: OrderFilters = {}, format: 'csv' | 'excel' = 'csv') {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      
      params.append('format', format);
      
      const response = await api.get(`/orders/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Orders data exported successfully' };
    } catch (error) {
      console.error('Error exporting orders data:', error);
      throw error;
    }
  }

  // Bulk update order status
  async bulkUpdateOrderStatus(orderIds: string[], status: UpdateOrderData['status']) {
    try {
      const promises = orderIds.map(id => this.updateOrderStatus(id, status));
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      return {
        successful,
        failed,
        total: orderIds.length,
        results
      };
    } catch (error) {
      console.error('Error in bulk order status update:', error);
      throw error;
    }
  }

  // Get orders summary for dashboard
  async getOrdersSummary() {
    try {
      const [stats, recentOrders] = await Promise.all([
        this.getOrderStats(),
        this.getRecentOrders(5)
      ]);
      
      return {
        ...stats,
        recentOrders,
        todayOrders: recentOrders.filter((order: any) => {
          const today = new Date().toDateString();
          const orderDate = new Date(order.createdAt).toDateString();
          return today === orderDate;
        }).length
      };
    } catch (error) {
      console.error('Error fetching orders summary:', error);
      throw error;
    }
  }
}

export const ordersService = new OrdersService();
export default ordersService; 