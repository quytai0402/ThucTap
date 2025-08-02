import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { OrderHelper } from './order-helper.service';

@ApiTags('guest-orders')
@Controller('guest-orders')
export class GuestOrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderHelper: OrderHelper
  ) {}

  @Get('phone/:phone')
  @ApiOperation({ summary: 'Get orders by phone number for guest customers' })
  @ApiParam({ name: 'phone', description: 'Phone number', type: String })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  async getOrdersByPhone(
    @Param('phone') phone: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.orderHelper.findOrdersByPhone(phone, +page, +limit);
  }

  @Get('track/:orderNumber')
  @ApiOperation({ summary: 'Track order by order number (public endpoint)' })
  @ApiParam({ name: 'orderNumber', description: 'Order number', type: String })
  async trackOrder(
    @Param('orderNumber') orderNumber: string,
  ) {
    const order = await this.ordersService.findByOrderNumber(orderNumber);
    
    // Return limited information for public tracking
    return {
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order['createdAt'],
      updatedAt: order['updatedAt'],
      deliveredAt: order.deliveredAt,
      shippingAddress: {
        name: order.shippingAddress.name,
        city: order.shippingAddress.city,
        district: order.shippingAddress.district,
        ward: order.shippingAddress.ward,
      },
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity
      })),
      shippingFee: order.shippingFee,
      total: order.total,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      trackingNumber: order.trackingNumber,
    };
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get guest order by ID (public endpoint)' })
  @ApiParam({ name: 'orderId', description: 'Order ID', type: String })
  async getGuestOrderById(
    @Param('orderId') orderId: string,
  ) {
    try {
      const order = await this.ordersService.findOne(orderId);
      
      // Only return order if it's a guest order (for security)
      if (!order.isGuestOrder) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      throw new Error('Order not found');
    }
  }
}
