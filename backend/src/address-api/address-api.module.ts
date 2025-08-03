import { Module } from '@nestjs/common';
import { AddressApiController } from './address-api.controller';
import { AddressApiService } from './address-api.service';

@Module({
  controllers: [AddressApiController],
  providers: [AddressApiService],
  exports: [AddressApiService],
})
export class AddressApiModule {}
