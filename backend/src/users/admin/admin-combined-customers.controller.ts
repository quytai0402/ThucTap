import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../users.service';
import { GuestCustomerService } from '../../guest-customer/guest-customer.service';
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
    private readonly guestCustomerService: GuestCustomerService
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
    
    // Get registered customers
    const registeredResult = await this.usersService.findAll(pageNum, limitNum, UserRole.CUSTOMER);
    
    // Get guest customers
    const guestResult = await this.guestCustomerService.getAllGuestCustomers(pageNum, limitNum, search);
    
    // Transform guest customers to match user format
    const formattedGuestCustomers = guestResult.customers.map(guest => {
      // Safely convert to plain object
      const guestObj = JSON.parse(JSON.stringify(guest));
      return {
        id: guestObj._id.toString(),
        fullName: guestObj.fullName || 'Guest Customer',
        email: guestObj.email || '',
        phone: guestObj.phone,
        address: guestObj.lastAddress?.address || '',
        city: guestObj.lastAddress?.city || '',
        district: guestObj.lastAddress?.district || '',
        ward: guestObj.lastAddress?.ward || '',
        totalOrders: guestObj.totalOrders || 0,
        successfulOrders: guestObj.successfulOrders || 0,
        totalSpent: guestObj.totalSpent || 0,
        lastOrderDate: guestObj.lastOrder?.orderDate || null,
        customerLevel: guestObj.customerLevel,
        loyaltyPoints: guestObj.loyaltyPoints || 0,
        status: 'active', // Guest customers are always considered active
        createdAt: guestObj.createdAt,
        updatedAt: guestObj.updatedAt,
        isGuest: true // Add a flag to identify guest customers
      };
    });
    
    // Add isGuest: false flag to registered customers
    const formattedRegisteredCustomers = registeredResult.users.map(user => {
      // Safely convert to plain object
      const userObj = JSON.parse(JSON.stringify(user));
      return {
        ...userObj,
        id: userObj._id.toString(),
        address: userObj.addresses?.[0]?.address || '',
        city: userObj.addresses?.[0]?.city || '',
        district: userObj.addresses?.[0]?.district || '',
        ward: userObj.addresses?.[0]?.ward || '',
        isGuest: false
      };
    });
    
    // Combine both customer types
    let combinedCustomers = [...formattedRegisteredCustomers, ...formattedGuestCustomers];
    
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
}
