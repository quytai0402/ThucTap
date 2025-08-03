import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../src/components/Layout'
import { 
  MapIcon,
  HomeIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  PhoneIcon,
  NewspaperIcon,
  QuestionMarkCircleIcon,
  TruckIcon,
  ArrowPathIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const Sitemap: React.FC = () => {
  const sitemapSections = [
    {
      title: 'Trang chủ',
      icon: HomeIcon,
      links: [
        { name: 'Trang chủ', url: '/', description: 'Trang chủ IT-Global' }
      ]
    },
    {
      title: 'Sản phẩm',
      icon: ComputerDesktopIcon,
      links: [
        { name: 'Tất cả sản phẩm', url: '/products', description: 'Danh sách tất cả laptop' },
        { name: 'Danh mục sản phẩm', url: '/categories', description: 'Phân loại theo thương hiệu' },
        { name: 'Giỏ hàng', url: '/cart', description: 'Quản lý giỏ hàng' },
        { name: 'Thanh toán', url: '/checkout', description: 'Tiến hành thanh toán' },
        { name: 'Xử lý thanh toán', url: '/payment', description: 'Trang xử lý thanh toán' },
        { name: 'Kết quả thanh toán', url: '/payment-return', description: 'Kết quả giao dịch' }
      ]
    },
    {
      title: 'Tài khoản người dùng',
      icon: UserIcon,
      links: [
        { name: 'Đăng nhập', url: '/login', description: 'Đăng nhập tài khoản' },
        { name: 'Đăng ký', url: '/register', description: 'Tạo tài khoản mới' },
        { name: 'Quên mật khẩu', url: '/forgot-password', description: 'Khôi phục mật khẩu' },
        { name: 'Đặt lại mật khẩu', url: '/reset-password', description: 'Đặt lại mật khẩu mới' },
        { name: 'Hồ sơ cá nhân', url: '/profile', description: 'Quản lý thông tin cá nhân' },
        { name: 'Đơn hàng của tôi', url: '/profile/orders', description: 'Theo dõi đơn hàng' },
        { name: 'Đơn hàng', url: '/orders', description: 'Danh sách đơn hàng' },
        { name: 'Thành công', url: '/order-success', description: 'Đặt hàng thành công' }
      ]
    },
    {
      title: 'Giỏ hàng & Đặt hàng',
      icon: ShoppingCartIcon,
      links: [
        { name: 'Giỏ hàng', url: '/cart', description: 'Xem giỏ hàng hiện tại' },
        { name: 'Thanh toán', url: '/checkout', description: 'Tiến hành thanh toán' }
      ]
    },
    {
      title: 'Dashboard Quản trị',
      icon: UserGroupIcon,
      links: [
        { name: 'Admin Dashboard', url: '/admin', description: 'Bảng điều khiển quản trị' },
        { name: 'Quản lý sản phẩm', url: '/admin/products', description: 'Quản lý danh sách sản phẩm' },
        { name: 'Quản lý đơn hàng', url: '/admin/orders', description: 'Quản lý đơn hàng' },
        { name: 'Quản lý người dùng', url: '/admin/users', description: 'Quản lý tài khoản khách hàng' },
        { name: 'Báo cáo & Thống kê', url: '/admin/analytics', description: 'Báo cáo doanh số và thống kê' }
      ]
    },
    {
      title: 'Tin tức & Hỗ trợ',
      icon: NewspaperIcon,
      links: [
        { name: 'Tin tức công nghệ', url: '/news', description: 'Tin tức và đánh giá sản phẩm' },
        { name: 'Trung tâm hỗ trợ', url: '/support', description: 'FAQ và yêu cầu hỗ trợ' },
        { name: 'Liên hệ', url: '/contact', description: 'Thông tin liên hệ' },
        { name: 'Về chúng tôi', url: '/about', description: 'Giới thiệu về LaptopStore' }
      ]
    },
    {
      title: 'Chính sách & Điều khoản',
      icon: DocumentTextIcon,
      links: [
        { name: 'Chính sách vận chuyển', url: '/shipping', description: 'Thông tin giao hàng và phí vận chuyển' },
        { name: 'Chính sách đổi trả', url: '/return', description: 'Quy định đổi trả sản phẩm' },
        { name: 'Phương thức thanh toán', url: '/payment', description: 'Các hình thức thanh toán' },
        { name: 'Chính sách bảo hành', url: '/warranty', description: 'Thông tin bảo hành sản phẩm' },
        { name: 'Chính sách bảo mật', url: '/privacy', description: 'Bảo vệ thông tin cá nhân' },
        { name: 'Điều khoản sử dụng', url: '/terms', description: 'Điều khoản và điều kiện' },
        { name: 'Câu hỏi thường gặp', url: '/faq', description: 'Các câu hỏi phổ biến' }
      ]
    }
  ]

  const popularPages = [
    { name: 'Laptop Gaming', url: '/categories/gaming', count: '150+ sản phẩm' },
    { name: 'Laptop Văn phòng', url: '/categories/office', count: '200+ sản phẩm' },
    { name: 'MacBook', url: '/categories/macbook', count: '50+ sản phẩm' },
    { name: 'Laptop Đồ họa', url: '/categories/workstation', count: '80+ sản phẩm' },
    { name: 'Laptop Sinh viên', url: '/categories/student', count: '120+ sản phẩm' },
    { name: 'Laptop Mỏng nhẹ', url: '/categories/ultrabook', count: '90+ sản phẩm' }
  ]

  const quickLinks = [
    { name: 'Tìm kiếm sản phẩm', url: '/search' },
    { name: 'So sánh laptop', url: '/compare' },
    { name: 'Tư vấn mua hàng', url: '/consultation' },
    { name: 'Kiểm tra bảo hành', url: '/warranty-check' },
    { name: 'Theo dõi đơn hàng', url: '/order-tracking' },
    { name: 'Đánh giá sản phẩm', url: '/reviews' }
  ]

  return (
    <>
      <Head>
        <title>Sơ đồ trang web - LaptopStore</title>
        <meta name="description" content="Sơ đồ trang web LaptopStore - Tổng quan tất cả các trang và chức năng" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <MapIcon className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Sơ đồ trang web
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Tổng quan tất cả các trang và chức năng của LaptopStore
              </p>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Truy cập nhanh
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Các trang được truy cập nhiều nhất
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickLinks.map((link, index) => (
                <Link key={index} href={link.url}>
                  <div className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {link.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Danh mục phổ biến
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Các danh mục sản phẩm được quan tâm nhiều nhất
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPages.map((page, index) => (
                <Link key={index} href={page.url}>
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {page.name}
                      </h3>
                      <ComputerDesktopIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">{page.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Full Sitemap */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tất cả trang web
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Danh sách đầy đủ tất cả các trang và chức năng
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {sitemapSections.map((section, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <section.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <Link key={linkIndex} href={link.url}>
                        <div className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {link.name}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {link.description}
                            </p>
                          </div>
                          <div className="ml-4 text-gray-400 group-hover:text-blue-600 transition-colors">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Website Statistics */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Thống kê trang web
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">35+</div>
                <div className="text-sm text-gray-600">Trang chính</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Sản phẩm</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
                <div className="text-sm text-gray-600">Danh mục</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Hỗ trợ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Tips */}
        <div className="py-16 bg-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-8 border border-blue-200">
              <div className="flex items-center mb-6">
                <InformationCircleIcon className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Mẹo tìm kiếm
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Tìm kiếm sản phẩm:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Sử dụng tên thương hiệu: "MacBook", "Dell XPS"</li>
                    <li>• Tìm theo cấu hình: "i7", "RTX 4060", "16GB RAM"</li>
                    <li>• Tìm theo mức giá: "dưới 20 triệu", "từ 15-25 triệu"</li>
                    <li>• Tìm theo mục đích: "gaming", "văn phòng", "đồ họa"</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Điều hướng nhanh:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Sử dụng menu danh mục ở header</li>
                    <li>• Lọc sản phẩm theo nhiều tiêu chí</li>
                    <li>• Sử dụng breadcrumb để quay lại</li>
                    <li>• Lưu sản phẩm yêu thích để xem sau</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact for Sitemap Issues */}
        <div className="py-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Không tìm thấy trang cần thiết?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Liên hệ với chúng tôi để được hỗ trợ tìm kiếm thông tin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Trung tâm hỗ trợ
              </Link>
              <Link href="/contact" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
                Liên hệ trực tiếp
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Sitemap
