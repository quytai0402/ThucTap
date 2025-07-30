import { Controller, Get, Post, Body, Param, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { GuestCustomerService } from './guest-customer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/schemas/user.schema';

@ApiTags('guest-customers')
@Controller('guest-customers')
export class GuestCustomerController {
  constructor(private readonly guestCustomerService: GuestCustomerService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all guest customers (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getAllGuestCustomers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    return this.guestCustomerService.getAllGuestCustomers(
      parseInt(page),
      parseInt(limit),
      search,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get guest customer by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  async getGuestCustomerById(@Param('id') id: string) {
    return this.guestCustomerService.getGuestCustomerById(id);
  }

  @Get('phone/:phone')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get guest customer by phone number (Admin only)' })
  @ApiParam({ name: 'phone', type: String })
  async getGuestCustomerByPhone(@Param('phone') phone: string) {
    return this.guestCustomerService.findByPhone(phone);
  }
  
  @Get('phone/:phone/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders for a guest customer by phone number (Admin only)' })
  @ApiParam({ name: 'phone', type: String })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getGuestCustomerOrders(
    @Param('phone') phone: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const guestCustomer = await this.guestCustomerService.findByPhone(phone);
    if (!guestCustomer) {
      throw new NotFoundException(`No guest customer found with phone ${phone}`);
    }
    
    // Return orders from the guest customer's order IDs
    return {
      guestCustomer,
      orders: guestCustomer.orderIds
    };
  }
}
