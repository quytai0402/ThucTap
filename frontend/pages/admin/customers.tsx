import React, { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import SearchAndFilter, { FilterConfig } from '../../src/components/SearchAndFilter';
import { customerService } from '../../src/services/customerService';
import api from '../../src/utils/api';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  ArrowDownTrayIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
  updatedAt: string;
  isGuest?: boolean;
  successfulOrders?: number;
  customerLevel?: string;
}

interface CustomerDetails extends Customer {
  orders?: Order[];
  fullDetails?: any;
  fullName?: string;
  lastAddress?: {
    address: string;
    city: string;
    district: string;
    ward: string;
  };
}

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showCustomerDetail, setShowCustomerDetail] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomers();
      const customersData = Array.isArray(response) ? response : ((response as any)?.data || []);
      setCustomers(customersData.map((customer: any) => ({
        id: customer.id || customer._id,
        name: customer.name || customer.fullName || 'N/A',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address?.street || customer.address || '',
        city: customer.address?.city || customer.city || '',
        district: customer.address?.district || customer.district || '',
        avatar: customer.avatar || '',
        totalOrders: customer.totalOrders || 0,
        totalSpent: customer.totalSpent || 0,
        lastOrderDate: customer.lastOrderDate || '',
        status: customer.status || 'active',
        createdAt: customer.createdAt || new Date().toISOString(),
        updatedAt: customer.updatedAt || new Date().toISOString(),
        isGuest: customer.isGuest || false,
        successfulOrders: customer.successfulOrders || 0,
        customerLevel: customer.customerLevel || ''
      })));
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerDetails = async (customerId: string, isGuest: boolean) => {
    try {
      setLoadingDetails(true);
      
      // Load customer details
      const [detailsResponse, ordersResponse] = await Promise.all([
        fetch(`/api/admin/combined-customers/${customerId}/details?isGuest=${isGuest}`),
        fetch(`/api/admin/combined-customers/${customerId}/orders?isGuest=${isGuest}&limit=10`)
      ]);
      
      if (!detailsResponse.ok || !ordersResponse.ok) {
        throw new Error('Failed to load customer details');
      }
      
      const details = await detailsResponse.json();
      const ordersData = await ordersResponse.json();
      
      setCustomerDetails(details);
      setCustomerOrders(ordersData.orders || []);
    } catch (error) {
      console.error('Error loading customer details:', error);
      alert('Không thể tải thông tin chi tiết khách hàng');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewCustomer = async (customer: Customer) => {
    setShowCustomerDetail(customer.id);
    await loadCustomerDetails(customer.id, customer.isGuest || false);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (customer.phone && customer.phone.includes(searchTerm));
    const matchesStatus = !filters.status || customer.status === filters.status;
    const matchesCity = !filters.city || customer.city === filters.city;
    const matchesType = !filters.customerType || 
                      (filters.customerType === 'guest' && customer.isGuest) || 
                      (filters.customerType === 'registered' && !customer.isGuest);
    
    return matchesSearch && matchesStatus && matchesCity && matchesType;
  });

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Handle filter change
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  // Handle reset
  const handleReset = () => {
    setSearchTerm('');
    setFilters({});
  };

  // Get unique cities for filter
  const uniqueCities = Array.from(new Set(customers.map(c => c.city).filter(Boolean)));

  // Configure filters for admin customers
  const filterConfigs: FilterConfig[] = [
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
        { value: 'blocked', label: 'Bị khóa' }
      ]
    },
    {
      key: 'customerType',
      label: 'Loại khách hàng',
      type: 'select',
      options: [
        { value: 'registered', label: 'Đã đăng ký' },
        { value: 'guest', label: 'Khách vãng lai' }
      ]
    },
    {
      key: 'city',
      label: 'Thành phố',
      type: 'select',
      options: uniqueCities.map(city => ({
        value: city,
        label: city
      }))
    }
  ];

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa có đơn hàng';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'blocked': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'blocked': return 'Bị khóa';
      default: return status;
    }
  };

  const handleStatusChange = async (customerId: string, newStatus: string) => {
    try {
      // Gọi API để cập nhật trong database
      await customerService.updateCustomerStatus(customerId, newStatus as any);
      
      // Cập nhật state local sau khi API thành công
      setCustomers(customers.map(customer => 
        customer.id === customerId 
          ? { ...customer, status: newStatus as any, updatedAt: new Date().toISOString() }
          : customer
      ));
      
      console.log(`✅ Customer ${customerId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('❌ Error updating customer status:', error);
      alert('Không thể cập nhật trạng thái khách hàng. Vui lòng thử lại.');
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(paginatedCustomers.map(customer => customer.id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedCustomers.length === 0) {
      alert('Vui lòng chọn ít nhất một khách hàng');
      return;
    }

    try {
      switch (action) {
        case 'activate':
          await customerService.bulkUpdateStatus(selectedCustomers, 'active');
          setCustomers(customers.map(customer => 
            selectedCustomers.includes(customer.id) 
              ? { ...customer, status: 'active' as any, updatedAt: new Date().toISOString() }
              : customer
          ));
          break;
        case 'deactivate':
          await customerService.bulkUpdateStatus(selectedCustomers, 'inactive');
          setCustomers(customers.map(customer => 
            selectedCustomers.includes(customer.id) 
              ? { ...customer, status: 'inactive' as any, updatedAt: new Date().toISOString() }
              : customer
          ));
          break;
        case 'block':
          if (confirm(`Bạn có chắc chắn muốn khóa ${selectedCustomers.length} khách hàng đã chọn?`)) {
            await customerService.bulkUpdateStatus(selectedCustomers, 'blocked');
            setCustomers(customers.map(customer => 
              selectedCustomers.includes(customer.id) 
                ? { ...customer, status: 'blocked' as any, updatedAt: new Date().toISOString() }
                : customer
            ));
          }
          break;
        case 'delete':
          if (confirm(`Bạn có chắc chắn muốn xóa ${selectedCustomers.length} khách hàng đã chọn?`)) {
            await customerService.bulkDeleteCustomers(selectedCustomers);
            setCustomers(customers.filter(customer => !selectedCustomers.includes(customer.id)));
          }
          break;
        default:
          console.log(`Bulk action: ${action} for customers:`, selectedCustomers);
      }
      setSelectedCustomers([]);
    } catch (error) {
      console.error('❌ Error performing bulk action:', error);
      alert('Không thể thực hiện hành động. Vui lòng thử lại.');
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      try {
        await customerService.deleteCustomer(customerId);
        setCustomers(customers.filter(customer => customer.id !== customerId));
        console.log(`✅ Customer ${customerId} deleted successfully`);
      } catch (error) {
        console.error('❌ Error deleting customer:', error);
        alert('Không thể xóa khách hàng. Vui lòng thử lại.');
      }
    }
  };

  const handleExport = () => {
    console.log('Exporting customers...');
    // Implement export functionality
  };

  const handleCleanupData = async () => {
    if (!confirm('Bạn có chắc muốn dọn dẹp dữ liệu không thực tế? Thao tác này sẽ reset các giá trị quá lớn về mức hợp lý.')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.post('/admin/cleanup-unrealistic-data');
      alert(`✅ Đã dọn dẹp thành công ${response.data.cleanedOrders} đơn hàng không thực tế!`);
      // Reload customers to reflect changes
      await loadCustomers();
    } catch (error) {
      console.error('Error cleaning up data:', error);
      alert('❌ Có lỗi xảy ra khi dọn dẹp dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const cities = Array.from(new Set(customers.map(c => c.city)));

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    inactiveCustomers: customers.filter(c => c.status === 'inactive').length,
    blockedCustomers: customers.filter(c => c.status === 'blocked').length,
    guestCustomers: customers.filter(c => c.isGuest).length,
    registeredCustomers: customers.filter(c => !c.isGuest).length,
    // Tính doanh thu từ khách hàng đã có đơn hàng hoàn thành với validation
    totalRevenue: (() => {
      console.log('=== DEBUG: Calculating totalRevenue ===');
      const revenue = customers.reduce((sum, customer, index) => {
        // Đảm bảo customerSpent là number, không phải string
        let customerSpent = customer.totalSpent || 0;
        console.log(`Customer ${index + 1}: totalSpent = ${customerSpent} (type: ${typeof customerSpent})`);
        
        if (typeof customerSpent === 'string') {
          console.log(`Converting string to number: ${customerSpent}`);
          customerSpent = parseFloat(customerSpent) || 0;
        }
        // Kiểm tra số tiền không thực tế (quá 1 tỷ VNĐ)
        if (customerSpent > 1000000000) {
          console.warn(`Customer ${customer.name} has unrealistic totalSpent: ${customerSpent}`);
          return sum; // Bỏ qua customer này
        }
        console.log(`Adding ${customerSpent} to sum ${sum} = ${sum + customerSpent}`);
        return sum + customerSpent;
      }, 0);
      console.log(`Final totalRevenue: ${revenue}`);
      return revenue;
    })(),
    // Tính giá trị trung bình đơn hàng với validation
    averageOrderValue: (() => {
      const totalOrders = customers.reduce((sum, customer) => sum + (customer.totalOrders || 0), 0);
      const totalRevenue = customers.reduce((sum, customer) => {
        const customerSpent = customer.totalSpent || 0;
        // Kiểm tra số tiền không thực tế
        if (customerSpent > 1000000000) {
          return sum; // Bỏ qua customer này
        }
        return sum + customerSpent;
      }, 0);
      
      if (totalOrders === 0) return 0;
      const avgValue = totalRevenue / totalOrders;
      
      // Nếu giá trị trung bình quá cao (> 100 triệu), đặt về 0
      if (avgValue > 100000000) {
        console.warn(`Average order value too high: ${avgValue}`);
        return 0;
      }
      
      return avgValue;
    })()
  };

  return (
    <AdminLayout title="Quản lý khách hàng">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý khách hàng</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Theo dõi và quản lý thông tin khách hàng
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleCleanupData}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-orange-300 dark:border-orange-600 rounded-lg shadow-sm text-sm font-medium text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 disabled:opacity-50"
              title="Dọn dẹp dữ liệu không thực tế (> 1 tỷ VNĐ)"
            >
              🧹 Dọn dẹp DL
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Xuất Excel
            </button>
            <button
              onClick={() => setShowAddCustomer(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Thêm khách hàng
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng KH</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <UserIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hoạt động</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <UserIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Không HĐ</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inactiveCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <UserIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bị khóa</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.blockedCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng DT</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <ShoppingCartIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">GT TB/Đơn</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {isNaN(stats.averageOrderValue) ? '0₫' : formatCurrency(stats.averageOrderValue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <UserIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Khách vãng lai</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.guestCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <UserIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đã đăng ký</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.registeredCustomers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <SearchAndFilter
            searchPlaceholder="Tìm kiếm khách hàng theo tên, email, số điện thoại..."
            filters={filterConfigs}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            initialValues={{ search: searchTerm, ...filters }}
            compact={true}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          />
          
          {/* Bulk Actions */}
          {selectedCustomers.length > 0 && (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Đã chọn {selectedCustomers.length} khách hàng
                </span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkAction(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn hành động...</option>
                  <option value="export">Xuất đã chọn</option>
                  <option value="activate">Kích hoạt</option>
                  <option value="deactivate">Vô hiệu hóa</option>
                  <option value="block">Khóa tài khoản</option>
                  <option value="delete">Xóa đã chọn</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Customers Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Địa chỉ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tổng chi tiêu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ngày tham gia
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${customer.isGuest ? 'bg-gradient-to-r from-orange-500 to-amber-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}>
                          <span className="text-white font-semibold text-sm">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</div>
                            {customer.isGuest && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                Khách
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">#{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center mb-1">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                          {customer.email}
                        </div>
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-start">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <div>{customer.address}</div>
                            <div className="text-gray-500 dark:text-gray-400">{customer.district}, {customer.city}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="font-medium">{customer.totalOrders} đơn</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          {formatDate(customer.lastOrderDate)}
                        </div>
                        {customer.isGuest && customer.successfulOrders !== undefined && customer.totalOrders > 0 && (
                          <div className="mt-1">
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Tỉ lệ thành công: {Math.round((customer.successfulOrders / customer.totalOrders) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(customer.totalSpent)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={customer.status}
                        onChange={(e) => handleStatusChange(customer.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(customer.status)}`}
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                        <option value="blocked">Bị khóa</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => console.log('Edit customer:', customer.id)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
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
                      <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredCustomers.length)}</span> trong{' '}
                      <span className="font-medium">{filteredCustomers.length}</span> kết quả
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

        {/* Customer Detail Modal */}
        {showCustomerDetail && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCustomerDetail(null)}></div>
              
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      Chi tiết khách hàng
                      {customerDetails?.isGuest && (
                        <span className="ml-3 px-2.5 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                          Khách vãng lai
                        </span>
                      )}
                    </h3>
                    <button
                      onClick={() => setShowCustomerDetail(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {loadingDetails ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : customerDetails ? (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 dark:text-white">Thông tin cá nhân</h4>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                            <div className="flex items-center">
                              <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Họ tên</p>
                                <p className="font-medium text-gray-900 dark:text-white">{customerDetails.fullName || customerDetails.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                <p className="font-medium text-gray-900 dark:text-white">{customerDetails.email || 'Không có'}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Điện thoại</p>
                                <p className="font-medium text-gray-900 dark:text-white">{customerDetails.phone}</p>
                              </div>
                            </div>
                            {customerDetails.lastAddress && (
                              <div className="flex items-start">
                                <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ</p>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {customerDetails.lastAddress.address}, {customerDetails.lastAddress.ward}, {customerDetails.lastAddress.district}, {customerDetails.lastAddress.city}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order Stats */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 dark:text-white">Thống kê mua hàng</h4>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Tổng đơn hàng:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{customerDetails.totalOrders || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Tổng chi tiêu:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(customerDetails.totalSpent || 0)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Giá trị TB/đơn:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {customerDetails.totalOrders > 0 ? formatCurrency((customerDetails.totalSpent || 0) / (customerDetails.totalOrders || 1)) : '0₫'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Đơn hàng cuối:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{formatDate(customerDetails.lastOrderDate)}</span>
                            </div>
                            {customerDetails.isGuest && customerDetails.successfulOrders !== undefined && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Đơn thành công:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {customerDetails.successfulOrders} đơn ({customerDetails.totalOrders > 0 ? Math.round((customerDetails.successfulOrders / customerDetails.totalOrders) * 100) : 0}%)
                                </span>
                              </div>
                            )}
                            {customerDetails.customerLevel && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Hạng khách hàng:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{customerDetails.customerLevel}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Trạng thái:</span>
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customerDetails.status || 'active')}`}>
                                {getStatusText(customerDetails.status || 'active')}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Ngày tham gia:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{formatDate(customerDetails.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Orders Section */}
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Đơn hàng gần đây</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                          {loadingDetails ? (
                            <div className="flex justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                          ) : customerOrders.length > 0 ? (
                            <div className="space-y-3">
                              {customerOrders.map((order) => (
                                <div key={order._id} className="bg-white dark:bg-gray-600 rounded-lg p-3 border border-gray-200 dark:border-gray-500">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="font-medium text-gray-900 dark:text-white">#{order.orderNumber}</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.total)}</p>
                                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                        order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                        'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                                      }`}>
                                        {order.status === 'delivered' ? 'Đã giao' :
                                         order.status === 'processing' ? 'Đang xử lý' :
                                         order.status === 'pending' ? 'Chờ xác nhận' : order.status}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {order.items?.length} sản phẩm
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                              Chưa có đơn hàng nào
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      Không tìm thấy thông tin khách hàng
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={() => console.log('Edit customer:', showCustomerDetail)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => setShowCustomerDetail(null)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Đóng
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

export default AdminCustomers;
