import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../common/schemas/user.schema';
import { EmailService } from '../email/email.service';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
  fullName?: string;
  phone: string; // Required phone number
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await this.usersService.validatePassword(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user._id, 
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.fullName,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      // Validate input
      if (!registerDto.email || !registerDto.password) {
        throw new BadRequestException('Email and password are required');
      }

      if (!registerDto.fullName && !registerDto.name) {
        throw new BadRequestException('Name is required');
      }

      if (!registerDto.phone) {
        throw new BadRequestException('Phone number is required');
      }

      // Validate phone format (Vietnamese phone number)
      const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
      if (!phoneRegex.test(registerDto.phone)) {
        throw new BadRequestException('Invalid phone number format');
      }

      const user = await this.usersService.create({
        email: registerDto.email,
        password: registerDto.password,
        fullName: registerDto.fullName || registerDto.name,
        phone: registerDto.phone,
        role: UserRole.CUSTOMER,
      });

      // Convert to plain object and remove password
      const userObj = (user as any).toObject ? (user as any).toObject() : user;
      const { password, ...result } = userObj;
      
      return this.login(result);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async getProfile(userId: string) {
    try {
      const user = await this.usersService.findOne(userId);
      if (user) {
        const userObj = (user as any).toObject ? (user as any).toObject() : user;
        const { password, ...result } = userObj;
        return {
          id: result._id || result.id,
          email: result.email,
          name: result.fullName,
          role: result.role,
          avatar: result.avatar,
          phone: result.phone,
          ...result,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw new UnauthorizedException('User not found');
    }
  }

  async updateProfile(userId: string, updateData: any) {
    return this.usersService.update(userId, updateData);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.usersService.findByEmail(userId);
    
    if (!user || !await this.usersService.validatePassword(oldPassword, user.password)) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.usersService.updatePassword(user._id.toString(), newPassword);
    return { message: 'Password updated successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    // Generate reset token (valid for 15 minutes)
    const resetToken = this.jwtService.sign(
      { 
        userId: user._id, 
        email: user.email, 
        type: 'password-reset' 
      },
      { expiresIn: '15m' }
    );

    // Send password reset email
    try {
      await this.emailService.sendPasswordResetEmail(user.email, resetToken);
      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to send password reset email');
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = this.jwtService.verify(token);
      
      if (decoded.type !== 'password-reset') {
        throw new UnauthorizedException('Invalid reset token');
      }

      const user = await this.usersService.findByEmail(decoded.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      await this.usersService.updatePassword(user._id.toString(), newPassword);
      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token không hợp lệ. Vui lòng kiểm tra lại đường link.');
      }
      throw error;
    }
  }
}
