import React, { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  PhotoIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon,
  TagIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  sold: number;
  isNew?: boolean;
  isHot?: boolean;
  isSale?: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'PRD001',
      name: 'iPhone 15 Pro Max 256GB',
      description: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP và màn hình Super Retina XDR 6.7 inch',
      price: 30000000,
      originalPrice: 32000000,
      image: '/images/iphone15.jpg',
      category: 'Điện thoại',
      brand: 'Apple',
      rating: 4.8,
      reviewCount: 156,
      inStock: true,
      stockQuantity: 25,
      sold: 125,
      isNew: true,
      isHot: true,
      isSale: true,
      status: 'active',
      createdAt: '2023-12-01T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z'
    },
    {
      id: 'PRD002',
      name: 'MacBook Pro M3 14 inch',
      description: 'MacBook Pro 14 inch với chip M3, 16GB RAM, 512GB SSD',
      price: 50000000,
      image: '/images/macbook-pro-m3.jpg',
      category: 'Laptop',
      brand: 'Apple',
      rating: 4.9,
      reviewCount: 89,
      inStock: true,
      stockQuantity: 12,
      sold: 89,
      isNew: true,
      isHot: true,
      status: 'active',
      createdAt: '2023-11-15T09:30:00Z',
      updatedAt: '2024-01-14T16:45:00Z'
    },
    {
      id: 'PRD003',
      name: 'iPad Air 5th Gen 256GB',
      description: 'iPad Air với chip M1, màn hình Liquid Retina 10.9 inch',
      price: 18000000,
      originalPrice: 20000000,
      image: '/images/ipad-air.jpg',
      category: 'Tablet',
      brand: 'Apple',
      rating: 4.7,
      reviewCount: 234,
      inStock: true,
      stockQuantity: 35,
      sold: 156,
      isSale: true,
      status: 'active',
      createdAt: '2023-10-20T11:15:00Z',
      updatedAt: '2024-01-13T09:20:00Z'
    },
    {
      id: 'PRD004',
      name: 'AirPods Pro 2nd Gen',
      description: 'AirPods Pro với chip H2, chống ồn chủ động thế hệ mới',
      price: 6000000,
      image: '/images/airpods-pro.jpg',
      category: 'Phụ kiện',
      brand: 'Apple',
      rating: 4.6,
      reviewCount: 345,
      inStock: true,
      stockQuantity: 50,
      sold: 234,
      isHot: true,
      status: 'active',
      createdAt: '2023-09-10T14:00:00Z',
      updatedAt: '2024-01-12T11:30:00Z'
    },
    {
      id: 'PRD005',
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Galaxy S24 Ultra với Snapdragon 8 Gen 3, camera 200MP',
      price: 28000000,
      image: '/images/galaxy-s24.jpg',
      category: 'Điện thoại',
      brand: 'Samsung',
      rating: 4.5,
      reviewCount: 198,
      inStock: false,
      stockQuantity: 0,
      sold: 87,
      status: 'out_of_stock',
      createdAt: '2023-08-25T16:30:00Z',
      updatedAt: '2024-01-10T08:15:00Z'
    },
    {
      id: 'PRD006',
      name: 'Dell XPS 13 Plus',
      description: 'Dell XPS 13 Plus với Intel Core i7, 16GB RAM, 1TB SSD',
      price: 35000000,
      image: '/images/dell-xps.jpg',
      category: 'Laptop',
      brand: 'Dell',
      rating: 4.4,
      reviewCount: 67,
      inStock: true,
      stockQuantity: 8,
      sold: 45,
      status: 'inactive',
      createdAt: '2023-07-15T13:45:00Z',
      updatedAt: '2024-01-08T15:20:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showProductDetail, setShowProductDetail] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredProducts = products.filter(product => {
    const categoryName = typeof product.category === 'string' ? product.category : (product.category as any)?.name || '';
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || 
      (typeof product.category === 'string' ? product.category === categoryFilter : (product.category as any)?.name === categoryFilter);
    const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'out_of_stock': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Tạm dừng';
      case 'out_of_stock': return 'Hết hàng';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-4 w-4" />;
      case 'inactive': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'out_of_stock': return <XCircleIcon className="h-4 w-4" />;
      default: return <CheckCircleIcon className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (productId: string, newStatus: string) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, status: newStatus as any, updatedAt: new Date().toISOString() }
        : product
    ));
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map(product => product.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for products:`, selectedProducts);
    // Implement bulk actions here
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const handleExport = () => {
    console.log('Exporting products...');
    // Implement export functionality
  };

  const categories = Array.from(new Set(products.map(p => p.category)));
  const brands = Array.from(new Set(products.map(p => p.brand)));

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    inactiveProducts: products.filter(p => p.status === 'inactive').length,
    outOfStockProducts: products.filter(p => p.status === 'out_of_stock').length,
    totalValue: products.reduce((sum, product) => sum + (product.price * product.stockQuantity), 0),
    totalSold: products.reduce((sum, product) => sum + product.sold, 0)
  };

  return (
    <AdminLayout title="Quản lý sản phẩm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý sản phẩm</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Theo dõi và quản lý kho hàng
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Xuất Excel
            </button>
            <button
              onClick={() => setShowAddProduct(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <CubeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng SP</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hoạt động</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tạm dừng</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inactiveProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hết hàng</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.outOfStockProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <TagIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">GT Kho</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CubeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đã bán</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSold}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả thương hiệu</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm dừng</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>

            {selectedProducts.length > 0 && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkAction(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Hành động ({selectedProducts.length})</option>
                <option value="export">Xuất đã chọn</option>
                <option value="activate">Kích hoạt</option>
                <option value="deactivate">Tạm dừng</option>
                <option value="delete">Xóa đã chọn</option>
              </select>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Đã bán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cập nhật
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <PhotoIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                            {product.isNew && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Mới
                              </span>
                            )}
                            {product.isHot && (
                              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Hot
                              </span>
                            )}
                            {product.isSale && (
                              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Sale
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">#{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {typeof product.category === 'string' ? product.category : (product.category as any)?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        product.stockQuantity < 10 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {product.stockQuantity}
                      </div>
                      {product.stockQuantity < 10 && (
                        <div className="text-xs text-red-500">Sắp hết</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{product.sold}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-900 dark:text-white">{product.rating}</span>
                        </div>
                        <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          ({product.reviewCount})
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={product.status}
                        onChange={(e) => handleStatusChange(product.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(product.status)}`}
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Tạm dừng</option>
                        <option value="out_of_stock">Hết hàng</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(product.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setShowProductDetail(product.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => console.log('Edit product:', product.id)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{' '}
                      <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> trong{' '}
                      <span className="font-medium">{filteredProducts.length}</span> kết quả
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        Trước
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        Sau
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Detail Modal */}
        {showProductDetail && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowProductDetail(null)}></div>
              
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                {(() => {
                  const product = products.find(p => p.id === showProductDetail);
                  if (!product) return null;
                  
                  return (
                    <>
                      <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Chi tiết sản phẩm: {product.name}
                          </h3>
                          <button
                            onClick={() => setShowProductDetail(null)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Product Image */}
                          <div className="space-y-4">
                            <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                              <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <PhotoIcon className="h-16 w-16 text-gray-400" />
                              </div>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Thông tin sản phẩm</h4>
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">ID:</span>
                                  <span className="font-medium">{product.id}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Thương hiệu:</span>
                                  <span className="font-medium">{product.brand}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Danh mục:</span>
                                  <span className="font-medium">
                                    {typeof product.category === 'string' ? product.category : (product.category as any)?.name || 'N/A'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Giá bán:</span>
                                  <span className="font-medium text-green-600">{formatCurrency(product.price)}</span>
                                </div>
                                {product.originalPrice && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Giá gốc:</span>
                                    <span className="font-medium text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Tồn kho:</span>
                                  <span className={`font-medium ${product.stockQuantity < 10 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                                    {product.stockQuantity}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Đã bán:</span>
                                  <span className="font-medium">{product.sold}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Đánh giá:</span>
                                  <div className="flex items-center">
                                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="ml-1 font-medium">{product.rating}</span>
                                    <span className="ml-1 text-sm text-gray-500">({product.reviewCount})</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Trạng thái:</span>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                                    {getStatusIcon(product.status)}
                                    <span className="ml-1">{getStatusText(product.status)}</span>
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Ngày tạo:</span>
                                  <span className="font-medium">{formatDate(product.createdAt)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Cập nhật:</span>
                                  <span className="font-medium">{formatDate(product.updatedAt)}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Tags */}
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Nhãn sản phẩm</h4>
                              <div className="flex flex-wrap gap-2">
                                {product.isNew && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Sản phẩm mới
                                  </span>
                                )}
                                {product.isHot && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Sản phẩm hot
                                  </span>
                                )}
                                {product.isSale && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Đang sale
                                  </span>
                                )}
                                {!product.isNew && !product.isHot && !product.isSale && (
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Không có nhãn đặc biệt</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Mô tả sản phẩm</h4>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300">{product.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          onClick={() => console.log('Edit product:', product.id)}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => setShowProductDetail(null)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Đóng
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
