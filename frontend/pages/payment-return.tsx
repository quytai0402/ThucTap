import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../src/components/Layout';
import paymentService from '../src/services/paymentService';
import { VNPayService } from '../src/services/vnpayService';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  HomeIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface PaymentResult {
  success: boolean;
  orderId: string;
  amount: number;
  message: string;
  transactionId: string;
  payDate: string;
}

export default function PaymentReturn() {
  const router = useRouter();
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      handlePaymentReturn();
    }
  }, [router.isReady]);

  const handlePaymentReturn = async () => {
    try {
      const query = router.query;
      
      // Verify VNPay response first
      const isValid = VNPayService.verifyReturnUrl(query as { [key: string]: string });
      
      if (!isValid) {
        setResult({
          success: false,
          orderId: '',
          amount: 0,
          message: 'Giao dịch không hợp lệ',
          transactionId: '',
          payDate: ''
        });
        setLoading(false);
        return;
      }

      // Use payment service to handle VNPay return
      const vnpayResult = await paymentService.handleVNPayReturn({
        vnp_TxnRef: query.vnp_TxnRef as string,
        vnp_ResponseCode: query.vnp_ResponseCode as string,
        vnp_TransactionNo: query.vnp_TransactionNo as string,
        vnp_Amount: query.vnp_Amount as string,
        vnp_BankCode: query.vnp_BankCode as string,
        vnp_PayDate: query.vnp_PayDate as string
      });

      if (vnpayResult.success) {
        // Check payment status to confirm
        const statusCheck = await paymentService.checkPaymentStatus(query.vnp_TxnRef as string);
        
        const responseCode = query.vnp_ResponseCode as string;
        const { success, message } = VNPayService.parseResponseCode(responseCode);
        
        const paymentResult: PaymentResult = {
          success: statusCheck.isPaid || false,
          orderId: query.vnp_TxnRef as string,
          amount: parseInt(query.vnp_Amount as string) / 100,
          message: statusCheck.message || message,
          transactionId: query.vnp_TransactionNo as string,
          payDate: query.vnp_PayDate as string
        };

        setResult(paymentResult);

        // Redirect to success page if payment successful
        if (paymentResult.success) {
          setTimeout(() => {
            router.push(`/order-success?orderId=${paymentResult.orderId}`);
          }, 2000);
        }
      } else {
        setResult({
          success: false,
          orderId: query.vnp_TxnRef as string || '',
          amount: parseInt(query.vnp_Amount as string) / 100 || 0,
          message: vnpayResult.message || 'Thanh toán thất bại',
          transactionId: query.vnp_TransactionNo as string || '',
          payDate: query.vnp_PayDate as string || ''
        });
      }
    } catch (error) {
      console.error('Error processing payment return:', error);
      setResult({
        success: false,
        orderId: '',
        amount: 0,
        message: 'Có lỗi xảy ra khi xử lý thanh toán',
        transactionId: '',
        payDate: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString.length !== 14) return '';
    
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(8, 10);
    const minute = dateString.substring(10, 12);
    const second = dateString.substring(12, 14);
    
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <ArrowPathIcon className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
            <p className="mt-4 text-gray-600">Đang xử lý kết quả thanh toán...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Icon và Status */}
            <div className="text-center mb-8">
              {result?.success ? (
                <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
              ) : (
                <XCircleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
              )}
              
              <h1 className={`text-2xl font-bold ${result?.success ? 'text-green-600' : 'text-red-600'}`}>
                {result?.success ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
              </h1>
              <p className="text-gray-600 mt-2">{result?.message}</p>
            </div>

            {/* Chi tiết giao dịch */}
            {result && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Chi tiết giao dịch</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mã đơn hàng</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{result.orderId}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số tiền</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">{formatCurrency(result.amount)}</p>
                  </div>
                  
                  {result.transactionId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mã giao dịch VNPay</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">{result.transactionId}</p>
                    </div>
                  )}
                  
                  {result.payDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Thời gian thanh toán</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(result.payDate)}</p>
                    </div>
                  )}
                </div>

                {/* Thông tin tài khoản nhận tiền */}
                {result.success && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-green-800 mb-2">Tiền đã được chuyển vào:</h3>
                    <div className="text-sm text-green-700">
                      <p><strong>Số tài khoản:</strong> 8866997979</p>
                      <p><strong>Ngân hàng:</strong> Techcombank</p>
                      <p><strong>Chủ tài khoản:</strong> TRAN QUY TAI</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nút hành động */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {result?.success ? (
                <>
                  <Link
                    href="/orders"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center inline-flex items-center justify-center"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Xem đơn hàng
                  </Link>
                  <Link
                    href="/"
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center inline-flex items-center justify-center"
                  >
                    <HomeIcon className="h-5 w-5 mr-2" />
                    Tiếp tục mua sắm
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/checkout"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    Thử lại
                  </Link>
                  <Link
                    href="/"
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center inline-flex items-center justify-center"
                  >
                    <HomeIcon className="h-5 w-5 mr-2" />
                    Về trang chủ
                  </Link>
                </>
              )}
            </div>

            {/* Lưu ý */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Lưu ý quan trọng:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {result?.success ? (
                  <>
                    <li>• Đơn hàng sẽ được xử lý trong vòng 24 giờ</li>
                    <li>• Bạn sẽ nhận được email xác nhận</li>
                    <li>• Liên hệ hotline nếu cần hỗ trợ</li>
                  </>
                ) : (
                  <>
                    <li>• Kiểm tra lại thông tin thanh toán</li>
                    <li>• Đảm bảo tài khoản có đủ số dư</li>
                    <li>• Liên hệ ngân hàng nếu cần thiết</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
