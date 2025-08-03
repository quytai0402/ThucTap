import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../src/components/Layout'
import { 
  CreditCardIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

const Payment: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('credit-card')

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Thẻ tín dụng/Ghi nợ',
      icon: CreditCardIcon,
      description: 'Visa, Mastercard, JCB, American Express',
      processingTime: 'Ngay lập tức',
      fee: 'Miễn phí',
      benefits: [
        'Thanh toán an toàn với 3D Secure',
        'Hỗ trợ trả góp 0% với một số ngân hàng',
        'Tích lũy điểm thưởng từ ngân hàng',
        'Bảo vệ giao dịch tốt nhất'
      ],
      supportedCards: ['Visa', 'Mastercard', 'JCB', 'American Express'],
      installmentBanks: ['Sacombank', 'Techcombank', 'VPBank', 'HSBC']
    },
    {
      id: 'bank-transfer',
      name: 'Chuyển khoản ngân hàng',
      icon: BuildingLibraryIcon,
      description: 'Internet Banking, Mobile Banking',
      processingTime: '15-30 phút',
      fee: 'Miễn phí',
      benefits: [
        'Không giới hạn số tiền giao dịch',
        'Bảo mật cao với OTP',
        'Có thể chuyển từ nhiều ngân hàng',
        'Lưu lại lịch sử giao dịch'
      ],
      supportedBanks: ['Vietcombank', 'BIDV', 'Vietinbank', 'Agribank', 'Sacombank', 'Techcombank'],
      accountInfo: {
        bank: 'Ngân hàng Vietcombank',
        accountNumber: '0123456789',
        accountName: 'CONG TY TNHH LAPTOPSTORE',
        branch: 'Chi nhánh TP.HCM'
      }
    },
    {
      id: 'e-wallet',
      name: 'Ví điện tử',
      icon: DevicePhoneMobileIcon,
      description: 'MoMo, ZaloPay, VNPay, ShopeePay',
      processingTime: 'Ngay lập tức',
      fee: 'Miễn phí',
      benefits: [
        'Thanh toán nhanh chóng bằng QR Code',
        'Ưu đãi và cashback từ ví điện tử',
        'Không cần nhập thông tin thẻ',
        'Hỗ trợ thanh toán 24/7'
      ],
      supportedWallets: ['MoMo', 'ZaloPay', 'VNPay', 'ShopeePay', 'AirPay']
    },
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng (COD)',
      icon: TruckIcon,
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      processingTime: 'Khi giao hàng',
      fee: '30.000đ (đơn hàng < 5 triệu)',
      benefits: [
        'Kiểm tra hàng trước khi thanh toán',
        'Không cần tài khoản ngân hàng',
        'An toàn cho người mua',
        'Phù hợp với mọi đối tượng'
      ],
      limitations: [
        'Chỉ áp dụng với đơn hàng < 50 triệu',
        'Không áp dụng cho một số khu vực xa',
        'Có thể mất nhiều thời gian xử lý'
      ]
    }
  ]

  const securityFeatures = [
    {
      icon: LockClosedIcon,
      title: 'Mã hóa SSL 256-bit',
      description: 'Tất cả thông tin thanh toán được mã hóa và bảo vệ'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Xác thực 3D Secure',
      description: 'Lớp bảo mật bổ sung cho giao dịch thẻ tín dụng'
    },
    {
      icon: CheckCircleIcon,
      title: 'PCI DSS Compliant',
      description: 'Tuân thủ tiêu chuẩn bảo mật thanh toán quốc tế'
    }
  ]

  const installmentOptions = [
    {
      bank: 'Sacombank',
      months: [3, 6, 9, 12, 18, 24],
      rate: '0%',
      minAmount: '3.000.000đ',
      conditions: 'Áp dụng cho laptop từ 15 triệu'
    },
    {
      bank: 'Techcombank',
      months: [6, 12, 18, 24],
      rate: '0%',
      minAmount: '5.000.000đ', 
      conditions: 'Áp dụng cho laptop gaming và workstation'
    },
    {
      bank: 'VPBank',
      months: [3, 6, 9, 12],
      rate: '0%',
      minAmount: '2.000.000đ',
      conditions: 'Áp dụng cho khách hàng Priority'
    },
    {
      bank: 'HSBC',
      months: [6, 12, 24, 36],
      rate: '0%',
      minAmount: '10.000.000đ',
      conditions: 'Áp dụng cho thẻ tín dụng Platinum trở lên'
    }
  ]

  const paymentPolicies = [
    {
      title: 'Chính sách hoàn tiền',
      content: 'Hoàn tiền trong vòng 3-7 ngày làm việc tùy theo phương thức thanh toán. Thẻ tín dụng: 3-5 ngày, chuyển khoản: 1-3 ngày, ví điện tử: ngay lập tức.'
    },
    {
      title: 'Xử lý giao dịch thất bại',
      content: 'Nếu giao dịch thất bại, số tiền sẽ được hoàn về tài khoản trong 24-48 giờ. Vui lòng liên hệ ngân hàng nếu không nhận được tiền sau thời gian này.'
    },
    {
      title: 'Bảo mật thông tin',
      content: 'Chúng tôi không lưu trữ thông tin thẻ tín dụng. Tất cả giao dịch được xử lý qua cổng thanh toán an toàn của ngân hàng và đối tác.'
    },
    {
      title: 'Hóa đơn VAT',
      content: 'Hóa đơn VAT được xuất trong vòng 3 ngày làm việc sau khi thanh toán thành công. Khách hàng có thể yêu cầu hóa đơn điện tử hoặc giấy.'
    }
  ]

  const paymentSteps = [
    {
      step: 1,
      title: 'Chọn sản phẩm',
      description: 'Thêm sản phẩm vào giỏ hàng và kiểm tra thông tin'
    },
    {
      step: 2,
      title: 'Chọn phương thức thanh toán',
      description: 'Lựa chọn phương thức thanh toán phù hợp'
    },
    {
      step: 3,
      title: 'Nhập thông tin',
      description: 'Điền thông tin giao hàng và thanh toán'
    },
    {
      step: 4,
      title: 'Xác nhận thanh toán',
      description: 'Xác nhận và thực hiện thanh toán an toàn'
    },
    {
      step: 5,
      title: 'Hoàn tất đơn hàng',
      description: 'Nhận xác nhận và theo dõi đơn hàng'
    }
  ]

  return (
    <>
      <Head>
        <title>Phương thức thanh toán - IT-Global</title>
        <meta name="description" content="Các phương thức thanh toán an toàn và tiện lợi tại LaptopStore - Thẻ tín dụng, chuyển khoản, ví điện tử, COD" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <CreditCardIcon className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Phương thức thanh toán
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Thanh toán an toàn, tiện lợi với nhiều lựa chọn phù hợp
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Các phương thức thanh toán
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Chọn phương thức thanh toán phù hợp với nhu cầu của bạn
              </p>
            </div>
            
            {/* Payment Method Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedMethod === method.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {method.name}
                </button>
              ))}
            </div>

            {/* Payment Method Details */}
            {paymentMethods.map((method) => (
              selectedMethod === method.id && (
                <div key={method.id} className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <method.icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-gray-600">{method.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span className="font-medium text-gray-900">Thời gian xử lý</span>
                          </div>
                          <span className="text-green-600 font-semibold">{method.processingTime}</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <CurrencyDollarIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span className="font-medium text-gray-900">Phí giao dịch</span>
                          </div>
                          <span className="text-green-600 font-semibold">{method.fee}</span>
                        </div>
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-3">Ưu điểm:</h4>
                      <ul className="space-y-2">
                        {method.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>

                      {method.limitations && (
                        <>
                          <h4 className="font-semibold text-gray-900 mb-3 mt-6">Lưu ý:</h4>
                          <ul className="space-y-2">
                            {method.limitations.map((limitation, index) => (
                              <li key={index} className="flex items-start text-sm text-gray-600">
                                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                                {limitation}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                    
                    <div>
                      {method.supportedCards && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Thẻ được hỗ trợ:</h4>
                          <div className="flex flex-wrap gap-2">
                            {method.supportedCards.map((card, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                              >
                                {card}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {method.supportedBanks && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Ngân hàng hỗ trợ:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {method.supportedBanks.map((bank, index) => (
                              <span
                                key={index}
                                className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm text-center"
                              >
                                {bank}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {method.supportedWallets && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Ví điện tử hỗ trợ:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {method.supportedWallets.map((wallet, index) => (
                              <span
                                key={index}
                                className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm text-center"
                              >
                                {wallet}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {method.accountInfo && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Thông tin tài khoản:</h4>
                          <div className="space-y-1 text-sm">
                            <p><strong>Ngân hàng:</strong> {method.accountInfo.bank}</p>
                            <p><strong>Số tài khoản:</strong> {method.accountInfo.accountNumber}</p>
                            <p><strong>Tên tài khoản:</strong> {method.accountInfo.accountName}</p>
                            <p><strong>Chi nhánh:</strong> {method.accountInfo.branch}</p>
                          </div>
                        </div>
                      )}

                      {method.installmentBanks && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Trả góp 0%:</h4>
                          <div className="flex flex-wrap gap-2">
                            {method.installmentBanks.map((bank, index) => (
                              <span
                                key={index}
                                className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                              >
                                {bank}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Installment Options */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trả góp 0% lãi suất
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Sở hữu laptop yêu thích với các gói trả góp hấp dẫn
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {installmentOptions.map((option, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {option.bank}
                    </h3>
                    <div className="text-2xl font-bold text-orange-600">
                      {option.rate}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Kỳ hạn:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {option.months.map((month, monthIndex) => (
                          <span
                            key={monthIndex}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {month} tháng
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Số tiền tối thiểu:</span>
                      <p className="text-sm text-green-600 font-semibold">{option.minAmount}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Điều kiện:</span>
                      <p className="text-xs text-gray-600">{option.conditions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Bảo mật thanh toán
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Cam kết bảo vệ thông tin và giao dịch của khách hàng
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
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

        {/* Payment Process */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quy trình thanh toán
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                5 bước đơn giản để hoàn tất thanh toán
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {paymentSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    {index < paymentSteps.length - 1 && (
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

        {/* Payment Policies */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Chính sách thanh toán
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {paymentPolicies.map((policy, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {policy.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {policy.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="py-16 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Cần hỗ trợ thanh toán?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Liên hệ ngay với chúng tôi để được tư vấn về thanh toán
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:0987613161"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Hotline: 0987613161
              </a>
              <a
                href="/support"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Hỗ trợ trực tuyến
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Payment
