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
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from '../orders.service';
import { OrderStatus } from '../../common/schemas/order.schema';

@ApiTags('admin-orders')
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders for admin' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    try {
      const result = await this.ordersService.findAll(
        +page,
        +limit,
        { status: status as any },
        search,
      );

      return {
        success: true,
        data: result.orders,
        pagination: {
          page: +page,
          limit: +limit,
          total: result.total,
          totalPages: Math.ceil(result.total / +limit),
        },
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to fetch orders', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics for admin dashboard' })
  async getStats() {
    try {
      const stats = await this.ordersService.getOrderStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to fetch stats', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID for admin' })
  async findOne(@Param('id') id: string) {
    try {
      const order = await this.ordersService.findOne(id);
      if (!order) {
        throw new HttpException(
          { success: false, message: 'Order not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        data: order,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to fetch order', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    try {
      const order = await this.ordersService.updateStatus(id, status as any);
      return {
        success: true,
        message: 'Order status updated successfully',
        data: order,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to update order status', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order (Admin only)' })
  async remove(@Param('id') id: string) {
    try {
      const order = await this.ordersService.findOne(id);
      if (!order) {
        throw new HttpException(
          { success: false, message: 'Order not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      
      // For now, we'll mark as cancelled instead of deleting
      await this.ordersService.updateStatus(id, 'cancelled' as any);
      return {
        success: true,
        message: 'Order cancelled successfully',
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to cancel order', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
