import { Controller, Post, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ClearDataService } from './clear-data.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly clearDataService: ClearDataService) {}

  @Post('clear-data')
  @ApiOperation({ summary: 'Clear all data from database' })
  async clearAllData() {
    return this.clearDataService.clearAllData();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get database statistics' })
  async getStats() {
    return this.clearDataService.getDataStats();
  }
}
