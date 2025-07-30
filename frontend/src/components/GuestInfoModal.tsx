import React, { useState, useEffect } from 'react'
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  XMarkIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

interface GuestInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (guestInfo: GuestInfo) => void
  isProcessing?: boolean
}

export interface GuestInfo {
  fullName: string
  phone: string
  email: string
  address: string
  provinceCode: string
  provinceName: string
  districtCode: string
  districtName: string
  wardCode: string
  wardName: string
  note?: string
}

const GuestInfoModal: React.FC<GuestInfoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isProcessing = false
}) => {
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    provinceCode: '',
    provinceName: '',
    districtCode: '',
    districtName: '',
    wardCode: '',
    wardName: '',
    note: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [existingCustomerData, setExistingCustomerData] = useState<any>(null)
  const [isCheckingPhone, setIsCheckingPhone] = useState(false)

  // Check for existing customer data when phone number changes
  const checkExistingCustomer = async (phone: string) => {
    if (phone.length < 10) return
    
    try {
      setIsCheckingPhone(true)
      const response = await fetch(`/api/get-guest-orders?phone=${encodeURIComponent(phone)}`)
      const data = await response.json()
      
      if (data && data.orders && data.orders.length > 0) {
        // Found existing customer data
        const lastOrder = data.orders[0]
        setExistingCustomerData({
          orders: data.orders,
          total: data.total,
          lastOrder
        })
        
        // Auto-fill form with data from last order
        setGuestInfo(prev => ({
          ...prev,
          fullName: lastOrder.shippingAddress.name || prev.fullName,
          email: lastOrder.shippingAddress.email || prev.email,
          address: lastOrder.shippingAddress.address || prev.address,
          provinceCode: lastOrder.shippingAddress.provinceCode || prev.provinceCode,
          provinceName: lastOrder.shippingAddress.city || prev.provinceName,
          districtCode: lastOrder.shippingAddress.districtCode || prev.districtCode,
          districtName: lastOrder.shippingAddress.district || prev.districtName,
          wardCode: lastOrder.shippingAddress.wardCode || prev.wardCode,
          wardName: lastOrder.shippingAddress.ward || prev.wardName
        }))
      } else {
        setExistingCustomerData(null)
      }
    } catch (error) {
      console.error('Error checking for existing customer:', error)
      setExistingCustomerData(null)
    } finally {
      setIsCheckingPhone(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setGuestInfo(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    
    // Check for existing customer when phone number changes
    if (name === 'phone' && value.length >= 10) {
      checkExistingCustomer(value)
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!guestInfo.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên'
    }

    if (!guestInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại'
    } else if (!/^(0[0-9]{9,10})$/.test(guestInfo.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }

    if (!guestInfo.email.trim()) {
      newErrors.email = 'Vui lòng nhập email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!guestInfo.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ'
    }

    if (!guestInfo.provinceCode) {
      newErrors.provinceCode = 'Vui lòng chọn tỉnh/thành phố'
    }

    if (!guestInfo.districtCode) {
      newErrors.districtCode = 'Vui lòng chọn quận/huyện'
    }

    if (!guestInfo.wardCode) {
      newErrors.wardCode = 'Vui lòng chọn phường/xã'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(guestInfo)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Đóng</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Thông tin vận chuyển
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Vui lòng nhập thông tin vận chuyển để tiếp tục đặt hàng
                </p>
                
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={guestInfo.fullName}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md ${
                          errors.fullName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          value={guestInfo.phone}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="0912345678"
                        />
                        {isCheckingPhone && (
                          <div className="absolute right-2 top-2">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        {existingCustomerData && (
                          <div className="absolute right-2 top-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={guestInfo.email}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="example@gmail.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={guestInfo.address}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md ${
                          errors.address ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="123 Đường ABC"
                      />
                    </div>
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                      Ghi chú (tuỳ chọn)
                    </label>
                    <div className="mt-1">
                      <textarea
                        name="note"
                        id="note"
                        rows={2}
                        value={guestInfo.note}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                        placeholder="Ghi chú cho đơn hàng"
                      />
                    </div>
                    
                    {/* Existing Customer Info */}
                    {existingCustomerData && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                        <h4 className="text-sm font-medium text-blue-800">
                          Thông tin từ đơn hàng trước
                        </h4>
                        <div className="mt-2 text-xs text-blue-700">
                          <p>Tìm thấy {existingCustomerData.total} đơn hàng với số điện thoại này</p>
                          <p>Đơn hàng gần nhất: {new Date(existingCustomerData.lastOrder.createdAt).toLocaleDateString('vi-VN')}</p>
                          <div className="mt-1 flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            <span>Thông tin đã được tự động điền</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isProcessing}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-70"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                'Tiếp tục đặt hàng'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestInfoModal
