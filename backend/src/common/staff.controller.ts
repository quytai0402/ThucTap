import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@ApiTags('staff')
@Controller('staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get staff dashboard statistics' })
  @ApiBearerAuth()
  async getDashboardStats(@Request() req) {
    const user = req.user;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    try {
      // Get basic stats
      const [orderStats, productStats] = await Promise.all([
        this.ordersService.getOrderStats(startOfDay, endOfDay),
        this.productsService.getAdminStats(),
      ]);

      // Get role-specific data
      let roleSpecificData = {};
      
      switch (user.role) {
        case 'sales_staff':
          roleSpecificData = await this.getSalesStaffData();
          break;
        case 'warehouse_staff':
          roleSpecificData = await this.getWarehouseStaffData();
          break;
        case 'content_editor':
          roleSpecificData = await this.getContentEditorData();
          break;
        default:
          roleSpecificData = {};
      }

      return {
        success: true,
        data: {
          user: {
            name: user.name,
            role: user.role,
            email: user.email,
          },
          stats: {
            ordersToday: orderStats.totalOrders || 0,
            pendingOrders: orderStats.pendingOrders || 0,
            processingOrders: orderStats.processingOrders || 0,
            completedOrders: orderStats.deliveredOrders || 0,
            totalProducts: productStats.totalProducts || 0,
            activeProducts: productStats.activeProducts || 0,
            lowStockProducts: productStats.lowStockProducts || 0,
            outOfStockProducts: productStats.outOfStockProducts || 0,
          },
          roleSpecific: roleSpecificData,
          recentActivity: await this.getRecentActivity(user.role),
          notifications: await this.getNotifications(user.role),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch dashboard data',
        error: error.message,
      };
    }
  }

  private async getSalesStaffData() {
    // Get recent orders for sales staff
    const recentOrders = await this.ordersService.findAll(1, 10, {}, 'createdAt', 'desc');
    return {
      tasksToday: 15,
      completedTasks: 8,
      pendingTasks: 7,
      urgentTasks: 3,
      recentOrders: recentOrders.orders.slice(0, 5),
    };
  }

  private async getWarehouseStaffData() {
    // Get inventory-related data  
    const allProducts = await this.productsService.findAll(1, 10);
    return {
      tasksToday: 12,
      completedTasks: 6,
      pendingTasks: 6,
      urgentTasks: 2,
      lowStockProducts: allProducts.products.slice(0, 5),
      stockMovements: [], // Would need to implement stock movement tracking
    };
  }

  private async getContentEditorData() {
    // Get content-related data
    const allProducts = await this.productsService.findAll(1, 10);
    return {
      tasksToday: 8,
      completedTasks: 4,
      pendingTasks: 4,
      urgentTasks: 1,
      incompleteProducts: allProducts.products.slice(0, 5),
      contentTasks: [], // Would need to implement content task tracking
    };
  }

  private async getRecentActivity(role: string) {
    const activities = [];
    
    switch (role) {
      case 'sales_staff':
        const recentOrders = await this.ordersService.findAll(1, 5, {}, 'createdAt', 'desc');
        activities.push(
          ...recentOrders.orders.map((order, index) => ({
            id: `order-${index}`,
            action: `Xử lý đơn hàng #${order.orderNumber || 'N/A'}`,
            time: '1 giờ trước', // TODO: Calculate actual time difference
            type: 'order',
            status: order.status,
          }))
        );
        break;
        
      case 'warehouse_staff':
        // TODO: Implement real warehouse activities tracking
        activities.push(
          { id: 1, action: 'Kiểm kê sản phẩm laptop Dell', time: '15 phút trước', type: 'inventory' },
          { id: 2, action: 'Chuẩn bị hàng cho đơn hàng', time: '30 phút trước', type: 'shipping' },
        );
        break;
        
      case 'content_editor':
        // TODO: Implement real content activities tracking
        activities.push(
          { id: 1, action: 'Cập nhật mô tả sản phẩm', time: '20 phút trước', type: 'content' },
          { id: 2, action: 'Thêm hình ảnh sản phẩm', time: '45 phút trước', type: 'media' },
        );
        break;
    }
    
    return activities;
  }

  private async getNotifications(role: string) {
    const notifications = [];
    
    switch (role) {
      case 'sales_staff':
        const allOrders = await this.ordersService.findAll(1, 10);
        const pendingCount = allOrders.orders.filter(order => order.status === 'pending').length;
        if (pendingCount > 0) {
          notifications.push({
            id: 1,
            message: `Có ${pendingCount} đơn hàng cần xác nhận`,
            type: 'warning',
            time: '5 phút trước',
          });
        }
        break;
        
      case 'warehouse_staff':
        const allProducts = await this.productsService.findAll(1, 10);
        const lowStockCount = allProducts.products.filter(product => product.stock < 10).length;
        if (lowStockCount > 0) {
          notifications.push({
            id: 1,
            message: `Có ${lowStockCount} sản phẩm sắp hết hàng`,
            type: 'warning',
            time: '10 phút trước',
          });
        }
        break;
        
      case 'content_editor':
        // TODO: Implement real content notifications
        notifications.push({
          id: 1,
          message: 'Có 5 sản phẩm chưa có mô tả đầy đủ',
          type: 'warning',
          time: '30 phút trước',
        });
        break;
    }
    
    return notifications;
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} giờ trước`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} ngày trước`;
    }
  }
}
