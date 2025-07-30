import api from '../utils/api';

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  timezone: string;
  language: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface ShippingSettings {
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  maxShippingDays: number;
  shippingZones: Array<{
    name: string;
    cities: string[];
    standardFee: number;
    expressFee: number;
  }>;
}

export interface PaymentSettings {
  vnpayEnabled: boolean;
  vnpayTmnCode?: string;
  momoEnabled: boolean;
  bankTransferEnabled: boolean;
  codEnabled: boolean;
  autoConfirmPayment: boolean;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  templates: {
    orderConfirmation: boolean;
    orderShipped: boolean;
    orderDelivered: boolean;
    orderCancelled: boolean;
    passwordReset: boolean;
    welcome: boolean;
  };
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  orderNotifications: boolean;
  inventoryNotifications: boolean;
  promotionNotifications: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireUppercase: boolean;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  googleTagManagerId?: string;
  robotsTxt: string;
  sitemapEnabled: boolean;
}

export interface AllSettings {
  system: SystemSettings;
  shipping: ShippingSettings;
  payment: PaymentSettings;
  email: EmailSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  seo: SEOSettings;
}

class SettingsService {
  // ===== SYSTEM SETTINGS =====

  // Get all settings
  async getAllSettings(): Promise<AllSettings> {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching all settings:', error);
      throw error;
    }
  }

  // Get system settings
  async getSystemSettings(): Promise<SystemSettings> {
    try {
      const response = await api.get('/admin/settings/system');
      return response.data;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  }

  // Update system settings
  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const response = await api.patch('/admin/settings/system', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  }

  // ===== SHIPPING SETTINGS =====

  // Get shipping settings
  async getShippingSettings(): Promise<ShippingSettings> {
    try {
      const response = await api.get('/admin/settings/shipping');
      return response.data;
    } catch (error) {
      console.error('Error fetching shipping settings:', error);
      throw error;
    }
  }

  // Update shipping settings
  async updateShippingSettings(settings: Partial<ShippingSettings>): Promise<ShippingSettings> {
    try {
      const response = await api.patch('/admin/settings/shipping', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating shipping settings:', error);
      throw error;
    }
  }

  // ===== PAYMENT SETTINGS =====

  // Get payment settings
  async getPaymentSettings(): Promise<PaymentSettings> {
    try {
      const response = await api.get('/admin/settings/payment');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      throw error;
    }
  }

  // Update payment settings
  async updatePaymentSettings(settings: Partial<PaymentSettings>): Promise<PaymentSettings> {
    try {
      const response = await api.patch('/admin/settings/payment', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating payment settings:', error);
      throw error;
    }
  }

  // Test payment gateway connection
  async testPaymentGateway(gateway: 'vnpay' | 'momo'): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/admin/settings/payment/test/${gateway}`);
      return response.data;
    } catch (error) {
      console.error('Error testing payment gateway:', error);
      throw error;
    }
  }

  // ===== EMAIL SETTINGS =====

  // Get email settings
  async getEmailSettings(): Promise<EmailSettings> {
    try {
      const response = await api.get('/admin/settings/email');
      return response.data;
    } catch (error) {
      console.error('Error fetching email settings:', error);
      throw error;
    }
  }

  // Update email settings
  async updateEmailSettings(settings: Partial<EmailSettings>): Promise<EmailSettings> {
    try {
      const response = await api.patch('/admin/settings/email', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating email settings:', error);
      throw error;
    }
  }

  // Test email configuration
  async testEmailConfig(testEmail: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/admin/settings/email/test', { testEmail });
      return response.data;
    } catch (error) {
      console.error('Error testing email config:', error);
      throw error;
    }
  }

  // ===== NOTIFICATION SETTINGS =====

  // Get notification settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await api.get('/admin/settings/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  }

  // Update notification settings
  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    try {
      const response = await api.patch('/admin/settings/notifications', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

  // ===== SECURITY SETTINGS =====

  // Get security settings
  async getSecuritySettings(): Promise<SecuritySettings> {
    try {
      const response = await api.get('/admin/settings/security');
      return response.data;
    } catch (error) {
      console.error('Error fetching security settings:', error);
      throw error;
    }
  }

  // Update security settings
  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
    try {
      const response = await api.patch('/admin/settings/security', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw error;
    }
  }

  // ===== SEO SETTINGS =====

  // Get SEO settings
  async getSEOSettings(): Promise<SEOSettings> {
    try {
      const response = await api.get('/admin/settings/seo');
      return response.data;
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
      throw error;
    }
  }

  // Update SEO settings
  async updateSEOSettings(settings: Partial<SEOSettings>): Promise<SEOSettings> {
    try {
      const response = await api.patch('/admin/settings/seo', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating SEO settings:', error);
      throw error;
    }
  }

  // Generate sitemap
  async generateSitemap(): Promise<{ success: boolean; message: string; url?: string }> {
    try {
      const response = await api.post('/admin/settings/seo/sitemap/generate');
      return response.data;
    } catch (error) {
      console.error('Error generating sitemap:', error);
      throw error;
    }
  }

  // ===== BACKUP & RESTORE =====

  // Create settings backup
  async createBackup(): Promise<{ success: boolean; backupId: string; downloadUrl: string }> {
    try {
      const response = await api.post('/admin/settings/backup');
      return response.data;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  // Get backup list
  async getBackups(): Promise<Array<{
    id: string;
    name: string;
    size: number;
    createdAt: string;
    downloadUrl: string;
  }>> {
    try {
      const response = await api.get('/admin/settings/backup');
      return response.data;
    } catch (error) {
      console.error('Error fetching backups:', error);
      throw error;
    }
  }

  // Restore from backup
  async restoreBackup(backupId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/admin/settings/backup/${backupId}/restore`);
      return response.data;
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  }

  // Delete backup
  async deleteBackup(backupId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/admin/settings/backup/${backupId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting backup:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  // Reset settings to default
  async resetToDefault(section: keyof AllSettings): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/admin/settings/${section}/reset`);
      return response.data;
    } catch (error) {
      console.error(`Error resetting ${section} settings:`, error);
      throw error;
    }
  }

  // Validate settings before save
  validateSettings(section: keyof AllSettings, settings: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (section) {
      case 'system':
        if (!settings.siteName?.trim()) errors.push('Site name is required');
        if (!settings.contactEmail?.trim()) errors.push('Contact email is required');
        if (settings.contactEmail && !this.isValidEmail(settings.contactEmail)) {
          errors.push('Contact email format is invalid');
        }
        break;

      case 'shipping':
        if (settings.freeShippingThreshold < 0) errors.push('Free shipping threshold must be positive');
        if (settings.standardShippingFee < 0) errors.push('Standard shipping fee must be positive');
        break;

      case 'payment':
        if (settings.vnpayEnabled && !settings.vnpayTmnCode?.trim()) {
          errors.push('VNPay TMN Code is required when VNPay is enabled');
        }
        break;

      case 'email':
        if (!settings.smtpHost?.trim()) errors.push('SMTP host is required');
        if (!settings.smtpPort || settings.smtpPort < 1) errors.push('Valid SMTP port is required');
        if (!settings.fromEmail?.trim()) errors.push('From email is required');
        if (settings.fromEmail && !this.isValidEmail(settings.fromEmail)) {
          errors.push('From email format is invalid');
        }
        break;

      case 'security':
        if (settings.passwordMinLength < 6) errors.push('Password minimum length should be at least 6');
        if (settings.sessionTimeout < 5) errors.push('Session timeout should be at least 5 minutes');
        break;

      case 'seo':
        if (!settings.metaTitle?.trim()) errors.push('Meta title is required');
        if (!settings.metaDescription?.trim()) errors.push('Meta description is required');
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper: Validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get settings summary for dashboard
  async getSettingsSummary() {
    try {
      const [system, payment, security] = await Promise.all([
        this.getSystemSettings(),
        this.getPaymentSettings(),
        this.getSecuritySettings()
      ]);

      return {
        siteName: system.siteName,
        paymentMethodsEnabled: {
          vnpay: payment.vnpayEnabled,
          momo: payment.momoEnabled,
          bankTransfer: payment.bankTransferEnabled,
          cod: payment.codEnabled
        },
        securityFeatures: {
          twoFactorAuth: security.twoFactorAuth,
          strongPassword: security.passwordMinLength >= 8 && security.passwordRequireSpecialChars
        },
        lastBackup: null // This would come from backup API
      };
    } catch (error) {
      console.error('Error fetching settings summary:', error);
      throw error;
    }
  }

  // Export settings configuration
  async exportSettings(): Promise<{ success: boolean; downloadUrl: string }> {
    try {
      const response = await api.get('/admin/settings/export', {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `settings_export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, downloadUrl: url };
    } catch (error) {
      console.error('Error exporting settings:', error);
      throw error;
    }
  }

  // Import settings configuration
  async importSettings(file: File): Promise<{ success: boolean; message: string }> {
    try {
      const formData = new FormData();
      formData.append('settings', file);
      
      const response = await api.post('/admin/settings/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error importing settings:', error);
      throw error;
    }
  }
}

export const settingsService = new SettingsService();
export default settingsService; 