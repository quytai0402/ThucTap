import React, { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import {
  ChartBarIcon,
  UsersIcon,
  CubeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { analyticsService } from '../../src/services/analyticsService';
import { orderService } from '../../src/services/orderService';
import { productService } from '../../src/services/productService';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  productsGrowth: number;
  customersGrowth: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  sold: number;
  revenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [revenueChartData, setRevenueChartData] = useState<any>(null);
  const [ordersChartData, setOrdersChartData] = useState<any>(null);
  const [categoryChartData, setCategoryChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  // Load all dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard stats
      const dashboardStats = await analyticsService.getDashboardStats();
      setStats({
        totalRevenue: dashboardStats.totalRevenue || 0,
        totalOrders: dashboardStats.totalOrders || 0,
        totalProducts: dashboardStats.totalProducts || 0,
        totalCustomers: dashboardStats.totalCustomers || 0,
        revenueGrowth: dashboardStats.revenueGrowth || 0,
        ordersGrowth: dashboardStats.ordersGrowth || 0,
        productsGrowth: dashboardStats.productsGrowth || 0,
        customersGrowth: dashboardStats.customersGrowth || 0
      });

      // Load recent orders
      const ordersResponse = await orderService.getOrders();
      const orders = Array.isArray(ordersResponse) ? ordersResponse : [];
      // Sort by createdAt descending and take first 5
      const sortedOrders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
      setRecentOrders(sortedOrders.map((order: any) => ({
        id: order.id || order._id,
        customerName: order.customerName || 'N/A',
        amount: order.total || 0,
        status: order.status || 'pending',
        createdAt: order.createdAt || new Date().toISOString()
      })));

      // Load top products
      const productAnalytics = await analyticsService.getProductAnalytics();
      if (productAnalytics && productAnalytics.topProducts) {
        setTopProducts(productAnalytics.topProducts.map((product: any) => ({
          id: product.productId || product.id,
          name: product.productName || product.name,
          category: product.category || 'N/A',
          sold: product.totalSold || product.sold || 0,
          revenue: product.revenue || 0
        })));
      }

      // Load chart data
      await loadChartData();

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      // Load revenue chart data
      const revenueData = await analyticsService.getRevenueAnalytics(timeRange);
      if (revenueData && revenueData.chartData) {
        setRevenueChartData({
          labels: revenueData.chartData.labels || [],
          datasets: [{
            label: 'Doanh thu (VNĐ)',
            data: revenueData.chartData.data || [],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
          }]
        });
      }

      // Load orders chart data
      const salesData = await analyticsService.getSalesAnalytics();
      if (salesData && salesData.chartData) {
        setOrdersChartData({
          labels: salesData.chartData.labels || [],
          datasets: [{
            label: 'Đơn hàng',
            data: salesData.chartData.data || [],
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
          }]
        });
      }

      // Load category chart data
      const categoryData = await analyticsService.getCategoryPerformance();
      if (categoryData && categoryData.chartData) {
        setCategoryChartData({
          labels: categoryData.chartData.labels || [],
          datasets: [{
            data: categoryData.chartData.data || [],
            backgroundColor: [
              '#3B82F6',
              '#10B981',
              '#F59E0B',
              '#EF4444',
              '#8B5CF6',
            ],
            borderWidth: 0,
          }]
        });
      }

    } catch (error) {
      console.error('Error loading chart data:', error);
      // Set fallback empty chart data
      setRevenueChartData({
        labels: [],
        datasets: [{
          label: 'Doanh thu (VNĐ)',
          data: [],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        }]
      });
      setOrdersChartData({
        labels: [],
        datasets: [{
          label: 'Đơn hàng',
          data: [],
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
        }]
      });
      setCategoryChartData({
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6',
          ],
          borderWidth: 0,
        }]
      });
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const statCards = [
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(stats?.totalRevenue || 0),
      change: stats?.revenueGrowth || 0,
      icon: CurrencyDollarIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Tổng đơn hàng',
      value: formatNumber(stats?.totalOrders || 0),
      change: stats?.ordersGrowth || 0,
      icon: ShoppingCartIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Tổng sản phẩm',
      value: formatNumber(stats?.totalProducts || 0),
      change: stats?.productsGrowth || 0,
      icon: CubeIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Tổng khách hàng',
      value: formatNumber(stats?.totalCustomers || 0),
      change: stats?.customersGrowth || 0,
      icon: UsersIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Tổng quan hiệu suất kinh doanh của bạn
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="3months">3 tháng qua</option>
              <option value="1year">1 năm qua</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{card.value}</p>
                  <div className="flex items-center mt-2">
                    {card.change > 0 ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${card.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(card.change)}%
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs tháng trước</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <card.icon className={`h-8 w-8 ${card.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Doanh thu theo ngày</h3>
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="h-80">
              {loading || !revenueChartData ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</div>
                </div>
              ) : (
                <Line data={revenueChartData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Đơn hàng theo ngày</h3>
              <ChartBarIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="h-80">
              {loading || !ordersChartData ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</div>
                </div>
              ) : (
                <Bar data={ordersChartData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Đơn hàng gần đây</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Xem tất cả
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{order.id.slice(-2)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(order.amount)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products & Category Chart */}
          <div className="space-y-6">
            {/* Category Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Phân bố danh mục</h3>
              <div className="h-48">
                {loading || !categoryChartData ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</div>
                  </div>
                ) : (
                  <Doughnut 
                    data={categoryChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                              size: 12
                            }
                          }
                        }
                      }
                    }} 
                  />
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Sản phẩm bán chạy</h3>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {typeof product.category === 'string' ? product.category : (product.category as any)?.name || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.sold}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">đã bán</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
