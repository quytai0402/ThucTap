import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../src/components/Layout'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Địa chỉ cửa hàng',
      details: [
        '2/1/15 đường 40, F Hiệp Bình Chánh, Tp. Thủ Đức',
        'TP. Hồ Chí Minh, Việt Nam'
      ]
    },
    {
      icon: PhoneIcon,
      title: 'Số điện thoại',
      details: [
        'Hotline: +84 987.613.161',
        'Zalo: 0987613161'
      ]
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: [
        'info@it-global.net',
        'support@it-global.net'
      ]
    },
    {
      icon: ClockIcon,
      title: 'Giờ làm việc',
      details: [
        'Thứ 2 - Thứ 7: 8:00 - 20:00',
        'Chủ nhật: 9:00 - 18:00'
      ]
    }
  ]

  const stores = [
    {
      name: 'Chi nhánh Quận 1',
      address: '123 Đường Nguyễn Văn Cừ, Quận 1, TP.HCM',
      phone: '028-1234-5678',
      hours: '8:00 - 20:00'
    },
    {
      name: 'Chi nhánh Quận 3',
      address: '456 Đường Võ Văn Tần, Quận 3, TP.HCM',
      phone: '028-1234-5679',
      hours: '8:00 - 20:00'
    },
    {
      name: 'Chi nhánh Hà Nội',
      address: '789 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội',
      phone: '024-1234-5680',
      hours: '8:00 - 20:00'
    }
  ]

  return (
    <>
      <Head>
        <title>Liên hệ - IT-Global</title>
        <meta name="description" content="Liên hệ với LaptopStore để được tư vấn và hỗ trợ" />
      </Head>

      <Layout>
       {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern.svg')] bg-cover bg-center pointer-events-none"></div>

          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-xl mb-6 break-words">
              Kết nối với chúng tôi
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-10 text-white/90 leading-relaxed">
              Luôn sẵn sàng hỗ trợ bạn mọi lúc – vì trải nghiệm mua sắm của bạn là ưu tiên hàng đầu.
            </p>
          </div>
        </section>


        {/* Contact Info */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form & Map */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Gửi tin nhắn cho chúng tôi
                </h2>
                
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Cảm ơn bạn đã liên hệ!
                    </h3>
                    <p className="text-gray-600">
                      Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                      Gửi tin nhắn khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Chủ đề *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Chọn chủ đề</option>
                          <option value="product">Tư vấn sản phẩm</option>
                          <option value="support">Hỗ trợ kỹ thuật</option>
                          <option value="warranty">Bảo hành</option>
                          <option value="complaint">Khiếu nại</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Tin nhắn *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tin nhắn của bạn..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                    </button>
                  </form>
                )}
              </div>

              {/* Map */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Tìm đường đến cửa hàng
                </h2>
                <div className="bg-gray-200 rounded-lg h-64 mb-6 flex items-center justify-center">
                  <p className="text-gray-600">Bản đồ Google Maps sẽ được tích hợp tại đây</p>
                </div>
                <div className="space-y-4">
                  {stores.map((store, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h3 className="font-semibold text-gray-900">{store.name}</h3>
                      <p className="text-gray-600 text-sm">{store.address}</p>
                      <p className="text-gray-600 text-sm">SĐT: {store.phone}</p>
                      <p className="text-gray-600 text-sm">Giờ mở cửa: {store.hours}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Câu hỏi thường gặp
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Một số câu hỏi thường gặp từ khách hàng
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Tôi có thể đổi trả sản phẩm không?
                  </h3>
                  <p className="text-gray-600">
                    Có, bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày mua với điều kiện sản phẩm còn nguyên vẹn.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Thời gian bảo hành là bao lâu?
                  </h3>
                  <p className="text-gray-600">
                    Thời gian bảo hành phụ thuộc vào từng sản phẩm, thường từ 12-36 tháng theo chính sách của nhà sản xuất.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Có hỗ trợ trả góp không?
                  </h3>
                  <p className="text-gray-600">
                    Có, chúng tôi hỗ trợ trả góp 0% lãi suất qua các ngân hàng và công ty tài chính uy tín.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Phí giao hàng như thế nào?
                  </h3>
                  <p className="text-gray-600">
                    Miễn phí giao hàng cho đơn hàng trên 5 triệu đồng trong nội thành. Các khu vực khác tính phí theo khoảng cách.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Có thể xem hàng trước khi mua không?
                  </h3>
                  <p className="text-gray-600">
                    Có, bạn có thể đến showroom để xem và trải nghiệm sản phẩm trước khi quyết định mua.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Có hỗ trợ cài đặt phần mềm không?
                  </h3>
                  <p className="text-gray-600">
                    Có, chúng tôi hỗ trợ cài đặt phần mềm cơ bản miễn phí khi mua laptop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Contact
