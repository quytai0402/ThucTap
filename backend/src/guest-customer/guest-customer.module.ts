import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuestCustomerService } from './guest-customer.service';
import { GuestCustomer, GuestCustomerSchema } from '../common/schemas/guest-customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GuestCustomer.name, schema: GuestCustomerSchema },
    ]),
  ],
  providers: [GuestCustomerService],
  exports: [GuestCustomerService],
})
export class GuestCustomerModule {}
