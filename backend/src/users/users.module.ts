import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { AdminCustomersController } from './admin/admin-customers.controller';
import { AdminCombinedCustomersController } from './admin/admin-combined-customers.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../common/schemas/user.schema';
import { Order, OrderSchema } from '../common/schemas/order.schema';
import { GuestCustomerModule } from '../guest-customer/guest-customer.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema }
    ]),
    GuestCustomerModule,
    OrdersModule,
  ],
  controllers: [UsersController, AdminCustomersController, AdminCombinedCustomersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
