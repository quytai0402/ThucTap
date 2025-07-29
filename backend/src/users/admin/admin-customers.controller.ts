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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService, CreateUserDto, UpdateUserDto } from '../users.service';
import { UserRole } from '../../common/schemas/user.schema';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';

@ApiTags('admin-customers')
@Controller('admin/customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminCustomersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers for admin' })
  async getCustomers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('city') city?: string,
  ) {
    // Get customers only (filter by role)
    const result = await this.usersService.findAll(+page, +limit, UserRole.CUSTOMER);
    
    let filteredUsers = result.users;
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.fullName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.includes(search)
      );
    }
    
    // Apply status filter
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    
    return {
      customers: filteredUsers,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: +page
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer details by ID' })
  async getCustomer(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customer' })
  async updateCustomer(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer' })
  async deleteCustomer(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get customer statistics' })
  async getCustomerStats() {
    const result = await this.usersService.findAll(1, 1000, UserRole.CUSTOMER);
    
    const totalCustomers = result.total;
    const activeCustomers = result.users.filter(u => u.status === 'active').length;
    const newCustomersThisMonth = result.users.filter(u => {
      const userObj = (u as any).toObject ? (u as any).toObject() : u;
      const created = new Date(userObj.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers: totalCustomers - activeCustomers,
      newCustomersThisMonth,
      customerGrowthRate: newCustomersThisMonth > 0 ? ((newCustomersThisMonth / Math.max(totalCustomers - newCustomersThisMonth, 1)) * 100) : 0
    };
  }
}
