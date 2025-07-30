import api from '../utils/api';

export interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  addresses?: CustomerAddress[];
  defaultAddressId?: string;
  status: 'active' | 'inactive' | 'blocked';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  loyaltyPoints?: number;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue?: number;
  lastOrderDate?: string;
  registrationDate?: string;
  lastLoginDate?: string;
  notes?: string;
  tags?: string[];
  preferredLanguage?: 'vi' | 'en';
  marketingConsent?: boolean;
  createdAt: string;
  updatedAt: string;
  isGuest?: boolean;
  successfulOrders?: number;
  customerLevel?: string;
}

export interface CustomerAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  label?: string;
  recipientName: string;
  recipientPhone: string;
  street: string;
  city: string;
  district: string;
  ward: string;
  zipCode?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  status?: 'active' | 'inactive' | 'blocked';
  addresses?: Omit<CustomerAddress, 'id' | 'createdAt' | 'updatedAt'>[];
  notes?: string;
  tags?: string[];
  preferredLanguage?: 'vi' | 'en';
  marketingConsent?: boolean;
}

export interface UpdateCustomerData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  status?: 'active' | 'inactive' | 'blocked';
  notes?: string;
  tags?: string[];
  preferredLanguage?: 'vi' | 'en';
  marketingConsent?: boolean;
}

export interface CustomerFilters {
  status?: string;
  city?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  lastOrderStartDate?: string;
  lastOrderEndDate?: string;
  minTotalSpent?: number;
  maxTotalSpent?: number;
  minOrders?: number;
  maxOrders?: number;
  tags?: string[];
  hasOrders?: boolean;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  customersWithOrders: number;
  averageCustomerValue: number;
  topCustomersBySpending: {
    id: string;
    name: string;
    totalSpent: number;
    totalOrders: number;
  }[];
  customersByCity: {
    city: string;
    count: number;
  }[];
  customerGrowth: {
    month: string;
    newCustomers: number;
    totalCustomers: number;
  }[];
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

class CustomerService {
  async getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => params.append(key, v));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }
      
      // Use the combined customers endpoint to get both registered and guest customers
      const response = await api.get(`/admin/combined-customers?${params.toString()}`);
      return response.data.customers || response.data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getCustomerById(id: string): Promise<Customer> {
    try {
      const response = await api.get(`/api/admin/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  async createCustomer(data: CreateCustomerData): Promise<Customer> {
    try {
      const response = await api.post('/api/admin/customers', data);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async updateCustomer(id: string, data: UpdateCustomerData): Promise<Customer> {
    try {
      const response = await api.put(`/api/admin/customers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  async updateCustomerStatus(id: string, status: Customer['status']): Promise<Customer> {
    try {
      const response = await api.patch(`/api/admin/customers/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating customer status:', error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/customers/${id}`);
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  async bulkDeleteCustomers(customerIds: string[]): Promise<void> {
    try {
      await api.delete('/api/admin/customers/bulk', { data: { customerIds } });
    } catch (error) {
      console.error('Error bulk deleting customers:', error);
      throw error;
    }
  }

  async bulkUpdateStatus(customerIds: string[], status: Customer['status']): Promise<void> {
    try {
      await api.patch('/api/admin/customers/bulk-status', { customerIds, status });
    } catch (error) {
      console.error('Error bulk updating customer status:', error);
      throw error;
    }
  }

  async addCustomerAddress(customerId: string, address: Omit<CustomerAddress, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomerAddress> {
    try {
      const response = await api.post(`/api/admin/customers/${customerId}/addresses`, address);
      return response.data;
    } catch (error) {
      console.error('Error adding customer address:', error);
      throw error;
    }
  }

  async updateCustomerAddress(customerId: string, addressId: string, address: Partial<CustomerAddress>): Promise<CustomerAddress> {
    try {
      const response = await api.put(`/api/admin/customers/${customerId}/addresses/${addressId}`, address);
      return response.data;
    } catch (error) {
      console.error('Error updating customer address:', error);
      throw error;
    }
  }

  async deleteCustomerAddress(customerId: string, addressId: string): Promise<void> {
    try {
      await api.delete(`/api/admin/customers/${customerId}/addresses/${addressId}`);
    } catch (error) {
      console.error('Error deleting customer address:', error);
      throw error;
    }
  }

  async setDefaultAddress(customerId: string, addressId: string): Promise<void> {
    try {
      await api.patch(`/api/admin/customers/${customerId}/addresses/${addressId}/default`);
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }

  async getCustomerOrders(customerId: string): Promise<CustomerOrder[]> {
    try {
      const response = await api.get(`/api/admin/customers/${customerId}/orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  }

  async addLoyaltyPoints(customerId: string, points: number, reason?: string): Promise<Customer> {
    try {
      const response = await api.post(`/api/admin/customers/${customerId}/loyalty-points`, { points, reason });
      return response.data;
    } catch (error) {
      console.error('Error adding loyalty points:', error);
      throw error;
    }
  }

  async getCustomerStats(startDate?: string, endDate?: string): Promise<CustomerStats> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/api/admin/customers/stats?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw error;
    }
  }

  async exportCustomers(filters?: CustomerFilters, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => params.append(key, v));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }
      
      const response = await api.get(`/api/admin/customers/export?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting customers:', error);
      throw error;
    }
  }

  async sendCustomerEmail(customerId: string, subject: string, content: string, template?: string): Promise<void> {
    try {
      await api.post(`/api/admin/customers/${customerId}/email`, { subject, content, template });
    } catch (error) {
      console.error('Error sending customer email:', error);
      throw error;
    }
  }

  async bulkSendEmail(customerIds: string[], subject: string, content: string, template?: string): Promise<void> {
    try {
      await api.post('/api/admin/customers/bulk-email', { customerIds, subject, content, template });
    } catch (error) {
      console.error('Error sending bulk customer email:', error);
      throw error;
    }
  }

  async getCustomerActivity(customerId: string): Promise<any[]> {
    try {
      const response = await api.get(`/api/admin/customers/${customerId}/activity`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer activity:', error);
      throw error;
    }
  }

  async addCustomerNote(customerId: string, note: string): Promise<void> {
    try {
      await api.post(`/api/admin/customers/${customerId}/notes`, { note });
    } catch (error) {
      console.error('Error adding customer note:', error);
      throw error;
    }
  }

  async addCustomerTags(customerId: string, tags: string[]): Promise<Customer> {
    try {
      const response = await api.post(`/api/admin/customers/${customerId}/tags`, { tags });
      return response.data;
    } catch (error) {
      console.error('Error adding customer tags:', error);
      throw error;
    }
  }

  async removeCustomerTags(customerId: string, tags: string[]): Promise<Customer> {
    try {
      const response = await api.delete(`/api/admin/customers/${customerId}/tags`, { data: { tags } });
      return response.data;
    } catch (error) {
      console.error('Error removing customer tags:', error);
      throw error;
    }
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    try {
      const response = await api.get(`/api/admin/customers/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }
}

export const customerService = new CustomerService();
export default customerService;
