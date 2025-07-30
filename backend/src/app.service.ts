import { Injectable, OnModuleInit, Logger } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  async onModuleInit() {
    try {
      this.logger.log('Application initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize application:', error);
    }
  }

  getHello(): string {
    return 'Laptop E-commerce API is running!';
  }
}
