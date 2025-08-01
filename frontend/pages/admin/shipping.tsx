import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../src/components/AdminLayout'
import { withAuth } from '../../src/components/withAuth'
import { ordersService } from '../../src/services/ordersService'
import { 
  TruckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface ShippingOrder {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  shippingAddress: {
    street: string
    district: string
    city: string
  }
  items: Array<{
    productName: string
    quantity: number
    weight: number
  }>
  shippingMethod: string
  carrier: string
  trackingNumber: string
  status: 'preparing' | 'ready_to_ship' | 'shipped' | 'in_transit' | 'delivered' | 'returned'
  shippingFee: number
  estimatedDelivery: string
  actualDelivery?: string
  weight: number
  dimensions: string
  notes: string
  createdDate: string
  lastUpdate: string
}

const AdminShipping: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [shippingOrders, setShippingOrders] = useState<ShippingOrder[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCarrier, setFilterCarrier] = useState<string>('all')

  useEffect(() => {
    fetchShippingOrders()
  }, [])

  const fetchShippingOrders = async () => {
    try {
      const response = await ordersService.getAdminOrders({ status: 'all' });
      const orders = Array.isArray(response) ? response : ((response as any).data || []);
      
      // Transform orders to shipping format
      const shippingOrders = orders.map((order: any) => ({
        id: order._id || order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer?.name || order.customer?.fullName || 'N/A',
        customerPhone: order.customer?.phone || 'N/A',
        shippingAddress: order.shippingAddress || {},
        items: order.items || [],
        shippingMethod: order.shippingMethod || 'Standard',
        carrier: order.carrier || 'Giao Hàng Nhanh',
        trackingNumber: order.trackingNumber || '',
        status: order.status,
        shippingFee: order.shippingFee || 0,
        estimatedDelivery: order.estimatedDelivery,
        weight: order.weight || 0,
        dimensions: order.dimensions || '',
        notes: order.notes || '',
        createdDate: order.createdAt,
        lastUpdate: order.updatedAt
      }));
      
      setShippingOrders(shippingOrders);
    } catch (error) {
      console.error('Error fetching shipping orders:', error);
      setShippingOrders([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = shippingOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesCarrier = filterCarrier === 'all' || order.carrier === filterCarrier

    return matchesSearch && matchesStatus && matchesCarrier
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      preparing: { bg: 'bg-gray-100', text: 'text-gray-800', icon: ClockIcon, label: 'Đang chuẩn bị' },
      ready_to_ship: { bg: 'bg-blue-100', text: 'text-blue-800', icon: TruckIcon, label: 'Sẵn sàng giao' },
      shipped: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: TruckIcon, label: 'Đã gửi' },
      in_transit: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: MapPinIcon, label: 'Đang vận chuyển' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon, label: 'Đã giao' },
      returned: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircleIcon, label: 'Hoàn trả' }
    }
    return styles[status as keyof typeof styles] || styles.preparing
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

  const getCarriers = () => {
    const carriersSet = new Set(shippingOrders.map(order => order.carrier))
    return Array.from(carriersSet)
  }

  if (loading) {
    return (
      <AdminLayout title="Quản lý vận chuyển">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Quản lý vận chuyển - Admin</title>
      </Head>

      <AdminLayout title="Quản lý vận chuyển">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Quản lý vận chuyển</h1>
              <p className="text-gray-600">Theo dõi và quản lý đơn hàng vận chuyển</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <TruckIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Tổng đơn hàng</p>
                  <p className="text-2xl font-semibold text-gray-900">{filteredOrders.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Đang vận chuyển</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {filteredOrders.filter(o => o.status === 'in_transit').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Đã giao</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {filteredOrders.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Cần chú ý</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {filteredOrders.filter(o => o.status === 'returned' || o.status === 'preparing').length}
                  </p>
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
                  placeholder="Tìm mã đơn, tên khách hàng, mã vận đơn..."
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
                  <option value="preparing">Đang chuẩn bị</option>
                  <option value="ready_to_ship">Sẵn sàng giao</option>
                  <option value="shipped">Đã gửi</option>
                  <option value="in_transit">Đang vận chuyển</option>
                  <option value="delivered">Đã giao</option>
                  <option value="returned">Hoàn trả</option>
                </select>
              </div>

              {/* Carrier Filter */}
              <div className="relative">
                <TruckIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <select
                  value={filterCarrier}
                  onChange={(e) => setFilterCarrier(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả đơn vị vận chuyển</option>
                  {getCarriers().map(carrier => (
                    <option key={carrier} value={carrier}>{carrier}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Shipping Orders Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vận chuyển
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giao hàng
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const statusInfo = getStatusBadge(order.status)
                    const StatusIcon = statusInfo.icon
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                            <div className="text-sm text-gray-500">
                              {order.items.length} sản phẩm • {order.weight}kg
                            </div>
                            <div className="text-sm text-gray-500">{order.dimensions}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.customerPhone}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {order.shippingAddress.street}, {order.shippingAddress.district}, {order.shippingAddress.city}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.carrier}</div>
                            <div className="text-sm text-gray-500">{order.trackingNumber}</div>
                            <div className="text-sm text-gray-500">{order.shippingMethod}</div>
                            <div className="text-sm font-medium text-green-600">{formatCurrency(order.shippingFee)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div><strong>Dự kiến:</strong> {formatDate(order.estimatedDelivery)}</div>
                            {order.actualDelivery && (
                              <div><strong>Thực tế:</strong> {formatDate(order.actualDelivery)}</div>
                            )}
                            <div className="text-xs text-gray-500">Cập nhật: {formatDate(order.lastUpdate)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button className="text-indigo-600 hover:text-indigo-900" title="Cập nhật">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900" title="Theo dõi">
                              <MapPinIcon className="h-4 w-4" />
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

export default withAuth(AdminShipping, { allowedRoles: ['admin'] })
