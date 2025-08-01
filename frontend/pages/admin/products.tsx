import React, { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import ProductForm from '../../src/components/ProductForm';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  TagIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import productService from '../../src/services/productService';
import categoriesService from '../../src/services/categoriesService';

interface AdminProduct {
  _id: string;
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  image: string;
  category: string | { name: string; _id: string };
  categoryName?: string; // Add this for mapped category name
  brand: string;
  stock: number;
  stockQuantity: number;
  inStock: boolean;
  isHot: boolean;
  isNew?: boolean;
  isSale?: boolean;
  status: 'active' | 'inactive';
  description: string;
  rating: number;
  reviews: number;
  reviewCount: number;
  sold: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateProductData {
  name: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  stockQuantity?: number;
  description: string;
  shortDescription?: string;
  images?: string[];
}

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Dynamic data from API
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadBrands();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAdminProducts();
      
      console.log('Admin products response:', response);
      
      // Handle different response formats
      let productsData = [];
      if (response.success && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (Array.isArray(response)) {
        productsData = response;
      } else {
        console.warn('Unexpected API response format:', response);
        productsData = [];
      }
      
      console.log('Raw products data:', productsData);
      
      // Map _id to id for compatibility and ensure proper data structure
      const mappedProducts = productsData.map((product: any) => ({
        ...product,
        id: product._id || product.id,
        image: product.images?.[0] || '/images/placeholder.jpg',
        stockQuantity: product.stock || 0,
        // Ensure category is accessible
        categoryName: typeof product.category === 'string' ? product.category : product.category?.name || 'N/A'
      }));
      
      console.log('Mapped products:', mappedProducts);
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesService.getCategories();
      console.log('Categories loaded:', response);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await productService.getAdminBrands();
      console.log('Brands loaded:', response);
      setBrands(response.data || []);
    } catch (error) {
      console.error('Error loading brands:', error);
      setBrands([]);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: CreateProductData) => {
    try {
      setFormLoading(true);
      
      if (editingProduct) {
        // Update existing product - use _id
        await productService.updateProduct(editingProduct._id || editingProduct.id, data);
      } else {
        // Create new product - must include shortDescription
        await productService.createProduct({
          ...data,
          shortDescription: data.shortDescription || data.description.substring(0, 150),
          images: data.images || []
        });
      }
      
      // Reload products to show updated data from database
      await loadProducts();
      
      // Close form
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Lỗi khi lưu sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (product: AdminProduct) => {
    try {
      await productService.deleteProduct(product._id || product.id);
      await loadProducts();
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(`Lỗi khi xóa sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      await productService.bulkDeleteProducts(selectedProducts);
      await loadProducts();
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      alert(`Lỗi khi xóa sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSelectedProducts([]);
    }
  };

  // Filter products
  const filteredProducts = (products || []).filter(product => {
    // Get category name safely
    const categoryName = product.categoryName || 
                        (typeof product.category === 'string' ? product.category : product.category?.name) || '';
    
    // Search matching
    const matchesSearch = !searchQuery || (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Category filtering - exact match with category name
    const matchesCategory = !selectedCategory || categoryName === selectedCategory;
    
    // Brand filtering - exact match with brand name
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    
    // Status filtering - exact match with status
    const matchesStatus = !selectedStatus || product.status === selectedStatus;
    
    // Uncomment for debugging filters
    // console.log('Filtering product:', {
    //   name: product.name,
    //   categoryName,
    //   selectedCategory,
    //   matchesCategory,
    //   brand: product.brand,
    //   selectedBrand,
    //   matchesBrand,
    //   status: product.status,
    //   selectedStatus,
    //   matchesStatus,
    //   finalMatch: matchesSearch && matchesCategory && matchesBrand && matchesStatus
    // });
    
    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-0 md:p-4">
        {/* Header with improved spacing and visual hierarchy */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Quản lý sản phẩm
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Quản lý danh sách sản phẩm của cửa hàng - 
              Hiển thị <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredProducts.length}</span>/{products.length} sản phẩm
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            {selectedProducts.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all duration-200 hover:shadow"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Xóa ({selectedProducts.length})
              </button>
            )}
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all duration-200 hover:shadow"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Stats Cards - Redesigned with gradient backgrounds and improved visual appearance */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-blue-900/20 p-5 rounded-xl shadow-sm border border-blue-100 dark:border-blue-900/30 transform transition-all duration-200 hover:translate-y-[-3px] hover:shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl shadow-inner">
                <TagIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{(products || []).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-green-900/20 p-5 rounded-xl shadow-sm border border-green-100 dark:border-green-900/30 transform transition-all duration-200 hover:translate-y-[-3px] hover:shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl shadow-inner">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Đang bán</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(products || []).filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-800 dark:to-red-900/20 p-5 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 transform transition-all duration-200 hover:translate-y-[-3px] hover:shadow">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl shadow-inner">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hết hàng</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(products || []).filter(p => p.stockQuantity === 0).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-yellow-900/20 p-5 rounded-xl shadow-sm border border-yellow-100 dark:border-yellow-900/30 transform transition-all duration-200 hover:translate-y-[-3px] hover:shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl shadow-inner">
                <StarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sản phẩm hot</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(products || []).filter(p => p.isHot).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters with better layout and visual design */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map(category => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((brand, index) => (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card-based Product List */}
        <div className="mb-8">
          {/* Mobile: Card view for better mobile experience */}
          <div className="md:hidden space-y-4">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-start">
                  <div className="mr-4 flex-shrink-0">
                    <img
                      className="h-20 w-20 rounded-lg object-cover"
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {product.name}
                      </h3>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(prev => [...prev, product.id]);
                          } else {
                            setSelectedProducts(prev => prev.filter(id => id !== product.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {product.brand} • {product.categoryName || 'N/A'}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                            {formatCurrency(product.originalPrice)}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {getStatusText(product.status)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex space-x-1">
                        {product.isNew && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            Mới
                          </span>
                        )}
                        {product.isHot && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            Hot
                          </span>
                        )}
                        {product.isSale && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Sale
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowForm(true);
                          }}
                          className="p-1.5 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                        >
                          <PencilIcon className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(product);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-1.5 text-white bg-red-500 rounded-lg hover:bg-red-600"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Enhanced Table with better spacing and visual hierarchy */}
          <div className="hidden md:block bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(paginatedProducts.map(p => p.id));
                          } else {
                            setSelectedProducts([]);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tồn kho
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts(prev => [...prev, product.id]);
                            } else {
                              setSelectedProducts(prev => prev.filter(id => id !== product.id));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-14 w-14 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                            <img
                              className="h-14 w-14 object-cover"
                              src={product.image}
                              alt={product.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {product.brand}
                            </div>
                            <div className="flex space-x-1 mt-1">
                              {product.isNew && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                  Mới
                                </span>
                              )}
                              {product.isHot && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                  Hot
                                </span>
                              )}
                              {product.isSale && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                  Sale
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {product.categoryName || 'N/A'}
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
                          product.stockQuantity === 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : product.stockQuantity < 10 
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-gray-900 dark:text-white'
                        }`}>
                          <div className="flex items-center">
                            {product.stockQuantity === 0 ? (
                              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                            ) : product.stockQuantity < 10 ? (
                              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                            ) : (
                              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            )}
                            {product.stockQuantity}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {getStatusText(product.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowForm(true);
                            }}
                            className="text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setProductToDelete(product);
                              setShowDeleteConfirm(true);
                            }}
                            className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-colors duration-200"
                            title="Xóa"
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
          </div>

          {/* Improved Pagination with better design */}
          {totalPages > 1 && (
            <div className="mt-6 bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
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
                      className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                    >
                      <span className="sr-only">Previous</span>
                      &larr;
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Logic to show pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          } transition-colors duration-200`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                    >
                      <span className="sr-only">Next</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Form Modal */}
        <ProductForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSubmit={handleFormSubmit}
          product={editingProduct ? {
            ...editingProduct,
            category: typeof editingProduct.category === 'string' ? editingProduct.category : editingProduct.category?.name || ''
          } : null}
          isLoading={formLoading}
        />

        {/* Enhanced Delete Confirmation Modal */}
        {showDeleteConfirm && productToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={() => setShowDeleteConfirm(false)}></div>
              
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700">
                <div className="bg-white dark:bg-gray-800 px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-12 sm:w-12">
                      <ExclamationTriangleIcon className="h-7 w-7 text-red-600 dark:text-red-500" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-6 sm:text-left">
                      <h3 className="text-xl leading-6 font-bold text-gray-900 dark:text-white">
                        Xóa sản phẩm
                      </h3>
                      <div className="mt-3">
                        <p className="text-base text-gray-600 dark:text-gray-300">
                          Bạn có chắc chắn muốn xóa sản phẩm <span className="font-medium">"{productToDelete.name}"</span>?
                        </p>
                        <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                          Lưu ý: Hành động này không thể hoàn tác và có thể ảnh hưởng đến dữ liệu liên quan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(productToDelete)}
                    className="w-full inline-flex justify-center items-center rounded-xl border border-transparent shadow-sm px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-base font-medium text-white hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Xóa sản phẩm
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="mt-3 w-full inline-flex justify-center items-center rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm px-5 py-2.5 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
