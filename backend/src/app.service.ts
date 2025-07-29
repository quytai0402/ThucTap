import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { SeedService } from './common/seed.service';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    try {
      // SeedService will auto-seed via its own onModuleInit
      this.logger.log('Application initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize application:', error);
    }
  }

  getHello(): string {
    return 'Laptop E-commerce API is running!';
  }
}
