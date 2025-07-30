import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../src/common/schemas/category.schema';

async function seedBasicData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const categoryModel = app.get<Model<CategoryDocument>>('CategoryModel');
  
  // Check if categories already exist
  const existingCategories = await categoryModel.countDocuments();
  
  if (existingCategories > 0) {
    console.log('✅ Categories already exist, skipping...');
    await app.close();
    return;
  }

  const categories = [
    {
      name: 'Laptop Gaming',
      description: 'Laptop chuyên dụng cho game thủ với hiệu năng cao',
      slug: 'laptop-gaming',
      isActive: true,
    },
    {
      name: 'MacBook',
      description: 'Dòng laptop Apple MacBook',
      slug: 'macbook',
      isActive: true,
    },
    {
      name: 'Laptop Văn phòng',
      description: 'Laptop phù hợp cho công việc văn phòng',
      slug: 'laptop-van-phong',
      isActive: true,
    },
    {
      name: 'Ultrabook',
      description: 'Laptop mỏng nhẹ, thiết kế cao cấp',
      slug: 'ultrabook',
      isActive: true,
    },
    {
      name: 'Laptop Doanh nghiệp',
      description: 'Laptop chuyên nghiệp cho doanh nghiệp',
      slug: 'laptop-doanh-nghiep',
      isActive: true,
    },
    {
      name: 'Laptop Sinh viên',
      description: 'Laptop phù hợp với sinh viên, giá cả hợp lý',
      slug: 'laptop-sinh-vien',
      isActive: true,
    },
    {
      name: 'Phụ kiện Laptop',
      description: 'Phụ kiện và linh kiện cho laptop',
      slug: 'phu-kien-laptop',
      isActive: true,
    },
  ];

  try {
    await categoryModel.insertMany(categories);
    console.log('✅ Basic categories created successfully!');
  } catch (error) {
    console.error('❌ Error creating categories:', error);
  }

  await app.close();
}

seedBasicData().catch(console.error);
