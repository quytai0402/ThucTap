import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../src/components/Layout'
import { 
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  UserGroupIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const Support: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    priority: '',
    subject: '',
    description: ''
  })

  const supportChannels = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      description: 'Hỗ trợ trực tuyến 24/7',
      action: 'Bắt đầu chat',
      available: true,
      responseTime: 'Trong vài phút'
    },
    {
      icon: PhoneIcon,
      title: 'Hotline',
      description: 'Gọi ngay để được hỗ trợ',
      action: '1900-1234',
      available: true,
      responseTime: 'Ngay lập tức'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      description: 'Gửi email chi tiết vấn đề',
      action: 'support@laptopstore.com',
      available: true,
      responseTime: 'Trong 24h'
    },
    {
      icon: UserGroupIcon,
      title: 'Tại cửa hàng',
      description: 'Hỗ trợ trực tiếp tại cửa hàng',
      action: 'Xem địa chỉ',
      available: true,
      responseTime: 'Ngay lập tức'
    }
  ]

  const faqCategories = [
    { id: 'all', name: 'Tất cả', count: 45 },
    { id: 'order', name: 'Đặt hàng', count: 12 },
    { id: 'payment', name: 'Thanh toán', count: 8 },
    { id: 'shipping', name: 'Vận chuyển', count: 10 },
    { id: 'warranty', name: 'Bảo hành', count: 9 },
    { id: 'return', name: 'Đổi trả', count: 6 }
  ]

  const faqs = [
    {
      id: 1,
      category: 'order',
      question: 'Làm thế nào để đặt hàng trên website?',
      answer: 'Bạn có thể đặt hàng bằng cách chọn sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán. Hệ thống sẽ hướng dẫn chi tiết từng bước.'
    },
    {
      id: 2,
      category: 'payment',
      question: 'Các phương thức thanh toán nào được hỗ trợ?',
      answer: 'Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng, ví điện tử và thanh toán khi nhận hàng (COD).'
    },
    {
      id: 3,
      category: 'shipping',
      question: 'Thời gian giao hàng là bao lâu?',
      answer: 'Thời gian giao hàng từ 1-3 ngày làm việc trong nội thành, 3-5 ngày cho các tỉnh khác. Giao hàng nhanh trong ngày có phí phụ thu.'
    },
    {
      id: 4,
      category: 'warranty',
      question: 'Chính sách bảo hành như thế nào?',
      answer: 'Tất cả sản phẩm đều có bảo hành chính hãng từ 12-36 tháng tùy từng hãng. Chúng tôi hỗ trợ bảo hành tại chỗ và đổi máy mới nếu lỗi từ NSX.'
    },
    {
      id: 5,
      category: 'return',
      question: 'Có thể đổi trả sản phẩm không?',
      answer: 'Bạn có thể đổi trả trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên vẹn, đầy đủ phụ kiện.'
    },
    {
      id: 6,
      category: 'order',
      question: 'Làm thế nào để theo dõi đơn hàng?',
      answer: 'Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi" sau khi đăng nhập, hoặc qua email/SMS thông báo.'
    }
  ]

  const ticketCategories = [
    'Vấn đề kỹ thuật',
    'Vấn đề đặt hàng',
    'Vấn đề thanh toán',
    'Vấn đề giao hàng',
    'Vấn đề bảo hành',
    'Khiếu nại dịch vụ',
    'Khác'
  ]

  const priorities = [
    { value: 'low', label: 'Thấp', color: 'green' },
    { value: 'medium', label: 'Trung bình', color: 'yellow' },
    { value: 'high', label: 'Cao', color: 'orange' },
    { value: 'urgent', label: 'Khẩn cấp', color: 'red' }
  ]

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle ticket submission
    console.log('Ticket submitted:', ticketForm)
    alert('Yêu cầu hỗ trợ đã được gửi thành công!')
  }

  return (
    <>
      <Head>
        <title>Hỗ trợ khách hàng - LaptopStore</title>
        <meta name="description" content="Trung tâm hỗ trợ khách hàng LaptopStore - FAQ, liên hệ, tạo ticket hỗ trợ" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <QuestionMarkCircleIcon className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Trung tâm hỗ trợ
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
              </p>
              
              {/* Quick Search */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm câu hỏi thường gặp..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pl-12 text-gray-900 rounded-full focus:outline-none focus:ring-4 focus:ring-white/30"
                  />
                  <MagnifyingGlassIcon className="absolute left-4 top-4.5 h-6 w-6 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Channels */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Kênh hỗ trợ
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Chọn kênh hỗ trợ phù hợp với nhu cầu của bạn
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportChannels.map((channel, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <channel.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{channel.title}</h3>
                      {channel.available && (
                        <div className="flex items-center text-sm text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Đang hoạt động
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{channel.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {channel.responseTime}
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      {channel.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Câu hỏi thường gặp
                </h2>
                
                {/* FAQ Categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8">
                    <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Không tìm thấy câu hỏi nào phù hợp</p>
                  </div>
                )}
              </div>
            </div>

            {/* Support Ticket Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Tạo yêu cầu hỗ trợ
                </h3>
                <p className="text-gray-600 mb-6">
                  Không tìm thấy câu trả lời? Gửi yêu cầu hỗ trợ cho chúng tôi
                </p>

                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketForm.name}
                      onChange={(e) => setTicketForm({...ticketForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={ticketForm.email}
                      onChange={(e) => setTicketForm({...ticketForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={ticketForm.phone}
                      onChange={(e) => setTicketForm({...ticketForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại vấn đề *
                    </label>
                    <select
                      required
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn loại vấn đề</option>
                      {ticketCategories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mức độ ưu tiên *
                    </label>
                    <select
                      required
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn mức độ ưu tiên</option>
                      {priorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiêu đề *
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mô tả ngắn gọn vấn đề"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả chi tiết *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Gửi yêu cầu hỗ trợ
                  </button>
                </form>
              </div>

              {/* Quick Links */}
              <div className="bg-gray-50 rounded-xl p-6 mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Liên kết hữu ích</h4>
                <div className="space-y-3">
                  <a href="/warranty" className="flex items-center text-blue-600 hover:text-blue-700">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Chính sách bảo hành
                  </a>
                  <a href="/return" className="flex items-center text-blue-600 hover:text-blue-700">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Chính sách đổi trả
                  </a>
                  <a href="/shipping" className="flex items-center text-blue-600 hover:text-blue-700">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Chính sách vận chuyển
                  </a>
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-700">
                    <VideoCameraIcon className="h-4 w-4 mr-2" />
                    Video hướng dẫn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Check */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kiểm tra trạng thái hỗ trợ
            </h2>
            <p className="text-gray-600 mb-8">
              Nhập mã ticket để kiểm tra tình trạng xử lý
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="text"
                placeholder="Nhập mã ticket..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors">
                Kiểm tra
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Support
