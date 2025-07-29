import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AddressesModule } from './addresses/addresses.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { InventoryModule } from './inventory/inventory.module';
import { UploadModule } from './upload/upload.module';
import { SeedService } from './common/seed.service';
import { ClearDataService } from './common/clear-data.service';
import { AdminController } from './common/admin.controller';
import { User, UserSchema } from './common/schemas/user.schema';
import { Category, CategorySchema } from './common/schemas/category.schema';
import { Product, ProductSchema } from './common/schemas/product.schema';
import { Order, OrderSchema } from './common/schemas/order.schema';
import { Review, ReviewSchema } from './common/schemas/review.schema';
import { Favorite, FavoriteSchema } from './common/schemas/favorite.schema';
import { Address, AddressSchema } from './common/schemas/address.schema';
import { StockAdjustment, StockAdjustmentSchema } from './common/schemas/stock-adjustment.schema';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}?retryWrites=true&w=majority`
    ),
    
    // Schemas for SeedService and ClearDataService
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Favorite.name, schema: FavoriteSchema },
      { name: Address.name, schema: AddressSchema },
      { name: StockAdjustment.name, schema: StockAdjustmentSchema },
    ]),
    
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    
    // Feature modules
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    ReviewsModule,
    FavoritesModule,
    AddressesModule,
    AnalyticsModule,
    InventoryModule,
    UploadModule,
  ],
  controllers: [AdminController],
  providers: [SeedService, ClearDataService],
})
export class AppModule {}
