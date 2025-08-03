import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { PortDetectionService } from '../common/port-detection.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService, PortDetectionService],
  exports: [EmailService, PortDetectionService],
})
export class EmailModule {}
