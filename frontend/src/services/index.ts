// Authentication
export { default as authService } from './authService';
export type { User, LoginData, RegisterData, UpdateProfileData, ChangePasswordData, AuthResponse } from './authService';

// Products
export { default as productService } from './productService';
export type { Product, CreateProductData, UpdateProductData, ProductFilters } from './productService';

// Categories
export { default as categoriesService } from './categoriesService';
export type { Category, CreateCategoryData, UpdateCategoryData, CategoryFilters, CategoryTree } from './categoriesService';

// Orders
export { default as orderService } from './orderService';
export type { Order, OrderItem, CreateOrderData } from './orderService';

// Customers
export { default as customerService } from './customerService';
export type { Customer, CustomerAddress, CreateCustomerData } from './customerService';

// Staff
export { default as staffService } from './staffService';

// Reviews
export { default as reviewsService } from './reviewsService';
export type { Review, CreateReviewData, UpdateReviewData, ReviewFilters, ReviewStats, ReportReviewData } from './reviewsService';

// Favorites
export { default as favoritesService } from './favoritesService';
export type { Favorite, FavoriteStats } from './favoritesService';

// Addresses
export { default as addressesService } from './addressesService';
export type { Address, CreateAddressData, UpdateAddressData } from './addressesService';

// Analytics
export { default as analyticsService } from './analyticsService';
export type { AnalyticsData } from './analyticsService';

// Inventory
export { default as inventoryService } from './inventoryService';
export type { InventoryItem, StockAdjustment, UpdateStockData, StockReport, InventoryFilters } from './inventoryService';

// Upload
export { default as uploadService } from './uploadService';
export type { UploadResponse, MultipleUploadResponse } from './uploadService';
