import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../common/schemas/user.schema';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
  fullName?: string;
  phone?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

    await this.usersService.updatePassword(userId, newPassword);
    return { message: 'Password updated successfully' };
  }
}
