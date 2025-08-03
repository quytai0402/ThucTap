import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PortDetectionService {
  constructor(private configService: ConfigService) {}

  /**
   * Get the frontend URL from configuration
   */
  getFrontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  }

  /**
   * Get the backend URL from configuration
   */
  getBackendUrl(): string {
    const port = this.configService.get<number>('PORT', 3001);
    return `http://localhost:${port}`;
  }

  /**
   * Detect if we're running in development mode
   */
  isDevelopment(): boolean {
    return this.configService.get<string>('NODE_ENV') !== 'production';
  }
}
