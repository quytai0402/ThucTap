// VNPay Configuration - Production Ready
export const VNPAY_CONFIG = {
  // Production VNPay Gateway
  vnp_Url: "https://pay.vnpay.vn/vpcpay.html",
  vnp_Api: "https://pay.vnpay.vn/merchant_webapi/merchant.html",
  vnp_ReturnUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/payment-return`,
  
  // Merchant Info - CẦN ĐĂNG KÝ VỚI VNPAY
  vnp_TmnCode: process.env.VNPAY_TMN_CODE || "DEMO_TMN_CODE", // Mã merchant từ VNPay
  vnp_HashSecret: process.env.VNPAY_HASH_SECRET || "DEMO_HASH_SECRET", // Key bảo mật từ VNPay
  
  // Bank Account Info - Tài khoản nhận tiền
  merchant_bank_account: "8866997979",
  merchant_bank_name: "TECHCOMBANK",
  merchant_name: "TRAN QUY TAI",
  
  // Supported Banks
  supported_banks: [
    { code: "VNPAYQR", name: "Thanh toán bằng QR Code" },
    { code: "VNBANK", name: "Thẻ ATM - Tài khoản ngân hàng" },
    { code: "INTCARD", name: "Thẻ thanh toán quốc tế" },
    { code: "VISA", name: "Thẻ VISA" },
    { code: "MASTERCARD", name: "Thẻ MASTERCARD" },
    { code: "JCB", name: "Thẻ JCB" },
    { code: "TCB", name: "Techcombank" },
    { code: "VCB", name: "Vietcombank" },
    { code: "VTB", name: "Vietinbank" },
    { code: "BIDV", name: "BIDV" },
    { code: "ACB", name: "ACB" },
    { code: "MB", name: "MB Bank" },
  ]
};

// VNPay Payment Types
export const VNPAY_PAYMENT_TYPES = {
  QR_CODE: "VNPAYQR",
  ATM_CARD: "VNBANK", 
  CREDIT_CARD: "INTCARD",
  VISA: "VISA",
  MASTERCARD: "MASTERCARD",
  JCB: "JCB"
};

// Order Status
export const VNPAY_ORDER_STATUS = {
  PENDING: "00", // Chờ thanh toán
  SUCCESS: "01", // Thành công
  FAILED: "02",  // Thất bại
  CANCELLED: "03" // Hủy bỏ
};
