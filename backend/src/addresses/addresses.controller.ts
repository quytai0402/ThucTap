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
}
