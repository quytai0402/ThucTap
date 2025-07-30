import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../src/components/AdminLayout'
import { withAuth } from '../../src/components/withAuth'
import { inventoryService } from '../../src/services/inventoryService'
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
  TrashIcon
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
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('productName')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    fetchInventory()
  }, [])

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
      
      const [inventoryData, lowStockData, outOfStockData, alertsData] = await Promise.all([
        inventoryService.getInventoryStatus(filters),
        inventoryService.getLowStockProducts(10),
        inventoryService.getOutOfStockProducts(),
        inventoryService.getInventoryAlerts()
      ]);

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
      console.log('Inventory data:', { inventoryData, lowStockData, outOfStockData, alertsData });
      
    } catch (error) {
      console.error('Error fetching inventory:', error);
      // Set mock data for demo if API fails
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

  const getStatusBadge = (status: string) => {
    const styles = {
      in_stock: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon, label: 'Còn hàng' },
      low_stock: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ExclamationTriangleIcon, label: 'Sắp hết' },
      out_of_stock: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircleIcon, label: 'Hết hàng' }
    }
    return styles[status as keyof typeof styles] || styles.in_stock
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const totalValue = filteredInventory.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = filteredInventory.filter(item => item.status === 'low_stock').length
  const outOfStockItems = filteredInventory.filter(item => item.status === 'out_of_stock').length

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
        <title>Quản lý kho hàng - Admin</title>
      </Head>

      <AdminLayout title="Quản lý kho hàng">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Quản lý kho hàng</h1>
              <p className="text-gray-600">Theo dõi tồn kho và quản lý hàng hóa</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <ArrowPathIcon className="h-5 w-5" />
                <span>Đồng bộ kho</span>
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                <PlusIcon className="h-5 w-5" />
                <span>Nhập kho</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <CubeIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Tổng sản phẩm</p>
                  <p className="text-2xl font-semibold text-gray-900">{filteredInventory.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Sắp hết hàng</p>
                  <p className="text-2xl font-semibold text-gray-900">{lowStockItems}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <XCircleIcon className="h-8 w-8 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Hết hàng</p>
                  <p className="text-2xl font-semibold text-gray-900">{outOfStockItems}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <CubeIcon className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Giá trị tồn kho</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalValue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FunnelIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="in_stock">Còn hàng</option>
                  <option value="low_stock">Sắp hết hàng</option>
                  <option value="out_of_stock">Hết hàng</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="productName">Tên sản phẩm</option>
                  <option value="currentStock">Tồn kho</option>
                  <option value="totalValue">Giá trị</option>
                  <option value="lastStockUpdate">Cập nhật cuối</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tồn kho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá trị
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vị trí
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cập nhật cuối
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => {
                    const statusInfo = getStatusBadge(item.status)
                    const StatusIcon = statusInfo.icon
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                            <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                            <div className="text-sm text-gray-500">{item.category}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div><strong>Hiện tại:</strong> {item.currentStock}</div>
                            <div><strong>Khả dụng:</strong> {item.availableStock}</div>
                            <div><strong>Đã đặt:</strong> {item.reservedStock}</div>
                            <div className="text-xs text-gray-500">Tối thiểu: {item.minimumStock}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div><strong>Đơn giá:</strong> {formatCurrency(item.unitPrice)}</div>
                            <div><strong>Tổng:</strong> {formatCurrency(item.totalValue)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.location}</div>
                          <div className="text-sm text-gray-500">{item.supplier}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(item.lastStockUpdate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900" title="Chỉnh sửa">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900" title="Điều chỉnh tồn kho">
                              <ArrowPathIcon className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900" title="Xóa">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}

export default withAuth(AdminInventory, { allowedRoles: ['admin'] })
