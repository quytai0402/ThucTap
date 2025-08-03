import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../src/components/Layout'
import ProductCard from '../../src/components/ProductCard'
import SearchAndFilter, { FilterConfig } from '../../src/components/SearchAndFilter'
import RelatedLinks from '../../src/components/RelatedLinks'
import SearchHelp from '../../src/components/SearchHelp'
import { Product } from '@/types'
import productService from '../../src/services/productService'
import categoriesService from '../../src/services/categoriesService'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const router = useRouter()
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

  const relatedLinks = [
    { title: 'Danh mục sản phẩm', href: '/categories', description: 'Xem tất cả danh mục', icon: '📂' },
    { title: 'Giỏ hàng', href: '/cart', description: 'Xem giỏ hàng hiện tại', icon: '🛒' },
    { title: 'So sánh sản phẩm', href: '/compare', description: 'So sánh các sản phẩm', icon: '⚖️' },
    { title: 'Hỗ trợ mua hàng', href: '/support', description: 'Tư vấn chọn laptop phù hợp', icon: '💬' },
  ];

  return (
    <>
      <Head>
        <title>{`Sản phẩm${searchTerm ? ` - ${searchTerm}` : ''} | IT-Global`}</title>
        <meta name="description" content="Khám phá bộ sưu tập laptop đa dạng từ các thương hiệu hàng đầu. Giá tốt nhất, bảo hành chính hãng." />
      </Head>

      <Layout 
        showBreadcrumb={true}
        breadcrumbs={[
          { label: 'Sản phẩm', href: '/products' },
          ...(searchTerm ? [{ label: `Kết quả: "${searchTerm}"` }] : [])
        ]}
      >
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
            <>
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
              </div>
              <SearchHelp searchTerm={searchTerm} resultCount={products.length} />
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                // Transform product to match ProductCard interface
                const productForCard = {
                  id: product._id || product.id,
                  name: product.name,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  image: product.images?.[0] || product.image || '/images/placeholder-product.jpg',
                  category: product.category,
                  rating: product.rating || 0,
                  reviewCount: product.reviewCount || 0,
                  inStock: product.inStock,
                  stock: product.stock,
                  isNew: product.isNew,
                  isHot: product.isHot
                };
                
                return (
                  <ProductCard 
                    key={product._id || product.id} 
                    product={productForCard} 
                  />
                );
              })}
            </div>
          )}

          {/* Related Links */}
          <div className="mt-12">
            <RelatedLinks links={relatedLinks} />
          </div>
        </div>
      </Layout>
    </>
  )
}
