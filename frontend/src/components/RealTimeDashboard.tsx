import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  UsersIcon,
  CubeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { analyticsService } from '../services/analyticsService';
import { ordersService } from '../services/ordersService';
import { inventoryService } from '../services/inventoryService';
import productService from '../services/productService';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockCount: number;
  outOfStockCount: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'product' | 'inventory';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

const RealTimeDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    loadDashboardData();
    
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [
        dashboardStats,
        orderStats,
        inventorySummary,
        inventoryAlerts,
        recentOrders
      ] = await Promise.all([
        analyticsService.getDashboardStats().catch(() => null),
        ordersService.getOrderStats().catch(() => null),
        inventoryService.getInventorySummary().catch(() => null),
        inventoryService.getInventoryAlerts().catch(() => ({ alerts: [] })),
        ordersService.getRecentOrders(5).catch(() => [])
      ]);

      // Combine stats from different sources
      const combinedStats: DashboardStats = {
        totalRevenue: dashboardStats?.totalRevenue || 0,
        totalOrders: dashboardStats?.totalOrders || orderStats?.totalOrders || 0,
        totalProducts: dashboardStats?.totalProducts || inventorySummary?.totalProducts || 0,
        totalCustomers: dashboardStats?.totalUsers || 0,
        lowStockCount: inventorySummary?.lowStockCount || 0,
        outOfStockCount: inventorySummary?.outOfStockCount || 0,
        pendingOrders: orderStats?.pendingOrders || 0,
        processingOrders: (orderStats?.confirmedOrders || 0) + (orderStats?.processingOrders || 0), // Combine confirmed + processing for display
        shippedOrders: orderStats?.shippedOrders || 0,
        deliveredOrders: orderStats?.deliveredOrders || 0,
        cancelledOrders: orderStats?.cancelledOrders || 0
      };

      setStats(combinedStats);
      setAlerts(inventoryAlerts.alerts || []);

      // Format recent activity
      const activity: RecentActivity[] = [];
      
      // Add recent orders to activity
      if (recentOrders && Array.isArray(recentOrders)) {
        recentOrders.slice(0, 3).forEach((order: any) => {
          activity.push({
            id: order._id || order.id,
            type: 'order',
            message: `Đơn hàng mới từ ${order.customer?.fullName || 'Khách hàng'}`,
            timestamp: order.createdAt,
            status: 'success'
          });
        });
      }

      // Add inventory alerts to activity
      inventoryAlerts.alerts?.slice(0, 2).forEach((alert: any) => {
        activity.push({
          id: alert.product,
          type: 'inventory',
          message: alert.message,
          timestamp: new Date().toISOString(),
          status: alert.severity === 'error' ? 'error' : 'warning'
        });
      });

      setRecentActivity(activity);
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? formatCurrency(stats.totalRevenue) : '0 ₫'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12.5%</span>
            <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? formatNumber(stats.totalOrders) : '0'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingCartIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              {stats?.pendingOrders || 0} chờ xử lý
            </span>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? formatNumber(stats.totalProducts) : '0'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CubeIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-red-600">
              {stats?.lowStockCount || 0} sắp hết hàng
            </span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? formatNumber(stats.totalCustomers) : '0'}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <UsersIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+8.2%</span>
            <span className="text-sm text-gray-500 ml-1">tăng trưởng</span>
          </div>
        </div>
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Pending Orders */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
              <p className="text-xl font-bold text-yellow-600">
                {stats?.pendingOrders || 0}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        {/* Processing Orders */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
              <p className="text-xl font-bold text-blue-600">
                {stats?.processingOrders || 0}
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {/* Shipped Orders */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang giao</p>
              <p className="text-xl font-bold text-purple-600">
                {stats?.shippedOrders || 0}
              </p>
            </div>
            <TruckIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã giao</p>
              <p className="text-xl font-bold text-green-600">
                {stats?.deliveredOrders || 0}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã hủy</p>
              <p className="text-xl font-bold text-red-600">
                {stats?.cancelledOrders || 0}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Alerts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cảnh báo kho hàng</h3>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getStatusIcon(alert.severity)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500">Vừa xảy ra</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Không có cảnh báo nào</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hoạt động gần đây</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Chưa có hoạt động nào</p>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Cập nhật lần cuối: {lastUpdated.toLocaleString('vi-VN')}
          <button 
            onClick={loadDashboardData}
            className="ml-2 text-blue-600 hover:text-blue-800"
            disabled={loading}
          >
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default RealTimeDashboard; 