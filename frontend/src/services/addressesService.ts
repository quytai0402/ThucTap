import api from '../utils/api';

export interface Address {
  _id: string;
  user: string;
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

export interface CreateAddressData {
  type: 'home' | 'work' | 'other';
  label?: string;
  recipientName: string;
  recipientPhone: string;
  street: string;
  city: string;
  district: string;
  ward: string;
  zipCode?: string;
  isDefault?: boolean;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {}

class AddressesService {
  // Create new address
  async createAddress(addressData: CreateAddressData) {
    try {
      const response = await api.post('/addresses', addressData);
      return response.data;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  }

  // Get user's addresses
  async getAddresses() {
    try {
      const response = await api.get('/addresses');
      return response.data;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  }

  // Get default address
  async getDefaultAddress() {
    try {
      const response = await api.get('/addresses/default');
      return response.data;
    } catch (error) {
      console.error('Error fetching default address:', error);
      throw error;
    }
  }

  // Get single address
  async getAddress(addressId: string) {
    try {
      const response = await api.get(`/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching address:', error);
      throw error;
    }
  }

  // Update address
  async updateAddress(addressId: string, updateData: UpdateAddressData) {
    try {
      const response = await api.patch(`/addresses/${addressId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  // Set default address
  async setDefaultAddress(addressId: string) {
    try {
      const response = await api.patch(`/addresses/${addressId}/set-default`);
      return response.data;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }

  // Delete address
  async deleteAddress(addressId: string) {
    try {
      await api.delete(`/addresses/${addressId}`);
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }
}

export const addressesService = new AddressesService();
export default addressesService;
