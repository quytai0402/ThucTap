import React from 'react'
import Head from 'next/head'
import Layout from '../src/components/Layout'
import { 
  QuestionMarkCircleIcon, 
  ChatBubbleLeftRightIcon, 
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon 
} from '@heroicons/react/24/outline'

const FAQ: React.FC = () => {
  const faqs = [
    {
      category: 'Sản phẩm',
      questions: [
        {
          q: 'Laptop có phải hàng chính hãng không?',
          a: 'Tất cả sản phẩm tại LaptopStore đều là hàng chính hãng 100%, có tem niêm phong và đầy đủ giấy tờ bảo hành từ hãng.'
        },
        {
          q: 'Tôi có thể kiểm tra hàng trước khi nhận không?',
          a: 'Có, bạn có thể kiểm tra tình trạng bên ngoài sản phẩm trước khi thanh toán. Tuy nhiên không được bật máy để kiểm tra.'
        },
        {
          q: 'Sản phẩm có sẵn phần mềm không?',
          a: 'Laptop được cài sẵn Windows bản quyền. Chúng tôi hỗ trợ cài đặt thêm phần mềm cơ bản miễn phí khi mua hàng.'
        }
      ]
    },
    {
      category: 'Đặt hàng',
      questions: [
        {
          q: 'Làm thế nào để đặt hàng?',
          a: 'Bạn có thể đặt hàng trực tuyến qua website, gọi điện hotline 1900-1234, hoặc đến trực tiếp cửa hàng.'
        },
        {
          q: 'Tôi có thể thay đổi đơn hàng sau khi đặt không?',
          a: 'Bạn có thể thay đổi hoặc hủy đơn hàng trước khi chúng tôi xác nhận và chuẩn bị hàng (thường trong 2 giờ đầu).'
        },
        {
          q: 'Đơn hàng bao lâu được xác nhận?',
          a: 'Đơn hàng sẽ được xác nhận trong vòng 30 phút - 2 giờ làm việc sau khi đặt hàng thành công.'
        }
      ]
    },
    {
      category: 'Thanh toán',
      questions: [
        {
          q: 'Có những phương thức thanh toán nào?',
          a: 'Chúng tôi hỗ trợ thanh toán tiền mặt, chuyển khoản, thẻ ATM, thẻ tín dụng, ví điện tử và trả góp 0%.'
        },
        {
          q: 'Có thể trả góp với lãi suất 0% không?',
          a: 'Có, chúng tôi hỗ trợ trả góp 0% lãi suất qua các ngân hàng đối tác cho đơn hàng từ 5 triệu đồng.'
        },
        {
          q: 'Khi nào tôi cần thanh toán?',
          a: 'Đối với đơn hàng COD: thanh toán khi nhận hàng. Đối với chuyển khoản: thanh toán trước để xác nhận đơn hàng.'
        }
      ]
    },
    {
      category: 'Giao hàng',
      questions: [
        {
          q: 'Thời gian giao hàng bao lâu?',
          a: 'Nội thành TP.HCM và Hà Nội: 2-4 giờ. Tỉnh thành khác: 1-3 ngày làm việc tùy khoảng cách.'
        },
        {
          q: 'Phí giao hàng như thế nào?',
          a: 'Miễn phí giao hàng cho đơn từ 5 triệu đồng. Dưới 5 triệu tính phí 30.000đ nội thành, 50.000đ ngoại thành.'
        },
        {
          q: 'Tôi không ở nhà thì sao?',
          a: 'Shipper sẽ gọi điện trước khi giao. Nếu không liên lạc được, đơn hàng sẽ được giao lại lần sau hoặc gửi đến địa chỉ khác.'
        }
      ]
    },
    {
      category: 'Bảo hành',
      questions: [
        {
          q: 'Thời gian bảo hành bao lâu?',
          a: 'Thời gian bảo hành phụ thuộc vào từng hãng và sản phẩm, thường từ 12-36 tháng. Thông tin chi tiết có trên phiếu bảo hành.'
        },
        {
          q: 'Bảo hành ở đâu?',
          a: 'Bảo hành tại các trung tâm bảo hành chính hãng của hãng hoặc tại cửa hàng LaptopStore (với một số lỗi nhỏ).'
        },
        {
          q: 'Những trường hợp nào không được bảo hành?',
          a: 'Hư hỏng do va đập, rơi vỡ, ngấm nước, cháy nổ, tự ý tháo máy, hoặc sử dụng sai cách theo hướng dẫn.'
        }
      ]
    },
    {
      category: 'Đổi trả',
      questions: [
        {
          q: 'Tôi có thể đổi trả sản phẩm không?',
          a: 'Có, bạn có thể đổi trả trong vòng 7 ngày với điều kiện sản phẩm còn nguyên seal, đầy đủ phụ kiện và hộp.'
        },
        {
          q: 'Quy trình đổi trả như thế nào?',
          a: 'Liên hệ hotline để thông báo -> Mang sản phẩm đến cửa hàng -> Kiểm tra điều kiện -> Đổi/trả/hoàn tiền.'
        },
        {
          q: 'Chi phí đổi trả ai chịu?',
          a: 'Nếu lỗi từ nhà sản xuất: chúng tôi chịu phí. Nếu khách hàng đổi ý: khách hàng chịu phí vận chuyển và 3% phí xử lý.'
        }
      ]
    }
  ]

  const contactMethods = [
    {
      icon: PhoneIcon,
      title: 'Hotline',
      info: '1900-1234',
      description: '24/7 - Miễn phí'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      info: 'Chat ngay',
      description: '8:00 - 22:00 hàng ngày'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      info: 'support@laptopstore.vn',
      description: 'Phản hồi trong 2 giờ'
    }
  ]

  return (
    <>
      <Head>
        <title>Câu hỏi thường gặp - LaptopStore</title>
        <meta name="description" content="Câu hỏi thường gặp và giải đáp từ LaptopStore" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <QuestionMarkCircleIcon className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Câu hỏi thường gặp
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Tìm câu trả lời nhanh chóng cho những thắc mắc phổ biến
              </p>
            </div>
          </div>
        </div>

        {/* Search FAQ */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors">
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="bg-gray-50 rounded-lg overflow-hidden">
                      <details className="group">
                        <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-100 transition-colors">
                          <h3 className="text-lg font-semibold text-gray-900 pr-4">
                            {faq.q}
                          </h3>
                          <div className="flex-shrink-0">
                            <svg 
                              className="w-6 h-6 text-gray-500 group-open:rotate-180 transition-transform" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </summary>
                        <div className="px-6 pb-6">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Mẹo hữu ích
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <ClockIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Đặt hàng nhanh
                </h3>
                <p className="text-gray-600">
                  Tạo tài khoản và lưu thông tin để đặt hàng nhanh chóng trong những lần sau.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tư vấn miễn phí
                </h3>
                <p className="text-gray-600">
                  Chat trực tiếp với chuyên viên để được tư vấn sản phẩm phù hợp nhất.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <EnvelopeIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nhận ưu đãi
                </h3>
                <p className="text-gray-600">
                  Đăng ký email để nhận thông báo khuyến mãi và ưu đãi đặc biệt.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Không tìm thấy câu trả lời?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => (
                <div key={index} className="text-center p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <method.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-lg font-medium text-blue-600 mb-1">
                    {method.info}
                  </p>
                  <p className="text-sm text-gray-600">
                    {method.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Still Need Help */}
        <div className="py-16 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Vẫn cần hỗ trợ thêm?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Liên hệ trực tiếp với chúng tôi qua các kênh sau
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Gửi tin nhắn
              </a>
              <a
                href="tel:19001234"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Gọi ngay: 1900-1234
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default FAQ
