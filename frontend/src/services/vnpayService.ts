import crypto from 'crypto';
import { VNPAY_CONFIG, VNPAY_PAYMENT_TYPES } from '../config/vnpay';

export interface VNPayPaymentData {
  orderId: string;
  amount: number;
  orderInfo: string;
  paymentType: string;
  bankCode?: string;
  locale?: string;
}

export interface VNPayResponse {
  code: string;
  message: string;
  data?: string; // Payment URL
}

export class VNPayService {
  // Tạo URL thanh toán VNPay
  static createPaymentUrl(paymentData: VNPayPaymentData): string {
    const {
      orderId,
      amount,
      orderInfo,
      paymentType,
      bankCode,
      locale = 'vn'
    } = paymentData;

    // Tạo timestamp
    const date = new Date();
    const createDate = date.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
    const expireDate = new Date(date.getTime() + 15 * 60 * 1000)
      .toISOString().replace(/[-:]/g, '').replace(/\..+/, '');

    // Tham số VNPay
    const vnpParams: { [key: string]: string } = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: VNPAY_CONFIG.vnp_TmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: (amount * 100).toString(), // VNPay yêu cầu * 100
      vnp_ReturnUrl: VNPAY_CONFIG.vnp_ReturnUrl,
      vnp_IpAddr: '127.0.0.1', // Sẽ được backend thay thế bằng IP thật
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    // Thêm bankCode nếu có
    if (bankCode && bankCode !== '') {
      vnpParams.vnp_BankCode = bankCode;
    }

    // Sắp xếp tham số theo alphabet
    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((result: { [key: string]: string }, key) => {
        result[key] = vnpParams[key];
        return result;
      }, {});

    // Tạo query string
    const queryString = Object.keys(sortedParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(sortedParams[key])}`)
      .join('&');

    // Tạo secure hash
    const secureHash = crypto
      .createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret)
      .update(Buffer.from(queryString, 'utf-8'))
      .digest('hex');

    // URL thanh toán cuối cùng
    const paymentUrl = `${VNPAY_CONFIG.vnp_Url}?${queryString}&vnp_SecureHash=${secureHash}`;

    return paymentUrl;
  }

  // Verify return từ VNPay
  static verifyReturnUrl(vnpParams: { [key: string]: string }): boolean {
    const secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    // Sắp xếp tham số
    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((result: { [key: string]: string }, key) => {
        result[key] = vnpParams[key];
        return result;
      }, {});

    // Tạo query string để verify
    const queryString = Object.keys(sortedParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(sortedParams[key])}`)
      .join('&');

    // Tạo hash để so sánh
    const checkHash = crypto
      .createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret)
      .update(Buffer.from(queryString, 'utf-8'))
      .digest('hex');

    return secureHash === checkHash;
  }

  // Parse response code
  static parseResponseCode(code: string): { success: boolean; message: string } {
    const responseCodes: { [key: string]: string } = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
    };

    return {
      success: code === '00',
      message: responseCodes[code] || 'Lỗi không xác định'
    };
  }

  // Tạo link thanh toán cho từng loại thẻ
  static createCreditCardPayment(orderId: string, amount: number, cardType: 'VISA' | 'MASTERCARD' | 'JCB'): string {
    return this.createPaymentUrl({
      orderId,
      amount,
      orderInfo: `Thanh toán đơn hàng ${orderId} - ${cardType}`,
      paymentType: VNPAY_PAYMENT_TYPES.CREDIT_CARD,
      bankCode: cardType
    });
  }

  // Tạo link thanh toán QR
  static createQRPayment(orderId: string, amount: number): string {
    return this.createPaymentUrl({
      orderId,
      amount,
      orderInfo: `Thanh toán QR đơn hàng ${orderId}`,
      paymentType: VNPAY_PAYMENT_TYPES.QR_CODE,
      bankCode: 'VNPAYQR'
    });
  }

  // Tạo link thanh toán ATM
  static createATMPayment(orderId: string, amount: number, bankCode: string): string {
    return this.createPaymentUrl({
      orderId,
      amount,
      orderInfo: `Thanh toán ATM đơn hàng ${orderId}`,
      paymentType: VNPAY_PAYMENT_TYPES.ATM_CARD,
      bankCode
    });
  }
}

export const vnpayService = new VNPayService();
export default vnpayService;
