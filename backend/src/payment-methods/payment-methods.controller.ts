import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentMethodsService } from './payment-methods.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payment-methods')
@Controller('payment-methods')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  @ApiOperation({ summary: 'Add new payment method' })
  create(@Request() req, @Body() createPaymentMethodDto: any) {
    return this.paymentMethodsService.create(req.user.sub, createPaymentMethodDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payment methods' })
  findAll(@Request() req) {
    return this.paymentMethodsService.findAll(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment method by id' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.paymentMethodsService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update payment method' })
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updatePaymentMethodDto: any,
  ) {
    return this.paymentMethodsService.update(id, req.user.sub, updatePaymentMethodDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payment method' })
  remove(@Param('id') id: string, @Request() req) {
    return this.paymentMethodsService.remove(id, req.user.sub);
  }

  @Patch(':id/set-default')
  @ApiOperation({ summary: 'Set payment method as default' })
  setDefault(@Param('id') id: string, @Request() req) {
    return this.paymentMethodsService.setDefault(id, req.user.sub);
  }
}
