import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../../src/components/Layout'
import { useCart } from '../../src/context/CartContext'
import { useAuth } from '../../src/context/AuthContext'
import { Product } from '../../src/types'
import { productsService } from '../../src/services/productsService'
import api from '../../src/utils/api'
import toast from 'react-hot-toast'
import { 
  StarIcon, 
  HeartIcon,
  ShareIcon,
  ShoppingCartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface Review {
  _id: string
  user: {
    name: string
    avatar?: string
  }
  rating: number
  comment: string
  createdAt: string
}

export default function ProductDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { addItem } = useCart()
  const { user } = useAuth()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProduct()
      fetchReviews()
    }
  }, [id])

  useEffect(() => {
    // Check if product is in favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.includes(id))
  }, [id])

  const fetchProduct = async () => {
    try {
      const data: any = await productsService.getProductById(id as string)
      if (data) {
        // Transform data to match expected format
        const transformedProduct = {
          id: data._id || data.id,
          name: data.name,
          price: data.price,
          originalPrice: data.originalPrice,
          image: data.images && data.images.length > 0 
            ? (data.images[0].startsWith('http') 
              ? data.images[0] 
              : `http://localhost:3001/uploads/${data.images[0]}`)
            : 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
          category: data.category,
          description: data.description,
          shortDescription: data.shortDescription,
          brand: data.brand,
          specifications: data.specifications,
          stock: data.stock,
          rating: data.rating || 0,
          reviewCount: data.reviewCount || 0,
          images: data.images || [],
          inStock: (data.stock || 0) > 0
        }
        setProduct(transformedProduct as any)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/product/${id}`)
      if (response.status === 200) {
        const data = response.data
        // Ensure reviews is always an array
        setReviews(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([]) // Set empty array on error
    }
  }

  // Helper function to safely extract category name
  const getCategoryName = (category: any): string => {
    if (typeof category === 'string') return category;
    if (category && typeof category === 'object' && 'name' in category) return category.name;
    return 'Unknown';
  };

  // Check if product is actually in stock
  const isActuallyInStock = (product: Product) => {
    return product.inStock && (product.stock === undefined || product.stock > 0);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!isActuallyInStock(product)) {
      toast.error('Sản phẩm này hiện đã hết hàng!');
      return;
    }

    if (quantity > (product.stock || 0)) {
      toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
      return;
    }
    
    // Convert product to cart item format
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: getCategoryName(product.category)
    }
    
    // Add item quantity times
    let success = true;
    for (let i = 0; i < quantity; i++) {
      const result = await addItem(cartItem);
      if (!result) {
        success = false;
        break;
      }
    }
    
    if (success) {
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    } else {
      toast.error('Không thể thêm vào giỏ hàng. Sản phẩm có thể đã hết hàng!');
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    if (!isActuallyInStock(product)) {
      toast.error('Sản phẩm này hiện đã hết hàng!');
      return;
    }

    if (quantity > (product.stock || 0)) {
      toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
      return;
    }
    
    // Tạo session mua ngay riêng biệt
    const buyNowItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: getCategoryName(product.category),
      quantity: quantity
    };
    
    // Lưu thông tin "mua ngay" vào sessionStorage
    sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    sessionStorage.setItem('isBuyNow', 'true');
    
    // Chuyển thẳng đến checkout
    router.push('/checkout?mode=buynow');
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: string) => fav !== id)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    } else {
      favorites.push(id)
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
    setIsFavorite(!isFavorite)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push('/login')
      return
    }

    setSubmittingReview(true)
    try {
      const response = await api.post('/reviews', {
        product: id,
        rating: newReview.rating,
        comment: newReview.comment
      })

      if (response.status === 200 || response.status === 201) {
        setNewReview({ rating: 5, comment: '' })
        fetchReviews()
        fetchProduct() // Refresh product to update rating
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setSubmittingReview(false)
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

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h2>
            <Link href="/products" className="text-blue-600 hover:text-blue-500">
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-700">Sản phẩm</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-4">
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-24 bg-white rounded-lg overflow-hidden flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 ${
                      selectedImage === index ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-md hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <span className="sr-only">Image {index + 1}</span>
                    <span className="absolute inset-0 rounded-lg overflow-hidden">
                      <Image
                        src={image || '/placeholder-product.jpg'}
                        alt=""
                        fill
                        className="w-full h-full object-center object-cover transition-transform duration-200 hover:scale-110"
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main image */}
            <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
              <Image
                src={product.images?.[selectedImage] || product.image || '/placeholder-product.jpg'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-center object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">{product.name}</h1>
            
            {/* Product badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.isNew && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Mới
                </span>
              )}
              {product.isSale && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Giảm giá
                </span>
              )}
              {product.isHot && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  🔥 Hot
                </span>
              )}
            </div>

            {/* Category navigation */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Danh mục: 
                <Link 
                  href={`/categories?category=${encodeURIComponent(getCategoryName(product.category))}`}
                  className="text-blue-600 hover:text-blue-800 ml-1 hover:underline font-medium"
                >
                  {getCategoryName(product.category)}
                </Link>
              </p>
            </div>

            {/* Stock status */}
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  product && isActuallyInStock(product) ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`text-sm font-medium ${
                  product && isActuallyInStock(product) ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product && isActuallyInStock(product) ? `Còn hàng (${product.stock} sản phẩm)` : 'Hết hàng'}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="sr-only">Product information</h2>
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <p className="text-3xl lg:text-4xl text-red-600 font-bold">
                      {product.price.toLocaleString('vi-VN')}₫
                    </p>
                    {product.originalPrice && (
                      <div className="flex flex-col">
                        <p className="text-lg text-gray-500 line-through">
                          {product.originalPrice.toLocaleString('vi-VN')}₫
                        </p>
                        <p className="text-sm text-green-600 font-semibold">
                          Tiết kiệm {((product.originalPrice - product.price) / product.originalPrice * 100).toFixed(0)}%
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Giá đã bao gồm VAT</p>
                    <p className="text-xs text-gray-500">Miễn phí vận chuyển</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarSolidIcon
                      key={rating}
                      className={`${
                        product.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                      } h-5 w-5 flex-shrink-0`}
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
                <p className="ml-2 text-sm text-gray-500">
                  {product.rating} ({product.reviewCount} đánh giá)
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin cơ bản</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center text-sm">
                  <span className="text-gray-600 w-20">Thương hiệu:</span>
                  <span className="font-medium text-gray-900">{typeof product.brand === 'string' ? product.brand : (product.brand as any)?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-600 w-20">Tình trạng:</span>
                  <span className="font-medium text-green-600">
                    {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-600 w-20">Bảo hành:</span>
                  <span className="font-medium text-gray-900">12 tháng</span>
                </div>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Số lượng:</h3>
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors duration-200"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-semibold min-w-[3rem] text-center">{quantity}</span>
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-r-lg transition-colors duration-200"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 space-y-4">
              {/* Main action buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product || !isActuallyInStock(product)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg py-3 px-6 flex items-center justify-center text-base font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform transition duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  {product && isActuallyInStock(product) ? 'Thêm vào giỏ' : 'Hết hàng'}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={!product || !isActuallyInStock(product)}
                  className="bg-gradient-to-r from-red-600 to-red-700 border border-transparent rounded-lg py-3 px-6 flex items-center justify-center text-base font-medium text-white hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform transition duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {product && isActuallyInStock(product) ? 'Mua ngay' : 'Hết hàng'}
                </button>
              </div>
              
              {/* Secondary action buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={toggleFavorite}
                  className="flex-1 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-red-300 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-400" />
                  )}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                  </span>
                </button>

                <button className="flex-1 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center">
                  <ShareIcon className="h-6 w-6 text-gray-400 hover:text-blue-500" />
                  <span className="ml-2 text-sm font-medium text-gray-700">Chia sẻ</span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center">
                  <TruckIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-sm text-gray-700">Miễn phí vận chuyển cho đơn hàng trên 1.000.000₫</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-500 mr-3" />
                  <span className="text-sm text-gray-700">Bảo hành chính hãng 12 tháng</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-sm text-gray-700">Đổi trả trong 7 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product details tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-t-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50">
              <nav className="flex space-x-0">
                {[
                  { id: 'description', name: 'Mô tả sản phẩm', icon: '📝' },
                  { id: 'specifications', name: 'Thông số kỹ thuật', icon: '⚙️' },
                  { id: 'reviews', name: `Đánh giá (${reviews.length})`, icon: '⭐' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 border-b-2 border-blue-500 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    } flex-1 py-4 px-6 font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-b-xl p-8">
            {activeTab === 'description' && (
              <div className="bg-white">
                <div className="prose max-w-none">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Mô tả chi tiết sản phẩm</h3>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-green-600 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900">Bảo hành chính hãng</h4>
                      <p className="text-sm text-gray-600 mt-1">12 tháng bảo hành toàn cầu</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-blue-600 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900">Miễn phí vận chuyển</h4>
                      <p className="text-sm text-gray-600 mt-1">Đơn hàng trên 1.000.000đ</p>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <div className="text-orange-600 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900">Đổi trả trong 7 ngày</h4>
                      <p className="text-sm text-gray-600 mt-1">Không hài lòng hoàn tiền</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance Specs */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Hiệu năng
                    </h4>
                    <div className="space-y-3">
                      {(product as any).specifications?.cpu && (
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                          <span className="text-sm font-medium text-gray-700">CPU</span>
                          <span className="text-sm text-gray-900 font-semibold">{(product as any).specifications.cpu}</span>
                        </div>
                      )}
                      {(product as any).specifications?.ram && (
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                          <span className="text-sm font-medium text-gray-700">RAM</span>
                          <span className="text-sm text-gray-900 font-semibold">{(product as any).specifications.ram}</span>
                        </div>
                      )}
                      {(product as any).specifications?.storage && (
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                          <span className="text-sm font-medium text-gray-700">Lưu trữ</span>
                          <span className="text-sm text-gray-900 font-semibold">{(product as any).specifications.storage}</span>
                        </div>
                      )}
                      {(product as any).specifications?.gpu && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm font-medium text-gray-700">GPU</span>
                          <span className="text-sm text-gray-900 font-semibold">{(product as any).specifications.gpu}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Display & Design Specs */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clipRule="evenodd" />
                      </svg>
                      Màn hình & Thiết kế
                    </h4>
                    <div className="space-y-3">
                      {(product as any).specifications?.screen && (
                        <div className="flex justify-between items-center py-2 border-b border-green-200">
                          <span className="text-sm font-medium text-gray-700">Màn hình</span>
                          <span className="text-sm text-gray-900 font-semibold">{(product as any).specifications.screen}</span>
                        </div>
                      )}
                      {(product as any).specifications?.screenSize && (
                        <div className="flex justify-between items-center py-2 border-b border-green-200">
                          <span className="text-sm font-medium text-gray-700">Kích thước</span>
                          <span className="text-sm text-gray-900 font-semibold">{(product as any).specifications.screenSize}</span>
                        </div>
                      )}
                      {(product as any).specifications?.resolution && (
                        <div className="flex justify-between items-center py-2 border-b border-green-200">
                          <span className="text-sm font-medium text-gray-700">Độ phân giải</span>
                          <span className="text-sm text-gray-900 font-semibold">{(product as any).specifications.resolution}</span>
                        </div>
                      )}
                      {(product as any).specifications?.weight && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm font-medium text-gray-700">Trọng lượng</span>
                          <span className="text-sm text-gray-900 font-semibold">{(product as any).specifications.weight}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* System & Connectivity */}
                  <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                      Hệ thống & Pin
                    </h4>
                    <div className="space-y-3">
                      {(product as any).specifications?.os && (
                        <div className="flex justify-between items-center py-2 border-b border-purple-200">
                          <span className="text-sm font-medium text-gray-700">Hệ điều hành</span>
                          <span className="text-sm text-gray-900 font-semibold">{(product as any).specifications.os}</span>
                        </div>
                      )}
                      {(product as any).specifications?.battery && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm font-medium text-gray-700">Pin</span>
                          <span className="text-sm text-gray-900 font-semibold">{(product as any).specifications.battery}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features & Connectivity */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      Kết nối & Tính năng
                    </h4>
                    <div className="space-y-3">
                      {(product as any).specifications?.ports && (product as any).specifications.ports.length > 0 && (
                        <div className="py-2 border-b border-orange-200">
                          <span className="text-sm font-medium text-gray-700 block mb-2">Cổng kết nối</span>
                          <div className="flex flex-wrap gap-1">
                            {(product as any).specifications.ports.map((port: string, index: number) => (
                              <span key={index} className="inline-block bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                                {port}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {(product as any).specifications?.features && (product as any).specifications.features.length > 0 && (
                        <div className="py-2">
                          <span className="text-sm font-medium text-gray-700 block mb-2">Tính năng đặc biệt</span>
                          <div className="flex flex-wrap gap-1">
                            {(product as any).specifications.features.map((feature: string, index: number) => (
                              <span key={index} className="inline-block bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Reviews list */}
                <div className="space-y-6 mb-8">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarSolidIcon
                              key={rating}
                              className={`${
                                review.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                              } h-4 w-4 flex-shrink-0`}
                            />
                          ))}
                        </div>
                        <p className="ml-2 text-sm font-medium text-gray-900">{review.user.name}</p>
                        <p className="ml-auto text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Add review form */}
                {user ? (
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-900">Viết đánh giá</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đánh giá của bạn
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating })}
                            className="focus:outline-none"
                          >
                            <StarSolidIcon
                              className={`h-6 w-6 ${
                                rating <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Nhận xét
                      </label>
                      <textarea
                        id="comment"
                        rows={4}
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Đăng nhập để viết đánh giá</p>
                    <Link
                      href="/login"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                      Đăng nhập
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
