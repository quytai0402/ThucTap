import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/schemas/user.schema';

export class UpdateStockDto {
  productId: string;
  quantity: number;
  type: 'add' | 'subtract' | 'set';
  reason?: string;
}

export class StockAdjustmentDto {
  productId: string;
  oldQuantity: number;
  newQuantity: number;
  adjustmentType: 'add' | 'subtract' | 'set';
  reason: string;
  adjustedBy: string;
}

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get inventory status' })
  getInventoryStatus(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('lowStock') lowStock?: string,
    @Query('outOfStock') outOfStock?: string,
    @Query('search') search?: string,
  ) {
    return this.inventoryService.getInventoryStatus(
      +page,
      +limit,
      lowStock === 'true',
      outOfStock === 'true',
      search,
    );
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock products' })
  getLowStockProducts(@Query('threshold') threshold: string = '10') {
    return this.inventoryService.getLowStockProducts(+threshold);
  }

  @Get('out-of-stock')
  @ApiOperation({ summary: 'Get out of stock products' })
  getOutOfStockProducts() {
    return this.inventoryService.getOutOfStockProducts();
  }

  @Get('adjustments')
  @ApiOperation({ summary: 'Get stock adjustment history' })
  getStockAdjustments(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('productId') productId?: string,
  ) {
    return this.inventoryService.getStockAdjustments(+page, +limit, productId);
  }

  @Post('adjust')
  @ApiOperation({ summary: 'Adjust product stock' })
  adjustStock(@Body() updateStockDto: UpdateStockDto) {
    return this.inventoryService.adjustStock(updateStockDto);
  }

  @Get('reports/stock-levels')
  @ApiOperation({ summary: 'Get stock levels report' })
  getStockLevelsReport() {
    return this.inventoryService.getStockLevelsReport();
  }

  @Get('reports/stock-movements')
  @ApiOperation({ summary: 'Get stock movements report' })
  getStockMovementsReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.inventoryService.getStockMovementsReport(startDate, endDate);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get inventory alerts' })
  getInventoryAlerts() {
    return this.inventoryService.getInventoryAlerts();
  }
}
