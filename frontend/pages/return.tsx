import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../src/components/Layout'
import { 
  ArrowPathIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  CameraIcon,
  TruckIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

const Return: React.FC = () => {
  const [returnForm, setReturnForm] = useState({
    orderNumber: '',
    productName: '',
    reason: '',
    description: '',
    customerName: '',
    email: '',
    phone: ''
  })

  const returnReasons = [
    'Sản phẩm bị lỗi/hư hỏng',
    'Sản phẩm không đúng mô tả',
    'Giao sai sản phẩm',
    'Thay đổi ý định mua hàng',
    'Tìm được giá tốt hơn',
    'Sản phẩm không phù hợp nhu cầu',
    'Lý do khác'
  ]

  const returnConditions = [
    {
      icon: ClockIcon,
      title: 'Trong vòng 7 ngày',
      description: 'Kể từ ngày nhận hàng (không bao gồm chủ nhật và ngày lễ)',
      valid: true
    },
    {
      icon: CheckCircleIcon,
      title: 'Sản phẩm nguyên vẹn',
      description: 'Còn nguyên tem, nhãn, bao bì, phụ kiện đầy đủ',
      valid: true
    },
    {
      icon: DocumentTextIcon,
      title: 'Có hóa đơn mua hàng',
      description: 'Hóa đơn VAT hoặc phiếu bảo hành/mua hàng',
      valid: true
    },
    {
      icon: XCircleIcon,
      title: 'Không sử dụng',
      description: 'Sản phẩm chưa qua sử dụng, không có dấu hiệu hư hỏng',
      valid: true
    }
  ]

  const returnProcess = [
    {
      step: 1,
      title: 'Liên hệ yêu cầu đổi trả',
      description: 'Gọi hotline hoặc gửi form yêu cầu đổi trả',
      time: 'Ngay lập tức',
      actions: ['Hotline: 1900-1234', 'Email: return@laptopstore.com', 'Form online']
    },
    {
      step: 2,
      title: 'Xác nhận yêu cầu',
      description: 'Nhân viên xác nhận điều kiện và hướng dẫn',
      time: '2-4 giờ',
      actions: ['Kiểm tra đơn hàng', 'Xác nhận điều kiện', 'Cấp mã RMA']
    },
    {
      step: 3,
      title: 'Gửi hàng về',
      description: 'Đóng gói và gửi sản phẩm về cửa hàng',
      time: '1-3 ngày',
      actions: ['Đóng gói cẩn thận', 'Dán nhãn RMA', 'Gửi qua bưu điện']
    },
    {
      step: 4,
      title: 'Kiểm tra sản phẩm',
      description: 'Kiểm tra tình trạng và xác định phương án xử lý',
      time: '1-2 ngày',
      actions: ['Kiểm tra ngoại quan', 'Test chức năng', 'Xác định phương án']
    },
    {
      step: 5,
      title: 'Hoàn tất xử lý',
      description: 'Đổi sản phẩm mới hoặc hoàn tiền',
      time: '1-3 ngày',
      actions: ['Đổi sản phẩm mới', 'Hoàn tiền', 'Thông báo kết quả']
    }
  ]

  const exchangePolicy = [
    {
      type: 'Đổi cùng model',
      condition: 'Sản phẩm cùng model, cùng cấu hình',
      fee: 'Miễn phí',
      timeframe: '7 ngày',
      note: 'Đổi ngay tại cửa hàng nếu có hàng'
    },
    {
      type: 'Đổi model khác',
      condition: 'Đổi sang model khác cùng giá trị',
      fee: 'Phí xử lý: 50.000đ',
      timeframe: '7 ngày',
      note: 'Bù trừ chênh lệch nếu có'
    },
    {
      type: 'Đổi model cao cấp hơn',
      condition: 'Nâng cấp lên model có giá trị cao hơn',
      fee: 'Phí xử lý: 100.000đ + chênh lệch giá',
      timeframe: '7 ngày',
      note: 'Thanh toán thêm chênh lệch'
    }
  ]

  const refundPolicy = [
    {
      reason: 'Lỗi từ nhà sản xuất',
      refundPercent: '100%',
      timeframe: '3-5 ngày làm việc',
      method: 'Chuyển khoản/Tiền mặt'
    },
    {
      reason: 'Giao sai sản phẩm',
      refundPercent: '100%',
      timeframe: '3-5 ngày làm việc', 
      method: 'Chuyển khoản/Tiền mặt'
    },
    {
      reason: 'Thay đổi ý định (>3 ngày)',
      refundPercent: '95%',
      timeframe: '5-7 ngày làm việc',
      method: 'Chuyển khoản'
    },
    {
      reason: 'Thay đổi ý định (>5 ngày)',
      refundPercent: '90%',
      timeframe: '7-10 ngày làm việc',
      method: 'Chuyển khoản'
    }
  ]

  const nonReturnableItems = [
    'Sản phẩm đã qua sử dụng, có dấu hiệu hư hỏng do người dùng',
    'Sản phẩm bị mất tem, nhãn bảo hành',
    'Sản phẩm thiếu phụ kiện, hộp, tài liệu',
    'Laptop đã cài đặt phần mềm không bản quyền',
    'Sản phẩm có dữ liệu cá nhân chưa được xóa',
    'Quá thời hạn đổi trả (7 ngày)',
    'Sản phẩm theo yêu cầu đặc biệt'
  ]

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Return request:', returnForm)
    alert('Yêu cầu đổi trả đã được gửi thành công!')
  }

  return (
    <>
      <Head>
        <title>Chính sách đổi trả - IT-Global</title>
        <meta name="description" content="Chính sách đổi trả sản phẩm tại IT-Global - Điều kiện, quy trình và thời gian xử lý" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <ArrowPathIcon className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Chính sách đổi trả
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Đổi trả dễ dàng, hoàn tiền nhanh chóng trong vòng 7 ngày
              </p>
            </div>
          </div>
        </div>

        {/* Quick Return Form */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Yêu cầu đổi trả nhanh
                </h2>
                <p className="text-gray-600">
                  Điền form dưới đây để gửi yêu cầu đổi trả, chúng tôi sẽ liên hệ trong 2-4 giờ
                </p>
              </div>
              
              <form onSubmit={handleReturnSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã đơn hàng *
                  </label>
                  <input
                    type="text"
                    required
                    value={returnForm.orderNumber}
                    onChange={(e) => setReturnForm({...returnForm, orderNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="VD: DH001234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    value={returnForm.productName}
                    onChange={(e) => setReturnForm({...returnForm, productName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="VD: MacBook Pro M3 14 inch"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={returnForm.customerName}
                    onChange={(e) => setReturnForm({...returnForm, customerName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={returnForm.email}
                    onChange={(e) => setReturnForm({...returnForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={returnForm.phone}
                    onChange={(e) => setReturnForm({...returnForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lý do đổi trả *
                  </label>
                  <select
                    required
                    value={returnForm.reason}
                    onChange={(e) => setReturnForm({...returnForm, reason: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Chọn lý do</option>
                    {returnReasons.map((reason, index) => (
                      <option key={index} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả chi tiết *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={returnForm.description}
                    onChange={(e) => setReturnForm({...returnForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Mô tả chi tiết vấn đề và tình trạng sản phẩm..."
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Gửi yêu cầu đổi trả
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Return Conditions */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Điều kiện đổi trả
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Sản phẩm cần đáp ứng đầy đủ các điều kiện sau để được đổi trả
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {returnConditions.map((condition, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <condition.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {condition.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {condition.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Return Process */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quy trình đổi trả
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                5 bước đơn giản để thực hiện đổi trả sản phẩm
              </p>
            </div>
            
            <div className="space-y-8">
              {returnProcess.map((step, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {step.title}
                        </h3>
                        <div className="flex items-center text-sm text-orange-600">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {step.time}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {step.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {step.actions.map((action, actionIndex) => (
                          <span
                            key={actionIndex}
                            className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exchange & Refund Policies */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Exchange Policy */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Chính sách đổi hàng
                </h2>
                <div className="space-y-4">
                  {exchangePolicy.map((policy, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{policy.type}</h3>
                        <span className="text-sm text-orange-600 font-medium">{policy.timeframe}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{policy.condition}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 font-medium">{policy.fee}</span>
                        <span className="text-gray-500">{policy.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refund Policy */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Chính sách hoàn tiền
                </h2>
                <div className="space-y-4">
                  {refundPolicy.map((policy, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{policy.reason}</h3>
                        <span className="text-lg text-green-600 font-bold">{policy.refundPercent}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {policy.timeframe}
                        </div>
                        <span>{policy.method}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Non-returnable Items */}
        <div className="py-16 bg-red-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Những trường hợp không được đổi trả
              </h2>
              <p className="text-gray-600">
                Vui lòng lưu ý các trường hợp sau không được áp dụng chính sách đổi trả
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-red-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nonReturnableItems.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <XCircleIcon className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="py-16 bg-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-8 border border-blue-200">
              <div className="flex items-center mb-6">
                <InformationCircleIcon className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Lưu ý quan trọng
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Trước khi gửi hàng:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CameraIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                      Chụp ảnh sản phẩm và đóng gói cẩn thận
                    </li>
                    <li className="flex items-start">
                      <DocumentTextIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                      Bao gồm hóa đơn và tất cả phụ kiện
                    </li>
                    <li className="flex items-start">
                      <CalendarIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                      Liên hệ trước để được cấp mã RMA
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Phí vận chuyển:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <TruckIcon className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                      Miễn phí nếu lỗi từ cửa hàng
                    </li>
                    <li className="flex items-start">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2 mt-0.5 text-orange-500" />
                      Khách hàng chịu phí nếu đổi ý
                    </li>
                    <li className="flex items-start">
                      <ShieldCheckIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                      Bảo hiểm hàng hóa khi vận chuyển
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Cần hỗ trợ đổi trả?
            </h2>
            <p className="text-xl mb-8 text-orange-100">
              Liên hệ ngay với chúng tôi để được tư vấn về đổi trả
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:19001234"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Hotline: 0987613161
              </a>
              <a
                href="mailto:return@laptopstore.com"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                return@it-global.com
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Return
