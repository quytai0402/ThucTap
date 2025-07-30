import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { OrdersService, CreateOrderDto, CreateGuestOrderDto, UpdateOrderDto, OrderFilter, TrackGuestOrderDto } from './orders.service';
import { OrderStatus, PaymentStatus } from '../common/schemas/order.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new order for logged-in user' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createForLoggedInUser(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    // Set customer from authenticated user
    createOrderDto.customer = req.user.sub;
    createOrderDto.isGuestOrder = false;
    return this.ordersService.create(createOrderDto);
  }
  
  @Post('guest')
  @ApiOperation({ summary: 'Create a new order for guest user' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createGuestOrder(@Body() createGuestOrderDto: CreateGuestOrderDto) {
    // Convert guest order format to standard order format
    const createOrderDto: CreateOrderDto = {
      items: createGuestOrderDto.items.map(item => ({
        product: item.productId,
        quantity: item.quantity
      })),
      shippingAddress: {
        name: createGuestOrderDto.guestInfo.fullName,
        phone: createGuestOrderDto.guestInfo.phone,
        email: createGuestOrderDto.guestInfo.email,
        address: createGuestOrderDto.guestInfo.address.address,
        city: createGuestOrderDto.guestInfo.address.city,
        district: createGuestOrderDto.guestInfo.address.district,
        ward: createGuestOrderDto.guestInfo.address.ward
      },
      paymentMethod: createGuestOrderDto.paymentMethod,
      notes: createGuestOrderDto.notes,
      discountCode: createGuestOrderDto.discountCode,
      isGuestOrder: true
    };
    
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all orders with filtering and pagination' })
  @ApiBearerAuth()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('customer') customer?: string,
    @Query('phone') phone?: string,
    @Query('status') status?: OrderStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('isGuestOrder') isGuestOrder?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const filter: OrderFilter = {
      customer,
      phone,
      status,
      paymentStatus,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      isGuestOrder: isGuestOrder ? isGuestOrder === 'true' : undefined,
    };

    return this.ordersService.findAll(
      +page,
      +limit,
      filter,
      sortBy,
      sortOrder,
    );
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get order statistics' })
  @ApiBearerAuth()
  getStats(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.ordersService.getOrderStats(
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }

  @Get('number/:orderNumber')
  @ApiOperation({ summary: 'Get order by order number' })
  findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiBearerAuth()
  getMyOrders(@Request() req) {
    return this.ordersService.findByCustomer(req.user.sub);
  }
  
  @Post('guest/track')
  @ApiOperation({ summary: 'Track guest order by phone and order number' })
  @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async trackGuestOrder(@Body() trackGuestOrderDto: TrackGuestOrderDto) {
    try {
      const orders = await this.ordersService.findGuestOrdersByPhone(
        trackGuestOrderDto.phone, 
        trackGuestOrderDto.orderNumber
      );
      
      if (!orders || orders.length === 0) {
        throw new NotFoundException('No order found with the provided phone number and order number');
      }
      
      return orders;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error tracking order: ' + error.message);
    }
  }
  
  @Get('guest/by-phone/:phone')
  @ApiOperation({ summary: 'Get all guest orders by phone number' })
  @ApiResponse({ status: 200, description: 'Orders found' })
  @ApiResponse({ status: 404, description: 'No orders found' })
  async getGuestOrdersByPhone(@Param('phone') phone: string) {
    try {
      const orders = await this.ordersService.findGuestOrdersByPhone(phone);
      
      if (!orders || orders.length === 0) {
        throw new NotFoundException('No orders found with the provided phone number');
      }
      
      return orders;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error retrieving orders: ' + error.message);
    }
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get recent orders for customer' })
  @ApiBearerAuth()
  getRecentOrders(@Request() req, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 3;
    return this.ordersService.getRecentOrders(req.user.sub, limitNum);
  }

  @Get('customer-stats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get customer order statistics' })
  @ApiBearerAuth()
  getCustomerStats(@Request() req) {
    return this.ordersService.getCustomerStats(req.user.sub);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get orders by customer ID' })
  findByCustomer(
    @Param('customerId') customerId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.ordersService.findByCustomer(customerId, +page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update order status' })
  @ApiBearerAuth()
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus },
  ) {
    return this.ordersService.updateStatus(id, body.status);
  }

  @Patch(':id/payment-status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update payment status' })
  @ApiBearerAuth()
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { paymentStatus: PaymentStatus },
  ) {
    return this.ordersService.updatePaymentStatus(id, body.paymentStatus);
  }

  @Patch(':id/tracking')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add tracking number' })
  @ApiBearerAuth()
  addTrackingNumber(
    @Param('id') id: string,
    @Body() body: { trackingNumber: string },
  ) {
    return this.ordersService.addTrackingNumber(id, body.trackingNumber);
  }



  @Get(':id/tracking')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get order tracking information' })
  @ApiBearerAuth()
  getOrderTracking(@Param('id') id: string, @Request() req) {
    return this.ordersService.getOrderTracking(id, req.user.sub);
  }
}
