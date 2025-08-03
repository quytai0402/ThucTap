import React, { useState, useEffect } from 'react'
import { 
  MapPinIcon, 
  PlusIcon, 
  CheckIcon,
  PencilIcon 
} from '@heroicons/react/24/outline'
import api from '../utils/api'

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

interface SmartAddressSelectorProps {
  onAddressSelect: (address: Address | null) => void
  selectedAddress: Address | null
  userId?: string
  user?: {
    name?: string
    phone?: string
    email?: string
  }
}

const SmartAddressSelector: React.FC<SmartAddressSelectorProps> = ({
  onAddressSelect,
  selectedAddress,
  userId,
  user
}) => {
  const [mode, setMode] = useState<'select' | 'new' | 'replace'>('select')
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [canAddNew, setCanAddNew] = useState(true)
  const [addressCount, setAddressCount] = useState(0)
  const [loading, setLoading] = useState(false)
  
  // New address form states
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  })

  // Update newAddress when user info changes
  useEffect(() => {
    if (user) {
      setNewAddress(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone
      }))
    }
  }, [user])

  // Address to replace when user has max addresses
  const [addressToReplace, setAddressToReplace] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchSavedAddresses()
      checkCanAddAddress()
    } else {
      // For guest users, always show new address form
      setMode('new')
      fetchProvinces()
    }
  }, [userId])

  const fetchSavedAddresses = async () => {
    try {
      const response = await api.get('/addresses/suggestions/for-checkout')
      setSavedAddresses(response.data)
      
      // Auto-select default address if exists
      const defaultAddress = response.data.find((addr: Address) => addr.isDefault)
      if (defaultAddress && !selectedAddress) {
        onAddressSelect(defaultAddress)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const checkCanAddAddress = async () => {
    try {
      const response = await api.get('/addresses/check/can-add')
      setCanAddNew(response.data.canAdd)
      setAddressCount(response.data.currentCount)
    } catch (error) {
      console.error('Error checking address limit:', error)
    }
  }

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
      setWards([])
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
    const province = provinces.find(p => p.code === provinceCode)
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
    const district = districts.find(d => d.code === districtCode)
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
    const ward = wards.find(w => w.code === wardCode)
    setSelectedWard(wardCode)
    setNewAddress(prev => ({ ...prev, ward: ward?.name || '' }))
  }

  const handleSaveNewAddress = async () => {
    if (!userId) {
      // For guest users, just pass the address data
      onAddressSelect(newAddress as Address)
      return
    }

    setLoading(true)
    try {
      let response
      
      if (mode === 'replace' && addressToReplace) {
        // Replace existing address
        response = await api.put(`/addresses/${addressToReplace}/replace`, newAddress)
        onAddressSelect(response.data)
      } else {
        // Try to create new address or update existing
        response = await api.post('/addresses/from-order', newAddress)
        
        if (response.data.error === 'MAX_ADDRESSES_REACHED') {
          // User has max addresses, show replace options
          setSavedAddresses(response.data.suggestions)
          setMode('replace')
          return
        }
        
        onAddressSelect(response.data.address)
      }
      
      // Refresh saved addresses
      fetchSavedAddresses()
      setMode('select')
      resetNewAddressForm()
    } catch (error) {
      console.error('Error saving address:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetNewAddressForm = () => {
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
    setDistricts([])
    setWards([])
  }

  const startNewAddressMode = () => {
    setMode('new')
    fetchProvinces()
    resetNewAddressForm()
  }

  if (!userId) {
    // Guest mode - always show address form
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Thông tin giao hàng</h3>
        {renderAddressForm()}
      </div>
    )
  }

  // User mode
  if (mode === 'select') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Địa chỉ giao hàng</h3>
          {canAddNew && (
            <button
              onClick={startNewAddressMode}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Thêm địa chỉ mới
            </button>
          )}
        </div>

        {savedAddresses.length > 0 ? (
          <div className="space-y-3">
            {savedAddresses.map((address) => (
              <div
                key={address._id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedAddress?._id === address._id
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onAddressSelect(address)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{address.name}</span>
                      {address.isDefault && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Mặc định
                        </span>
                      )}
                      {selectedAddress?._id === address._id && (
                        <CheckIcon className="ml-2 h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                    <p className="text-sm text-gray-600">
                      {address.street}, {address.ward}, {address.district}, {address.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {!canAddNew && (
              <button
                onClick={startNewAddressMode}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
              >
                <PlusIcon className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Sử dụng địa chỉ khác (tối đa 3 địa chỉ)
                </span>
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Chưa có địa chỉ giao hàng nào</p>
            <button
              onClick={startNewAddressMode}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Thêm địa chỉ đầu tiên
            </button>
          </div>
        )}
      </div>
    )
  }

  if (mode === 'replace') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Chọn địa chỉ để thay thế
        </h3>
        <p className="text-sm text-gray-600">
          Bạn đã có tối đa 3 địa chỉ. Vui lòng chọn địa chỉ để thay thế bằng địa chỉ mới.
        </p>
        
        <div className="space-y-3">
          {savedAddresses.map((address) => (
            <div
              key={address._id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                addressToReplace === address._id
                  ? 'border-red-500 bg-red-50 ring-1 ring-red-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setAddressToReplace(address._id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{address.name}</span>
                    {address.isDefault && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Mặc định
                      </span>
                    )}
                    {addressToReplace === address._id && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Sẽ thay thế
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                  <p className="text-sm text-gray-600">
                    {address.street}, {address.ward}, {address.district}, {address.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Địa chỉ mới</h4>
          {renderAddressForm()}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setMode('select')}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveNewAddress}
            disabled={!addressToReplace || loading}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Thay thế địa chỉ'}
          </button>
        </div>
      </div>
    )
  }

  // New address mode
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          {userId ? 'Thêm địa chỉ mới' : 'Thông tin giao hàng'}
        </h3>
        {userId && savedAddresses.length > 0 && (
          <button
            onClick={() => setMode('select')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Chọn địa chỉ đã lưu
          </button>
        )}
      </div>
      
      {renderAddressForm()}
      
      <div className="flex space-x-3">
        {userId && (
          <button
            onClick={() => setMode('select')}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
        )}
        <button
          onClick={handleSaveNewAddress}
          disabled={!isAddressValid() || loading}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Đang lưu...' : userId ? 'Lưu địa chỉ' : 'Sử dụng địa chỉ này'}
        </button>
      </div>
    </div>
  )

  function renderAddressForm() {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên *
            </label>
            <input
              type="text"
              value={newAddress.name}
              onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập họ và tên"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại *
            </label>
            <input
              type="tel"
              value={newAddress.phone}
              onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ cụ thể *
          </label>
          <input
            type="text"
            value={newAddress.street}
            onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Số nhà, tên đường"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tỉnh/Thành phố *
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quận/Huyện *
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phường/Xã *
            </label>
            <select
              value={selectedWard}
              onChange={handleWardChange}
              disabled={wards.length === 0}
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

        {userId && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={newAddress.isDefault}
              onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
              Đặt làm địa chỉ mặc định
            </label>
          </div>
        )}
      </div>
    )
  }

  function isAddressValid() {
    const isValid = (
      newAddress.name.trim() &&
      newAddress.phone.trim() &&
      newAddress.street.trim() &&
      newAddress.ward.trim() &&
      newAddress.district.trim() &&
      newAddress.city.trim()
    )
    
    console.log('🔍 Address validation:', {
      name: !!newAddress.name.trim(),
      phone: !!newAddress.phone.trim(),
      street: !!newAddress.street.trim(),
      ward: !!newAddress.ward.trim(),
      district: !!newAddress.district.trim(),
      city: !!newAddress.city.trim(),
      isValid,
      newAddress
    })
    
    return isValid
  }
}

export default SmartAddressSelector
