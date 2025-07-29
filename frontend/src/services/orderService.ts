import api from '../utils/api';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    district: string;
    ward: string;
    zipCode?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: 'cod' | 'bank_transfer' | 'credit_card' | 'e_wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

export interface CreateOrderData {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    district: string;
    ward: string;
    zipCode?: string;
  };
  items: Omit<OrderItem, 'id'>[];
  paymentMethod: 'cod' | 'bank_transfer' | 'credit_card' | 'e_wallet';
  notes?: string;
}

export interface UpdateOrderData {
  status?: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  estimatedDelivery?: string;
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

class OrderService {
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      
      const response = await api.get(`/api/admin/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrderById(id: string): Promise<Order> {
    try {
      const response = await api.get(`/api/admin/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async createOrder(data: CreateOrderData): Promise<Order> {
    try {
      const response = await api.post('/api/admin/orders', data);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async updateOrder(id: string, data: UpdateOrderData): Promise<Order> {
    try {
      const response = await api.put(`/api/admin/orders/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    try {
      const response = await api.patch(`/api/admin/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']): Promise<Order> {
    try {
      const response = await api.patch(`/api/admin/orders/${id}/payment-status`, { paymentStatus });
      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  async cancelOrder(id: string, reason?: string): Promise<Order> {
    try {
      const response = await api.patch(`/api/admin/orders/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  async refundOrder(id: string, amount?: number, reason?: string): Promise<Order> {
    try {
      const response = await api.post(`/api/admin/orders/${id}/refund`, { amount, reason });
      return response.data;
    } catch (error) {
      console.error('Error refunding order:', error);
      throw error;
    }
  }

  async bulkUpdateStatus(orderIds: string[], status: Order['status']): Promise<void> {
    try {
      await api.patch('/api/admin/orders/bulk-status', { orderIds, status });
    } catch (error) {
      console.error('Error bulk updating order status:', error);
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/orders/${id}`);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  async bulkDeleteOrders(orderIds: string[]): Promise<void> {
    try {
      await api.delete('/api/admin/orders/bulk', { data: { orderIds } });
    } catch (error) {
      console.error('Error bulk deleting orders:', error);
      throw error;
    }
  }

  async getOrderStats(startDate?: string, endDate?: string): Promise<OrderStats> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/api/admin/orders/stats?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }

  async exportOrders(filters?: OrderFilters, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      
      const response = await api.get(`/api/admin/orders/export?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  }

  async sendOrderNotification(id: string, type: 'confirmation' | 'shipping' | 'delivery'): Promise<void> {
    try {
      await api.post(`/api/admin/orders/${id}/notifications`, { type });
    } catch (error) {
      console.error('Error sending order notification:', error);
      throw error;
    }
  }

  async getOrderHistory(id: string): Promise<any[]> {
    try {
      const response = await api.get(`/api/admin/orders/${id}/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
export default orderService;
