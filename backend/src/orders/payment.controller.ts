import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class PaymentController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('update-payment-status')
  async updatePaymentStatus(@Body() body: {
    orderId: string;
    status: string;
    transactionId: string;
    paymentMethod: string;
    amount: number;
  }) {
    try {
      // Find order by _id or orderNumber
      const order = await this.ordersService.findByIdOrOrderNumber(body.orderId);
      
      if (!order) {
        return {
          success: false,
          message: 'Order not found'
        };
      }

      // Convert status to PaymentStatus enum
      let paymentStatus;
      switch (body.status) {
        case 'paid':
          paymentStatus = 'paid';
          break;
        case 'failed':
          paymentStatus = 'failed';
          break;
        default:
          paymentStatus = 'pending';
      }

      // Update payment status with transaction ID
      const result = await this.ordersService.updatePaymentStatus(
        (order as any)._id.toString(),
        paymentStatus as any,
        body.transactionId
      );

      return {
        success: true,
        message: 'Payment status updated successfully',
        data: result
      };
    } catch (error) {
      console.error('❌ Error updating payment status:', error);
      return {
        success: false,
        message: 'Failed to update payment status',
        error: error.message
      };
    }
  }

  @Get('check-payment/:orderId')
  async checkPaymentStatus(@Param('orderId') orderId: string) {
    try {
      // Find order by _id or orderNumber
      const order = await this.ordersService.findByIdOrOrderNumber(orderId);
      
      if (!order) {
        return {
          success: false,
          message: 'Order not found',
          isPaid: false
        };
      }

      return {
        success: true,
        isPaid: order.paymentStatus === 'paid',
        status: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        transactionId: order.transactionId
      };
    } catch (error) {
      console.error('❌ Error checking payment status:', error);
      return {
        success: false,
        message: 'Failed to check payment status',
        isPaid: false
      };
    }
  }

  @Post('vnpay-return')
  async handleVNPayReturn(@Body() body: any) {
    try {
      // Verify VNPay signature here if needed
      const isValid = true; // Simplified for now
      
      if (!isValid) {
        return {
          success: false,
          message: 'Invalid VNPay signature'
        };
      }

      // Extract payment information
      const orderId = body.vnp_TxnRef;
      const responseCode = body.vnp_ResponseCode;
      const transactionId = body.vnp_TransactionNo;
      const amount = parseInt(body.vnp_Amount) / 100; // VNPay sends amount * 100

      // Update order status based on response code
      const status = responseCode === '00' ? 'paid' : 'failed';
      
      // Find the order first
      const order = await this.ordersService.findByIdOrOrderNumber(orderId);
      if (order) {
        await this.ordersService.updatePaymentStatus(
          (order as any)._id.toString(),
          status as any,
          transactionId
        );
      }

      return {
        success: true,
        message: 'VNPay return processed successfully',
        status,
        orderId,
        transactionId
      };
    } catch (error) {
      console.error('❌ Error processing VNPay return:', error);
      return {
        success: false,
        message: 'Failed to process VNPay return'
      };
    }
  }
}
