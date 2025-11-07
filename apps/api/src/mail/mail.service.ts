import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    // Lấy URL frontend từ config
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3002');
    const resetLink = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

    // Trong môi trường development, chỉ log email content
    // Trong production, bạn sẽ tích hợp với service email thực tế
    if (this.configService.get('NODE_ENV') === 'development') {
      console.log(`
        ===== PASSWORD RESET EMAIL =====
        To: ${email}
        Subject: Đặt lại mật khẩu - Finance Manager
        
        Xin chào,
        
        Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Finance Manager của mình.
        
        Vui lòng click vào link sau để đặt lại mật khẩu:
        ${resetLink}
        
        ⚠️ Link này sẽ hết hạn sau 15 phút.
        
        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
        Tài khoản của bạn vẫn an toàn và không có thay đổi nào được thực hiện.
        
        Trân trọng,
        Finance Manager Team
        ================================
      `);
    } else {
      // TODO: Implement actual email sending logic for production
      // Example with nodemailer, sendgrid, etc.
      await this.sendEmail({
        to: email,
        subject: 'Đặt lại mật khẩu - Finance Manager',
        template: 'password-reset',
        context: {
          resetLink,
          email,
        },
      });
    }
  }

  async sendPasswordChangedNotification(email: string): Promise<void> {
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3002');
    
    if (this.configService.get('NODE_ENV') === 'development') {
      console.log(`
        ===== PASSWORD CHANGED NOTIFICATION =====
        To: ${email}
        Subject: Mật khẩu đã được thay đổi - Finance Manager
        
        Xin chào,
        
        Mật khẩu cho tài khoản Finance Manager của bạn vừa được thay đổi thành công.
        
        Thời gian: ${new Date().toLocaleString('vi-VN')}
        
        Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức
        hoặc đặt lại mật khẩu tại: ${frontendUrl}/auth/forgot-password
        
        Trân trọng,
        Finance Manager Team
        ==========================================
      `);
    } else {
      // TODO: Implement actual email sending for production
      await this.sendEmail({
        to: email,
        subject: 'Mật khẩu đã được thay đổi - Finance Manager',
        template: 'password-changed',
        context: {
          email,
          changeTime: new Date().toLocaleString('vi-VN'),
          frontendUrl,
        },
      });
    }
  }

  private async sendEmail(options: {
    to: string;
    subject: string;
    template: string;
    context: any;
  }): Promise<void> {
    // TODO: Implement actual email sending logic
    // This is where you would integrate with your email service provider
    // Examples: SendGrid, AWS SES, Nodemailer with SMTP, etc.
    
    console.log('Email would be sent in production:', options);
  }
}
