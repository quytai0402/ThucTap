// Updated services exports with all new integrated services

// Core services
export { default as authService } from './authService';
export { default as productService } from './productService';
export { inventoryService } from './inventoryService';
export { ordersService } from './ordersService';
export { analyticsService } from './analyticsService';
export { settingsService } from './settingsService';

// Additional services  
export { default as categoriesService } from './categoriesService';
export { default as customerService } from './customerService';
export { default as favoritesService } from './favoritesService';
export { default as reviewsService } from './reviewsService';
export { default as uploadService } from './uploadService';
export { default as vnpayService } from './vnpayService';
export { default as addressesService } from './addressesService';

// Import for internal use
import productService from './productService';
import { ordersService } from './ordersService';
import { analyticsService } from './analyticsService';
import { inventoryService } from './inventoryService';
import { settingsService } from './settingsService';

// Legacy compatibility (if needed)
export { default as productsService } from './productService';
export { default as orderService } from './ordersService';

// Type exports
export type { Product, User, Order, Category } from '../types';

// Service configuration
export const serviceConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  retries: 3
};

// Service status checker
export const checkServiceHealth = async () => {
  try {
    const services = {
      products: await productService.getProducts({ limit: 1 }).then(() => true).catch(() => false),
      orders: await ordersService.getOrderStats().then(() => true).catch(() => false),
      analytics: await analyticsService.getDashboardStats().then(() => true).catch(() => false),
      inventory: await inventoryService.getInventoryAlerts().then(() => true).catch(() => false),
      settings: await settingsService.getSystemSettings().then(() => true).catch(() => false)
    };
    
    return services;
  } catch (error) {
    console.error('Service health check failed:', error);
    return {
      products: false,
      orders: false,
      analytics: false,
      inventory: false,
      settings: false
    };
  }
};

// Service initialization
export const initializeServices = async () => {
  console.log('🚀 Initializing all services...');
  
  const health = await checkServiceHealth();
  const healthyServices = Object.values(health).filter(Boolean).length;
  const totalServices = Object.keys(health).length;
  
  console.log(`✅ Services initialized: ${healthyServices}/${totalServices} healthy`);
  
  if (healthyServices < totalServices) {
    console.warn('⚠️ Some services are not responding. Check backend connection.');
  }
  
  return health;
};
