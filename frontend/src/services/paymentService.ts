import api from '../utils/api';

export interface PaymentStatusUpdate {
  orderId: string;
  status: string;
  transactionId: string;
  paymentMethod: string;
  amount: number;
}

export interface PaymentStatusResponse {
  success: boolean;
  message: string;
  isPaid?: boolean;
  status?: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface VNPayReturnData {
  vnp_TxnRef: string;
  vnp_ResponseCode: string;
  vnp_TransactionNo: string;
  vnp_Amount: string;
  [key: string]: any;
}

class PaymentService {
  /**
   * Update payment status for an order
   */
  async updatePaymentStatus(data: PaymentStatusUpdate): Promise<PaymentStatusResponse> {
    try {
      const response = await api.post('/orders/update-payment-status', data);
      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  /**
   * Check payment status of an order
   */
  async checkPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await api.get(`/orders/check-payment/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }

  /**
   * Handle VNPay return callback
   */
  async handleVNPayReturn(data: VNPayReturnData): Promise<PaymentStatusResponse> {
    try {
      const response = await api.post('/orders/vnpay-return', data);
      return response.data;
    } catch (error) {
      console.error('Error handling VNPay return:', error);
      throw error;
    }
  }

  /**
   * Process payment result and redirect user accordingly
   */
  async processPaymentResult(orderId: string, paymentData: any) {
    try {
      // Check current payment status
      const statusCheck = await this.checkPaymentStatus(orderId);
      
      if (statusCheck.success && statusCheck.isPaid) {
        // Payment successful - redirect to success page
        if (typeof window !== 'undefined') {
          window.location.href = `/order-success?orderId=${orderId}`;
        }
        return { success: true, redirect: 'success' };
      } else {
        // Payment failed - redirect to failure page
        if (typeof window !== 'undefined') {
          window.location.href = `/payment-failed?orderId=${orderId}`;
        }
        return { success: false, redirect: 'failed' };
      }
    } catch (error) {
      console.error('Error processing payment result:', error);
      // On error, redirect to payment page
      if (typeof window !== 'undefined') {
        window.location.href = `/payment?orderId=${orderId}`;
      }
      throw error;
    }
  }

  /**
   * Verify payment status periodically
   */
  async pollPaymentStatus(orderId: string, maxAttempts: number = 10, interval: number = 3000): Promise<boolean> {
    let attempts = 0;
    
    return new Promise((resolve) => {
      const checkStatus = async () => {
        try {
          attempts++;
          const result = await this.checkPaymentStatus(orderId);
          
          if (result.success && result.isPaid) {
            resolve(true);
          } else if (attempts >= maxAttempts) {
            resolve(false);
          } else {
            setTimeout(checkStatus, interval);
          }
        } catch (error) {
          console.error('Error polling payment status:', error);
          if (attempts >= maxAttempts) {
            resolve(false);
          } else {
            setTimeout(checkStatus, interval);
          }
        }
      };
      
      checkStatus();
    });
  }
}

export const paymentService = new PaymentService();
export default paymentService;
