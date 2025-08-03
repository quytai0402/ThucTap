import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../src/components/Layout'
import { useCart } from '../src/context/CartContext'
import { useAuth } from '../src/context/AuthContext'
import api from '../src/utils/api'
import { VNPayService } from '../src/services/vnpayService'
import { VNPAY_CONFIG } from '../src/config/vnpay'
import GuestInfoModal, { GuestInfo } from '../src/components/GuestInfoModal'
import SmartAddressSelector from '../src/components/SmartAddressSelector'

// Define Address interface to match SmartAddressSelector
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
import { 
  CreditCardIcon,
  TruckIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline'

interface ShippingAddress {
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

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: any
}

// Bank information for QR code generation
const bankInfo = {
  bankName: 'TECHCOMBANK',
  accountNumber: '1903 7003 894019',
  accountName: 'LAPTOP STORE'
}

// Generate VietQR code URL for banking
const generateQRCodeURL = (amount: number, orderId: string): string => {
  const bankId = 'TCB' // Techcombank
  const accountNo = '8866997979' // Số tài khoản thật của bạn
  const template = 'compact2'
  const description = `Thanh toan don hang ${orderId}`
  
  return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent('TRAN QUY TAI')}`
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  // Buy Now mode state
  const [isBuyNowMode, setIsBuyNowMode] = useState(false)
  const [buyNowItem, setBuyNowItem] = useState<any>(null)

  // Address data - simplified since SmartAddressSelector handles the complex logic
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    provinceCode: '',
    provinceName: '',
    districtCode: '',
    districtName: '',
    wardCode: '',
    wardName: '',
    note: ''
  })
  
  const [selectedPayment, setSelectedPayment] = useState('cod')
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [showQRCode, setShowQRCode] = useState(false)
  const [tempOrderId, setTempOrderId] = useState('')
  const [actualOrderId, setActualOrderId] = useState('') // ID thực từ database
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'confirmed' | 'failed'>('pending')
  const [paymentTimer, setPaymentTimer] = useState(0)
  const [realTimeChecker, setRealTimeChecker] = useState<NodeJS.Timeout | null>(null)
  const [showCreditCardForm, setShowCreditCardForm] = useState(false)
  const [creditCardData, setCreditCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    isValid: false
  })

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng (COD)',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      icon: TruckIcon
    },
    {
      id: 'bank_transfer',
      name: 'Chuyển khoản ngân hàng',
      description: 'Quét mã QR để chuyển khoản nhanh chóng',
      icon: QrCodeIcon
    },
    {
      id: 'credit_card',
      name: 'Thẻ tín dụng/ghi nợ',
      description: 'Visa, Mastercard, JCB',
      icon: CreditCardIcon
    }
  ]

  // Calculate totals based on mode
  const currentItems = isBuyNowMode ? (buyNowItem ? [buyNowItem] : []) : items
  const currentTotalPrice = isBuyNowMode ? (buyNowItem ? buyNowItem.price * buyNowItem.quantity : 0) : totalPrice
  const currentTotalItems = isBuyNowMode ? (buyNowItem ? buyNowItem.quantity : 0) : totalItems

  const shippingFee = currentTotalPrice > 1000000 ? 0 : 30000
  const finalTotal = currentTotalPrice + shippingFee

  // Check for Buy Now mode on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const mode = urlParams.get('mode')
    
    if (mode === 'buynow') {
      const storedBuyNowItem = sessionStorage.getItem('buyNowItem')
      const isBuyNowFlag = sessionStorage.getItem('isBuyNow')
      
      if (storedBuyNowItem && isBuyNowFlag === 'true') {
        setIsBuyNowMode(true)
        setBuyNowItem(JSON.parse(storedBuyNowItem))
      } else {
        // Nếu không có data, redirect về trang chủ
        router.push('/')
      }
    }
  }, [router])

  // Generate stable order ID that persists across reloads
  useEffect(() => {
    // Check if we already have an order ID in session storage
    let savedOrderId = sessionStorage.getItem('checkoutOrderId')
    
    if (!savedOrderId) {
      // Only generate new ID if we don't have one
      const timestamp = Date.now()
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
      savedOrderId = `ORD${timestamp}${randomSuffix}`
      sessionStorage.setItem('checkoutOrderId', savedOrderId)
    }
    
    setTempOrderId(savedOrderId)
  }, [])

  // Clear order ID when component unmounts or order is completed
  useEffect(() => {
    return () => {
      // Clean up intervals when component unmounts
      if (realTimeChecker) {
        clearInterval(realTimeChecker)
      }
    }
  }, [realTimeChecker])

  // State for guest mode
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [guestInfo, setGuestInfo] = useState<ShippingAddress | null>(null)
  
  // Update shipping address if guest info is set
  useEffect(() => {
    if (guestInfo) {
      setShippingAddress(guestInfo)
    }
  }, [guestInfo])

  useEffect(() => {
    // Skip validation if still loading buy now mode
    if (router.query.mode === 'buynow' && !buyNowItem) {
      return
    }
    
    if (currentItems.length === 0) {
      router.push('/cart')
      return
    }
    
    if (!user) {
      // Automatically set guest mode if no user is logged in
      setIsGuestMode(true)
    }
  }, [user, currentItems.length, router, buyNowItem])

  // Realtime payment checking function
  const checkPaymentStatus = async (orderId: string) => {
    try {
      // Call real API to check payment status
      const response = await fetch(`/api/check-payment?orderId=${orderId}`);
      const data = await response.json();
      
      if (data.success && data.isPaid) {
        setPaymentStatus('confirmed')
        setShowQRCode(false)
        stopRealTimeChecker()
        stopPaymentTimer()
        
        // Show success notification
        alert(`🎉 Đã nhận thanh toán ${finalTotal.toLocaleString('vi-VN')}₫!\n✅ Đang chuyển đến trang xác nhận đơn hàng...`)
        
        // Process order and redirect
        try {
          await processOrder(orderId)
          
          // Clear checkout session
          sessionStorage.removeItem('checkoutOrderId')
          
          // Redirect to order-success
          setTimeout(() => {
            router.push(`/order-success?orderId=${orderId}`)
          }, 1500)
          
        } catch (error) {
          console.error('Error processing order:', error)
          alert('❌ Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.')
        }
        
        return true
      }
      
      return false
      
    } catch (error) {
      console.error('Error checking payment:', error)
      
      // Fallback to simulation if API fails
      const timeElapsed = paymentTimer
      let detectionChance = 0.05 // 5% base chance
      
      if (timeElapsed > 30) detectionChance = 0.15 // 15% after 30 seconds
      if (timeElapsed > 60) detectionChance = 0.25 // 25% after 1 minute
      if (timeElapsed > 120) detectionChance = 0.35 // 35% after 2 minutes
      
      const isPaymentDetected = Math.random() < detectionChance
      
      if (isPaymentDetected) {
        setPaymentStatus('confirmed')
        setShowQRCode(false)
        stopRealTimeChecker()
        stopPaymentTimer()
        
        alert(`🎉 Đã nhận thanh toán ${finalTotal.toLocaleString('vi-VN')}₫!\n✅ Đang chuyển đến trang xác nhận đơn hàng...`)
        
        try {
          await processOrder(orderId)
          sessionStorage.removeItem('checkoutOrderId')
          
          setTimeout(() => {
            router.push(`/order-success?orderId=${orderId}`)
          }, 1500)
          
        } catch (error) {
          console.error('Error processing order:', error)
          alert('❌ Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.')
        }
        
        return true
      }
      
      return false
    }
  }

  // Start realtime payment checking
  const startRealTimeChecker = (orderId: string) => {
    // Check every 5 seconds
    const interval = setInterval(async () => {
      if (paymentStatus === 'pending') {
        await checkPaymentStatus(orderId)
      }
    }, 5000)
    
    setRealTimeChecker(interval)
  }

  // Stop realtime checking
  const stopRealTimeChecker = () => {
    if (realTimeChecker) {
      clearInterval(realTimeChecker)
      setRealTimeChecker(null)
    }
  }

  // Handle payment method change
  const handlePaymentMethodChange = (paymentId: string) => {
    setSelectedPayment(paymentId)
    
    if (paymentId === 'bank_transfer') {
      // Show QR code immediately when bank transfer is selected
      setShowQRCode(true)
      setShowCreditCardForm(false)
      setPaymentStatus('pending')
      setPaymentTimer(0)
      startPaymentTimer()
      // Start realtime payment checking
      startRealTimeChecker(actualOrderId || tempOrderId)
    } else if (paymentId === 'credit_card') {
      // Show credit card form when credit card is selected
      setShowCreditCardForm(true)
      setShowQRCode(false)
      setPaymentStatus('pending')
      stopPaymentTimer()
      stopRealTimeChecker()
    } else {
      // Hide both forms for COD
      setShowQRCode(false)
      setShowCreditCardForm(false)
      setPaymentStatus('pending')
      stopPaymentTimer()
      stopRealTimeChecker()
    }
  }

  // Payment timer for auto-checking
  const startPaymentTimer = () => {
    setPaymentTimer(0)
    const interval = setInterval(() => {
      setPaymentTimer(prev => {
        if (prev >= 600) { // 10 minutes timeout (increased from 5)
          setPaymentStatus('failed')
          stopRealTimeChecker()
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 1000)
  }

  const stopPaymentTimer = () => {
    setPaymentTimer(0)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    // For guest mode or when no address is selected, validate shippingAddress
    if (isGuestMode || !selectedAddress) {
      if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên'
      if (!shippingAddress.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại'
      else if (!/^[0-9]{10,11}$/.test(shippingAddress.phone)) newErrors.phone = 'Số điện thoại không hợp lệ'
      if (!shippingAddress.email.trim()) newErrors.email = 'Vui lòng nhập email'
      else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) newErrors.email = 'Email không hợp lệ'
      if (!shippingAddress.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ'
      if (!shippingAddress.provinceCode) newErrors.provinceCode = 'Vui lòng chọn tỉnh/thành phố'
      if (!shippingAddress.districtCode) newErrors.districtCode = 'Vui lòng chọn quận/huyện'
      if (!shippingAddress.wardCode) newErrors.wardCode = 'Vui lòng chọn phường/xã'
    } else {
      // For authenticated users with selected address, validate selectedAddress
      if (!selectedAddress.name?.trim()) newErrors.fullName = 'Vui lòng chọn hoặc thêm địa chỉ giao hàng'
      if (!selectedAddress.phone?.trim()) newErrors.phone = 'Địa chỉ được chọn thiếu số điện thoại'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form for both guest and authenticated users
    if (!validateForm()) return

    setIsProcessing(true)
    try {
      // Ensure we have a tempOrderId
      let currentOrderId = tempOrderId;
      if (!currentOrderId) {
        const timestamp = Date.now()
        const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
        currentOrderId = `ORD${timestamp}${randomSuffix}`
        setTempOrderId(currentOrderId)
        sessionStorage.setItem('checkoutOrderId', currentOrderId)
      }

      // Logic flow mới:
      // 1. COD: Tạo order trực tiếp với status PENDING
      // 2. Bank Transfer: Tạo order với status PENDING, hiển thị thông tin chuyển khoản
      // 3. Credit Card: Xử lý payment trước, nếu thành công thì tạo order với status PAID
      
      if (selectedPayment === 'credit_card') {
        // Xử lý thanh toán thẻ tín dụng trước
        if (!creditCardData.isValid) {
          alert('Vui lòng nhập đầy đủ thông tin thẻ tín dụng hợp lệ')
          setIsProcessing(false)
          return
        }
        
        // Process credit card payment first
        await processCreditCardPayment()
        return // processCreditCardPayment đã handle tạo order
      } else {
        // Cho COD và Bank Transfer: tạo order với payment status = PENDING
        const createdOrder = await processOrder(currentOrderId)
        
        // Nếu là bank transfer, hiển thị thông tin chuyển khoản với actual order ID
        if (selectedPayment === 'bank_transfer' && actualOrderId) {
          setShowQRCode(true)
          startRealTimeChecker(actualOrderId) // Dùng actual order ID
        }
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.')
      setIsProcessing(false)
    }
  }

  const handleGuestInfoSubmit = (info: GuestInfo) => {
    setGuestInfo(info)
    setShowGuestModal(false)
  }
  
  const processOrder = async (orderId: string) => {
    try {
      // Determine which address to use
      let addressToUse;
      if (selectedAddress && !isGuestMode) {
        // Use selected saved address for authenticated users
        addressToUse = {
          fullName: selectedAddress.name,
          phone: selectedAddress.phone,
          email: user?.email || '',
          address: selectedAddress.street,
          ward: selectedAddress.ward,
          district: selectedAddress.district,
          city: selectedAddress.city,
          fullAddress: `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}`,
          note: ''
        }
      } else {
        // Use manual input address for guest users or when no address selected
        addressToUse = {
          ...shippingAddress,
          fullAddress: `${shippingAddress.address}, ${shippingAddress.wardName}, ${shippingAddress.districtName}, ${shippingAddress.provinceName}`
        }
      }

      const orderData = {
        orderId,
        items: currentItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: addressToUse,
        paymentMethod: selectedPayment,
        total: finalTotal,
        shippingFee,
        note: addressToUse.note || shippingAddress.note,
        isGuestOrder: isGuestMode
      }

      // For all orders, use the API route to handle both guest and authenticated users
      let order;
      try {
        console.log('Sending order data:', orderData);
        
        const result = await fetch('/api/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });
        
        if (!result.ok) {
          const errorData = await result.json();
          console.error('Order creation failed:', errorData);
          throw new Error(`Đặt hàng thất bại: ${errorData.message || 'Lỗi không xác định'}`);
        }
        
        order = await result.json();
        console.log('Order created successfully:', order);
        
        if (!order || !order._id) {
          console.error('Order created but missing ID:', order);
          throw new Error('Đơn hàng được tạo nhưng không có ID');
        }

        // Lưu actual order ID từ database (dùng orderNumber cho đồng bộ)
        setActualOrderId(order.orderNumber || order._id)
        console.log('✅ Actual Order ID set:', order.orderNumber || order._id)
        
        // Auto-save address for authenticated users on first order
        if (!isGuestMode && user && !selectedAddress && shippingAddress.fullName) {
          try {
            const saveAddressData = {
              name: shippingAddress.fullName,
              phone: shippingAddress.phone,
              street: shippingAddress.address,
              ward: shippingAddress.wardName,
              district: shippingAddress.districtName,
              city: shippingAddress.provinceName,
              isDefault: true
            }
            
            await api.post('/addresses', saveAddressData)
            console.log('✅ Địa chỉ đã được tự động lưu')
          } catch (addressError) {
            console.warn('⚠️ Không thể lưu địa chỉ tự động:', addressError)
            // Don't fail the order if address saving fails
          }
        }
        
        // Clear cart only if order was successfully created and not in buy now mode
        if (!isBuyNowMode) {
          clearCart();
        } else {
          // Clear buy now session data
          sessionStorage.removeItem('buyNowItem');
          sessionStorage.removeItem('isBuyNow');
        }
        
        // Redirect to success page with the order ID
        const orderIdToUse = order._id || orderId;
        console.log('Redirecting to success page with orderId:', orderIdToUse);
        
        router.push(`/order-success?orderId=${orderIdToUse}`);
      } catch (error: any) {
        console.error('Error in order processing:', error);
        alert(`Có lỗi xảy ra khi đặt hàng: ${error.message || 'Lỗi không xác định'}`);
        throw error; // Re-throw to allow the caller to handle it
      }
    } catch (error) {
      console.error('Error processing order:', error)
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.')
    } finally {
      setIsProcessing(false)
      // Clear the session order ID after successful order
      sessionStorage.removeItem('checkoutOrderId')
    }
  }

  const handleConfirmPayment = async () => {
    // Mark payment as confirmed
    setPaymentStatus('confirmed')
    setShowQRCode(false)
    stopPaymentTimer()
    stopRealTimeChecker()
    
    try {
      // Process the order first
      await processOrder(tempOrderId)
      
      // Clear checkout session
      sessionStorage.removeItem('checkoutOrderId')
      
      // Redirect to order-success
      router.push(`/order-success?orderId=${actualOrderId || tempOrderId}`)
      
    } catch (error) {
      console.error('Error processing order:', error)
      alert('❌ Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.')
      setPaymentStatus('pending')
    }
  }

  const handleCancelPayment = () => {
    setShowQRCode(false)
    setSelectedPayment('cod') // Switch back to COD
    setPaymentStatus('pending')
    stopPaymentTimer()
    stopRealTimeChecker()
  }

  const simulatePaymentCheck = async () => {
    setPaymentStatus('checking')
    
    // Call the realtime checker manually
    const paymentDetected = await checkPaymentStatus(actualOrderId || tempOrderId)
    
    if (!paymentDetected) {
      setPaymentStatus('pending')
      alert('⏳ Chưa phát hiện thanh toán. Hệ thống sẽ tiếp tục tự động kiểm tra.')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Credit Card Functions
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const detectCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '')
    
    // Visa: starts with 4
    if (/^4/.test(number)) return 'visa'
    
    // Mastercard: starts with 5 or 2221-2720
    if (/^5[1-5]/.test(number) || /^2(2(2[1-9]|[3-9])|[3-6]|7(0|1|20))/.test(number)) return 'mastercard'
    
    // JCB: starts with 35
    if (/^35/.test(number)) return 'jcb'
    
    return 'unknown'
  }

  const validateCardNumber = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '')
    if (number.length < 13 || number.length > 19) return false
    
    // Luhn algorithm
    let sum = 0
    let alternate = false
    
    for (let i = number.length - 1; i >= 0; i--) {
      let n = parseInt(number.charAt(i), 10)
      
      if (alternate) {
        n *= 2
        if (n > 9) {
          n = (n % 10) + 1
        }
      }
      
      sum += n
      alternate = !alternate
    }
    
    return (sum % 10) === 0
  }

  const validateExpiryDate = (expiryDate: string) => {
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false
    
    const [month, year] = expiryDate.split('/').map(num => parseInt(num, 10))
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    
    if (month < 1 || month > 12) return false
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false
    
    return true
  }

  const handleCreditCardChange = (field: string, value: string) => {
    let formattedValue = value
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4)
    }
    
    const newCreditCardData = {
      ...creditCardData,
      [field]: formattedValue
    }
    
    // Validate form
    const isCardNumberValid = validateCardNumber(newCreditCardData.cardNumber)
    const isExpiryValid = validateExpiryDate(newCreditCardData.expiryDate)
    const isCvvValid = newCreditCardData.cvv.length >= 3
    const isNameValid = newCreditCardData.cardholderName.trim().length >= 2
    
    newCreditCardData.isValid = isCardNumberValid && isExpiryValid && isCvvValid && isNameValid
    
    setCreditCardData(newCreditCardData)
  }

  const processCreditCardPayment = async () => {
    setIsProcessing(true)
    
    try {
      // Validate card trước khi gửi đến VNPay
      const isCardValid = validateCardNumber(creditCardData.cardNumber) && 
                          validateExpiryDate(creditCardData.expiryDate) &&
                          creditCardData.cvv.length >= 3 &&
                          creditCardData.cardholderName.trim().length > 0

      if (!isCardValid) {
        alert('❌ Thông tin thẻ không hợp lệ. Vui lòng kiểm tra lại.')
        setIsProcessing(false)
        return
      }

      // Xác định loại thẻ để gửi đến VNPay
      const cardType = detectCardType(creditCardData.cardNumber)
      let vnpayCardType: 'VISA' | 'MASTERCARD' | 'JCB'
      
      switch (cardType) {
        case 'visa':
          vnpayCardType = 'VISA'
          break
        case 'mastercard':
          vnpayCardType = 'MASTERCARD'
          break
        case 'jcb':
          vnpayCardType = 'JCB'
          break
        default:
          alert('❌ Loại thẻ không được hỗ trợ. Chỉ chấp nhận Visa, Mastercard, JCB.')
          setIsProcessing(false)
          return
      }

      console.log('🚀 THANH TOÁN THẬT VỚI VNPAY!')
      console.log('Order ID:', tempOrderId)
      console.log('Amount:', finalTotal)
      console.log('Card Type:', vnpayCardType)

      // Tạo URL thanh toán VNPay
      const vnpayUrl = VNPayService.createCreditCardPayment(
        tempOrderId,
        finalTotal,
        vnpayCardType
      )

      console.log('VNPay URL:', vnpayUrl)

      // Lưu thông tin đơn hàng trước khi chuyển hướng
      await saveOrderBeforePayment()

      // Chuyển hướng đến VNPay
      window.location.href = vnpayUrl

    } catch (error) {
      console.error('VNPay payment error:', error)
      alert('❌ Có lỗi khi khởi tạo thanh toán. Vui lòng thử lại.')
      setIsProcessing(false)
    }
  }

  // Lưu đơn hàng với trạng thái pending trước khi thanh toán
  const saveOrderBeforePayment = async () => {
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        shippingAddress,
        paymentMethod: 'vnpay_credit_card',
        subtotal: totalPrice,
        shippingFee,
        total: finalTotal,
        status: 'pending_payment', // Đợi thanh toán
        orderId: tempOrderId
      }

      const response = await api.post('/orders', orderData)
      
      if (!response.data.success) {
        throw new Error('Failed to create order')
      }

      console.log('✅ Đơn hàng đã được lưu với trạng thái pending_payment')
      
    } catch (error) {
      console.error('Error saving order:', error)
      throw error
    }
  }

  if (currentItems.length === 0) {
    return <Layout><div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div></Layout>
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Buy Now Mode Banner */}
        {isBuyNowMode && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Mua ngay:</strong> Bạn đang thanh toán trực tiếp cho sản phẩm này, không ảnh hưởng đến giỏ hàng hiện tại.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
            {isBuyNowMode && (
              <button
                onClick={() => {
                  sessionStorage.removeItem('buyNowItem');
                  sessionStorage.removeItem('isBuyNow');
                  router.back();
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Quay lại sản phẩm
              </button>
            )}
          </div>
          
          {isGuestMode && (
            <div className="mt-2 bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    🛒 <strong>Đặt hàng không cần đăng nhập:</strong> Bạn có thể đặt hàng ngay lập tức mà không cần tạo tài khoản. Chỉ cần điền thông tin giao hàng bên dưới.
                  </p>
                  <p className="mt-3 text-sm md:mt-0 md:ml-6">
                    <Link 
                      href="/login?redirect=/checkout" 
                      className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                    >
                      Hoặc đăng nhập để theo dõi đơn hàng
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
            <Link href="/cart" className="hover:text-gray-700">Giỏ hàng</Link>
            <span>/</span>
            <span className="text-gray-900">Thanh toán</span>
          </nav>
        </div>

        <form onSubmit={handleSubmitOrder} className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          {/* Shipping & Payment Info */}
          <div className="lg:col-span-7">
            {/* Smart Address Selector */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <MapPinIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Địa chỉ giao hàng</h2>
                </div>
                
                {/* Smart Address Selector Component */}
                <SmartAddressSelector
                  userId={user?.id}
                  user={user ? {
                    name: user.name,
                    phone: user.phone,
                    email: user.email
                  } : undefined}
                  onAddressSelect={(address: Address | null) => {
                    setSelectedAddress(address)
                    // Convert address format for compatibility with existing shippingAddress state
                    if (address) {
                      setShippingAddress({
                        fullName: address.name || user?.name || '',
                        phone: address.phone || user?.phone || '',
                        email: user?.email || '',
                        address: address.street || '',
                        provinceCode: '',
                        provinceName: address.city || '',
                        districtCode: '',
                        districtName: address.district || '',
                        wardCode: '',
                        wardName: address.ward || '',
                        note: ''
                      })
                    }
                  }}
                  selectedAddress={selectedAddress}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Phương thức thanh toán</h2>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center">
                      <input
                        id={method.id}
                        name="payment-method"
                        type="radio"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor={method.id} className="ml-3 flex items-center cursor-pointer flex-1">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                        </div>
                        {method.id === 'bank_transfer' && paymentStatus === 'confirmed' && (
                          <div className="ml-2 flex items-center text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-xs font-medium">Đã thanh toán</span>
                          </div>
                        )}
                        {method.id === 'credit_card' && creditCardData.isValid && (
                          <div className="ml-2 flex items-center text-blue-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-xs font-medium">Thẻ hợp lệ</span>
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                {isBuyNowMode ? 'Mua ngay' : 'Đơn hàng của bạn'}
              </h2>

              {/* Order items */}
              <div className="flow-root mb-6">
                <ul className="-my-4 divide-y divide-gray-200">
                  {currentItems.map((item) => (
                    <li key={item.id} className="py-4 flex">
                      <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                        <Image
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="ml-4 text-sm font-medium text-gray-900">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Tạm tính ({currentTotalItems} sản phẩm)</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {currentTotalPrice.toLocaleString('vi-VN')}₫
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Phí vận chuyển</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      `${shippingFee.toLocaleString('vi-VN')}₫`
                    )}
                  </dd>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <dt className="text-base font-medium text-gray-900">Tổng cộng</dt>
                  <dd className="text-base font-medium text-red-600">
                    {finalTotal.toLocaleString('vi-VN')}₫
                  </dd>
                </div>
              </div>

              {/* Place order button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isProcessing || (selectedPayment === 'bank_transfer' && paymentStatus !== 'confirmed') || (selectedPayment === 'credit_card' && !creditCardData.isValid)}
                  className={`w-full border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                    (selectedPayment === 'bank_transfer' && paymentStatus !== 'confirmed') || (selectedPayment === 'credit_card' && !creditCardData.isValid)
                      ? 'bg-gray-400 hover:bg-gray-400 focus:ring-gray-400'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {selectedPayment === 'credit_card' ? 'Đang xử lý thanh toán...' : 'Đang xử lý...'}
                    </div>
                  ) : selectedPayment === 'bank_transfer' && paymentStatus !== 'confirmed' ? (
                    'Vui lòng hoàn tất thanh toán'
                  ) : selectedPayment === 'bank_transfer' && paymentStatus === 'confirmed' ? (
                    'Hoàn tất đặt hàng'
                  ) : selectedPayment === 'credit_card' && !creditCardData.isValid ? (
                    'Vui lòng nhập thông tin thẻ'
                  ) : selectedPayment === 'credit_card' ? (
                    'Thanh toán & Đặt hàng'
                  ) : (
                    'Đặt hàng'
                  )}
                </button>
              </div>

              {/* Security notice */}
              <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Thông tin của bạn được bảo mật</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Thanh toán QR Code
                </h3>
                <div className="flex items-center space-x-3">
                  {realTimeChecker && paymentStatus === 'pending' && (
                    <div className="flex items-center bg-white bg-opacity-20 rounded-full px-2 py-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs font-medium">Live</span>
                    </div>
                  )}
                  <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1">
                    <span className="text-sm font-medium">{formatTime(paymentTimer)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Payment Status */}
              <div className="mb-6">
                {paymentStatus === 'pending' && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-yellow-800 font-medium">Đang chờ thanh toán</span>
                    </div>
                  </div>
                )}
                {paymentStatus === 'checking' && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span className="text-blue-800 font-medium">Đang kiểm tra thanh toán...</span>
                    </div>
                  </div>
                )}
                {paymentStatus === 'confirmed' && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-green-800 font-medium">Thanh toán thành công!</span>
                    </div>
                  </div>
                )}
                {paymentStatus === 'failed' && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                      <span className="text-red-800 font-medium">Hết thời gian thanh toán</span>
                    </div>
                  </div>
                )}
              </div>

              {/* QR Code */}
              <div className="text-center mb-6">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-inner inline-block">
                  <img
                    src={generateQRCodeURL(finalTotal, actualOrderId || tempOrderId)}
                    alt="QR Code thanh toán"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-3 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <p className="text-2xl font-bold text-red-600">
                      {finalTotal.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Mã đơn hàng: <span className="font-mono font-semibold">{actualOrderId || tempOrderId}</span>
                  </p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngân hàng:</span>
                      <span className="font-semibold text-gray-900">Techcombank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số TK:</span>
                      <span className="font-mono font-semibold text-gray-900">8866997979</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chủ TK:</span>
                      <span className="font-semibold text-gray-900">TRAN QUY TAI</span>
                    </div>
                    <div className="pt-2 border-t border-gray-300">
                      <span className="text-gray-600">Nội dung CK:</span>
                      <p className="font-mono text-sm bg-yellow-50 p-2 rounded mt-1 break-words">
                        Thanh toan don hang {actualOrderId || tempOrderId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                {paymentStatus === 'pending' && (
                  <button
                    onClick={simulatePaymentCheck}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
                  >
                    Kiểm tra thanh toán
                  </button>
                )}
                
                {paymentStatus === 'confirmed' && (
                  <button
                    onClick={handleConfirmPayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
                  >
                    Xác nhận & Đóng
                  </button>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleCancelPayment}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
                  >
                    Hủy
                  </button>
                  {paymentStatus === 'pending' && (
                    <button
                      onClick={handleConfirmPayment}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
                    >
                      Đã chuyển
                    </button>
                  )}
                </div>
              </div>

              {/* Auto-refresh notice */}
              {paymentStatus === 'pending' && realTimeChecker && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center text-blue-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-xs">
                      Hệ thống đang tự động kiểm tra thanh toán mỗi 5 giây...
                    </span>
                  </div>
                </div>
              )}
              
              {paymentStatus === 'pending' && !realTimeChecker && (
                <p className="mt-4 text-xs text-center text-gray-400">
                  Hệ thống sẽ tự động kiểm tra thanh toán sau khi bạn chuyển khoản
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Credit Card Form Modal */}
      {showCreditCardForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Thanh toán thẻ tín dụng
                </h3>
                <div className="flex items-center space-x-2">
                  {detectCardType(creditCardData.cardNumber) === 'visa' && (
                    <div className="bg-white text-blue-600 px-2 py-1 rounded text-xs font-bold">VISA</div>
                  )}
                  {detectCardType(creditCardData.cardNumber) === 'mastercard' && (
                    <div className="bg-white text-red-600 px-2 py-1 rounded text-xs font-bold">MC</div>
                  )}
                  {detectCardType(creditCardData.cardNumber) === 'jcb' && (
                    <div className="bg-white text-green-600 px-2 py-1 rounded text-xs font-bold">JCB</div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Card Number */}
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Số thẻ *
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={creditCardData.cardNumber}
                  onChange={(e) => handleCreditCardChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono ${
                    creditCardData.cardNumber && !validateCardNumber(creditCardData.cardNumber)
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                {creditCardData.cardNumber && !validateCardNumber(creditCardData.cardNumber) && (
                  <p className="text-red-500 text-xs mt-1">Số thẻ không hợp lệ</p>
                )}
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày hết hạn *
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={creditCardData.expiryDate}
                    onChange={(e) => handleCreditCardChange('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
                      creditCardData.expiryDate && !validateExpiryDate(creditCardData.expiryDate)
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={creditCardData.cvv}
                    onChange={(e) => handleCreditCardChange('cvv', e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
                      creditCardData.cvv && creditCardData.cvv.length < 3
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="mb-6">
                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên chủ thẻ *
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  value={creditCardData.cardholderName}
                  onChange={(e) => handleCreditCardChange('cardholderName', e.target.value)}
                  placeholder="TRAN QUY TAI"
                  className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase ${
                    creditCardData.cardholderName && creditCardData.cardholderName.trim().length < 2
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Amount Display */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số tiền thanh toán:</span>
                  <span className="text-2xl font-bold text-red-600">
                    {finalTotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Mã đơn hàng: <span className="font-mono">{actualOrderId || tempOrderId}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreditCardForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={processCreditCardPayment}
                  disabled={!creditCardData.isValid || isProcessing}
                  className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ${
                    creditCardData.isValid && !isProcessing
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
                </button>
              </div>

              {/* Security Notice */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5"></div>
                  <div className="text-xs">
                    <p className="font-medium">Bảo mật SSL 256-bit</p>
                    <p>Thông tin thẻ được mã hóa và bảo mật tuyệt đối</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Guest Info Modal */}
      <GuestInfoModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        onSubmit={handleGuestInfoSubmit}
        isProcessing={isProcessing}
      />
    </Layout>
  )
}
