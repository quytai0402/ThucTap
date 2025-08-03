import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../src/components/AdminLayout'
import { withAuth } from '../../src/components/withAuth'
import { inventoryService } from '../../src/services/inventoryService'
import type { InventoryOverview, InventoryStats, InventoryAlert } from '../../src/services/inventoryService'
import { 
  CubeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BellIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface InventoryItem {
  id: string
  productName: string
  sku: string
  category: string
  currentStock: number
  minimumStock: number
  reservedStock: number
  availableStock: number
  unitPrice: number
  totalValue: number
  location: string
  lastStockUpdate: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  supplier: string
}

const AdminInventory: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [overview, setOverview] = useState<InventoryOverview | null>(null)
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('productName')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null)

  useEffect(() => {
    Promise.all([
      fetchInventory(),
      fetchOverview(),
      fetchStats(),
      fetchAlerts()
    ])
  }, [])

  const fetchOverview = async () => {
    try {
      const data = await inventoryService.getInventoryOverview()
      setOverview(data)
    } catch (error) {
      console.error('Error fetching overview:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await inventoryService.getInventoryStats()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchAlerts = async () => {
    try {
      const data = await inventoryService.getInventoryAlerts()
      setAlerts(data.alerts || [])
    } catch (error) {
      console.error('Error fetching alerts:', error)
    }
  }

  const fetchInventory = async () => {
    try {
      setLoading(true);
      
      const filters = {
        page: 1,
        limit: 100,
        search: searchTerm || undefined,
        lowStock: filterStatus === 'low_stock' ? true : undefined,
        outOfStock: filterStatus === 'out_of_stock' ? true : undefined
      };
      
      const inventoryData = await inventoryService.getInventoryStatus(filters);

      // Transform data to match interface
      const transformedData = (inventoryData.products || inventoryData || []).map((item: any) => ({
        id: item._id,
        productName: item.name,
        sku: item.sku || `SKU-${item._id.slice(-6).toUpperCase()}`,
        category: item.category?.name || 'Không có danh mục',
        currentStock: item.stock || 0,
        minimumStock: item.lowStockThreshold || 10,
        reservedStock: 0, // This would need to be calculated from pending orders
        availableStock: item.stock || 0,
        unitPrice: item.price || 0,
        totalValue: (item.stock || 0) * (item.price || 0),
        location: item.location || 'Kho chính',
        lastStockUpdate: item.updatedAt || new Date().toISOString(),
        status: item.stock === 0 ? 'out_of_stock' : 
                item.stock <= (item.lowStockThreshold || 10) ? 'low_stock' : 'in_stock',
        supplier: item.supplier || 'Chưa xác định'
      }));

      setInventory(transformedData);
      
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = Array.isArray(inventory) ? inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus

    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    const aValue = a[sortBy as keyof InventoryItem]
    const bValue = b[sortBy as keyof InventoryItem]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    return 0
  }) : [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'low_stock': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'out_of_stock': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'Còn hàng'
      case 'low_stock': return 'Sắp hết'
      case 'out_of_stock': return 'Hết hàng'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock': return CheckCircleIcon;
      case 'low_stock': return ExclamationTriangleIcon;
      case 'out_of_stock': return XCircleIcon;
      default: return CheckCircleIcon;
    }
  }

  const handleStockAdjustment = async (productId: string, adjustment: number, type: 'add' | 'subtract' | 'set', reason: string) => {
    try {
      await inventoryService.adjustStock({
        productId,
        quantity: Math.abs(adjustment),
        type,
        reason
      })
      
      // Refresh data
      await Promise.all([
        fetchInventory(),
        fetchOverview(),
        fetchAlerts()
      ])
      
      setShowAdjustModal(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Error adjusting stock:', error)
      alert('Không thể điều chỉnh tồn kho. Vui lòng thử lại.')
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Quản lý kho hàng">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Quản lý kho hàng | Admin</title>
        <meta name="description" content="Quản lý tồn kho và điều chỉnh hàng hóa" />
      </Head>

      <AdminLayout title="Quản lý kho hàng">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý kho hàng</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Theo dõi tồn kho và quản lý hàng hóa
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button 
                onClick={() => Promise.all([fetchInventory(), fetchOverview(), fetchAlerts()])}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Đồng bộ
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-blue-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                Điều chỉnh tồn kho
              </button>
            </div>
          </div>

          {/* Overview Cards */}
          {overview && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Products */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <CubeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng sản phẩm</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.totalProducts}</p>
                  </div>
                </div>
              </div>

              {/* Low Stock Alert */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 border-l-4 border-l-yellow-400">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sắp hết hàng</p>
                    <p className="text-2xl font-bold text-yellow-600">{overview.lowStockProducts}</p>
                  </div>
                </div>
              </div>

              {/* Out of Stock */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 border-l-4 border-l-red-400">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hết hàng</p>
                    <p className="text-2xl font-bold text-red-600">{overview.outOfStockProducts}</p>
                  </div>
                </div>
              </div>

              {/* Total Value */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
                <div className="flex items-center">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <CurrencyDollarIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-green-100 text-sm font-medium">Giá trị tồn kho</p>
                    <p className="text-2xl font-bold">{formatCurrency(overview.totalValue)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alerts Section */}
          {alerts.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <BellIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Cảnh báo tồn kho ({alerts.length})
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <ul className="list-disc pl-5 space-y-1">
                      {alerts.slice(0, 3).map((alert, index) => (
                        <li key={index}>{alert.message}</li>
                      ))}
                      {alerts.length > 3 && (
                        <li>Và {alerts.length - 3} cảnh báo khác...</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="in_stock">Còn hàng</option>
                <option value="low_stock">Sắp hết</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="productName">Tên sản phẩm</option>
                <option value="currentStock">Tồn kho</option>
                <option value="totalValue">Giá trị</option>
                <option value="lastStockUpdate">Cập nhật cuối</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Danh sách tồn kho ({filteredInventory.length} sản phẩm)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tồn kho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Giá trị
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cập nhật cuối
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredInventory.map((item) => {
                    const StatusIcon = getStatusIcon(item.status);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <CubeIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.productName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                SKU: {item.sku} • {item.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <span className="font-medium">{item.currentStock}</span>
                            <span className="text-gray-500 dark:text-gray-400 ml-1">
                              (Tối thiểu: {item.minimumStock})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(item.totalValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(item.lastStockUpdate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedProduct(item);
                                setShowAdjustModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {filteredInventory.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có sản phẩm</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Không tìm thấy sản phẩm nào khớp với bộ lọc hiện tại.
              </p>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  )
}

export default withAuth(AdminInventory)
