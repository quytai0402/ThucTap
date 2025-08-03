import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../src/components/Layout'
import { 
  ShieldCheckIcon, 
  ClockIcon, 
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const Warranty: React.FC = () => {
  const [serialNumber, setSerialNumber] = useState('')
  
  const warrantyPolicies = [
    {
      brand: 'ASUS',
      period: '24 tháng',
      coverage: 'Toàn cầu',
      details: 'Bảo hành 24 tháng cho laptop, 36 tháng cho mainboard'
    },
    {
      brand: 'Dell',
      period: '12 tháng', 
      coverage: 'Việt Nam',
      details: 'Bảo hành tại chỗ cho doanh nghiệp, mang máy cho cá nhân'
    },
    {
      brand: 'HP',
      period: '12 tháng',
      coverage: 'Toàn cầu', 
      details: 'Hỗ trợ online và bảo hành tại trung tâm'
    },
    {
      brand: 'Lenovo',
      period: '12 tháng',
      coverage: 'Việt Nam',
      details: 'Bảo hành nhanh trong ngày tại các trung tâm lớn'
    },
    {
      brand: 'Apple',
      period: '12 tháng',
      coverage: 'Toàn cầu',
      details: 'AppleCare+ có thể mở rộng bảo hành thêm 2 năm'
    },
    {
      brand: 'MSI',
      period: '24 tháng',
      coverage: 'Toàn cầu',
      details: 'Bảo hành đặc biệt cho dòng gaming và workstation'
    }
  ]

  const warrantySteps = [
    {
      step: 1,
      title: 'Liên hệ hỗ trợ',
      description: 'Gọi hotline hoặc đến cửa hàng để thông báo sự cố'
    },
    {
      step: 2,
      title: 'Kiểm tra điều kiện',
      description: 'Nhân viên kiểm tra tình trạng máy và điều kiện bảo hành'
    },
    {
      step: 3,
      title: 'Tiếp nhận máy',
      description: 'Lập phiếu tiếp nhận và ước tính thời gian sửa chữa'
    },
    {
      step: 4,
      title: 'Sửa chữa',
      description: 'Chuyển máy đến trung tâm bảo hành để khắc phục'
    },
    {
      step: 5,
      title: 'Giao máy',
      description: 'Thông báo và giao máy sau khi hoàn thành sửa chữa'
    }
  ]

  const excludedCases = [
    'Hư hỏng do va đập, rơi vỡ, bể màn hình',
    'Ngấm nước, chất lỏng vào máy',
    'Cháy nổ do sét đánh, điện áp không ổn định', 
    'Tự ý tháo máy, thay đổi cấu hình phần cứng',
    'Sử dụng phần mềm crack, virus làm hỏng hệ thống',
    'Hết thời hạn bảo hành theo quy định',
    'Không có hóa đơn mua hàng hoặc phiếu bảo hành'
  ]

  return (
    <>
      <Head>
        <title>Chính sách bảo hành - LaptopStore</title>
        <meta name="description" content="Thông tin chi tiết về chính sách bảo hành sản phẩm tại LaptopStore" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <ShieldCheckIcon className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Chính sách bảo hành
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Cam kết bảo hành chính hãng và hỗ trợ khách hàng tận tình
              </p>
            </div>
          </div>
        </div>

        {/* Warranty Check */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Kiểm tra bảo hành
                </h2>
                <p className="text-gray-600">
                  Nhập số serial để kiểm tra tình trạng bảo hành sản phẩm
                </p>
              </div>
              
              <div className="max-w-md mx-auto">
                <div className="flex">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Nhập số serial..."
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none" />
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors">
                    Kiểm tra
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Số serial thường nằm ở mặt dưới laptop hoặc trong Battery Info
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Warranty Policies */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Chính sách bảo hành theo hãng
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Thời gian và điều kiện bảo hành khác nhau tùy từng nhà sản xuất
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {warrantyPolicies.map((policy, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="font-bold text-blue-600">{policy.brand.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{policy.brand}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {policy.period}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Phạm vi:</span>
                      <span className="text-sm font-medium">{policy.coverage}</span>
                    </div>
                    <p className="text-sm text-gray-600">{policy.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Warranty Process */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quy trình bảo hành
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                5 bước đơn giản để thực hiện bảo hành sản phẩm
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {warrantySteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    {index < warrantySteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-16 w-full h-0.5 bg-gray-300"></div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's Covered */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Covered */}
              <div>
                <div className="flex items-center mb-6">
                  <ShieldCheckIcon className="h-8 w-8 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Được bảo hành
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Lỗi phần cứng</h3>
                      <p className="text-gray-600 text-sm">Mainboard, RAM, ổ cứng, màn hình bị lỗi từ nhà sản xuất</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Lỗi phần mềm hệ thống</h3>
                      <p className="text-gray-600 text-sm">Windows lỗi, driver không tương thích, BIOS bị lỗi</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Lỗi sản xuất</h3>
                      <p className="text-gray-600 text-sm">Khuyết tật từ quá trình sản xuất, lắp ráp</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Pin laptop</h3>
                      <p className="text-gray-600 text-sm">Pin chai, không sạc được trong thời gian bảo hành</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Not Covered */}
              <div>
                <div className="flex items-center mb-6">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Không được bảo hành
                  </h2>
                </div>
                <div className="space-y-3">
                  {excludedCases.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Centers */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trung tâm bảo hành
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hệ thống trung tâm bảo hành ủy quyền chính hãng
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">TP. Hồ Chí Minh</h3>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Địa chỉ:</strong> 123 Nguyễn Văn Cừ, Q.1</p>
                  <p><strong>Điện thoại:</strong> (028) 1234-5678</p>
                  <p><strong>Giờ làm việc:</strong> 8:00 - 17:30 (T2-T7)</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Hà Nội</h3>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Địa chỉ:</strong> 456 Cầu Giấy, Cầu Giấy</p>
                  <p><strong>Điện thoại:</strong> (024) 1234-5679</p>
                  <p><strong>Giờ làm việc:</strong> 8:00 - 17:30 (T2-T7)</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Đà Nẵng</h3>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Địa chỉ:</strong> 789 Hùng Vương, Hải Châu</p>
                  <p><strong>Điện thoại:</strong> (0236) 1234-5680</p>
                  <p><strong>Giờ làm việc:</strong> 8:00 - 17:30 (T2-T7)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="py-16 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Cần hỗ trợ bảo hành?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Liên hệ ngay với chúng tôi để được tư vấn và hỗ trợ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:19001234"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Hotline: 0987613161
              </a>
              <a
                href="/contact"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
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

export default Warranty
