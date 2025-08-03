import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../src/components/Layout';
import HeroSection from '../src/components/HeroSection';
import FeaturedProducts from '../src/components/FeaturedProducts';
import CategoriesSection from '../src/components/CategoriesSection';
import { useAuth } from '../src/context/AuthContext';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect admin to their dashboard - chỉ sau khi hoàn thành authentication check
    if (!isLoading && isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      }
    }
  }, [isAuthenticated, user, router, isLoading]);

  return (
    <>
      <Head>
        <title>LaptopStore - Cửa hàng laptop uy tín #1 Việt Nam</title>
        <meta
          name="description"
          content="Cửa hàng laptop uy tín với đa dạng sản phẩm từ Dell, HP, Asus, Apple. Giá tốt nhất, bảo hành chính hãng, giao hàng toàn quốc trong 24h."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="laptop, máy tính xách tay, Dell, HP, Asus, Apple, MacBook, gaming laptop, laptop văn phòng" />
        <link rel="canonical" href="https://laptopstore.vn" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Categories Section */}
        <CategoriesSection />

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tại sao chọn LaptopStore?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất với chất lượng dịch vụ hàng đầu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Chất lượng hàng đầu</h3>
                <p className="text-gray-600">
                  Sản phẩm chính hãng 100%, bảo hành toàn quốc
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Giao hàng nhanh chóng</h3>
                <p className="text-gray-600">
                  Giao hàng toàn quốc trong 24h, miễn phí vận chuyển
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Giá cả hợp lý</h3>
                <p className="text-gray-600">
                  Giá tốt nhất thị trường, nhiều ưu đãi hấp dẫn
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
                <p className="text-gray-600">
                  Tư vấn miễn phí, hỗ trợ kỹ thuật chuyên nghiệp
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Liên kết nhanh
              </h2>
              <p className="text-lg text-gray-600">
                Truy cập nhanh các trang thông tin quan trọng
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { name: 'Về chúng tôi', href: '/about', icon: '🏢' },
                { name: 'FAQ', href: '/faq', icon: '❓' },
                { name: 'Bảo hành', href: '/warranty', icon: '🛡️' },
                { name: 'Giao hàng', href: '/shipping', icon: '🚚' },
                { name: 'Đổi trả', href: '/return', icon: '↩️' },
                { name: 'Điều khoản', href: '/terms', icon: '📋' },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="group bg-gray-50 hover:bg-blue-50 rounded-xl p-6 text-center transition-all duration-200 hover:shadow-md"
                >
                  <div className="text-3xl mb-3">{link.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                    {link.name}
                  </h3>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Đăng ký nhận tin khuyến mãi
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và các sự kiện độc quyền
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </section>
      </Layout>
    </>
  );
}
