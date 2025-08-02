import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../users.service';
import { GuestCustomerService } from '../../guest-customer/guest-customer.service';
import { OrdersService } from '../../orders/orders.service';
import { UserRole } from '../../common/schemas/user.schema';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';

@ApiTags('admin-combined-customers')
@Controller('admin/combined-customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminCombinedCustomersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly guestCustomerService: GuestCustomerService,
    private readonly ordersService: OrdersService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers (registered and guest) for admin' })
  async getAllCustomers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('city') city?: string,
  ) {
    // Convert pagination parameters
    const pageNum = +page;
    const limitNum = +limit;
    
    // Get registered customers with real order statistics from delivered orders
    const registeredResult = await this.usersService.getCustomersWithRealOrderStats(pageNum, limitNum);
    
    // Get guest customers with real order statistics from delivered orders
    const guestResult = await this.guestCustomerService.getAllGuestCustomersWithRealStats(pageNum, limitNum, search);
    
    // Transform guest customers to match user format
    // Map guest customers to include order statistics from delivered orders only
    const guestCustomers = guestResult.customers.map(guest => ({
      _id: guest._id,
      fullName: guest.fullName,
      phone: guest.phone,
      email: guest.email || 'Không có email',
      isGuest: true,
      orderCount: guest.realSuccessfulOrders || 0,
      totalSpent: guest.realTotalSpent || 0,
      lastOrderDate: guest.realLastOrderDate || null,
      avatar: null,
      createdAt: guest.createdAt,
      // Add fields for compatibility with registered customers
      totalOrders: guest.realSuccessfulOrders || 0,
      successfulOrders: guest.realSuccessfulOrders || 0,
      status: 'active', // Guest customers are always active
      city: '', // Guests don't have city info
      address: '',
      district: '',
      ward: '',
      customerLevel: 'Bronze',
      loyaltyPoints: 0
    }));
    
    // Add isGuest: false flag to registered customers and format properly
    const formattedRegisteredCustomers = registeredResult.users.map(user => {
      // Handle aggregation result (no .toObject() needed)
      const userObj = user;
      return {
        id: userObj._id.toString(),
        fullName: userObj.fullName || userObj.name || 'N/A',
        email: userObj.email || '',
        phone: userObj.phone || '',
        address: userObj.addresses?.[0]?.address || '',
        city: userObj.addresses?.[0]?.city || '',
        district: userObj.addresses?.[0]?.district || '',
        ward: userObj.addresses?.[0]?.ward || '',
        totalOrders: userObj.realSuccessfulOrders || 0, // Use real stats from delivered orders only
        successfulOrders: userObj.realSuccessfulOrders || 0,
        totalSpent: userObj.realTotalSpent || 0, // Use real stats from delivered orders only
        lastOrderDate: userObj.realLastOrderDate || null,
        customerLevel: userObj.customerLevel || 'Bronze',
        loyaltyPoints: userObj.loyaltyPoints || 0,
        status: userObj.status || 'active',
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt,
        isGuest: false
      };
    });
    
    // Combine both customer types
    let combinedCustomers = [...formattedRegisteredCustomers, ...guestCustomers];
    
    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      combinedCustomers = combinedCustomers.filter(customer => 
        (customer.fullName && customer.fullName.toLowerCase().includes(searchLower)) ||
        (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
        (customer.phone && customer.phone.includes(search))
      );
    }
    
    // Apply status filter if provided
    if (status && status !== 'all') {
      combinedCustomers = combinedCustomers.filter(customer => customer.status === status);
    }
    
    // Apply city filter if provided
    if (city && city !== 'all') {
      combinedCustomers = combinedCustomers.filter(customer => customer.city === city);
    }
    
    // Sort by total orders (most active customers first)
    combinedCustomers.sort((a, b) => b.totalOrders - a.totalOrders);
    
    // Calculate total and pagination
    const total = combinedCustomers.length;
    
    // Apply pagination
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedCustomers = combinedCustomers.slice(startIndex, startIndex + limitNum);
    
    return {
      customers: paginatedCustomers,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    };
  }

  @Get(':customerId/details')
  @ApiOperation({ summary: 'Get customer details (registered or guest)' })
  async getCustomerDetails(
    @Param('customerId') customerId: string,
    @Query('isGuest') isGuest: string = 'false'
  ) {
    const isGuestBool = isGuest === 'true';
    
    if (isGuestBool) {
      // Get guest customer details
      const guestCustomer = await this.guestCustomerService.findById(customerId);
      if (!guestCustomer) {
        throw new Error('Guest customer not found');
      }
      
      return {
        ...guestCustomer.toObject(),
        isGuest: true
      };
    } else {
      // Get registered customer details
      const user = await this.usersService.findOne(customerId);
      if (!user) {
        throw new Error('User not found');
      }
      
      return {
        ...user,
        isGuest: false
      };
    }
  }

  @Get(':customerId/orders')
  @ApiOperation({ summary: 'Get customer orders (registered or guest)' })
  async getCustomerOrders(
    @Param('customerId') customerId: string,
    @Query('isGuest') isGuest: string = 'false',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    const isGuestBool = isGuest === 'true';
    const pageNum = +page;
    const limitNum = +limit;
    
    if (isGuestBool) {
      // Get orders for guest customer by phone
      const guestCustomer = await this.guestCustomerService.findById(customerId);
      if (!guestCustomer) {
        throw new Error('Guest customer not found');
      }
      
      const orders = await this.ordersService.findGuestOrdersByPhone(guestCustomer.phone);
      
      // Apply pagination manually since original method doesn't support it
      const total = orders.length;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedOrders = orders.slice(startIndex, startIndex + limitNum);
      
      return {
        orders: paginatedOrders,
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum
      };
    } else {
      // Get orders for registered customer - need to create this method
      return this.ordersService.findOrdersByUserId(customerId, pageNum, limitNum);
    }
  }
}
