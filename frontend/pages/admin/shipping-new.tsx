import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../src/components/AdminLayout'
import { withAuth } from '../../src/components/withAuth'
import { shippingService, ShippingOrder, ShippingOverview, ShippingStats, ShippingAlert } from '../../src/services/shippingService'
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
  PencilIcon,
  ArrowPathIcon,
  BellIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

const AdminShipping: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState<ShippingOverview | null>(null)
  const [stats, setStats] = useState<ShippingStats | null>(null)
  const [alerts, setAlerts] = useState<ShippingAlert[]>([])
  const [orders, setOrders] = useState<ShippingOrder[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCarrier, setFilterCarrier] = useState<string>('all')
  const [showAlerts, setShowAlerts] = useState(false)

  // Update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<ShippingOrder | null>(null)
  const [updateStatus, setUpdateStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [searchTerm, filterStatus, filterCarrier, pagination.page])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [overviewData, statsData, alertsData] = await Promise.all([
        shippingService.getShippingOverview(),
        shippingService.getShippingStats(),
        shippingService.getShippingAlerts()
      ])
      
      setOverview(overviewData)
      setStats(statsData)
      setAlerts(alertsData)
    } catch (error) {
      console.error('Error fetching shipping data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const result = await shippingService.getShippingOrders({
        status: filterStatus === 'all' ? undefined : filterStatus,
        carrier: filterCarrier === 'all' ? undefined : filterCarrier,
        search: searchTerm || undefined,
        page: pagination.page,
        limit: pagination.limit
      })

      setOrders(result.orders)
      setPagination(result.pagination)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return

    try {
      await shippingService.updateShippingStatus(
        selectedOrder.id,
        updateStatus,
        trackingNumber || undefined
      )
      
      setShowUpdateModal(false)
      setSelectedOrder(null)
      setUpdateStatus('')
      setTrackingNumber('')
      
      await fetchOrders()
      await fetchData()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const openUpdateModal = (order: ShippingOrder) => {
    setSelectedOrder(order)
    setUpdateStatus(order.status)
    setTrackingNumber(order.trackingNumber)
    setShowUpdateModal(true)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ClockIcon, label: 'Chờ xác nhận' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircleIcon, label: 'Đã xác nhận' },
      processing: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: ArrowPathIcon, label: 'Đang xử lý' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-800', icon: TruckIcon, label: 'Đã gửi' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon, label: 'Đã giao' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircleIcon, label: 'Đã hủy' }
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cao' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Trung bình' },
      low: { bg: 'bg-green-100', text: 'text-green-800', label: 'Thấp' }
    }
    return styles[priority as keyof typeof styles] || styles.medium
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
          {/* Header with Actions */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Quản lý vận chuyển</h1>
              <p className="text-gray-600">Theo dõi và quản lý đơn hàng vận chuyển</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                  showAlerts ? 'bg-red-50 text-red-700 border-red-300' : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <BellIcon className="h-4 w-4 mr-2" />
                Cảnh báo ({alerts.length})
              </button>
              <button
                onClick={fetchData}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Làm mới
              </button>
            </div>
          </div>

          {/* Alerts Panel */}
          {showAlerts && alerts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cảnh báo vận chuyển</h3>
              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert) => {
                  const priorityInfo = getPriorityBadge(alert.priority)
                  return (
                    <div key={alert.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <ExclamationCircleIcon className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            Đơn hàng #{alert.orderNumber} - {alert.customer}
                          </p>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${priorityInfo.bg} ${priorityInfo.text}`}>
                            {priorityInfo.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {shippingService.formatDateTime(alert.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Overview Cards */}
          {overview && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TruckIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Tổng đơn hàng</p>
                    <p className="text-2xl font-semibold text-gray-900">{overview.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <ArrowPathIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Đang vận chuyển</p>
                    <p className="text-2xl font-semibold text-gray-900">{overview.inTransitOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Đã giao</p>
                    <p className="text-2xl font-semibold text-gray-900">{overview.deliveredOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <CurrencyDollarIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Doanh thu vận chuyển</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {shippingService.formatCurrency(overview.totalShippingRevenue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Stats */}
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Orders by Status */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Theo trạng thái
                </h3>
                <div className="space-y-3">
                  {stats.ordersByStatus.map((item) => {
                    const statusInfo = getStatusBadge(item.status)
                    return (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{item.count}</p>
                          <p className="text-xs text-gray-500">{item.percentage}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Orders by Carrier */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2" />
                  Theo đơn vị vận chuyển
                </h3>
                <div className="space-y-3">
                  {stats.ordersByCarrier.map((item) => (
                    <div key={item.carrier} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.carrier}</p>
                        <p className="text-xs text-gray-500">{item.count} đơn hàng</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {shippingService.formatCurrency(item.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  Hoạt động gần đây
                </h3>
                <div className="space-y-3">
                  {stats.recentActivity.slice(0, 5).map((activity, index) => {
                    const statusInfo = getStatusBadge(activity.status)
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <statusInfo.icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">#{activity.orderNumber}</span> - {activity.customer}
                          </p>
                          <p className="text-xs text-gray-500">{statusInfo.label}</p>
                          <p className="text-xs text-gray-400">
                            {shippingService.formatDateTime(activity.updatedAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

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
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipped">Đã gửi</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
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
                  <option value="Giao Hàng Nhanh">Giao Hàng Nhanh</option>
                  <option value="Viettel Post">Viettel Post</option>
                  <option value="VNPost">VNPost</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
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
                  {orders.map((order) => {
                    const statusInfo = getStatusBadge(order.status)
                    const StatusIcon = statusInfo.icon
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">#{order.orderNumber}</div>
                            <div className="text-sm text-gray-500">
                              {order.items.length} sản phẩm • {order.weight}kg
                            </div>
                            <div className="text-sm text-gray-500">{order.dimensions}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              <HomeIcon className="h-4 w-4 mr-1 text-gray-400" />
                              {order.customer.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                              {order.customer.phone}
                            </div>
                            {order.customer.email && (
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                                {order.customer.email}
                              </div>
                            )}
                            <div className="text-sm text-gray-500 max-w-xs truncate mt-1">
                              📍 {order.shippingAddress.address}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.carrier}</div>
                            <div className="text-sm text-gray-500">
                              {order.trackingNumber ? `#${order.trackingNumber}` : 'Chưa có mã vận đơn'}
                            </div>
                            <div className="text-sm text-gray-500">{order.shippingMethod}</div>
                            <div className="text-sm font-medium text-green-600">
                              {shippingService.formatCurrency(order.shippingFee)}
                            </div>
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
                            <div className="flex items-center">
                              <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                              <span><strong>Dự kiến:</strong> {shippingService.formatDate(order.estimatedDelivery)}</span>
                            </div>
                            {order.actualDelivery && (
                              <div className="flex items-center mt-1">
                                <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                                <span><strong>Thực tế:</strong> {shippingService.formatDate(order.actualDelivery)}</span>
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              Cập nhật: {shippingService.formatDate(order.updatedAt)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openUpdateModal(order)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Cập nhật trạng thái"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 p-1" title="Theo dõi">
                              <MapPinIcon className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 p-1" title="Xem chi tiết">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Hiển thị {((pagination.page - 1) * pagination.limit) + 1} đến {Math.min(pagination.page * pagination.limit, pagination.total)} trong {pagination.total} kết quả
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Trước
                  </button>
                  <span className="px-3 py-1 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg">
                    {pagination.page}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Update Status Modal */}
        {showUpdateModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cập nhật trạng thái đơn hàng #{selectedOrder.orderNumber}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đã gửi</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã vận đơn
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Nhập mã vận đơn..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowUpdateModal(false)
                    setSelectedOrder(null)
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  )
}

export default withAuth(AdminShipping, { allowedRoles: ['admin'] })
