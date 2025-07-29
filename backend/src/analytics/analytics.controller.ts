import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/schemas/user.schema';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales analytics' })
  getSalesAnalytics(
    @Query('period') period: 'day' | 'week' | 'month' | 'year' = 'month',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getSalesAnalytics(period, startDate, endDate);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get product analytics' })
  getProductAnalytics(@Query('limit') limit: string = '10') {
    return this.analyticsService.getProductAnalytics(+limit);
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get customer analytics' })
  getCustomerAnalytics() {
    return this.analyticsService.getCustomerAnalytics();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  getRevenueAnalytics(
    @Query('period') period: 'day' | 'week' | 'month' | 'year' = 'month',
  ) {
    return this.analyticsService.getRevenueAnalytics(period);
  }

  @Get('orders/status')
  @ApiOperation({ summary: 'Get order status distribution' })
  getOrderStatusDistribution() {
    return this.analyticsService.getOrderStatusDistribution();
  }

  @Get('categories/performance')
  @ApiOperation({ summary: 'Get category performance' })
  getCategoryPerformance() {
    return this.analyticsService.getCategoryPerformance();
  }
}
