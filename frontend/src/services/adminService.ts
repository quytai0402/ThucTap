import api from '../utils/api';

export interface DatabaseStats {
  users: number;
  products: number;
  orders: number;
  categories: number;
  reviews: number;
  favorites: number;
  addresses: number;
  totalRecords: number;
  databaseSize?: string;
}

export interface ClearDataResponse {
  success: boolean;
  message: string;
  deletedCounts?: {
    [collection: string]: number;
  };
}

class AdminService {
  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<DatabaseStats> {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching database stats:', error);
      throw error;
    }
  }

  /**
   * Clear all data from database
   * WARNING: This is a destructive operation
   */
  async clearAllData(): Promise<ClearDataResponse> {
    try {
      const response = await api.post('/admin/clear-data');
      return response.data;
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  /**
   * Clear specific collection data
   */
  async clearCollectionData(collection: string): Promise<ClearDataResponse> {
    try {
      const response = await api.post('/admin/clear-data', { collection });
      return response.data;
    } catch (error) {
      console.error('Error clearing collection data:', error);
      throw error;
    }
  }

  /**
   * Backup database before clearing
   */
  async backupDatabase(): Promise<{ success: boolean; message: string; backupId?: string }> {
    try {
      const response = await api.post('/admin/backup');
      return response.data;
    } catch (error) {
      console.error('Error backing up database:', error);
      throw error;
    }
  }

  /**
   * Restore database from backup
   */
  async restoreDatabase(backupId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/admin/restore', { backupId });
      return response.data;
    } catch (error) {
      console.error('Error restoring database:', error);
      throw error;
    }
  }

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<{
    status: 'healthy' | 'warning' | 'error';
    services: {
      database: boolean;
      redis?: boolean;
      storage: boolean;
      email?: boolean;
    };
    uptime: number;
    memoryUsage: {
      used: number;
      total: number;
      percentage: number;
    };
  }> {
    try {
      const response = await api.get('/admin/health');
      return response.data;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }

  /**
   * Export all data
   */
  async exportAllData(format: 'json' | 'csv' | 'excel' = 'json'): Promise<Blob> {
    try {
      const response = await api.get(`/admin/export?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  /**
   * Import data from file
   */
  async importData(file: File, options?: {
    overwrite?: boolean;
    validate?: boolean;
  }): Promise<{
    success: boolean;
    message: string;
    importedCounts?: { [collection: string]: number };
    errors?: string[];
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (options?.overwrite) formData.append('overwrite', 'true');
      if (options?.validate) formData.append('validate', 'true');

      const response = await api.post('/admin/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  // Admin service methods for database and system management
}

export const adminService = new AdminService();
export default adminService;
