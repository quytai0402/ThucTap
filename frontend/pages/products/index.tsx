import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../src/components/Layout'
import SearchAndFilter, { FilterConfig } from '../../src/components/SearchAndFilter'
import { Product } from '@/types'
import { useCart } from '../../src/context/CartContext'
import productService from '../../src/services/productService'
import categoriesService from '../../src/services/categoriesService'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function ProductsPage() {
  const router = useRouter()
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Record<string, any>>({})

  useEffect(() => {
    // Get initial values from URL query
    const { category, search, brand, minPrice, maxPrice, sort } = router.query;
    
    const initialFilters: Record<string, any> = {};
    if (category && typeof category === 'string') initialFilters.category = category;
    if (brand && typeof brand === 'string') initialFilters.brand = brand;
    if (minPrice && typeof minPrice === 'string') initialFilters.priceRange = { min: Number(minPrice) };
    if (maxPrice && typeof maxPrice === 'string') {
      initialFilters.priceRange = { ...initialFilters.priceRange, max: Number(maxPrice) };
    }
    if (sort && typeof sort === 'string') initialFilters.sort = sort;
    
    setFilters(initialFilters);
    setSearchTerm((search as string) || '');
  }, [router.query]);

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchBrands()
  }, [searchTerm, filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      const searchParams = {
        search: searchTerm || undefined,
        category: filters.category || undefined,
        brand: filters.brand || undefined,
        minPrice: filters.priceRange?.min || undefined,
        maxPrice: filters.priceRange?.max || undefined,
        sortBy: filters.sort || 'name',
        page: 1,
        limit: 20
      }
      
      const response = await productService.getProducts(searchParams)
      const products = response?.data || response?.products || []
      setProducts(products)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const categories = await categoriesService.getCategories()
      setCategories(categories?.data || categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await productService.getBrands()
      setBrands(Array.isArray(response) ? response : (response as any)?.data || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
      setBrands([])
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters)
  }

  const handleReset = () => {
    setSearchTerm('')
    setFilters({})
    router.push('/products', undefined, { shallow: true })
  }

  // Configure filters
  const filterConfigs: FilterConfig[] = [
    {
      key: 'category',
      label: 'Danh mục',
      type: 'select',
      options: categories.map(category => ({
        value: category._id,
        label: category.name,
        count: category.productCount
      }))
    },
    {
      key: 'brand',
      label: 'Thương hiệu',
      type: 'select',
      options: brands.map(brand => ({
        value: brand,
        label: brand
      }))
    },
    {
      key: 'priceRange',
      label: 'Khoảng giá',
      type: 'range',
      min: 0,
      max: 100000000
    },
    {
      key: 'sort',
      label: 'Sắp xếp',
      type: 'select',
      options: [
        { value: 'name', label: 'Tên A-Z' },
        { value: '-name', label: 'Tên Z-A' },
        { value: 'price', label: 'Giá thấp đến cao' },
        { value: '-price', label: 'Giá cao đến thấp' },
        { value: '-createdAt', label: 'Mới nhất' },
        { value: '-rating', label: 'Đánh giá cao nhất' }
      ]
    }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/images/placeholder-product.jpg',
      category: product.category || ''
    })
    
    // Show notification (optional)
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`)
  }

  return (
    <>
      <Head>
        <title>Sản phẩm - LaptopStore</title>
        <meta name="description" content="Khám phá bộ sưu tập laptop đa dạng với giá tốt nhất" />
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Tất cả sản phẩm</h1>
            
            {/* Search and Filter Component */}
            <SearchAndFilter
              searchPlaceholder="Tìm kiếm sản phẩm..."
              filters={filterConfigs}
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              initialValues={{ search: searchTerm, ...filters }}
              compact={true}
              className="mb-6"
            />
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id || product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Product Image */}
                  <Link href={`/products/${product._id || product.id}`}>
                    <div className="aspect-w-1 aspect-h-1 bg-gray-200 cursor-pointer">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg'
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">Chưa có hình ảnh</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <Link href={`/products/${product._id || product.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-red-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Rating */}
                    {product.rating > 0 && (
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-1">
                          ({product.reviewCount || 0})
                        </span>
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}
