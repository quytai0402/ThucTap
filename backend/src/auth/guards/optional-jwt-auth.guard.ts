import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Allow access for both authenticated and unauthenticated users
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    // If no token or invalid token, just return null (no user)
    // Don't throw error - allow guest access
    if (err || !user) {
      return null;
    }
    return user;
  }
}
