import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AddressApiService } from './address-api.service';

@ApiTags('address-api')
@Controller('address-api')
export class AddressApiController {
  constructor(private readonly addressApiService: AddressApiService) {}

  @Get('provinces')
  @ApiOperation({ summary: 'Get all provinces' })
  async getProvinces() {
    return this.addressApiService.getProvinces();
  }

  @Get('districts')
  @ApiOperation({ summary: 'Get districts by province code' })
  async getDistricts(@Query('province_code') provinceCode: string) {
    return this.addressApiService.getDistricts(provinceCode);
  }

  @Get('wards')
  @ApiOperation({ summary: 'Get wards by district code' })
  async getWards(@Query('district_code') districtCode: string) {
    return this.addressApiService.getWards(districtCode);
  }
}
