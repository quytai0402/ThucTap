import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../src/components/Layout'
import { useAuth } from '../../src/context/AuthContext'
import api from '../../src/utils/api'
import { 
  UserIcon, 
  ShoppingBagIcon, 
  CogIcon, 
  HeartIcon,
  MapPinIcon,
  CreditCardIcon,
  PencilIcon,
  CheckCircleIcon,
  TruckIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/solid'

interface UserStats {
  totalOrders: number
  totalSpent: number
  completedOrders: number
  pendingOrders: number
}

interface Address {
  _id: string
  name: string
  phone: string
  street: string
  ward: string
  district: string
  city: string
  isDefault: boolean
}

interface Favorite {
  _id: string
  productId: {
    _id: string
    name: string
    price: number
    salePrice?: number
    images: string[]
    category: {
      name: string
    }
    brand?: string
  }
  createdAt: string
}

interface Province {
  code: string
  name: string
}

interface District {
  code: string
  name: string
}

interface Ward {
  code: string
  name: string
}

interface PaymentMethod {
  _id: string
  type: 'card' | 'bank_account' | 'ewallet'
  name: string
  cardNumber?: string
  cardType?: string
  expiryMonth?: number
  expiryYear?: number
  cardHolderName?: string
  bankName?: string
  accountNumber?: string
  accountHolderName?: string
  walletType?: string
  walletId?: string
  isDefault: boolean
  isActive: boolean
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('info')
  const [orders, setOrders] = useState([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [editingPayment, setEditingPayment] = useState<any>(null)

  // Address form states
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')

  // Payment form states
  const [newPayment, setNewPayment] = useState({
    type: 'card' as 'card' | 'bank_account' | 'ewallet',
    name: '',
    cardNumber: '',
    cardType: '',
    expiryMonth: '',
    expiryYear: '',
    cardHolderName: '',
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    walletType: '',
    walletId: '',
    isDefault: false
  })

  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    if (user) {
      switch (activeTab) {
        case 'orders':
          fetchRecentOrders()
          fetchCustomerStats()
          break
        case 'favorites':
          fetchFavorites()
          break
        case 'addresses':
          fetchAddresses()
          fetchProvinces()
          break
        case 'payments':
          fetchPaymentMethods()
          break
      }
    }
  }, [user, activeTab])

  // Auto-populate dropdowns when editing address
  useEffect(() => {
    if (editingAddress && provinces.length > 0) {
      const province = provinces.find(p => p.name === editingAddress.city)
      if (province && selectedProvince !== province.code) {
        setSelectedProvince(province.code)
        fetchDistricts(province.code)
      }
    }
  }, [editingAddress, provinces])

  useEffect(() => {
    if (editingAddress && districts.length > 0) {
      const district = districts.find(d => d.name === editingAddress.district)
      if (district && selectedDistrict !== district.code) {
        setSelectedDistrict(district.code)
        fetchWards(district.code)
      }
    }
  }, [editingAddress, districts])

  useEffect(() => {
    if (editingAddress && wards.length > 0) {
      const ward = wards.find(w => w.name === editingAddress.ward)
      if (ward && selectedWard !== ward.code) {
        setSelectedWard(ward.code)
      }
    }
  }, [editingAddress, wards])

  const fetchCustomerStats = async () => {
    try {
      const response = await api.get('/orders/customer-stats')
      if (response.status === 200) {
        setUserStats(response.data)
      }
    } catch (error) {
      console.error('Error fetching customer stats:', error)
    }
  }

  const fetchRecentOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/orders/recent?limit=3')
      if (response.status === 200) {
        setOrders(response.data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await api.get('/favorites')
      if (response.status === 200) {
        setFavorites(response.data)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const response = await api.get('/addresses')
      if (response.status === 200) {
        setAddresses(response.data)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (productId: string) => {
    try {
      await api.delete(`/favorites/${productId}`)
      setFavorites(favorites.filter(fav => fav.productId._id !== productId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const saveAddress = async () => {
    try {
      console.log('🔍 Profile saving address:', newAddress)
      
      // Validate required fields
      if (!newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.street.trim() || 
          !newAddress.city.trim() || !newAddress.district.trim() || !newAddress.ward.trim()) {
        alert('Vui lòng điền đầy đủ thông tin địa chỉ')
        return
      }
      
      if (editingAddress) {
        await api.patch(`/addresses/${editingAddress._id}`, newAddress)
      } else {
        await api.post('/addresses', newAddress)
      }
      fetchAddresses()
      setShowAddressModal(false)
      setEditingAddress(null)
      resetAddressForm()
    } catch (error) {
      console.error('Error saving address:', error)
      alert('Có lỗi xảy ra khi lưu địa chỉ')
    }
  }

  const deleteAddress = async (addressId: string) => {
    try {
      await api.delete(`/addresses/${addressId}`)
      fetchAddresses()
    } catch (error) {
      console.error('Error deleting address:', error)
    }
  }

  const setDefaultAddress = async (addressId: string) => {
    try {
      await api.patch(`/addresses/${addressId}/set-default`)
      fetchAddresses()
    } catch (error) {
      console.error('Error setting default address:', error)
    }
  }

  // Province/District/Ward functions
  const fetchProvinces = async () => {
    try {
      const response = await api.get('/address-api/provinces')
      setProvinces(response.data)
    } catch (error) {
      console.error('Error fetching provinces:', error)
    }
  }

  const fetchDistricts = async (provinceCode: string) => {
    try {
      const response = await api.get(`/address-api/districts?province_code=${provinceCode}`)
      setDistricts(response.data)
      setWards([]) // Reset wards when province changes
    } catch (error) {
      console.error('Error fetching districts:', error)
    }
  }

  const fetchWards = async (districtCode: string) => {
    try {
      const response = await api.get(`/address-api/wards?district_code=${districtCode}`)
      setWards(response.data)
    } catch (error) {
      console.error('Error fetching wards:', error)
    }
  }

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value
    const province = provinces.find((p: any) => p.code === provinceCode)
    setSelectedProvince(provinceCode)
    setSelectedDistrict('')
    setSelectedWard('')
    setNewAddress(prev => ({ ...prev, city: province?.name || '', district: '', ward: '' }))
    if (provinceCode) {
      fetchDistricts(provinceCode)
    } else {
      setDistricts([])
      setWards([])
    }
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = e.target.value
    const district = districts.find((d: any) => d.code === districtCode)
    setSelectedDistrict(districtCode)
    setSelectedWard('')
    setNewAddress(prev => ({ ...prev, district: district?.name || '', ward: '' }))
    if (districtCode) {
      fetchWards(districtCode)
    } else {
      setWards([])
    }
  }

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value
    const ward = wards.find((w: any) => w.code === wardCode)
    setSelectedWard(wardCode)
    setNewAddress(prev => ({ ...prev, ward: ward?.name || '' }))
  }

  const resetAddressForm = () => {
    setNewAddress({
      name: user?.name || '',
      phone: user?.phone || '',
      street: '',
      ward: '',
      district: '',
      city: '',
      isDefault: false
    })
    setSelectedProvince('')
    setSelectedDistrict('')
    setSelectedWard('')
    setProvinces([])
    setDistricts([])
    setWards([])
  }

  const openAddressModal = (address?: Address) => {
    setShowAddressModal(true)
    fetchProvinces()
    
    if (address) {
      setEditingAddress(address)
      setNewAddress(address)
    } else {
      setEditingAddress(null)
      resetAddressForm()
    }
  }

  // Payment Methods functions
  const fetchPaymentMethods = async () => {
    try {
      setLoading(true)
      const response = await api.get('/payment-methods')
      if (response.status === 200) {
        setPaymentMethods(response.data)
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePaymentMethod = async () => {
    try {
      if (editingPayment) {
        await api.patch(`/payment-methods/${editingPayment._id}`, newPayment)
      } else {
        await api.post('/payment-methods', newPayment)
      }
      fetchPaymentMethods()
      setShowPaymentModal(false)
      setEditingPayment(null)
      resetPaymentForm()
    } catch (error) {
      console.error('Error saving payment method:', error)
    }
  }

  const deletePaymentMethod = async (paymentId: string) => {
    try {
      await api.delete(`/payment-methods/${paymentId}`)
      fetchPaymentMethods()
    } catch (error) {
      console.error('Error deleting payment method:', error)
    }
  }

  const setDefaultPaymentMethod = async (paymentId: string) => {
    try {
      await api.patch(`/payment-methods/${paymentId}/set-default`)
      fetchPaymentMethods()
    } catch (error) {
      console.error('Error setting default payment method:', error)
    }
  }

  const resetPaymentForm = () => {
    setNewPayment({
      type: 'card',
      name: '',
      cardNumber: '',
      cardType: '',
      expiryMonth: '',
      expiryYear: '',
      cardHolderName: '',
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
      walletType: '',
      walletId: '',
      isDefault: false
    })
  }

  const openPaymentModal = (payment?: PaymentMethod) => {
    if (payment) {
      setEditingPayment(payment)
      setNewPayment({
        type: payment.type,
        name: payment.name,
        cardNumber: payment.cardNumber || '',
        cardType: payment.cardType || '',
        expiryMonth: payment.expiryMonth?.toString() || '',
        expiryYear: payment.expiryYear?.toString() || '',
        cardHolderName: payment.cardHolderName || '',
        bankName: payment.bankName || '',
        accountNumber: payment.accountNumber || '',
        accountHolderName: payment.accountHolderName || '',
        walletType: payment.walletType || '',
        walletId: payment.walletId || '',
        isDefault: payment.isDefault
      })
    } else {
      setEditingPayment(null)
      resetPaymentForm()
    }
    setShowPaymentModal(true)
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

  if (!user) {
    return <div>Loading...</div>
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const tabs = [
    { id: 'info', name: 'Thông tin cá nhân', icon: UserIcon },
    { id: 'orders', name: 'Đơn hàng', icon: ShoppingBagIcon },
    { id: 'favorites', name: 'Yêu thích', icon: HeartIcon },
    { id: 'addresses', name: 'Địa chỉ', icon: MapPinIcon },
    { id: 'payments', name: 'Thanh toán', icon: CreditCardIcon },
    { id: 'settings', name: 'Cài đặt', icon: CogIcon },
  ]

  return (
    <>
      <Head>
        <title>Hồ sơ cá nhân - LaptopStore</title>
        <meta name="description" content="Quản lý thông tin cá nhân và đơn hàng" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Card */}
            <div className="bg-white shadow-lg rounded-xl mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <UserIcon className="h-10 w-10 text-white" />
                    </div>
                    <div className="ml-6">
                      <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                      <p className="text-blue-100 text-lg">{user?.email}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur">
                        {user?.role === 'customer' ? 'Khách hàng' : user?.role === 'admin' ? 'Quản trị viên' : user?.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow-lg rounded-xl p-6">
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <tab.icon className="h-5 w-5 mr-3" />
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <div className="bg-white shadow-lg rounded-xl p-8">
                  {activeTab === 'info' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                            <input
                              type="text"
                              value={user?.name || ''}
                              disabled
                              className="block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                              type="email"
                              value={user?.email || ''}
                              disabled
                              className="block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                            <input
                              type="tel"
                              value={user?.phone || 'Chưa cập nhật'}
                              disabled
                              className="block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                            <div className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                              user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user?.role === 'customer' ? 'Khách hàng' : user?.role === 'admin' ? 'Quản trị viên' : user?.role}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Statistics Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                          <div className="flex items-center">
                            <ShoppingBagIcon className="h-8 w-8" />
                            <div className="ml-4">
                              <p className="text-blue-100">Tổng đơn hàng</p>
                              <p className="text-2xl font-bold">{userStats?.totalOrders || 0}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-8 w-8" />
                            <div className="ml-4">
                              <p className="text-green-100">Đã hoàn thành</p>
                              <p className="text-2xl font-bold">{userStats?.completedOrders || 0}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                          <div className="flex items-center">
                            <TruckIcon className="h-8 w-8" />
                            <div className="ml-4">
                              <p className="text-purple-100">Đang xử lý</p>
                              <p className="text-2xl font-bold">{userStats?.pendingOrders || 0}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                          <div className="flex items-center">
                            <CreditCardIcon className="h-8 w-8" />
                            <div className="ml-4">
                              <p className="text-orange-100">Tổng chi tiêu</p>
                              <p className="text-xl font-bold">{(userStats?.totalSpent || 0).toLocaleString('vi-VN')}đ</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Đơn hàng gần nhất</h2>
                        <Link
                          href="/profile/orders"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Xem tất cả →
                        </Link>
                      </div>
                      
                      {loading ? (
                        <div className="flex justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : orders.length > 0 ? (
                        <div className="space-y-4">
                          {orders.map((order: any) => (
                            <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                      Đơn hàng #{order.orderNumber}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusText(order.status)}
                                  </span>
                                  <p className="text-lg font-semibold text-gray-900 mt-1">
                                    {order.total.toLocaleString('vi-VN')}đ
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-gray-500">
                                  <span>{order.items.length} sản phẩm</span>
                                </div>
                                <Link
                                  href="/profile/orders"
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  Chi tiết
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                          <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
                          <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
                          <Link
                            href="/products"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            Mua sắm ngay
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'favorites' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Sản phẩm yêu thích</h2>
                        <span className="text-sm text-gray-500">{favorites.length} sản phẩm</span>
                      </div>
                      
                      {loading ? (
                        <div className="flex justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : favorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {favorites.map((favorite) => (
                            <div key={favorite._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                              <div className="relative">
                                <img
                                  src={favorite.productId.images[0] || '/images/default-product.png'}
                                  alt={favorite.productId.name}
                                  className="w-full h-48 object-cover"
                                />
                                <button
                                  onClick={() => removeFavorite(favorite.productId._id)}
                                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                                >
                                  <TrashIcon className="h-4 w-4 text-red-500" />
                                </button>
                              </div>
                              <div className="p-4">
                                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                  {favorite.productId.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">
                                  {favorite.productId.category.name}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    {favorite.productId.salePrice ? (
                                      <>
                                        <span className="text-lg font-bold text-red-600">
                                          {favorite.productId.salePrice.toLocaleString('vi-VN')}đ
                                        </span>
                                        <span className="text-sm text-gray-500 line-through">
                                          {favorite.productId.price.toLocaleString('vi-VN')}đ
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-lg font-bold text-gray-900">
                                        {favorite.productId.price.toLocaleString('vi-VN')}đ
                                      </span>
                                    )}
                                  </div>
                                  <Link
                                    href={`/products/${favorite.productId._id}`}
                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
                                  >
                                    <EyeIcon className="h-4 w-4 mr-1" />
                                    Xem
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                          <HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sản phẩm yêu thích</h3>
                          <p className="text-gray-600 mb-4">Thêm sản phẩm vào danh sách yêu thích để dễ dàng theo dõi</p>
                          <Link
                            href="/products"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <HeartIcon className="h-4 w-4 mr-2" />
                            Khám phá sản phẩm
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'addresses' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Địa chỉ giao hàng</h2>
                        <button
                          onClick={() => openAddressModal()}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Thêm địa chỉ
                        </button>
                      </div>
                      
                      {loading ? (
                        <div className="flex justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {addresses.map((address) => (
                            <div
                              key={address._id}
                              className={`border-2 rounded-lg p-6 ${
                                address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="font-semibold text-gray-900">{address.name}</h3>
                                    {address.isDefault && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Mặc định
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                                  <p className="text-sm text-gray-600">
                                    {address.street}, {address.ward}, {address.district}, {address.city}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => openAddressModal(address)}
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteAddress(address._id)}
                                    className="p-2 text-gray-400 hover:text-red-600"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              {!address.isDefault && (
                                <button
                                  onClick={() => setDefaultAddress(address._id)}
                                  className="w-full px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-md hover:bg-blue-50"
                                >
                                  Đặt làm mặc định
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                          <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có địa chỉ nào</h3>
                          <p className="text-gray-600 mb-4">Thêm địa chỉ giao hàng để thuận tiện hơn khi đặt hàng</p>
                          <button
                            onClick={() => openAddressModal()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Thêm địa chỉ đầu tiên
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'payments' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Phương thức thanh toán</h2>
                        <button
                          onClick={() => openPaymentModal()}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Thêm phương thức
                        </button>
                      </div>

                      {paymentMethods.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {paymentMethods.map((method: PaymentMethod) => (
                            <div key={method._id} className="bg-white border border-gray-200 rounded-lg p-6 relative">
                              {method.isDefault && (
                                <span className="absolute top-3 right-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Mặc định
                                </span>
                              )}
                              
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    <CreditCardIcon className="h-6 w-6 text-gray-400 mr-2" />
                                    <span className="font-medium text-gray-900">{method.name}</span>
                                  </div>
                                  
                                  {method.type === 'card' && (
                                    <>
                                      <p className="text-sm text-gray-600">
                                        {method.cardType} •••• {method.cardNumber}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Hết hạn: {method.expiryMonth}/{method.expiryYear}
                                      </p>
                                    </>
                                  )}
                                  
                                  {method.type === 'bank_account' && (
                                    <>
                                      <p className="text-sm text-gray-600">{method.bankName}</p>
                                      <p className="text-sm text-gray-600">•••• {method.accountNumber}</p>
                                    </>
                                  )}
                                  
                                  {method.type === 'ewallet' && (
                                    <>
                                      <p className="text-sm text-gray-600">{method.walletType}</p>
                                      <p className="text-sm text-gray-600">•••• {method.walletId}</p>
                                    </>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-2 ml-4">
                                  <button
                                    onClick={() => openPaymentModal(method)}
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => deletePaymentMethod(method._id)}
                                    className="p-2 text-gray-400 hover:text-red-600"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              
                              {!method.isDefault && (
                                <button
                                  onClick={() => setDefaultPaymentMethod(method._id)}
                                  className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                                >
                                  Đặt làm mặc định
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                          <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">Chưa có phương thức thanh toán nào</p>
                          <button
                            onClick={() => openPaymentModal()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Thêm phương thức đầu tiên
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900">Cài đặt tài khoản</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b">
                          <div>
                            <p className="font-medium">Nhận thông báo email</p>
                            <p className="text-sm text-gray-600">Nhận thông báo về đơn hàng và khuyến mãi</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b">
                          <div>
                            <p className="font-medium">Nhận SMS</p>
                            <p className="text-sm text-gray-600">Nhận tin nhắn về trạng thái đơn hàng</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddressModal(false)
                    setEditingAddress(null)
                    resetAddressForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cụ thể</label>
                  <input
                    type="text"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Số nhà, tên đường"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                    <select
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                    <select
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      disabled={!selectedProvince}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map((district) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                    <select
                      value={selectedWard}
                      onChange={handleWardChange}
                      disabled={!selectedDistrict}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddressModal(false)
                    setEditingAddress(null)
                    resetAddressForm()
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={saveAddress}
                  disabled={(() => {
                    const isDisabled = !newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.street.trim() || 
                                     !newAddress.city.trim() || !newAddress.district.trim() || !newAddress.ward.trim()
                    console.log('🔍 Profile button validation:', {
                      name: !!newAddress.name.trim(),
                      phone: !!newAddress.phone.trim(), 
                      street: !!newAddress.street.trim(),
                      city: !!newAddress.city.trim(),
                      district: !!newAddress.district.trim(),
                      ward: !!newAddress.ward.trim(),
                      isDisabled,
                      newAddress
                    })
                    return isDisabled
                  })()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingAddress ? 'Cập nhật' : 'Lưu địa chỉ'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingPayment ? 'Chỉnh sửa phương thức thanh toán' : 'Thêm phương thức thanh toán'}
                </h3>
                <button
                  onClick={() => {
                    setShowPaymentModal(false)
                    setEditingPayment(null)
                    resetPaymentForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại phương thức</label>
                  <select
                    value={newPayment.type}
                    onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="card">Thẻ tín dụng/ghi nợ</option>
                    <option value="bank_account">Tài khoản ngân hàng</option>
                    <option value="ewallet">Ví điện tử</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên phương thức</label>
                  <input
                    type="text"
                    value={newPayment.name}
                    onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Thẻ Visa chính"
                  />
                </div>

                {newPayment.type === 'card' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số thẻ</label>
                      <input
                        type="text"
                        value={newPayment.cardNumber}
                        onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại thẻ</label>
                      <select
                        value={newPayment.cardType}
                        onChange={(e) => setNewPayment({ ...newPayment, cardType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn loại thẻ</option>
                        <option value="Visa">Visa</option>
                        <option value="MasterCard">MasterCard</option>
                        <option value="JCB">JCB</option>
                        <option value="American Express">American Express</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tháng hết hạn</label>
                        <select
                          value={newPayment.expiryMonth}
                          onChange={(e) => setNewPayment({ ...newPayment, expiryMonth: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Tháng</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Năm hết hạn</label>
                        <select
                          value={newPayment.expiryYear}
                          onChange={(e) => setNewPayment({ ...newPayment, expiryYear: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Năm</option>
                          {Array.from({ length: 20 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ thẻ</label>
                      <input
                        type="text"
                        value={newPayment.cardHolderName}
                        onChange={(e) => setNewPayment({ ...newPayment, cardHolderName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tên như trên thẻ"
                      />
                    </div>
                  </>
                )}

                {newPayment.type === 'bank_account' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên ngân hàng</label>
                      <select
                        value={newPayment.bankName}
                        onChange={(e) => setNewPayment({ ...newPayment, bankName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn ngân hàng</option>
                        <option value="Vietcombank">Vietcombank</option>
                        <option value="BIDV">BIDV</option>
                        <option value="VietinBank">VietinBank</option>
                        <option value="Agribank">Agribank</option>
                        <option value="Techcombank">Techcombank</option>
                        <option value="MBBank">MBBank</option>
                        <option value="VPBank">VPBank</option>
                        <option value="TPBank">TPBank</option>
                        <option value="Sacombank">Sacombank</option>
                        <option value="ACB">ACB</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
                      <input
                        type="text"
                        value={newPayment.accountNumber}
                        onChange={(e) => setNewPayment({ ...newPayment, accountNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Số tài khoản ngân hàng"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ tài khoản</label>
                      <input
                        type="text"
                        value={newPayment.accountHolderName}
                        onChange={(e) => setNewPayment({ ...newPayment, accountHolderName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tên chủ tài khoản"
                      />
                    </div>
                  </>
                )}

                {newPayment.type === 'ewallet' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại ví điện tử</label>
                      <select
                        value={newPayment.walletType}
                        onChange={(e) => setNewPayment({ ...newPayment, walletType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn ví điện tử</option>
                        <option value="MoMo">MoMo</option>
                        <option value="ZaloPay">ZaloPay</option>
                        <option value="VNPay">VNPay</option>
                        <option value="ShopeePay">ShopeePay</option>
                        <option value="GrabPay">GrabPay</option>
                        <option value="AirPay">AirPay</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID ví / Số điện thoại</label>
                      <input
                        type="text"
                        value={newPayment.walletId}
                        onChange={(e) => setNewPayment({ ...newPayment, walletId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Số điện thoại hoặc ID ví"
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefaultPayment"
                    checked={newPayment.isDefault}
                    onChange={(e) => setNewPayment({ ...newPayment, isDefault: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefaultPayment" className="ml-2 block text-sm text-gray-900">
                    Đặt làm phương thức mặc định
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPaymentModal(false)
                    setEditingPayment(null)
                    resetPaymentForm()
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={savePaymentMethod}
                  disabled={!newPayment.name || !newPayment.type}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingPayment ? 'Cập nhật' : 'Lưu phương thức'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}

export default ProfilePage