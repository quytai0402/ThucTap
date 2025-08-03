import api from '../utils/api';
import Cookies from 'js-cookie';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'customer';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  phoneVerified: boolean;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  loyaltyPoints?: number;
  customerLevel?: 'bronze' | 'silver' | 'gold' | 'platinum';
  addresses?: string[];
  favorites?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string; // Required phone number
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

class AuthService {
  // Login
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', loginData);
      
      if (response.data.token) {
        // Store token in cookies
        Cookies.set('token', response.data.token, { expires: 7 });
        
        // Store user data in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Register
  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', registerData);
      
      if (response.data.token) {
        // Store token in cookies
        Cookies.set('token', response.data.token, { expires: 7 });
        
        // Store user data in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  // Logout
  logout() {
    try {
      // Remove token and user data
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/auth/profile');
      
      // Update user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Update profile
  async updateProfile(updateData: UpdateProfileData): Promise<User> {
    try {
      const response = await api.patch('/auth/profile', updateData);
      
      // Update user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(passwordData: ChangePasswordData) {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    try {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = Cookies.get('token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  // Check if user is customer
  isCustomer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'customer';
  }

  // Get auth token
  getToken(): string | undefined {
    return Cookies.get('token');
  }
}

export const authService = new AuthService();
export default authService;
