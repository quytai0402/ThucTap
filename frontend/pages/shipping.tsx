import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../src/components/Layout'
import { 
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const Shipping: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState('zone1')
  const [trackingNumber, setTrackingNumber] = useState('')

  const shippingZones = [
    {
      id: 'zone1',
      name: 'Nội thành TP.HCM & Hà Nội',
      areas: ['Quận 1-12', 'TP. Thủ Đức', 'Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Hai Bà Trưng'],
      standardTime: '1-2 ngày',
      expressTime: 'Trong ngày',
      standardFee: 'Miễn phí',
      expressFee: '50.000đ'
    },
    {
      id: 'zone2', 
      name: 'Các tỉnh lân cận',
      areas: ['Bình Dương', 'Đồng Nai', 'Long An', 'Hưng Yên', 'Bắc Ninh', 'Hải Phòng'],
      standardTime: '2-3 ngày',
      expressTime: '1-2 ngày',
      standardFee: '30.000đ',
      expressFee: '80.000đ'
    },
    {
      id: 'zone3',
      name: 'Miền Nam',
      areas: ['Cần Thơ', 'An Giang', 'Đồng Tháp', 'Vĩnh Long', 'Bến Tre', 'Trà Vinh'],
      standardTime: '3-4 ngày',
      expressTime: '2-3 ngày',
      standardFee: '50.000đ',
      expressFee: '100.000đ'
    },
    {
      id: 'zone4',
      name: 'Miền Trung',
      areas: ['Đà Nẵng', 'Huế', 'Quảng Nam', 'Khánh Hòa', 'Bình Thuận', 'Phú Yên'],
      standardTime: '3-5 ngày',
      expressTime: '2-3 ngày',
      standardFee: '60.000đ',
      expressFee: '120.000đ'
    },
    {
      id: 'zone5',
      name: 'Miền Bắc',
      areas: ['Lào Cai', 'Cao Bằng', 'Hà Giang', 'Điện Biên', 'Sơn La', 'Lai Châu'],
      standardTime: '4-6 ngày',
      expressTime: '3-4 ngày',
      standardFee: '80.000đ',
      expressFee: '150.000đ'
    }
  ]

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Giao hàng tiêu chuẩn',
      icon: TruckIcon,
      description: 'Giao hàng trong giờ hành chính',
      features: [
        'Miễn phí với đơn hàng từ 5 triệu',
        'Giao hàng từ T2-T6 (8h-17h)',
        'Có thể giao thứ 7 (+20.000đ)',
        'Nhận hàng tại cửa hàng miễn phí'
      ]
    },
    {
      id: 'express',
      name: 'Giao hàng nhanh',
      icon: ClockIcon,
      description: 'Giao hàng trong ngày hoặc 24h',
      features: [
        'Giao trong ngày nếu đặt trước 14h',
        'Giao 7 ngày/tuần (8h-20h)',
        'Ưu tiên xử lý và đóng gói',
        'SMS/Email thông báo liên tục'
      ]
    },
    {
      id: 'appointment',
      name: 'Giao hàng theo lịch hẹn',
      icon: CalendarIcon,
      description: 'Đặt lịch giao hàng theo ý muốn',
      features: [
        'Chọn ngày giờ giao hàng',
        'Giao vào cuối tuần',
        'Giao ngoài giờ hành chính',
        'Phí phụ thu theo khung giờ'
      ]
    }
  ]

  const deliveryProcess = [
    {
      step: 1,
      title: 'Xác nhận đơn hàng',
      description: 'Kiểm tra thông tin và xác nhận đơn hàng qua điện thoại',
      time: '30 phút sau khi đặt hàng'
    },
    {
      step: 2,
      title: 'Chuẩn bị hàng',
      description: 'Kiểm tra sản phẩm, đóng gói cẩn thận và dán tem bảo hành',
      time: '2-4 giờ'
    },
    {
      step: 3,
      title: 'Bàn giao vận chuyển',
      description: 'Chuyển hàng cho đối tác vận chuyển hoặc xe giao hàng',
      time: '4-6 giờ sau xác nhận'
    },
    {
      step: 4,
      title: 'Đang vận chuyển',
      description: 'Hàng đang trên đường giao đến địa chỉ của bạn',
      time: 'Theo từng khu vực'
    },
    {
      step: 5,
      title: 'Giao hàng thành công',
      description: 'Nhận hàng, kiểm tra và xác nhận hoàn tất',
      time: 'Theo lịch hẹn'
    }
  ]

  const packagingInfo = [
    {
      icon: ShieldCheckIcon,
      title: 'Đóng gói chuyên nghiệp',
      description: 'Sử dụng hộp carton chuyên dụng, xốp bọc khí chống sốc'
    },
    {
      icon: CheckCircleIcon,
      title: 'Kiểm tra kỹ lưỡng',
      description: 'Kiểm tra máy, phụ kiện, cài đặt sẵn phần mềm cơ bản'
    },
    {
      icon: TruckIcon,
      title: 'Vận chuyển an toàn',
      description: 'Đối tác vận chuyển uy tín, bảo hiểm hàng hóa toàn trình'
    }
  ]

  const restrictedAreas = [
    'Huyện đảo (Phú Quốc, Cô Tô, Cát Bà...)',
    'Vùng sâu vùng xa không có đường ô tô',
    'Khu vực có an ninh đặc biệt',
    'Địa chỉ không rõ ràng, không có người nhận'
  ]

  const shippingPolicies = [
    {
      title: 'Kiểm tra hàng khi nhận',
      content: 'Khách hàng có quyền kiểm tra sản phẩm trước khi thanh toán và ký nhận. Từ chối nhận hàng nếu phát hiện hư hỏng.'
    },
    {
      title: 'Địa chỉ giao hàng',
      content: 'Vui lòng cung cấp địa chỉ chính xác, có số nhà rõ ràng. Không giao đến địa chỉ PO Box hoặc hòm thư.'
    },
    {
      title: 'Thời gian giao hàng',
      content: 'Thời gian giao hàng có thể thay đổi do thời tiết, giao thông hoặc lực lượng bất khả kháng.'
    },
    {
      title: 'Phí giao hàng',
      content: 'Phí giao hàng được tính theo khu vực và trọng lượng. Miễn phí giao hàng cho đơn từ 5 triệu đồng.'
    }
  ]

  const handleTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return
    // Handle tracking
    alert(`Theo dõi đơn hàng: ${trackingNumber}`)
  }

  return (
    <>
      <Head>
        <title>Chính sách vận chuyển - LaptopStore</title>
        <meta name="description" content="Thông tin chi tiết về chính sách vận chuyển, phí giao hàng và thời gian giao hàng của LaptopStore" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <TruckIcon className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Chính sách vận chuyển
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Giao hàng nhanh chóng, an toàn trên toàn quốc
              </p>
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Theo dõi đơn hàng
                </h2>
                <p className="text-gray-600">
                  Nhập mã đơn hàng để kiểm tra tình trạng vận chuyển
                </p>
              </div>
              
              <form onSubmit={handleTrackingSubmit} className="max-w-md mx-auto">
                <div className="flex">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nhập mã đơn hàng..."
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none" />
                  </div>
                  <button 
                    type="submit"
                    className="bg-green-600 text-white px-6 py-3 rounded-r-lg hover:bg-green-700 transition-colors"
                  >
                    Theo dõi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="py-16 bg-gray-1oo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Phương thức giao hàng
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Chọn phương thức giao hàng phù hợp với nhu cầu của bạn
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {shippingMethods.map((method) => (
                <div key={method.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <method.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  
                  <ul className="space-y-2">
                    {method.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Khu vực giao hàng & Phí vận chuyển
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Phí và thời gian giao hàng theo từng khu vực
              </p>
            </div>
            
            {/* Zone Selector */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {shippingZones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedZone === zone.id
                      ? 'bg-green-600 text-black hover:bg-green-700 border border-green-700'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {zone.name}
                </button>
              ))}
            </div>

            {/* Zone Details */}
            {shippingZones.map((zone) => (
              selectedZone === zone.id && (
                <div key={zone.id} className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {zone.name}
                      </h3>
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Các khu vực:</h4>
                        <div className="flex flex-wrap gap-2">
                          {zone.areas.map((area, index) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Giao hàng tiêu chuẩn</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <ClockIcon className="h-4 w-4 text-gray-500 mr-2" />
                            {zone.standardTime}
                          </div>
                          <div className="flex items-center text-sm">
                            <CurrencyDollarIcon className="h-4 w-4 text-gray-500 mr-2" />
                            {zone.standardFee}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Giao hàng nhanh</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <ClockIcon className="h-4 w-4 text-blue-500 mr-2" />
                            {zone.expressTime}
                          </div>
                          <div className="flex items-center text-sm">
                            <CurrencyDollarIcon className="h-4 w-4 text-blue-500 mr-2" />
                            {zone.expressFee}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

       {/* Delivery Process - Improved Layout */}
          {/* Delivery Process with Arrow-Shaped Step Numbers */}
          <div className="py-20 bg-gradient-to-r from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                  Quy trình giao hàng
                </h2>
                <p className="text-gray-600 text-lg">
                  Từng bước đảm bảo đơn hàng đến tay bạn nhanh chóng và an toàn
                </p>
              </div>

              <div className="relative">
                <div className="hidden md:block absolute top-10 left-0 right-0 h-1 bg-gray-200 z-0"></div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 relative z-10">
                  {deliveryProcess.map((step, index) => (
                    <div key={index} className="text-center flex flex-col items-center">
                      {/* Arrow down shape with number inside */}
                      <div className="relative mb-4">
                        <div className="w-14 h-14 bg-white border-4 border-green-600 transform rotate-45 flex items-center justify-center shadow-md">
                          <span className="transform -rotate-45 text-black text-xl font-bold">
                            {step.step}
                          </span>
                        </div>
                        {/* Tail triangle */}
                        <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[14px] border-l-transparent border-r-transparent border-t-green-600 mx-auto -mt-1" />
                      </div>

                      {/* Card content */}
                      <div className="bg-white p-4 rounded-xl shadow-md w-full min-h-[160px] transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                        <p className="text-xs text-green-600 font-medium">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

       {/* Packaging & Delivery Section */}
            <section className="py-20 bg-gray-70">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-14">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                    Đóng gói & Vận chuyển
                  </h2>
                  <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
                    Chúng tôi cam kết sản phẩm luôn được đóng gói chuyên nghiệp và giao hàng an toàn đến tay bạn.
                  </p>
                </div>

                {/* Grid of Packaging Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {packagingInfo.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-green-100 p-3 rounded-full">
                          <item.icon className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
                
              </div>
            </section>
        {/* Policies & Restrictions */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Shipping Policies */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Chính sách giao hàng
                </h2>
                <div className="space-y-6">
                  {shippingPolicies.map((policy, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {policy.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {policy.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restricted Areas */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Khu vực không giao hàng
                </h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <InformationCircleIcon className="h-6 w-6 text-yellow-600 mr-2" />
                    <h3 className="font-semibold text-yellow-800">
                      Lưu ý quan trọng
                    </h3>
                  </div>
                  <p className="text-yellow-700 text-sm mb-4">
                    Chúng tôi chưa hỗ trợ giao hàng đến các khu vực sau:
                  </p>
                  <ul className="space-y-2">
                    {restrictedAreas.map((area, index) => (
                      <li key={index} className="flex items-start text-sm text-yellow-700">
                        <XCircleIcon className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                        {area}
                      </li>
                    ))}
                  </ul>
                  <p className="text-yellow-700 text-sm mt-4">
                    Vui lòng liên hệ hotline để được tư vấn thêm về giao hàng đến các khu vực đặc biệt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="py-20 bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Cần hỗ trợ về vận chuyển?
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Liên hệ ngay với chúng tôi để được tư vấn về giao hàng
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:19001234"
                className="inline-block px-8 py-3 border-2 border-white text-black text-lg font-semibold rounded-xl hover:bg-gray-200 hover:text-black transition"
              >
                Hotline: 1900-1234
              </a>
              <a
                href="/support"
                className="inline-block px-8 py-3 border-2 border-white text-black text-lg font-semibold rounded-xl hover:bg-gray-200  hover:text-black transition"
              >
                Gửi yêu cầu hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Shipping
