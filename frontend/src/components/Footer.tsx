import React from 'react';
import Link from 'next/link';

import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { name: 'Laptop Gaming', href: '/products?category=gaming' },
      { name: 'MacBook', href: '/products?category=macbook' },
      { name: 'Laptop Văn phòng', href: '/products?category=office' },
      { name: 'Ultrabook', href: '/products?category=ultrabook' },
    ],
    services: [
      { name: 'Bảo hành', href: '/warranty' },
      { name: 'Giao hàng', href: '/shipping' },
      { name: 'Đổi trả', href: '/return' },
      { name: 'Hỗ trợ', href: '/support' },
      { name: 'Thanh toán', href: '/payment' },
    ],
    company: [
      { name: 'Về chúng tôi', href: '/about' },
      { name: 'Tin tức', href: '/news' },
      { name: 'Liên hệ', href: '/contact' },
      { name: 'Đơn hàng', href: '/orders' },
      { name: 'Theo dõi đơn hàng', href: '/order-success' },
    ],
    support: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Hướng dẫn mua hàng', href: '/guide' },
      { name: 'Chính sách bảo mật', href: '/privacy' },
      { name: 'Điều khoản sử dụng', href: '/terms' },
      { name: 'Sơ đồ trang', href: '/sitemap' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="https://it-global.net/public/main/img/icon.svg" // hoặc link online như: "https://example.com/logo.png"
                alt="ITS-Global Logo"
                className="w-10 h-10 object-contain rounded-lg"
            />
              <span className="ml-2 text-xl font-bold">IT-Global</span>
            </div>
            <p className="text-gray-300 mb-4">
              Công Ty TNHH Giải Pháp Công Nghệ IT-Global
            </p>
            <p className="text-gray-300 mb-4">
              Mr.Tân: 0987613161
            </p>
             {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="text-sm font-medium">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="text-sm font-medium">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="text-sm font-medium">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="text-sm font-medium">YouTube</span>
              </a>
            </div>
            <p className="text-gray-300 mb-4">
              Liên Hệ 
            </p>
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <PhoneIcon className="h-5 w-5 mr-2" />
                <span>+84 987.613.161</span>
              </div>
              <div className="flex items-center text-gray-300">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                <span>info@it-global.net</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>2/1/15 đường 40, F Hiệp Bình Chánh, Tp. Thủ Đức</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Công ty</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-4">Đăng ký nhận tin</h3>
            <p className="text-gray-300 mb-4">
              Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-r-lg transition-colors duration-200"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} IT-Global. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Điều khoản sử dụng
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Sitemap
              </Link>
              <Link href="/all-pages" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Tất cả trang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 