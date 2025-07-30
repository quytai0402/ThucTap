import React from 'react'
import Head from 'next/head'
import Layout from '../src/components/Layout'
import { DocumentTextIcon, ScaleIcon, HandRaisedIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

const Terms: React.FC = () => {
  const sections = [
    {
      id: 'general',
      title: 'Điều khoản chung',
      icon: DocumentTextIcon,
      content: [
        'Bằng việc sử dụng website, bạn đồng ý với các điều khoản này',
        'Chúng tôi có quyền thay đổi điều khoản bất cứ lúc nào',
        'Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có nghĩa bạn chấp nhận',
        'Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ',
        'Điều khoản áp dụng cho tất cả người dùng'
      ]
    },
    {
      id: 'account',
      title: 'Tài khoản người dùng',
      icon: HandRaisedIcon,
      content: [
        'Bạn chịu trách nhiệm bảo mật thông tin tài khoản',
        'Không chia sẻ tài khoản với người khác',
        'Thông báo ngay nếu phát hiện tài khoản bị xâm nhập',
        'Cung cấp thông tin chính xác và cập nhật',
        'Chịu trách nhiệm cho mọi hoạt động trên tài khoản'
      ]
    },
    {
      id: 'purchase',
      title: 'Mua hàng và thanh toán',
      icon: ScaleIcon,
      content: [
        'Giá sản phẩm có thể thay đổi mà không báo trước',
        'Đơn hàng chỉ được xác nhận sau khi thanh toán thành công',
        'Chúng tôi có quyền từ chối đơn hàng trong một số trường hợp',
        'Khách hàng chịu phí giao hàng theo chính sách',
        'Hóa đơn VAT được xuất theo yêu cầu'
      ]
    },
    {
      id: 'liability',
      title: 'Giới hạn trách nhiệm',
      icon: ExclamationCircleIcon,
      content: [
        'Chúng tôi không chịu trách nhiệm cho thiệt hại gián tiếp',
        'Trách nhiệm tối đa bằng giá trị đơn hàng',
        'Không đảm bảo website hoạt động liên tục không lỗi',
        'Khách hàng tự chịu rủi ro khi sử dụng dịch vụ',
        'Không chịu trách nhiệm cho nội dung từ bên thứ ba'
      ]
    }
  ]

  return (
    <>
      <Head>
        <title>Điều khoản dịch vụ - LaptopStore</title>
        <meta name="description" content="Điều khoản dịch vụ và sử dụng của LaptopStore" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <DocumentTextIcon className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Điều khoản dịch vụ
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Các điều khoản và điều kiện sử dụng dịch vụ LaptopStore
              </p>
              <p className="text-sm text-blue-100">
                Có hiệu lực từ: 01 tháng 1, 2025
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8">
                Chào mừng bạn đến với IT-Global. Khi sử dụng website và dịch vụ của chúng tôi, 
                bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-yellow-800">
                  <strong>Lưu ý quan trọng:</strong> Vui lòng đọc kỹ các điều khoản này trước khi sử dụng dịch vụ. 
                  Việc sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận toàn bộ điều khoản.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
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

        {/* Detailed Terms */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Các điều khoản chi tiết
            </h2>
            
            <div className="space-y-8">
              {/* Warranty Policy */}
              <div className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  1. Chính sách bảo hành
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Sản phẩm được bảo hành theo chính sách của nhà sản xuất</p>
                  <p>• Thời gian bảo hành từ 12-36 tháng tùy sản phẩm</p>
                  <p>• Bảo hành không áp dụng cho hư hỏng do người dùng</p>
                  <p>• Khách hàng cần giữ hóa đơn và tem bảo hành</p>
                </div>
              </div>

              {/* Return Policy */}
              <div className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  2. Chính sách đổi trả
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Đổi trả trong vòng 7 ngày kể từ ngày mua</p>
                  <p>• Sản phẩm phải còn nguyên vẹn, chưa sử dụng</p>
                  <p>• Có đầy đủ phụ kiện và hộp đựng ban đầu</p>
                  <p>• Khách hàng chịu phí vận chuyển đổi trả</p>
                </div>
              </div>

              {/* Privacy */}
              <div className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  3. Quyền riêng tư
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Thông tin khách hàng được bảo mật tuyệt đối</p>
                  <p>• Không chia sẻ thông tin cho bên thứ ba trái phép</p>
                  <p>• Sử dụng thông tin chỉ để xử lý đơn hàng và hỗ trợ</p>
                  <p>• Khách hàng có quyền yêu cầu xóa thông tin cá nhân</p>
                </div>
              </div>

              {/* Intellectual Property */}
              <div className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  4. Sở hữu trí tuệ
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Toàn bộ nội dung website thuộc bản quyền của LaptopStore</p>
                  <p>• Không được sao chép, sử dụng nội dung trái phép</p>
                  <p>• Logo, hình ảnh sản phẩm được bảo vệ bởi luật bản quyền</p>
                  <p>• Vi phạm sẽ bị xử lý theo quy định pháp luật</p>
                </div>
              </div>

              {/* Dispute Resolution */}
              <div className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  5. Giải quyết tranh chấp
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Ưu tiên giải quyết tranh chấp bằng thương lượng</p>
                  <p>• Nếu không thỏa thuận được, sẽ đưa ra tòa án có thẩm quyền</p>
                  <p>• Áp dụng pháp luật Việt Nam để giải quyết</p>
                  <p>• Khách hàng có thể khiếu nại qua hotline hoặc email</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Updates */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Cập nhật điều khoản
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  IT-Global có quyền thay đổi, bổ sung các điều khoản này bất cứ lúc nào mà không cần 
                  thông báo trước. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website.
                </p>
                <p>
                  Chúng tôi khuyến khích khách hàng thường xuyên kiểm tra trang này để cập nhật 
                  những thay đổi mới nhất.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">
                    Lần cập nhật cuối: 28 tháng 7, 2025
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
              Có thắc mắc về điều khoản?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Liên hệ với chúng tôi để được tư vấn và giải đáp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Liên hệ ngay
              </a>
              <a
                href="mailto:legal@laptopstore.vn"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Email: info@it-global.net
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Terms
