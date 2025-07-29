import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../src/components/Layout'
import { useAuth } from '../src/context/AuthContext'
import api from '../src/utils/api'
import { 
  CheckCircleIcon,
  TruckIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
  CalendarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

interface OrderDetails {
  _id: string
  orderNumber: string
  status: string
  totalAmount: number
  shippingFee: number
  paymentMethod: string
  shippingAddress: {
    fullName: string
    phone: string
    email: string
    address: string
    city: string
    district: string
    ward: string
  }
  items: Array<{
    product: {
      _id: string
      name: string
      price: number
      images: string[]
    }
    quantity: number
    price: number
  }>
  createdAt: string
  estimatedDelivery?: string
}

export default function OrderSuccessPage() {
  const router = useRouter()
  const { orderId } = router.query
  const { user } = useAuth()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId && user) {
      fetchOrderDetails()
    } else if (!user) {
      router.push('/login')
    }
  }, [orderId, user, router])

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`)
      
      if (response.status === 200) {
        const data = response.data
        setOrder(data)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng (COD)'
      case 'bank_transfer': return 'Chuyển khoản ngân hàng'
      case 'credit_card': return 'Thẻ tín dụng/ghi nợ'
      default: return method
    }
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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy đơn hàng</h2>
            <Link href="/" className="text-blue-600 hover:text-blue-500">
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Đặt hàng thành công!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi
          </p>
          <p className="text-sm text-gray-500">
            Mã đơn hàng: <span className="font-mono font-semibold">#{order.orderNumber || order._id.slice(-8).toUpperCase()}</span>
          </p>
        </div>

        {/* Order Status */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Trạng thái đơn hàng</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Ngày đặt hàng</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Dự kiến giao hàng</p>
                  <p className="text-sm text-gray-500">
                    {order.estimatedDelivery || '3-5 ngày làm việc'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Thanh toán</p>
                  <p className="text-sm text-gray-500">
                    {getPaymentMethodName(order.paymentMethod)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Order Items */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400 mr-2" />
                Sản phẩm đã đặt
              </h2>
              
              <div className="flow-root">
                <ul className="-my-4 divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.product._id} className="py-4 flex">
                      <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                        <Image
                          src={item.product.images[0] || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.product.name}
                          </h4>
                          <p className="ml-4 text-sm font-medium text-gray-900">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.price.toLocaleString('vi-VN')}₫ x {item.quantity}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Tạm tính</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {(order.totalAmount - order.shippingFee).toLocaleString('vi-VN')}₫
                  </dd>
                </div>
                <div className="flex justify-between mt-2">
                  <dt className="text-sm text-gray-600">Phí vận chuyển</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      `${order.shippingFee.toLocaleString('vi-VN')}₫`
                    )}
                  </dd>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                  <dt className="text-base font-medium text-gray-900">Tổng cộng</dt>
                  <dd className="text-base font-medium text-red-600">
                    {order.totalAmount.toLocaleString('vi-VN')}₫
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                Địa chỉ giao hàng
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.shippingAddress.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.shippingAddress.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      {order.shippingAddress.address}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.shippingAddress.ward}, {order.shippingAddress.district}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.shippingAddress.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tiếp tục mua sắm
          </Link>
          
          <Link
            href="/profile/orders"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Xem đơn hàng của tôi
          </Link>
        </div>

        {/* Support Information */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hỗ trợ khách hàng</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Hotline hỗ trợ</p>
                <p className="text-sm text-gray-600">1800-1234 (Miễn phí)</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Theo dõi đơn hàng</p>
                <p className="text-sm text-gray-600">Trên website hoặc ứng dụng</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Lưu ý:</strong> Chúng tôi sẽ gửi email cập nhật trạng thái đơn hàng đến địa chỉ {order.shippingAddress.email}. 
              Vui lòng kiểm tra email thường xuyên để nhận thông tin mới nhất.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
