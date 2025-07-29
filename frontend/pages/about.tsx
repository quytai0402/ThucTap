import React from 'react'
import Head from 'next/head'
import Layout from '../src/components/Layout'
import { 
  ShieldCheckIcon, 
  TruckIcon, 
  PhoneIcon,
  UserGroupIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const About: React.FC = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Bảo hành chính hãng',
      description: 'Cam kết 100% sản phẩm chính hãng với bảo hành đầy đủ từ nhà sản xuất'
    },
    {
      icon: TruckIcon,
      title: 'Giao hàng nhanh chóng',
      description: 'Giao hàng trong 24h tại nội thành, 2-3 ngày toàn quốc'
    },
    {
      icon: PhoneIcon,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ kỹ thuật sẵn sàng hỗ trợ khách hàng mọi lúc mọi nơi'
    },
    {
      icon: UserGroupIcon,
      title: 'Đội ngũ chuyên nghiệp',
      description: 'Nhân viên được đào tạo bài bản, tư vấn nhiệt tình và chuyên nghiệp'
    },
    {
      icon: StarIcon,
      title: 'Giải thưởng uy tín',
      description: 'Được khách hàng bình chọn là cửa hàng laptop uy tín nhất 2023'
    },
    {
      icon: ClockIcon,
      title: 'Kinh nghiệm lâu năm',
      description: 'Hơn 10 năm kinh nghiệm trong lĩnh vực kinh doanh laptop'
    }
  ]

  const stats = [
    { number: '10+', label: 'Năm kinh nghiệm' },
    { number: '50K+', label: 'Khách hàng tin tưởng' },
    { number: '100+', label: 'Sản phẩm đa dạng' },
    { number: '24/7', label: 'Hỗ trợ khách hàng' }
  ]

  return (
    <>
      <Head>
        <title>Về chúng tôi - LaptopStore</title>
        <meta name="description" content="Tìm hiểu về LaptopStore - cửa hàng laptop uy tín hàng đầu Việt Nam" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Về LaptopStore
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Chúng tôi cam kết mang đến cho khách hàng những sản phẩm laptop chất lượng cao 
                với dịch vụ tốt nhất và giá cả hợp lý nhất
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Câu chuyện của chúng tôi
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    LaptopStore được thành lập vào năm 2013 với mục tiêu trở thành cửa hàng laptop 
                    uy tín hàng đầu tại Việt Nam. Xuất phát từ một cửa hàng nhỏ với đội ngũ chỉ 3 người, 
                    chúng tôi đã không ngừng phát triển và mở rộng.
                  </p>
                  <p>
                    Ngày hôm nay, LaptopStore đã trở thành một trong những cửa hàng laptop được khách hàng 
                    tin tưởng nhất với hơn 50,000 khách hàng đã mua sắm và hài lòng với sản phẩm, dịch vụ 
                    của chúng tôi.
                  </p>
                  <p>
                    Chúng tôi tự hào là đại lý chính thức của các thương hiệu laptop hàng đầu thế giới 
                    như Dell, HP, ASUS, Lenovo, Apple, MSI và nhiều thương hiệu khác.
                  </p>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
                  alt="LaptopStore Store"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Thành tựu của chúng tôi
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Những con số ấn tượng thể hiện sự tin tưởng của khách hàng dành cho LaptopStore
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tại sao chọn LaptopStore?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Chúng tôi cam kết mang đến cho khách hàng trải nghiệm mua sắm tốt nhất
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Sứ mệnh của chúng tôi
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                "Mang đến cho mọi người cơ hội tiếp cận công nghệ hiện đại thông qua những sản phẩm laptop 
                chất lượng cao với giá cả hợp lý, kèm theo dịch vụ khách hàng xuất sắc. 
                Chúng tôi không chỉ bán laptop, mà còn là người bạn đồng hành đáng tin cậy trong 
                hành trình công nghệ của bạn."
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Sẵn sàng mua sắm cùng chúng tôi?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Hãy liên hệ với chúng tôi để được tư vấn miễn phí
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Xem sản phẩm
              </a>
              <a
                href="/contact"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Liên hệ ngay
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default About
