import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../src/components/Layout'
import { 
  CalendarIcon, 
  UserIcon, 
  EyeIcon,
  TagIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

const News: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Tất cả', count: 24 },
    { id: 'reviews', name: 'Đánh giá', count: 8 },
    { id: 'news', name: 'Tin tức', count: 6 },
    { id: 'guides', name: 'Hướng dẫn', count: 5 },
    { id: 'promotions', name: 'Khuyến mãi', count: 3 },
    { id: 'events', name: 'Sự kiện', count: 2 }
  ]

  const featuredArticles = [
    {
      id: 1,
      title: 'MacBook Pro M3 2024: Đánh giá chi tiết hiệu năng và tính năng mới',
      excerpt: 'Apple vừa ra mắt MacBook Pro M3 với nhiều cải tiến đáng chú ý về hiệu năng và thời lượng pin. Cùng tìm hiểu chi tiết...',
      image: '/images/news/macbook-m3.jpg',
      category: 'reviews',
      categoryName: 'Đánh giá',
      author: 'Nguyễn Văn A',
      publishDate: '2024-12-20',
      readTime: '8 phút đọc',
      views: 1250,
      featured: true
    },
    {
      id: 2,
      title: 'Top 10 laptop gaming tốt nhất năm 2024 dưới 30 triệu',
      excerpt: 'Danh sách những chiếc laptop gaming có hiệu năng tốt nhất trong tầm giá dưới 30 triệu đồng...',
      image: '/images/news/gaming-laptops.jpg',
      category: 'guides',
      categoryName: 'Hướng dẫn',
      author: 'Trần Thị B',
      publishDate: '2024-12-18',
      readTime: '12 phút đọc',
      views: 2100,
      featured: true
    }
  ]

  const articles = [
    {
      id: 3,
      title: 'Cách chọn laptop phù hợp cho sinh viên năm 2024',
      excerpt: 'Hướng dẫn chi tiết giúp sinh viên chọn được chiếc laptop phù hợp với nhu cầu học tập và ngân sách...',
      image: '/images/news/student-laptop.jpg',
      category: 'guides',
      categoryName: 'Hướng dẫn',
      author: 'Phạm Văn C',
      publishDate: '2024-12-15',
      readTime: '6 phút đọc',
      views: 890
    },
    {
      id: 4,
      title: 'Intel Core i7-14700H vs AMD Ryzen 7 7840HS: Cuộc đua hiệu năng',
      excerpt: 'So sánh chi tiết hiệu năng giữa hai dòng CPU laptop hàng đầu từ Intel và AMD...',
      image: '/images/news/cpu-comparison.jpg',
      category: 'reviews',
      categoryName: 'Đánh giá',
      author: 'Lê Thị D',
      publishDate: '2024-12-12',
      readTime: '10 phút đọc',
      views: 1540
    },
    {
      id: 5,
      title: 'Khuyến mãi cuối năm: Giảm giá đến 30% cho laptop Dell XPS',
      excerpt: 'Chương trình khuyến mãi hấp dẫn từ Dell với mức giảm giá lên đến 30% cho dòng XPS...',
      image: '/images/news/dell-promotion.jpg',
      category: 'promotions',
      categoryName: 'Khuyến mãi',
      author: 'Hoàng Văn E',
      publishDate: '2024-12-10',
      readTime: '3 phút đọc',
      views: 650
    },
    {
      id: 6,
      title: 'Hướng dẫn tối ưu Windows 11 cho laptop hiệu năng tốt nhất',
      excerpt: 'Những tips và tricks giúp tối ưu hóa Windows 11 để laptop chạy mượt mà và tiết kiệm pin...',
      image: '/images/news/windows-optimization.jpg',
      category: 'guides',
      categoryName: 'Hướng dẫn',
      author: 'Ngô Thị F',
      publishDate: '2024-12-08',
      readTime: '15 phút đọc',
      views: 1120
    },
    {
      id: 7,
      title: 'ASUS ra mắt ROG Strix G16: Gaming laptop với RTX 4060',
      excerpt: 'ASUS vừa công bố dòng ROG Strix G16 mới với card đồ họa RTX 4060 và nhiều cải tiến...',
      image: '/images/news/asus-rog.jpg',
      category: 'news',
      categoryName: 'Tin tức',
      author: 'Đỗ Văn G',
      publishDate: '2024-12-05',
      readTime: '7 phút đọc',
      views: 980
    },
    {
      id: 8,
      title: 'Sự kiện Tech Expo 2024: Triển lãm công nghệ lớn nhất Việt Nam',
      excerpt: 'Tech Expo 2024 sẽ diễn ra từ 15-17/12 tại TP.HCM với sự tham gia của nhiều thương hiệu...',
      image: '/images/news/tech-expo.jpg',
      category: 'events',
      categoryName: 'Sự kiện',
      author: 'Bùi Thị H',
      publishDate: '2024-12-03',
      readTime: '5 phút đọc',
      views: 450
    }
  ]

  const trendingTags = [
    'MacBook M3', 'Gaming Laptop', 'RTX 4060', 'Intel 14th Gen', 
    'AMD Ryzen 7000', 'Windows 11', 'SSD NVMe', 'Dell XPS'
  ]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Head>
        <title>Tin tức công nghệ - LaptopStore</title>
        <meta name="description" content="Cập nhật tin tức mới nhất về laptop, công nghệ, đánh giá sản phẩm và hướng dẫn từ LaptopStore" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Tin tức công nghệ
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Cập nhật những tin tức mới nhất về laptop, công nghệ và đánh giá sản phẩm
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 pl-12 text-gray-900 rounded-full focus:outline-none focus:ring-4 focus:ring-white/30"
                  />
                  <MagnifyingGlassIcon className="absolute left-4 top-4.5 h-6 w-6 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories */}
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh mục</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Tags */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thẻ phổ biến</h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Articles */}
              {searchTerm === '' && selectedCategory === 'all' && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết nổi bật</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredArticles.map((article) => (
                      <Link key={article.id} href={`/news/${article.id}`}>
                        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                          <div className="relative h-48">
                            <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                              <span className="text-gray-500">Image {article.id}</span>
                            </div>
                            <div className="absolute top-4 left-4">
                              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {article.categoryName}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <UserIcon className="h-4 w-4 mr-1" />
                                  {article.author}
                                </div>
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  {new Date(article.publishDate).toLocaleDateString('vi-VN')}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <EyeIcon className="h-4 w-4 mr-1" />
                                {article.views}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All Articles */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {searchTerm ? `Kết quả tìm kiếm cho "${searchTerm}"` : 'Tất cả bài viết'}
                  </h2>
                  <span className="text-gray-500">
                    {filteredArticles.length} bài viết
                  </span>
                </div>

                <div className="space-y-6">
                  {filteredArticles.map((article) => (
                    <Link key={article.id} href={`/news/${article.id}`}>
                      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-64 flex-shrink-0">
                            <div className="w-full h-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500">Image {article.id}</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mr-3">
                                {article.categoryName}
                              </span>
                              <span className="text-sm text-gray-500">{article.readTime}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                              {article.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <UserIcon className="h-4 w-4 mr-1" />
                                  {article.author}
                                </div>
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  {new Date(article.publishDate).toLocaleDateString('vi-VN')}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <EyeIcon className="h-4 w-4 mr-1" />
                                  {article.views}
                                </div>
                                <ChevronRightIcon className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Không tìm thấy bài viết nào
                    </h3>
                    <p className="text-gray-600">
                      Thử tìm kiếm với từ khóa khác hoặc xem tất cả bài viết
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {filteredArticles.length > 0 && (
                  <div className="flex items-center justify-center mt-12">
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
                        Trước
                      </button>
                      <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded">
                        1
                      </button>
                      <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                        2
                      </button>
                      <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                        3
                      </button>
                      <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                        Sau
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Đăng ký nhận tin tức
            </h2>
            <p className="text-gray-600 mb-8">
              Nhận những bài viết mới nhất về công nghệ và laptop qua email
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default News
