import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Layout from '../src/components/Layout'
import { useCart } from '../src/context/CartContext'
import { useAuth } from '../src/context/AuthContext'
import { 
  TrashIcon, 
  MinusIcon, 
  PlusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

// Helper function to safely extract category name from potentially complex objects
const getCategoryName = (category: any): string => {
  if (typeof category === 'string') return category;
  if (category && typeof category === 'object' && 'name' in category) return category.name;
  return 'Unknown';
};

export default function CartPage() {
  const { items, totalPrice, totalItems, updateQuantity, removeItem, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const shippingFee = totalPrice > 1000000 ? 0 : 30000
  const finalTotal = totalPrice + shippingFee - discount

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      const success = await updateQuantity(productId, newQuantity)
      if (!success) {
        alert('Không thể cập nhật số lượng. Sản phẩm có thể đã hết hàng!')
      }
    }
  }

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return
    
    setIsApplyingPromo(true)
    try {
      // TODO: Implement actual promo code validation API
      if (promoCode.toLowerCase() === 'welcome10') {
        setDiscount(totalPrice * 0.1)
        alert('Áp dụng mã giảm giá thành công!')
      } else if (promoCode.toLowerCase() === 'save50k') {
        setDiscount(Math.min(50000, totalPrice * 0.05))
        alert('Áp dụng mã giảm giá thành công!')
      } else {
        alert('Mã giảm giá không hợp lệ')
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi áp dụng mã giảm giá')
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const handleCheckout = () => {
    // Cho phép khách vãng lai đặt hàng - không bắt buộc đăng nhập
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Giỏ hàng trống</h2>
            <p className="mt-2 text-gray-600">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeftIcon className="mr-2 h-5 w-5" />
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-500"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Tiếp tục mua sắm
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          {/* Cart items */}
          <div className="lg:col-span-7">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {items.map((item) => (
                      <li key={item.id} className="py-6 flex">
                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                          <Image
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-center object-cover"
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <Link href={`/products/${item.id}`} className="hover:text-blue-600">
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="ml-4 text-red-600 font-bold">
                                {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.price.toLocaleString('vi-VN')}₫ x {item.quantity}
                            </p>
                                                        <p className="mt-1 text-sm text-gray-500">
                              Danh mục: {getCategoryName(item.category)}
                            </p>
                          </div>
                          
                          <div className="flex-1 flex items-end justify-between text-sm">
                            {/* Quantity controls */}
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-gray-500"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
                              <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-gray-500"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="flex">
                              <button
                                type="button"
                                className="font-medium text-red-600 hover:text-red-500 flex items-center"
                                onClick={() => removeItem(item.id)}
                              >
                                <TrashIcon className="h-4 w-4 mr-1" />
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Clear cart button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="text-sm font-medium text-red-600 hover:text-red-500"
                    onClick={clearCart}
                  >
                    Xóa toàn bộ giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

              {/* Promo code */}
              <div className="mb-6">
                <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-2">
                  Mã giảm giá
                </label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    id="promo-code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromoCode}
                    disabled={isApplyingPromo || !promoCode.trim()}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApplyingPromo ? 'Đang áp dụng...' : 'Áp dụng'}
                  </button>
                </div>
                {discount > 0 && (
                  <div className="mt-2 flex items-center text-green-600">
                    <CheckIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">Đã áp dụng mã giảm giá</span>
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Tạm tính ({totalItems} sản phẩm)</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {totalPrice.toLocaleString('vi-VN')}₫
                  </dd>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Giảm giá</dt>
                    <dd className="text-sm font-medium text-green-600">
                      -{discount.toLocaleString('vi-VN')}₫
                    </dd>
                  </div>
                )}

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

              {/* Shipping notice */}
              {totalPrice < 1000000 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    Mua thêm {(1000000 - totalPrice).toLocaleString('vi-VN')}₫ để được miễn phí vận chuyển!
                  </p>
                </div>
              )}

              {/* Checkout button */}
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500"
                >
                  Tiến hành thanh toán
                </button>
                {!user && (
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    Bạn có thể đặt hàng mà không cần đăng nhập, hoặc{' '}
                    <Link href="/login" className="text-blue-600 hover:text-blue-500">
                      đăng nhập
                    </Link>{' '}
                    để theo dõi đơn hàng dễ dàng hơn
                  </p>
                )}
              </div>

              {/* Security badges */}
              <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span>Thanh toán bảo mật</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span>Đổi trả dễ dàng</span>
                </div>
              </div>

              {/* Payment methods */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Phương thức thanh toán được chấp nhận</h3>
                <div className="flex space-x-2">
                  <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div className="w-8 h-6 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">MC</span>
                  </div>
                  <div className="w-8 h-6 bg-yellow-400 rounded flex items-center justify-center">
                    <span className="text-black text-xs font-bold">₫</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
