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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { OrdersService, CreateOrderDto, UpdateOrderDto, OrderFilter } from './orders.service';
import { OrderStatus, PaymentStatus } from '../common/schemas/order.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createOrderDto: CreateOrderDto) {
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
    @Query('status') status?: OrderStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const filter: OrderFilter = {
      customer,
      status,
      paymentStatus,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
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

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiBearerAuth()
  getMyOrders(@Request() req) {
    return this.ordersService.findByCustomer(req.user.sub);
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

  @Get('customer-stats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get customer order statistics' })
  @ApiBearerAuth()
  getCustomerStats(@Request() req) {
    return this.ordersService.getCustomerStats(req.user.sub);
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get recent orders for customer' })
  @ApiBearerAuth()
  getRecentOrders(@Request() req, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 3;
    return this.ordersService.getRecentOrders(req.user.sub, limitNum);
  }

  @Get(':id/tracking')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get order tracking information' })
  @ApiBearerAuth()
  getOrderTracking(@Param('id') id: string, @Request() req) {
    return this.ordersService.getOrderTracking(id, req.user.sub);
  }
}
