import React from 'react'
import Head from 'next/head'
import Layout from '../src/components/Layout'
import { ShieldCheckIcon, EyeIcon, UserGroupIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const Privacy: React.FC = () => {
  const sections = [
    {
      id: 'collection',
      title: 'Thông tin chúng tôi thu thập',
      icon: UserGroupIcon,
      content: [
        'Thông tin cá nhân như họ tên, email, số điện thoại',
        'Thông tin thanh toán và địa chỉ giao hàng',
        'Lịch sử mua hàng và tương tác với website',
        'Thông tin thiết bị và địa chỉ IP',
        'Cookies và dữ liệu theo dõi'
      ]
    },
    {
      id: 'usage',
      title: 'Cách chúng tôi sử dụng thông tin',
      icon: EyeIcon,
      content: [
        'Xử lý đơn hàng và giao hàng',
        'Cung cấp dịch vụ khách hàng',
        'Gửi thông báo về đơn hàng và khuyến mãi',
        'Cải thiện chất lượng dịch vụ',
        'Phát hiện và ngăn chặn gian lận'
      ]
    },
    {
      id: 'sharing',
      title: 'Chia sẻ thông tin',
      icon: UserGroupIcon,
      content: [
        'Với đối tác giao hàng để thực hiện đơn hàng',
        'Với ngân hàng và đối tác thanh toán',
        'Với cơ quan pháp luật khi có yêu cầu',
        'Với nhà cung cấp dịch vụ kỹ thuật',
        'Không bán thông tin cá nhân cho bên thứ ba'
      ]
    },
    {
      id: 'security',
      title: 'Bảo mật thông tin',
      icon: LockClosedIcon,
      content: [
        'Mã hóa SSL cho tất cả giao dịch',
        'Lưu trữ dữ liệu trên server bảo mật',
        'Kiểm soát truy cập nghiêm ngặt',
        'Sao lưu dữ liệu định kỳ',
        'Cập nhật bảo mật thường xuyên'
      ]
    }
  ]

  return (
    <>
      <Head>
        <title>Chính sách bảo mật - IT-Global</title>
        <meta name="description" content="Chính sách bảo mật thông tin khách hàng của LaptopStore" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <ShieldCheckIcon className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Chính sách bảo mật
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Chúng tôi cam kết bảo vệ thông tin cá nhân và quyền riêng tư của khách hàng
              </p>
              <p className="text-sm text-blue-100">
                Cập nhật lần cuối: 28 tháng 7, 2025
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8">
                IT-Global cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. 
                Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sections.map((section) => (
                <div key={section.id} className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <section.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rights */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Quyền của khách hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Quyền truy cập
                  </h3>
                  <p className="text-gray-600">
                    Bạn có quyền yêu cầu truy cập thông tin cá nhân mà chúng tôi lưu trữ về bạn.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Quyền chỉnh sửa
                  </h3>
                  <p className="text-gray-600">
                    Bạn có thể yêu cầu chỉnh sửa hoặc cập nhật thông tin cá nhân không chính xác.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Quyền xóa
                  </h3>
                  <p className="text-gray-600">
                    Bạn có quyền yêu cầu xóa thông tin cá nhân trong một số trường hợp nhất định.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Quyền phản đối
                  </h3>
                  <p className="text-gray-600">
                    Bạn có thể phản đối việc xử lý thông tin cá nhân trong một số trường hợp.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Quyền chuyển dữ liệu
                  </h3>
                  <p className="text-gray-600">
                    Bạn có quyền yêu cầu chuyển dữ liệu cá nhân sang nhà cung cấp khác.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Quyền rút đồng ý
                  </h3>
                  <p className="text-gray-600">
                    Bạn có thể rút lại sự đồng ý xử lý dữ liệu bất cứ lúc nào.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Chính sách Cookie
            </h2>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-600 mb-6">
                Chúng tôi sử dụng cookie để cải thiện trải nghiệm người dùng và phân tích lưu lượng truy cập.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Cookie cần thiết</h3>
                  <p className="text-gray-600 text-sm">
                    Cần thiết cho hoạt động cơ bản của website, không thể tắt.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cookie phân tích</h3>
                  <p className="text-gray-600 text-sm">
                    Giúp chúng tôi hiểu cách khách hàng sử dụng website để cải thiện dịch vụ.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cookie marketing</h3>
                  <p className="text-gray-600 text-sm">
                    Được sử dụng để hiển thị quảng cáo phù hợp với sở thích của bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="py-16 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Có câu hỏi về chính sách bảo mật?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Liên hệ với chúng tôi để được giải đáp thắc mắc
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Liên hệ ngay
              </a>
              <a
                href="mailto:privacy@laptopstore.vn"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Email: privacy@laptopstore.vn
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Privacy
