import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../src/components/Layout'
import categoriesService from '../src/services/categoriesService'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  productCount: number
  isActive: boolean
  sort?: number
}

const getCategoryIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  if (name.includes('gaming') || name.includes('game')) return '🎮';
  if (name.includes('doanh nghiệp') || name.includes('business')) return '💼';
  if (name.includes('sinh viên') || name.includes('student')) return '🎓';
  if (name.includes('văn phòng') || name.includes('office')) return '🏢';
  if (name.includes('phụ kiện') || name.includes('accessories')) return '🔌';
  if (name.includes('macbook') || name.includes('apple')) return '🍎';
  if (name.includes('ultrabook') || name.includes('mỏng')) return '✨';
  if (name.includes('test')) return '🧪';
  return '💻'; // Default laptop icon
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await categoriesService.getCategories({ isActive: true });
      let categoriesData = response.data || response || [];
      
      // Sort categories by sort field and then by name
      categoriesData = categoriesData.sort((a: Category, b: Category) => {
        if (a.sort !== b.sort) {
          return (a.sort || 0) - (b.sort || 0);
        }
        return a.name.localeCompare(b.name);
      });
      
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
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

  return (
    <>
      <Head>
        <title>Danh mục sản phẩm - IT-Global</title>
        <meta name="description" content="Khám phá các danh mục laptop đa dạng tại LaptopStore" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Danh mục sản phẩm
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Tìm kiếm laptop phù hợp với nhu cầu của bạn qua các danh mục đa dạng
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                    <div className="relative overflow-hidden">
                      {/* Background gradient - always visible */}
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-4xl mb-2">{getCategoryIcon(category.name)}</div>
                          <div className="text-lg font-semibold">{category.name}</div>
                        </div>
                      </div>
                      
                      {/* Overlay image if available */}
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="absolute inset-0 w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      )}
                      
                      {/* Product count badge */}
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                        {category.productCount} sản phẩm
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                        <span>Xem sản phẩm</span>
                        <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Danh mục phổ biến
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Những danh mục được khách hàng quan tâm và tìm kiếm nhiều nhất
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories
                .filter(cat => cat.productCount > 0)
                .slice(0, 4)
                .map((category) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category.slug}`}
                  className="group text-center p-6 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                    <div className="text-white text-2xl z-10">{getCategoryIcon(category.name)}</div>
                    {category.image && (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {category.productCount} sản phẩm
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Không tìm thấy danh mục phù hợp?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Hãy liên hệ với chúng tôi để được tư vấn cụ thể
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Liên hệ tư vấn
              </Link>
              <Link
                href="/products"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Categories
