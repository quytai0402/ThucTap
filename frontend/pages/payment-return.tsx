import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../src/components/Layout';
import { VNPayService } from '../src/services/vnpayService';

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
      const query = router.query;
      
      // Verify VNPay response
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

      // Parse kết quả
      const responseCode = query.vnp_ResponseCode as string;
      const { success, message } = VNPayService.parseResponseCode(responseCode);
      
      const paymentResult: PaymentResult = {
        success,
        orderId: query.vnp_TxnRef as string,
        amount: parseInt(query.vnp_Amount as string) / 100, // VNPay trả về * 100
        message,
        transactionId: query.vnp_TransactionNo as string,
        payDate: query.vnp_PayDate as string
      };

      setResult(paymentResult);
      setLoading(false);

      // Cập nhật trạng thái đơn hàng trong database
      if (success) {
        updateOrderStatus(paymentResult);
      }
    }
  }, [router.isReady, router.query]);

  const updateOrderStatus = async (paymentResult: PaymentResult) => {
    try {
      const response = await fetch('/api/orders/update-payment-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: paymentResult.orderId,
          status: paymentResult.success ? 'paid' : 'failed',
          transactionId: paymentResult.transactionId,
          paymentMethod: 'vnpay',
          amount: paymentResult.amount
        }),
      });

      if (!response.ok) {
        console.error('Failed to update order status');
      } else {
        // Nếu thanh toán thành công, chuyển đến order-success
        if (paymentResult.success) {
          // Clear checkout session
          sessionStorage.removeItem('checkoutOrderId');
          
          // Redirect to order-success page
          setTimeout(() => {
            router.push(`/order-success?orderId=${paymentResult.orderId}`);
          }, 2000); // Delay 2s để user đọc thông báo
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              ) : (
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
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
                  <button
                    onClick={() => router.push('/orders')}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Xem đơn hàng
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Tiếp tục mua sắm
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/checkout')}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Thử lại
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Về trang chủ
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
