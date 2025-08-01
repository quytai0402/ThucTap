import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { PaymentController } from './payment.controller';
import { GuestOrdersController } from './guest-orders.controller';
import { AdminOrdersController } from './admin/admin-orders.controller';
import { OrdersService } from './orders.service';
import { OrderHelper } from './order-helper.service';
import { Order, OrderSchema } from '../common/schemas/order.schema';
import { Product, ProductSchema } from '../common/schemas/product.schema';
import { GuestCustomerModule } from '../guest-customer/guest-customer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema }
    ]),
    GuestCustomerModule
  ],
  controllers: [OrdersController, PaymentController, GuestOrdersController, AdminOrdersController],
  providers: [OrdersService, OrderHelper],
  exports: [OrdersService],
})
export class OrdersModule {}
