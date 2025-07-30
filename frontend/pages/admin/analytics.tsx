import React, { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import { analyticsService } from '../../src/services/analyticsService';
import {
  CalendarIcon,
  ArrowDownTrayIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
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
  Filler,
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
  ArcElement,
  Filler
);

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    data: number[];
    labels: string[];
  };
  orders: {
    total: number;
    growth: number;
    data: number[];
    labels: string[];
  };
  customers: {
    total: number;
    growth: number;
    new: number;
    returning: number;
  };
  products: {
    topSelling: Array<{
      id: string;
      name: string;
      sold: number;
      revenue: number;
    }>;
    categories: Array<{
      name: string;
      percentage: number;
      revenue: number;
    }>;
  };
  traffic: {
    views: number;
    visitors: number;
    bounceRate: number;
    avgSession: string;
  };
}

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [dashboardStats, salesAnalytics, productAnalytics, customerAnalytics] = await Promise.all([
          analyticsService.getDashboardStats().catch(err => { console.error('Dashboard stats error:', err); return {}; }),
          analyticsService.getSalesAnalytics().catch(err => { console.error('Sales analytics error:', err); return {}; }),
          analyticsService.getProductAnalytics().catch(err => { console.error('Product analytics error:', err); return {}; }),
          analyticsService.getCustomerAnalytics().catch(err => { console.error('Customer analytics error:', err); return {}; }),
        ]);

        console.log('Analytics responses:', { dashboardStats, salesAnalytics, productAnalytics, customerAnalytics });

        setAnalyticsData({
          revenue: {
            total: (dashboardStats as any)?.totalRevenue || 0,
            growth: (salesAnalytics as any)?.growth || 0,
            data: (salesAnalytics as any)?.data || (salesAnalytics as any)?.chartData?.data || [],
            labels: (salesAnalytics as any)?.labels || (salesAnalytics as any)?.chartData?.labels || []
          },
          orders: {
            total: (dashboardStats as any)?.totalOrders || 0,
            growth: (salesAnalytics as any)?.orderGrowth || 0,
            data: (salesAnalytics as any)?.orderData || (salesAnalytics as any)?.chartData?.orderData || [],
            labels: (salesAnalytics as any)?.labels || (salesAnalytics as any)?.chartData?.labels || []
          },
          customers: {
            total: (dashboardStats as any)?.totalCustomers || (dashboardStats as any)?.totalUsers || 0,
            growth: (customerAnalytics as any)?.growth || 0,
            new: (customerAnalytics as any)?.newCustomers || 0,
            returning: (customerAnalytics as any)?.returningCustomers || 0
          },
          products: {
            topSelling: (productAnalytics as any)?.topProducts || (productAnalytics as any)?.topSellingProducts || [],
            categories: (productAnalytics as any)?.categories || (productAnalytics as any)?.categoryPerformance || []
          },
          traffic: {
            views: (dashboardStats as any)?.totalViews || 0,
            visitors: (dashboardStats as any)?.totalVisitors || 0,
            bounceRate: (dashboardStats as any)?.bounceRate || 0,
            avgSession: (dashboardStats as any)?.avgSession || '0m 0s'
          }
        });
      } catch (err) {
        setError('Không thể tải dữ liệu analytics');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [dateRange]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !analyticsData) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Không có dữ liệu'}</p>
        </div>
      </AdminLayout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  // Chart configurations
  const revenueChartData = {
    labels: analyticsData.revenue.labels,
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: analyticsData.revenue.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const ordersChartData = {
    labels: analyticsData.orders.labels,
    datasets: [
      {
        label: 'Đơn hàng',
        data: analyticsData.orders.data,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  const categoryChartData = {
    labels: analyticsData.products.categories.map(cat => cat.name),
    datasets: [
      {
        data: analyticsData.products.categories.map(cat => cat.percentage),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
        borderWidth: 0,
      },
    ],
  };

  const customerTypeData = {
    labels: ['Khách hàng mới', 'Khách hàng cũ'],
    datasets: [
      {
        data: [analyticsData.customers.new, analyticsData.customers.returning],
        backgroundColor: ['#3B82F6', '#10B981'],
        borderWidth: 0,
      },
    ],
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

  const doughnutOptions = {
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
  };

  const handleExport = () => {
    console.log('Exporting analytics data...');
    // Implement export functionality
  };

  const kpiCards = [
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(analyticsData.revenue.total),
      change: analyticsData.revenue.growth,
      icon: CurrencyDollarIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Tổng đơn hàng',
      value: formatNumber(analyticsData.orders.total),
      change: analyticsData.orders.growth,
      icon: ShoppingCartIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Khách hàng',
      value: formatNumber(analyticsData.customers.total),
      change: analyticsData.customers.growth,
      icon: UsersIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Lượt truy cập',
      value: formatNumber(analyticsData.traffic.views),
      change: 15.2,
      icon: EyeIcon,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <AdminLayout title="Phân tích & Báo cáo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Phân tích & Báo cáo</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Theo dõi hiệu suất kinh doanh và xu hướng thị trường
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="3months">3 tháng qua</option>
              <option value="1year">1 năm qua</option>
            </select>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card, index) => (
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
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs kỳ trước</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <card.icon className={`h-8 w-8 ${card.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Xu hướng doanh thu</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Theo dõi doanh thu theo thời gian</p>
              </div>
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="h-80">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Đơn hàng theo ngày</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Số lượng đơn hàng mỗi ngày</p>
              </div>
              <ShoppingCartIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="h-80">
              <Bar data={ordersChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Secondary Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Sản phẩm bán chạy</h3>
            <div className="space-y-4">
              {analyticsData.products.topSelling.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(product.revenue)}</p>
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

          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Phân bố danh mục</h3>
            <div className="h-64 mb-4">
              <Doughnut data={categoryChartData} options={doughnutOptions} />
            </div>
            <div className="space-y-2">
              {analyticsData.products.categories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index] }}
                    ></div>
                    <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{category.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Analytics */}
          <div className="space-y-6">
            {/* Customer Type */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Loại khách hàng</h3>
              <div className="h-48 mb-4">
                <Doughnut data={customerTypeData} options={doughnutOptions} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2 bg-blue-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Mới</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{analyticsData.customers.new}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Quay lại</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{analyticsData.customers.returning}</span>
                </div>
              </div>
            </div>

            {/* Traffic Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Thống kê truy cập</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Lượt xem trang</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatNumber(analyticsData.traffic.views)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Khách truy cập</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatNumber(analyticsData.traffic.visitors)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ thoát</span>
                  <span className="font-medium text-gray-900 dark:text-white">{analyticsData.traffic.bounceRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">TB thời gian</span>
                  <span className="font-medium text-gray-900 dark:text-white">{analyticsData.traffic.avgSession}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Category */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Doanh thu theo danh mục</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Danh mục</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Doanh thu</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {analyticsData.products.categories.map((category) => (
                    <tr key={category.name}>
                      <td className="py-3 text-sm text-gray-900 dark:text-white">{category.name}</td>
                      <td className="py-3 text-sm text-gray-900 dark:text-white text-right">
                        {formatCurrency(category.revenue)}
                      </td>
                      <td className="py-3 text-sm text-gray-900 dark:text-white text-right">
                        {category.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Chỉ số hiệu suất</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ chuyển đổi</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">2.7%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '27%' }}></div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Giá trị đơn hàng TB</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{formatCurrency(2850000)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ khách hàng quay lại</span>
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">81.6%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ hủy đơn</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">3.2%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '3.2%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nhận xét & Đề xuất</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center mb-2">
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium text-gray-900 dark:text-white">Tăng trưởng tốt</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Doanh thu tăng 12.5% so với kỳ trước, cho thấy xu hướng tích cực trong kinh doanh.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center mb-2">
                <ShoppingCartIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="font-medium text-gray-900 dark:text-white">Đơn hàng ổn định</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Số lượng đơn hàng duy trì ổn định với xu hướng tăng nhẹ vào cuối tuần.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center mb-2">
                <UsersIcon className="h-5 w-5 text-purple-500 mr-2" />
                <span className="font-medium text-gray-900 dark:text-white">Khách hàng trung thành</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tỷ lệ khách hàng quay lại cao (81.6%) cho thấy mức độ hài lòng tốt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
