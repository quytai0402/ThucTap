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
import Image from 'next/image'

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
                Về IT-Global
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Chúng tôi cam kết mang đến cho khách hàng những sản phẩm laptop chất lượng cao 
                với dịch vụ tốt nhất và giá cả hợp lý nhất
              </p>
            </div>
          </div>
        </div>

        {/* About Layout Section */}
        <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Giới Thiệu Công Ty Chúng Tôi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
            <div className="w-full h-full">
              <Image
                src="https://it-global.net/public/main/img/icon.svg"
                alt="Giới thiệu IT-Global"
                width={600}
                height={400}
                className="rounded shadow-md object-cover w-full h-auto"
              />
            </div>

            <div className="bg-white shadow-md rounded p-6 text-gray-700">
              <h3 className="font-bold text-lg mb-3">
                IT–Global Lĩnh vực về công nghệ thông tin
              </h3>
              <p className="mb-4">
                Chúng tôi tin rằng mỗi khách hàng là đối tác của chúng tôi và chúng tôi hợp tác với bạn để cung cấp dịch vụ CNTT chất lượng, phù hợp.
              </p>
              <p className="mb-4">
                Đội ngũ chuyên gia CNTT thân thiện, giàu kinh nghiệm và đáng tin cậy sẽ đến tận nơi, gọi điện hoặc nhận tin để hỗ trợ khách hàng.
              </p>
              <p className="mb-4">
                Sứ mệnh của chúng tôi là mang đến nền tảng vận hành số hoá doanh nghiệp. Đồng hành cùng doanh nghiệp Việt Nam trên con đường chuyển đổi số.
              </p>
              <p className="mb-4">
                Đội ngũ nhân viên say mê, yêu thích công nghệ và luôn hướng đến cái mới trong mọi công việc.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="bg-white shadow-md rounded p-6 text-gray-800">
              <h3 className="font-bold text-lg text-black mb-4">THÔNG TIN LIÊN HỆ IT–GLOBAL</h3>
              <p className="mb-2">
                <span className="font-semibold">– Trụ sở:</span> 2/1/15 đường 40, P.Hiệp Bình Chánh, Tp. Thủ Đức
              </p>
              <p className="mb-2">
                <span className="font-semibold">– Điện thoại:</span> 0987.613.161 (Mr.Tân)
              </p>
              <p>
                <span className="font-semibold">– Email:</span> info@it–global.net
              </p>
            </div>

            <div className="w-full h-full">
              <Image
                src="https://it-global.net/public/main/img/icon.svg"
                alt="Ảnh nhân sự"
                width={600}
                height={400}
                className="rounded shadow-md object-cover w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Phần khác giữ nguyên */}

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
        <div className="py-16 bg-gray-500 text-white">
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
