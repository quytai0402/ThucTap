import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { PaymentController } from './payment.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from '../common/schemas/order.schema';
import { Product, ProductSchema } from '../common/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema }
    ]),
  ],
  controllers: [OrdersController, PaymentController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
