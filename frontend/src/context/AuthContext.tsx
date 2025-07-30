import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import api from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = Cookies.get('token');
    if (token) {
      // Verify token with backend
      verifyToken(token);
    } else {
      // No token, user not logged in
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await api.get('/auth/profile');
      
      if (response.data) {
        const userData = response.data;
        setUser({
          id: userData.id || userData._id,
          name: userData.name || userData.fullName,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
        });
      } else {
        // Only remove token if we get a response but no data
        Cookies.remove('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      
      // Only remove token if it's a 401 (unauthorized) error
      if ((error as any)?.response?.status === 401) {
        console.log('Token expired or invalid, removing...');
        Cookies.remove('token');
        setUser(null);
      } else {
        // For other errors (like network issues), keep the token
        console.log('Network or server error, keeping token for retry');
        // Don't setUser(null) here - keep previous state
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data) {
        const { user: userData, access_token } = response.data;
        Cookies.set('token', access_token, { expires: 7 });
        const userInfo = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
        };
        setUser(userInfo);
        
        // Return user info for redirect logic
        return userInfo;
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', {
        fullName: name,
        email,
        password,
      });

      if (response.data) {
        const { user: userData, access_token } = response.data;
        Cookies.set('token', access_token, { expires: 7 });
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Đăng ký thất bại';
      throw new Error(errorMessage);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 