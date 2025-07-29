import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Layout from '../../src/components/Layout'
import { useAuth } from '../../src/context/AuthContext'
import api from '../../src/utils/api'
import {
  UserIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShoppingBagIcon,
  HeartIcon,
  CreditCardIcon,
  ArrowLeftIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface Order {
  _id: string
  orderNumber: string
  status: string
  paymentStatus: string
  totalAmount: number
  createdAt: string
  updatedAt: string
  shippingAddress: {
    name: string
    phone: string
    street: string
    ward: string
    district: string
    city: string
  }
  items: Array<{
    product: {
      _id: string
      name: string
      images: string[]
      price: number
    }
    quantity: number
    price: number
  }>
}

interface OrderTracking {
  _id: string
  status: string
  timeline: Array<{
    status: string
    date: string
    description: string
  }>
}

export default function ProfileOrdersPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderTracking, setOrderTracking] = useState<OrderTracking | null>(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchOrders()
  }, [user, router])

  useEffect(() => {
    const filtered = filterOrders(activeTab)
    setFilteredOrders(filtered)
  }, [orders, activeTab])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders')
      if (response.status === 200) {
        setOrders(response.data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderTracking = async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}/tracking`)
      if (response.status === 200) {
        setOrderTracking(response.data)
      }
    } catch (error) {
      console.error('Error fetching order tracking:', error)
    }
  }

  const filterOrders = (status: string) => {
    if (status === 'all') return orders
    return orders.filter(order => order.status === status)
  }

  const viewOrderDetail = async (order: Order) => {
    setSelectedOrder(order)
    await fetchOrderTracking(order._id)
    setShowOrderDetail(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'confirmed': return 'text-blue-600 bg-blue-100'
      case 'processing': return 'text-purple-600 bg-purple-100'
      case 'shipped': return 'text-indigo-600 bg-indigo-100'
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận'
      case 'confirmed': return 'Đã xác nhận'
      case 'processing': return 'Đang xử lý'
      case 'shipped': return 'Đang giao hàng'
      case 'delivered': return 'Đã giao hàng'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán'
      case 'completed': return 'Đã thanh toán'
      case 'failed': return 'Thanh toán thất bại'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return ClipboardDocumentListIcon
      case 'confirmed': return CheckCircleIcon
      case 'processing': return CogIcon
      case 'shipped': return TruckIcon
      case 'delivered': return CheckCircleIcon
      case 'cancelled': return XCircleIcon
      default: return ClipboardDocumentListIcon
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const tabs = [
    { id: 'info', name: 'Thông tin cá nhân', icon: UserIcon, href: '/profile' },
    { id: 'orders', name: 'Đơn hàng', icon: ShoppingBagIcon, href: '/profile/orders', active: true },
    { id: 'favorites', name: 'Yêu thích', icon: HeartIcon, href: '/profile' },
    { id: 'addresses', name: 'Địa chỉ', icon: MapPinIcon, href: '/profile' },
    { id: 'payments', name: 'Thanh toán', icon: CreditCardIcon, href: '/profile' },
    { id: 'settings', name: 'Cài đặt', icon: CogIcon, href: '/profile' },
  ]

  const orderTabs = [
    { id: 'all', name: 'Tất cả', count: orders.length },
    { id: 'pending', name: 'Chờ xác nhận', count: orders.filter(o => o.status === 'pending').length },
    { id: 'confirmed', name: 'Đã xác nhận', count: orders.filter(o => o.status === 'confirmed').length },
    { id: 'processing', name: 'Đang xử lý', count: orders.filter(o => o.status === 'processing').length },
    { id: 'shipped', name: 'Đang giao', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'delivered', name: 'Đã giao', count: orders.filter(o => o.status === 'delivered').length },
  ]

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <>
      <Head>
        <title>Đơn hàng của tôi - LaptopStore</title>
        <meta name="description" content="Quản lý và theo dõi đơn hàng" />
      </Head>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="bg-white shadow-lg rounded-xl mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Link
                      href="/profile"
                      className="mr-4 p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all"
                    >
                      <ArrowLeftIcon className="h-6 w-6" />
                    </Link>
                    <div>
                      <h1 className="text-3xl font-bold text-white">Đơn hàng của tôi</h1>
                      <p className="text-blue-100 text-lg">Quản lý và theo dõi đơn hàng</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100">Tổng đơn hàng</p>
                    <p className="text-3xl font-bold text-white">{orders.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow-lg rounded-xl p-6">
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <Link
                        key={tab.id}
                        href={tab.href}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-200 ${
                          tab.active
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <tab.icon className="h-5 w-5 mr-3" />
                        {tab.name}
                      </Link>
                    ))}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-lg flex items-center text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                      Đăng xuất
                    </button>
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-white shadow-lg rounded-xl p-8">
                  {/* Order Status Tabs */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                      {orderTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {tab.name}
                          {tab.count > 0 && (
                            <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                              activeTab === tab.id
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              {tab.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Orders List */}
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : filteredOrders.length > 0 ? (
                    <div className="space-y-6">
                      {filteredOrders.map((order) => {
                        const StatusIcon = getStatusIcon(order.status)
                        return (
                          <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  <StatusIcon className="h-8 w-8 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900">
                                    Đơn hàng #{order.orderNumber}
                                  </h3>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <CalendarDaysIcon className="h-4 w-4" />
                                    <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusText(order.status)}
                                  </span>
                                  {order.paymentStatus && (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                      {getPaymentStatusText(order.paymentStatus)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center text-lg font-semibold text-gray-900">
                                  <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                                  {order.totalAmount.toLocaleString('vi-VN')}đ
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <ShoppingBagIcon className="h-4 w-4 mr-1" />
                                <span>{order.items.length} sản phẩm</span>
                                {order.shippingAddress && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                    <span>{order.shippingAddress.city}</span>
                                  </>
                                )}
                              </div>
                              <button
                                onClick={() => viewOrderDetail(order)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                Chi tiết
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {activeTab === 'all' ? 'Chưa có đơn hàng nào' : `Không có đơn hàng ${orderTabs.find(t => t.id === activeTab)?.name.toLowerCase()}`}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {activeTab === 'all'
                           ? 'Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!'
                          : 'Không có đơn hàng nào trong trạng thái này.'
                        }
                      </p>
                      {activeTab === 'all' && (
                        <Link
                          href="/products"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Mua sắm ngay
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Detail Modal */}
        {showOrderDetail && selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Chi tiết đơn hàng #{selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setShowOrderDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Thông tin đơn hàng</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Mã đơn hàng:</span>
                        <span className="font-medium">#{selectedOrder.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày đặt:</span>
                        <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Trạng thái:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusText(selectedOrder.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Thanh toán:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                          {getPaymentStatusText(selectedOrder.paymentStatus)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Địa chỉ giao hàng</h3>
                    {selectedOrder.shippingAddress && (
                      <div className="text-sm text-gray-600">
                        <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.name}</p>
                        <p>{selectedOrder.shippingAddress.phone}</p>
                        <p>{selectedOrder.shippingAddress.street}</p>
                        <p>{selectedOrder.shippingAddress.ward}, {selectedOrder.shippingAddress.district}</p>
                        <p>{selectedOrder.shippingAddress.city}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Tracking */}
                {orderTracking && orderTracking.timeline.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-medium text-gray-900 mb-4">Theo dõi đơn hàng</h3>
                    <div className="space-y-4">
                      {orderTracking.timeline.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.description}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(item.date).toLocaleString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-4">Sản phẩm đã đặt</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.images[0] || '/images/placeholder.jpg'}
                            alt={item.product.name}
                            className="h-16 w-16 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {item.price.toLocaleString('vi-VN')}đ
                          </p>
                          <p className="text-sm text-gray-500">
                            Đơn giá: {item.product.price.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Tổng tiền:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {selectedOrder.totalAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}
