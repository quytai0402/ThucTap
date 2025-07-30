export interface Product {
  _id: string;
  id: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  image: string;
  category: string;
  brand: string;
  stock: number;
  stockQuantity: number;
  inStock: boolean;
  isHot: boolean;
  isNew?: boolean;
  isSale?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  status: 'active' | 'inactive';
  rating: number;
  reviews: number;
  reviewCount: number;
  sold: number;
  views?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  specifications?: Record<string, any>;
  specs?: Record<string, any>;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface User {
  _id: string;
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  addresses?: Address[];
  createdAt: string;
  isActive: boolean;
}

export interface Address {
  _id: string;
  id: string;
  userId: string;
  name: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export interface Order {
  _id: string;
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface OrderItem {
  _id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  id: string;
  userId: string;
  user?: User;
  productId: string;
  product?: Product;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  likes: number;
  dislikes: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  totalCount?: number;
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalViews?: number;
  totalVisitors?: number;
  bounceRate?: number;
  avgSession?: string;
}

export interface SalesAnalytics {
  growth: number;
  orderGrowth: number;
  data: number[];
  orderData: number[];
  labels: string[];
  chartData?: {
    data: number[];
    orderData: number[];
    labels: string[];
  };
}

export interface ProductAnalytics {
  topProducts: Product[];
  topSellingProducts: Product[];
  categories: CategoryPerformance[];
  categoryPerformance: CategoryPerformance[];
}

export interface CategoryPerformance {
  category: string;
  sales: number;
  revenue: number;
  growth: number;
}

export interface CustomerAnalytics {
  growth: number;
  newCustomers: number;
  returningCustomers: number;
}

export interface InventoryItem {
  _id: string;
  productId: string;
  product?: Product;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
  maxStock: number;
  location?: string;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface StockAdjustment {
  _id: string;
  productId: string;
  product?: Product;
  type: 'increase' | 'decrease' | 'correction';
  quantity: number;
  reason: string;
  userId: string;
  user?: User;
  createdAt: string;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  uptime: number;
  memoryUsage: {
    percentage: number;
    used: number;
    total: number;
  };
  services: Record<string, boolean>;
}

export interface DatabaseStats {
  users: number;
  products: number;
  orders: number;
  categories: number;
  reviews: number;
  favorites: number;
  addresses: number;
  totalRecords: number;
  databaseSize?: string;
}
