import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService, CreateAddressDto } from './addresses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Create address' })
  async create(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(req.user.sub, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user addresses' })
  async findAll(@Request() req) {
    return this.addressesService.findAll(req.user.sub);
  }

  @Get('default')
  @ApiOperation({ summary: 'Get default address' })
  async getDefault(@Request() req) {
    return this.addressesService.getDefault(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by id' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.addressesService.findOne(req.user.sub, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update address' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateAddressDto: Partial<CreateAddressDto>
  ) {
    return this.addressesService.update(req.user.sub, id, updateAddressDto);
  }

  @Patch(':id/set-default')
  @ApiOperation({ summary: 'Set address as default' })
  async setDefault(@Request() req, @Param('id') id: string) {
    return this.addressesService.setDefault(req.user.sub, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.addressesService.remove(req.user.sub, id);
    return { message: 'Address deleted successfully' };
  }

  // Smart address management endpoints
  @Get('check/can-add')
  @ApiOperation({ summary: 'Check if user can add new address' })
  async canAddNewAddress(@Request() req) {
    const canAdd = await this.addressesService.canAddNewAddress(req.user.sub);
    const count = await this.addressesService.getAddressCount(req.user.sub);
    return { canAdd, currentCount: count, maxAllowed: 3 };
  }

  @Get('suggestions/for-checkout')
  @ApiOperation({ summary: 'Get suggested addresses for checkout' })
  async getSuggestedAddresses(@Request() req) {
    return this.addressesService.getSuggestedAddressesForUser(req.user.sub);
  }

  @Post('from-order')
  @ApiOperation({ summary: 'Create or update address from order' })
  async createOrUpdateFromOrder(
    @Request() req, 
    @Body() addressData: CreateAddressDto
  ) {
    try {
      return await this.addressesService.createOrUpdateFromOrder(req.user.sub, addressData);
    } catch (error) {
      if (error.message === 'MAX_ADDRESSES_REACHED') {
        const suggestions = await this.addressesService.getSuggestedAddressesForUser(req.user.sub);
        return {
          error: 'MAX_ADDRESSES_REACHED',
          message: 'Bạn đã có tối đa 3 địa chỉ. Vui lòng chọn địa chỉ để thay thế.',
          suggestions
        };
      }
      throw error;
    }
  }

  @Put(':id/replace')
  @ApiOperation({ summary: 'Replace existing address with new one' })
  async replaceAddress(
    @Request() req,
    @Param('id') id: string,
    @Body() newAddressData: CreateAddressDto
  ) {
    return this.addressesService.replaceAddress(req.user.sub, id, newAddressData);
  }
}
