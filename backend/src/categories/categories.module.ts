import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesAdminController } from './admin/categories-admin.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from '../common/schemas/category.schema';
import { Product, ProductSchema } from '../common/schemas/product.schema';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    UploadModule,
  ],
  controllers: [CategoriesController, CategoriesAdminController],
  providers: [CategoriesService],
  exports: [
    CategoriesService,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
})
export class CategoriesModule {}
