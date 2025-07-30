import React, { useState, useEffect } from 'react';
import AdminLayout from '../../src/components/AdminLayout';
import RealTimeDashboard from '../../src/components/RealTimeDashboard';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { analyticsService } from '../../src/services/analyticsService';
import { Line, Bar } from 'react-chartjs-2';
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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);



const AdminDashboard = () => {
  const [revenueChartData, setRevenueChartData] = useState<any>(null);
  const [ordersChartData, setOrdersChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  // Load all dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Only load chart data now (stats handled by RealTimeDashboard)

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
      // Load chart data in parallel
      const [salesData, revenueData] = await Promise.all([
        analyticsService.getSalesAnalytics({ period: 'month' }).catch(() => []),
        analyticsService.getRevenueAnalytics('month').catch(() => [])
      ]);

      // Process revenue chart data
      if (Array.isArray(revenueData) && revenueData.length > 0) {
        setRevenueChartData({
          labels: revenueData.map((item: any) => item._id || 'N/A'),
          datasets: [{
            label: 'Doanh thu (VNĐ)',
            data: revenueData.map((item: any) => item.revenue || 0),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
          }]
        });
      } else {
        // Fallback mock data
        setRevenueChartData({
          labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
          datasets: [{
            label: 'Doanh thu (VNĐ)',
            data: [12000000, 19000000, 15000000, 25000000, 22000000, 30000000],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
          }]
        });
      }

      // Process sales/orders chart data
      if (Array.isArray(salesData) && salesData.length > 0) {
        setOrdersChartData({
          labels: salesData.map((item: any) => item._id || 'N/A'),
          datasets: [{
            label: 'Đơn hàng',
            data: salesData.map((item: any) => item.orderCount || 0),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
          }]
        });
      } else {
        // Fallback mock data
        setOrdersChartData({
          labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
          datasets: [{
            label: 'Đơn hàng',
            data: [65, 59, 80, 81, 56, 95],
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
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

        {/* Real-Time Dashboard */}
        <RealTimeDashboard />

        {/* Charts Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Biểu đồ phân tích</h2>
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

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
