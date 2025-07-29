import api from '../utils/api';

export interface StaffDashboardStats {
  user: {
    name: string;
    role: string;
    email: string;
  };
  stats: {
    ordersToday: number;
    pendingOrders: number;
    processingOrders: number;
    completedOrders: number;
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
  };
  roleSpecific: {
    tasksToday: number;
    completedTasks: number;
    pendingTasks: number;
    urgentTasks: number;
    [key: string]: any;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    time: string;
    type: string;
    status?: string;
  }>;
  notifications: Array<{
    id: number;
    message: string;
    type: 'info' | 'warning' | 'urgent' | 'success';
    time: string;
  }>;
}

class StaffService {
  async getDashboardStats(): Promise<StaffDashboardStats> {
    try {
      const response = await api.get('/api/staff/dashboard');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching staff dashboard stats:', error);
      throw error;
    }
  }

  async getQuickStats() {
    try {
      const response = await api.get('/api/staff/dashboard');
      const data = response.data.data;
      
      return {
        tasksToday: data.roleSpecific.tasksToday || 0,
        completedTasks: data.roleSpecific.completedTasks || 0,
        pendingTasks: data.roleSpecific.pendingTasks || 0,
        urgentTasks: data.roleSpecific.urgentTasks || 0,
      };
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      throw error;
    }
  }

  async getRecentActivity(limit: number = 5) {
    try {
      const response = await api.get('/api/staff/dashboard');
      const data = response.data.data;
      
      return data.recentActivity.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  async getNotifications(limit: number = 5) {
    try {
      const response = await api.get('/api/staff/dashboard');
      const data = response.data.data;
      
      return data.notifications.slice(0, limit);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }
}

export default new StaffService();
