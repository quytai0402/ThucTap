import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../src/components/Layout';
import Breadcrumb from '../src/components/Breadcrumb';
import {
  HomeIcon,
  ComputerDesktopIcon,
  UserIcon,
  ShoppingCartIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  PhoneIcon,
  NewspaperIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
  CreditCardIcon,
  MapIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const AllPages: React.FC = () => {
  const pageCategories = [
    {
      title: 'Trang chính',
      icon: HomeIcon,
      color: 'blue',
      pages: [
        { name: 'Trang chủ', href: '/', description: 'Trang chủ chính của website' },
        { name: 'Sản phẩm', href: '/products', description: 'Danh sách tất cả sản phẩm laptop' },
        { name: 'Danh mục', href: '/categories', description: 'Phân loại sản phẩm theo thương hiệu' },
      ]
    },
    {
      title: 'Tài khoản & Đăng nhập',
      icon: UserIcon,
      color: 'green',
      pages: [
        { name: 'Đăng nhập', href: '/login', description: 'Đăng nhập vào tài khoản' },
        { name: 'Đăng ký', href: '/register', description: 'Tạo tài khoản mới' },
        { name: 'Quên mật khẩu', href: '/forgot-password', description: 'Khôi phục mật khẩu' },
        { name: 'Đặt lại mật khẩu', href: '/reset-password', description: 'Tạo mật khẩu mới' },
        { name: 'Hồ sơ cá nhân', href: '/profile', description: 'Quản lý thông tin cá nhân' },
      ]
    },
    {
      title: 'Mua hàng & Đơn hàng',
      icon: ShoppingCartIcon,
      color: 'purple',
      pages: [
        { name: 'Giỏ hàng', href: '/cart', description: 'Xem và quản lý giỏ hàng' },
        { name: 'Thanh toán', href: '/checkout', description: 'Tiến hành thanh toán đơn hàng' },
        { name: 'Xử lý thanh toán', href: '/payment', description: 'Trang xử lý thanh toán' },
        { name: 'Kết quả thanh toán', href: '/payment-return', description: 'Xem kết quả giao dịch' },
        { name: 'Đơn hàng', href: '/orders', description: 'Danh sách đơn hàng' },
        { name: 'Đặt hàng thành công', href: '/order-success', description: 'Xác nhận đơn hàng thành công' },
      ]
    },
    {
      title: 'Thông tin & Hỗ trợ',
      icon: InformationCircleIcon,
      color: 'indigo',
      pages: [
        { name: 'Về chúng tôi', href: '/about', description: 'Thông tin về công ty' },
        { name: 'Liên hệ', href: '/contact', description: 'Thông tin liên hệ và form góp ý' },
        { name: 'Hỗ trợ', href: '/support', description: 'Trung tâm hỗ trợ khách hàng' },
        { name: 'FAQ', href: '/faq', description: 'Câu hỏi thường gặp' },
        { name: 'Tin tức', href: '/news', description: 'Tin tức và bài viết mới nhất' },
      ]
    },
    {
      title: 'Chính sách & Dịch vụ',
      icon: DocumentTextIcon,
      color: 'amber',
      pages: [
        { name: 'Bảo hành', href: '/warranty', description: 'Chính sách bảo hành sản phẩm' },
        { name: 'Giao hàng', href: '/shipping', description: 'Thông tin về giao hàng' },
        { name: 'Đổi trả', href: '/return', description: 'Chính sách đổi trả sản phẩm' },
        { name: 'Điều khoản sử dụng', href: '/terms', description: 'Điều khoản và điều kiện' },
        { name: 'Chính sách bảo mật', href: '/privacy', description: 'Chính sách bảo vệ thông tin' },
      ]
    },
    {
      title: 'Tiện ích',
      icon: MapIcon,
      color: 'gray',
      pages: [
        { name: 'Sơ đồ trang', href: '/sitemap', description: 'Sơ đồ toàn bộ website' },
        { name: 'Tất cả trang', href: '/all-pages', description: 'Danh sách đầy đủ các trang' },
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      amber: 'bg-amber-50 border-amber-200 text-amber-800',
      gray: 'bg-gray-50 border-gray-200 text-gray-800',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <>
      <Head>
        <title>Tất cả trang - IT-Global</title>
        <meta name="description" content="Danh sách đầy đủ tất cả các trang trên website IT-Global" />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Tất cả trang' }]} />
              <div className="mt-4">
                <h1 className="text-3xl font-bold text-gray-900">Tất cả trang website</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Danh sách đầy đủ tất cả các trang có sẵn trên website IT-Global
                </p>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-8">
              {pageCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div key={category.title} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className={`px-6 py-4 border-b border-gray-200 ${getColorClasses(category.color)}`}>
                      <div className="flex items-center">
                        <IconComponent className="h-6 w-6 mr-3" />
                        <h2 className="text-xl font-semibold">{category.title}</h2>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.pages.map((page) => (
                          <Link
                            key={page.href}
                            href={page.href}
                            className="group block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          >
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                              {page.name}
                            </h3>
                            <p className="text-sm text-gray-600 group-hover:text-gray-700">
                              {page.description}
                            </p>
                            <div className="mt-2 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              Nhấn để truy cập →
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer note */}
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500">
                Trang này giúp bạn dễ dàng tìm và truy cập tất cả các trang có sẵn trên website.
                <br />
                Nếu bạn không tìm thấy trang cần thiết, vui lòng{' '}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  liên hệ với chúng tôi
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AllPages;
