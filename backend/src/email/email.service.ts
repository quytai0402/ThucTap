import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { OrderDocument } from '../common/schemas/order.schema';
import { UserDocument } from '../common/schemas/user.schema';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.createTransporter();
  }

  private createTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendOrderConfirmation(order: OrderDocument) {
    try {
      const emailContent = this.generateOrderConfirmationEmail(order);
      
      await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_USER'),
        to: order.shippingAddress.email,
        subject: `Xác nhận đơn hàng #${order.orderNumber}`,
        html: emailContent,
      });

      this.logger.log(`Order confirmation email sent for order ${order.orderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to send order confirmation email: ${error.message}`);
    }
  }

  async sendOrderStatusUpdate(order: OrderDocument, previousStatus: string) {
    try {
      const emailContent = this.generateOrderStatusUpdateEmail(order, previousStatus);
      
      await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_USER'),
        to: order.shippingAddress.email,
        subject: `Cập nhật đơn hàng #${order.orderNumber}`,
        html: emailContent,
      });

      this.logger.log(`Order status update email sent for order ${order.orderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to send order status update email: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    try {
      const resetUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:3002')}/reset-password?token=${resetToken}`;
      const emailContent = this.generatePasswordResetEmail(resetUrl);
      
      await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_USER'),
        to: email,
        subject: 'Đặt lại mật khẩu - LaptopStore',
        html: emailContent,
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email: ${error.message}`);
    }
  }

  private generateOrderConfirmationEmail(order: OrderDocument): string {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 10px;">
          ${item.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString('vi-VN')}đ</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Xác nhận đơn hàng</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">LaptopStore</h1>
            <p style="color: #666; margin: 5px 0;">Cảm ơn bạn đã đặt hàng!</p>
          </div>

          <!-- Order Info -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; margin-bottom: 15px;">Thông tin đơn hàng</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0;"><strong>Mã đơn hàng:</strong></td>
                <td style="padding: 8px 0; color: #2563eb;">#${order.orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Ngày đặt:</strong></td>
                <td style="padding: 8px 0;">${new Date((order as any).createdAt).toLocaleDateString('vi-VN')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Trạng thái:</strong></td>
                <td style="padding: 8px 0;"><span style="background-color: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Đã đặt hàng</span></td>
              </tr>
            </table>
          </div>

          <!-- Products -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">Sản phẩm đã đặt</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Sản phẩm</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Số lượng</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Đơn giá</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <!-- Order Summary -->
          <div style="margin-bottom: 30px; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Tổng cộng</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 5px 0;">Tạm tính:</td>
                <td style="padding: 5px 0; text-align: right;">${order.subtotal.toLocaleString('vi-VN')}đ</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">Phí vận chuyển:</td>
                <td style="padding: 5px 0; text-align: right;">${order.shippingFee.toLocaleString('vi-VN')}đ</td>
              </tr>
              <tr style="border-top: 1px solid #ddd; font-weight: bold; font-size: 18px;">
                <td style="padding: 10px 0;">Tổng cộng:</td>
                <td style="padding: 10px 0; text-align: right; color: #2563eb;">${order.total.toLocaleString('vi-VN')}đ</td>
              </tr>
            </table>
          </div>

          <!-- Shipping Address -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">Địa chỉ giao hàng</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
              <p style="margin: 0;"><strong>${order.shippingAddress.name}</strong></p>
              <p style="margin: 5px 0;">📞 ${order.shippingAddress.phone}</p>
              <p style="margin: 5px 0;">📧 ${order.shippingAddress.email}</p>
              <p style="margin: 5px 0;">📍 ${order.shippingAddress.address}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.city}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; border-top: 1px solid #eee; padding-top: 20px; color: #666;">
            <p>Cảm ơn bạn đã tin tưởng LaptopStore!</p>
            <p>Mọi thắc mắc xin liên hệ: <a href="mailto:support@laptopstore.vn" style="color: #2563eb;">support@laptopstore.vn</a></p>
            <p style="font-size: 12px; margin-top: 20px;">Email này được gửi tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateOrderStatusUpdateEmail(order: OrderDocument, previousStatus: string): string {
    const statusMap = {
      'pending': { text: 'Chờ xác nhận', color: '#f59e0b', icon: '⏳' },
      'confirmed': { text: 'Đã xác nhận', color: '#3b82f6', icon: '✅' },
      'processing': { text: 'Đang xử lý', color: '#8b5cf6', icon: '⚙️' },
      'shipped': { text: 'Đang giao hàng', color: '#06b6d4', icon: '🚚' },
      'delivered': { text: 'Đã giao hàng', color: '#10b981', icon: '📦' },
      'cancelled': { text: 'Đã hủy', color: '#ef4444', icon: '❌' }
    };

    const currentStatusInfo = statusMap[order.status] || { text: order.status, color: '#6b7280', icon: '📋' };
    const previousStatusInfo = statusMap[previousStatus] || { text: previousStatus, color: '#6b7280', icon: '📋' };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Cập nhật đơn hàng</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">LaptopStore</h1>
            <p style="color: #666; margin: 5px 0;">Cập nhật trạng thái đơn hàng</p>
          </div>

          <!-- Status Update -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px;">
              <h2 style="margin: 0 0 10px 0;">${currentStatusInfo.icon} Đơn hàng #${order.orderNumber}</h2>
              <p style="margin: 0; font-size: 18px;">
                Đã chuyển từ <span style="text-decoration: line-through; opacity: 0.7;">${previousStatusInfo.text}</span> 
                thành <strong style="color: #fbbf24;">${currentStatusInfo.text}</strong>
              </p>
            </div>
          </div>

          <!-- Order Details -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">Thông tin đơn hàng</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0;"><strong>Mã đơn hàng:</strong></td>
                <td style="padding: 8px 0; color: #2563eb;">#${order.orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Ngày đặt:</strong></td>
                <td style="padding: 8px 0;">${new Date((order as any).createdAt).toLocaleDateString('vi-VN')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Tổng tiền:</strong></td>
                <td style="padding: 8px 0; font-weight: bold; color: #2563eb;">${order.total.toLocaleString('vi-VN')}đ</td>
              </tr>
              ${order.trackingNumber ? `
              <tr>
                <td style="padding: 8px 0;"><strong>Mã vận đơn:</strong></td>
                <td style="padding: 8px 0; font-family: monospace; background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${order.trackingNumber}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <!-- Status-specific content -->
          ${this.getStatusSpecificContent(order)}

          <!-- Contact Info -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Cần hỗ trợ?</h3>
            <p style="margin: 5px 0;">📞 Hotline: 1900-1234</p>
            <p style="margin: 5px 0;">📧 Email: support@laptopstore.vn</p>
            <p style="margin: 5px 0;">🕒 Thời gian hỗ trợ: 8:00 - 20:00 (Thứ 2 - Chủ nhật)</p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; border-top: 1px solid #eee; padding-top: 20px; color: #666;">
            <p>Cảm ơn bạn đã tin tưởng LaptopStore!</p>
            <p style="font-size: 12px; margin-top: 20px;">Email này được gửi tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getStatusSpecificContent(order: OrderDocument): string {
    switch (order.status) {
      case 'confirmed':
        return `
          <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px;">
            <h4 style="color: #1e40af; margin: 0 0 10px 0;">✅ Đơn hàng đã được xác nhận</h4>
            <p style="margin: 0; color: #1e40af;">Chúng tôi đang chuẩn bị sản phẩm cho bạn. Đơn hàng sẽ được giao trong 2-3 ngày làm việc.</p>
          </div>
        `;
      case 'processing':
        return `
          <div style="background-color: #ede9fe; border-left: 4px solid #8b5cf6; padding: 15px; margin-bottom: 20px;">
            <h4 style="color: #7c3aed; margin: 0 0 10px 0;">⚙️ Đang xử lý đơn hàng</h4>
            <p style="margin: 0; color: #7c3aed;">Đơn hàng của bạn đang được đóng gói và chuẩn bị giao hàng.</p>
          </div>
        `;
      case 'shipped':
        return `
          <div style="background-color: #cffafe; border-left: 4px solid #06b6d4; padding: 15px; margin-bottom: 20px;">
            <h4 style="color: #0891b2; margin: 0 0 10px 0;">🚚 Đơn hàng đang được giao</h4>
            <p style="margin: 0; color: #0891b2;">
              Đơn hàng đã được gửi đi và đang trên đường đến với bạn.
              ${order.trackingNumber ? `<br>Mã vận đơn: <strong>${order.trackingNumber}</strong>` : ''}
            </p>
          </div>
        `;
      case 'delivered':
        return `
          <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin-bottom: 20px;">
            <h4 style="color: #059669; margin: 0 0 10px 0;">📦 Đã giao hàng thành công</h4>
            <p style="margin: 0; color: #059669;">
              Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua sắm tại LaptopStore!
              <br>Đừng quên để lại đánh giá cho sản phẩm nhé!
            </p>
          </div>
        `;
      case 'cancelled':
        return `
          <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin-bottom: 20px;">
            <h4 style="color: #dc2626; margin: 0 0 10px 0;">❌ Đơn hàng đã bị hủy</h4>
            <p style="margin: 0; color: #dc2626;">
              Đơn hàng của bạn đã được hủy. Nếu bạn đã thanh toán, số tiền sẽ được hoàn lại trong 3-5 ngày làm việc.
              ${order.cancelReason ? `<br>Lý do: ${order.cancelReason}` : ''}
            </p>
          </div>
        `;
      default:
        return '';
    }
  }

  private generatePasswordResetEmail(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Đặt lại mật khẩu</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">LaptopStore</h1>
            <p style="color: #666; margin: 5px 0;">Yêu cầu đặt lại mật khẩu</p>
          </div>

          <!-- Content -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="margin: 0 0 10px 0;">🔐 Đặt lại mật khẩu</h2>
              <p style="margin: 0;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn</p>
            </div>

            <div style="margin: 30px 0;">
              <p style="color: #333; margin-bottom: 20px;">Nhấn vào nút bên dưới để đặt lại mật khẩu của bạn:</p>
              
              <!-- Button with table structure for better email client support -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px auto;">
                <tr>
                  <td style="border-radius: 6px; background-color: #2563eb;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 12px 30px; font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;"
                       target="_blank">
                      🔐 Đặt lại mật khẩu
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                Hoặc copy link sau vào trình duyệt:<br>
                <a href="${resetUrl}" style="color: #2563eb; text-decoration: underline; word-break: break-all;" target="_blank">${resetUrl}</a>
              </p>
              
              <div style="background: #f3f4f6; padding: 12px; border-radius: 4px; margin-top: 15px;">
                <p style="margin: 0; font-size: 12px; color: #6b7280; font-family: monospace; word-break: break-all;">
                  ${resetUrl}
                </p>
              </div>
            </div>

            <div style="background-color: #fef3cd; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                ⚠️ <strong>Lưu ý quan trọng:</strong> Link này chỉ có hiệu lực trong 15 phút kể từ khi email được gửi. 
                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
              </p>
            </div>
          </div>

          <!-- Security Tips -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">💡 Mẹo bảo mật</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</li>
              <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
              <li>Không chia sẻ mật khẩu với ai khác</li>
              <li>Đăng xuất sau khi sử dụng trên thiết bị công cộng</li>
            </ul>
          </div>

          <!-- Footer -->
          <div style="text-align: center; border-top: 1px solid #eee; padding-top: 20px; color: #666;">
            <p>Cần hỗ trợ? Liên hệ: <a href="mailto:support@laptopstore.vn" style="color: #2563eb;">support@laptopstore.vn</a></p>
            <p style="font-size: 12px; margin-top: 20px;">Email này được gửi tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
