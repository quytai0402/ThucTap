import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const OptionalUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return null;
    }
    
    try {
      const token = authorization.split(' ')[1];
      const jwtService = new JwtService({
        secret: process.env.JWT_SECRET || 'laptop-ecommerce-jwt-secret-key-2025-very-long-and-secure',
      });
      
      const payload = jwtService.verify(token);
      return payload;
    } catch (error) {
      return null;
    }
  },
);
