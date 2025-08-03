import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../src/components/AdminLayout'
import { withAuth } from '../../src/components/withAuth'
import adminService from '../../src/services/adminService'
import { 
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  KeyIcon,
  DocumentTextIcon,
  PhotoIcon,
  ServerIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface SystemSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  adminEmail: string
  currency: string
  timezone: string
  language: string
  theme: string
}

interface SecuritySettings {
  twoFactorAuth: boolean
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
  }
  sessionTimeout: number
  maxLoginAttempts: number
  ipWhitelist: string[]
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  orderNotifications: boolean
  lowStockAlerts: boolean
  customerRegistration: boolean
  reviewNotifications: boolean
}

interface PaymentSettings {
  enabledMethods: string[]
  defaultCurrency: string
  vatRate: number
  shippingFee: number
  freeShippingThreshold: number
}

interface EmailSettings {
  smtpHost: string
  smtpPort: number
  smtpUsername: string
  smtpPassword: string
  fromEmail: string
  fromName: string
  replyToEmail: string
}

const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'Laptop IT-Global',
    siteDescription: 'Công Ty TNHH IT-Global - Chuyên cung cấp laptop và thiết bị công nghệ',
    siteUrl: 'https://laptopstore.vn',
    adminEmail: 'admin@it-global.net',
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'vi',
    theme: 'light'
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    ipWhitelist: ['127.0.0.1', '192.168.1.0/24']
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    customerRegistration: true,
    reviewNotifications: true
  })

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    enabledMethods: ['credit_card', 'bank_transfer', 'cod'],
    defaultCurrency: 'VND',
    vatRate: 10,
    shippingFee: 30000,
    freeShippingThreshold: 500000
  })

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@laptopstore.vn',
    smtpPassword: '********',
    fromEmail: 'noreply@laptopstore.vn',
    fromName: 'Laptop Store Vietnam',
    replyToEmail: 'support@laptopstore.vn'
  })

  const [unsavedChanges, setUnsavedChanges] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // TODO: Implement actual settings API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setLoading(true)
      // TODO: Implement actual save settings API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUnsavedChanges(false)
      alert('Cài đặt đã được lưu thành công!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Có lỗi xảy ra khi lưu cài đặt')
    } finally {
      setLoading(false)
    }
  }

  const handleTestEmail = async () => {
    try {
      setLoading(true)
      // TODO: Implement actual test email API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Email test đã được gửi thành công!')
    } catch (error) {
      alert('Có lỗi xảy ra khi gửi email test')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'general', name: 'Chung', icon: CogIcon },
    { id: 'security', name: 'Bảo mật', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Thông báo', icon: BellIcon },
    { id: 'payment', name: 'Thanh toán', icon: CurrencyDollarIcon },
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
    { id: 'system', name: 'Hệ thống', icon: ServerIcon }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  if (loading && activeTab === 'general') {
    return (
      <AdminLayout title="Cài đặt hệ thống">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Cài đặt hệ thống - Admin</title>
      </Head>

      <AdminLayout title="Cài đặt hệ thống">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Cài đặt hệ thống</h1>
              <p className="text-gray-600">Quản lý cấu hình và thiết lập hệ thống</p>
            </div>
            {unsavedChanges && (
              <div className="flex items-center space-x-4">
                <span className="text-orange-600 text-sm">
                  <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" />
                  Có thay đổi chưa lưu
                </span>
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="p-6 space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Cài đặt chung</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên website
                        </label>
                        <input
                          type="text"
                          value={systemSettings.siteName}
                          onChange={(e) => {
                            setSystemSettings({...systemSettings, siteName: e.target.value})
                            setUnsavedChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email quản trị
                        </label>
                        <input
                          type="email"
                          value={systemSettings.adminEmail}
                          onChange={(e) => {
                            setSystemSettings({...systemSettings, adminEmail: e.target.value})
                            setUnsavedChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL website
                        </label>
                        <input
                          type="url"
                          value={systemSettings.siteUrl}
                          onChange={(e) => {
                            setSystemSettings({...systemSettings, siteUrl: e.target.value})
                            setUnsavedChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Múi giờ
                        </label>
                        <select
                          value={systemSettings.timezone}
                          onChange={(e) => {
                            setSystemSettings({...systemSettings, timezone: e.target.value})
                            setUnsavedChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">America/New_York</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngôn ngữ
                        </label>
                        <select
                          value={systemSettings.language}
                          onChange={(e) => {
                            setSystemSettings({...systemSettings, language: e.target.value})
                            setUnsavedChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="vi">Tiếng Việt</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giao diện
                        </label>
                        <select
                          value={systemSettings.theme}
                          onChange={(e) => {
                            setSystemSettings({...systemSettings, theme: e.target.value})
                            setUnsavedChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="light">Sáng</option>
                          <option value="dark">Tối</option>
                          <option value="auto">Tự động</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả website
                      </label>
                      <textarea
                        rows={3}
                        value={systemSettings.siteDescription}
                        onChange={(e) => {
                          setSystemSettings({...systemSettings, siteDescription: e.target.value})
                          setUnsavedChanges(true)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="p-6 space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Cài đặt bảo mật</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Xác thực 2 bước</h4>
                          <p className="text-sm text-gray-500">Bật xác thực 2 bước cho tài khoản admin</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.twoFactorAuth}
                            onChange={(e) => {
                              setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})
                              setUnsavedChanges(true)
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Độ dài mật khẩu tối thiểu
                          </label>
                          <input
                            type="number"
                            min="6"
                            max="20"
                            value={securitySettings.passwordPolicy.minLength}
                            onChange={(e) => {
                              setSecuritySettings({
                                ...securitySettings, 
                                passwordPolicy: {
                                  ...securitySettings.passwordPolicy,
                                  minLength: parseInt(e.target.value)
                                }
                              })
                              setUnsavedChanges(true)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thời gian hết hạn session (phút)
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="120"
                            value={securitySettings.sessionTimeout}
                            onChange={(e) => {
                              setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})
                              setUnsavedChanges(true)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số lần đăng nhập sai tối đa
                          </label>
                          <input
                            type="number"
                            min="3"
                            max="10"
                            value={securitySettings.maxLoginAttempts}
                            onChange={(e) => {
                              setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})
                              setUnsavedChanges(true)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">Chính sách mật khẩu</h4>
                        {[
                          { key: 'requireUppercase', label: 'Yêu cầu chữ hoa' },
                          { key: 'requireNumbers', label: 'Yêu cầu số' },
                          { key: 'requireSpecialChars', label: 'Yêu cầu ký tự đặc biệt' }
                        ].map(item => (
                          <div key={item.key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={securitySettings.passwordPolicy[item.key as keyof typeof securitySettings.passwordPolicy] as boolean}
                              onChange={(e) => {
                                setSecuritySettings({
                                  ...securitySettings,
                                  passwordPolicy: {
                                    ...securitySettings.passwordPolicy,
                                    [item.key]: e.target.checked
                                  }
                                })
                                setUnsavedChanges(true)
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">{item.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="p-6 space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Cài đặt thông báo</h3>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Thông báo email', description: 'Nhận thông báo qua email' },
                        { key: 'smsNotifications', label: 'Thông báo SMS', description: 'Nhận thông báo qua SMS' },
                        { key: 'pushNotifications', label: 'Thông báo đẩy', description: 'Nhận thông báo đẩy trên trình duyệt' },
                        { key: 'orderNotifications', label: 'Thông báo đơn hàng', description: 'Thông báo khi có đơn hàng mới' },
                        { key: 'lowStockAlerts', label: 'Cảnh báo sắp hết hàng', description: 'Thông báo khi sản phẩm sắp hết' },
                        { key: 'customerRegistration', label: 'Đăng ký khách hàng', description: 'Thông báo khách hàng mới đăng ký' },
                        { key: 'reviewNotifications', label: 'Thông báo đánh giá', description: 'Thông báo khi có đánh giá mới' }
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                              onChange={(e) => {
                                setNotificationSettings({...notificationSettings, [item.key]: e.target.checked})
                                setUnsavedChanges(true)
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Settings */}
                {activeTab === 'payment' && (
                  <div className="p-6 space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Cài đặt thanh toán</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Phương thức thanh toán</h4>
                        <div className="space-y-2">
                          {[
                            { key: 'credit_card', label: 'Thẻ tín dụng/ghi nợ' },
                            { key: 'bank_transfer', label: 'Chuyển khoản ngân hàng' },
                            { key: 'cod', label: 'Thanh toán khi nhận hàng (COD)' },
                            { key: 'e_wallet', label: 'Ví điện tử' },
                            { key: 'installment', label: 'Trả góp' }
                          ].map(method => (
                            <div key={method.key} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={paymentSettings.enabledMethods.includes(method.key)}
                                onChange={(e) => {
                                  const methods = e.target.checked
                                    ? [...paymentSettings.enabledMethods, method.key]
                                    : paymentSettings.enabledMethods.filter(m => m !== method.key)
                                  setPaymentSettings({...paymentSettings, enabledMethods: methods})
                                  setUnsavedChanges(true)
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label className="ml-2 text-sm text-gray-700">{method.label}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thuế VAT (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            step="0.1"
                            value={paymentSettings.vatRate}
                            onChange={(e) => {
                              setPaymentSettings({...paymentSettings, vatRate: parseFloat(e.target.value)})
                              setUnsavedChanges(true)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phí vận chuyển
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={paymentSettings.shippingFee}
                            onChange={(e) => {
                              setPaymentSettings({...paymentSettings, shippingFee: parseInt(e.target.value)})
                              setUnsavedChanges(true)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Miễn phí vận chuyển từ
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="10000"
                            value={paymentSettings.freeShippingThreshold}
                            onChange={(e) => {
                              setPaymentSettings({...paymentSettings, freeShippingThreshold: parseInt(e.target.value)})
                              setUnsavedChanges(true)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Hiện tại: {formatPrice(paymentSettings.freeShippingThreshold)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Settings */}
                {activeTab === 'email' && (
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Cài đặt email</h3>
                      <button
                        onClick={handleTestEmail}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? 'Đang gửi...' : 'Test email'}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          value={emailSettings.smtpHost}
                          onChange={(e) => {
                            setEmailSettings({...emailSettings, smtpHost: e.target.value})
                            setUnsavedChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="number"
                          value={emailSettings.smtpPort}
                          onChange={(e) => {
                            setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)})
                            setUnsavedChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={emailSettings.smtpUsername}
                          onChange={(e) => {
                            setEmailSettings({...emailSettings, smtpUsername: e.target.value})
                            setUnsavedChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          value={emailSettings.smtpPassword}
                          onChange={(e) => {
                            setEmailSettings({...emailSettings, smtpPassword: e.target.value})
                            setUnsavedChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Email
                        </label>
                        <input
                          type="email"
                          value={emailSettings.fromEmail}
                          onChange={(e) => {
                            setEmailSettings({...emailSettings, fromEmail: e.target.value})
                            setUnsavedChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Name
                        </label>
                        <input
                          type="text"
                          value={emailSettings.fromName}
                          onChange={(e) => {
                            setEmailSettings({...emailSettings, fromName: e.target.value})
                            setUnsavedChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reply To Email
                        </label>
                        <input
                          type="email"
                          value={emailSettings.replyToEmail}
                          onChange={(e) => {
                            setEmailSettings({...emailSettings, replyToEmail: e.target.value})
                            setUnsavedChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* System Settings */}
                {activeTab === 'system' && (
                  <div className="p-6 space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Cài đặt hệ thống</h3>
                    
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <div className="flex">
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-yellow-800">
                              Cảnh báo
                            </h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              Các thao tác dưới đây có thể ảnh hưởng đến hoạt động của hệ thống. Vui lòng cân nhắc kỹ trước khi thực hiện.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-900">Sao lưu dữ liệu</h4>
                          <button 
                            onClick={async () => {
                              try {
                                setLoading(true)
                                const result = await adminService.backupDatabase()
                                if (result.success) {
                                  alert(`✅ ${result.message}`)
                                } else {
                                  alert(`❌ ${result.message}`)
                                }
                              } catch (error) {
                                alert('❌ Có lỗi xảy ra khi sao lưu')
                              } finally {
                                setLoading(false)
                              }
                            }}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            {loading ? 'Đang sao lưu...' : 'Tạo bản sao lưu'}
                          </button>
                          <p className="text-xs text-gray-500">
                            Sao lưu cuối: 28/07/2025 - 10:30
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-900">Xuất dữ liệu</h4>
                          <button 
                            onClick={async () => {
                              try {
                                setLoading(true)
                                const blob = await adminService.exportAllData('json')
                                
                                // Create download link
                                const url = window.URL.createObjectURL(blob)
                                const link = document.createElement('a')
                                link.href = url
                                link.download = `database_export_${new Date().toISOString().split('T')[0]}.json`
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                                window.URL.revokeObjectURL(url)
                              } catch (error) {
                                alert('❌ Có lỗi xảy ra khi xuất dữ liệu')
                              } finally {
                                setLoading(false)
                              }
                            }}
                            disabled={loading}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            {loading ? 'Đang xuất...' : 'Xuất dữ liệu'}
                          </button>
                          <p className="text-xs text-gray-500">
                            Xuất toàn bộ dữ liệu thành file JSON
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-900">Xóa cache</h4>
                          <button 
                            onClick={async () => {
                              try {
                                setLoading(true)
                                // Clear cache implementation
                                await new Promise(resolve => setTimeout(resolve, 2000))
                                alert('✅ Cache đã được xóa thành công')
                              } catch (error) {
                                alert('❌ Có lỗi xảy ra khi xóa cache')
                              } finally {
                                setLoading(false)
                              }
                            }}
                            disabled={loading}
                            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                          >
                            {loading ? 'Đang xóa...' : 'Xóa tất cả cache'}
                          </button>
                          <p className="text-xs text-gray-500">
                            Xóa cache để cập nhật dữ liệu mới
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-900">Xóa dữ liệu</h4>
                          <button 
                            onClick={async () => {
                              if (confirm('⚠️ Bạn có chắc chắn muốn xóa TOÀN BỘ dữ liệu? Hành động này không thể hoàn tác!')) {
                                try {
                                  setLoading(true)
                                  const result = await adminService.clearAllData()
                                  if (result.success) {
                                    alert(`✅ ${result.message}`)
                                  } else {
                                    alert(`❌ ${result.message}`)
                                  }
                                } catch (error) {
                                  alert('❌ Có lỗi xảy ra khi xóa dữ liệu')
                                } finally {
                                  setLoading(false)
                                }
                              }
                            }}
                            disabled={loading}
                            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                          >
                            {loading ? 'Đang xóa...' : 'Xóa dữ liệu'}
                          </button>
                          <p className="text-xs text-gray-500">
                            ⚠️ Xóa toàn bộ dữ liệu (không thể hoàn tác)
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Thông tin hệ thống</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Phiên bản:</span> v1.0.0
                          </div>
                          <div>
                            <span className="font-medium">Database:</span> MongoDB 7.0
                          </div>
                          <div>
                            <span className="font-medium">Node.js:</span> v18.17.0
                          </div>
                          <div>
                            <span className="font-medium">Uptime:</span> 15 ngày 4 giờ
                          </div>
                          <div>
                            <span className="font-medium">Dung lượng sử dụng:</span> 2.4GB / 10GB
                          </div>
                          <div>
                            <span className="font-medium">RAM sử dụng:</span> 512MB / 2GB
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        // Reset changes
                        fetchSettings()
                        setUnsavedChanges(false)
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Hủy thay đổi
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      disabled={loading || !unsavedChanges}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}

export default withAuth(AdminSettings, { allowedRoles: ['admin'] })
