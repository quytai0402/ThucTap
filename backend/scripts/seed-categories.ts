import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CategoriesService, CreateCategoryDto } from '../src/categories/categories.service';

async function seedCategories() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const categoriesService = app.get(CategoriesService);

  console.log('🌱 Starting to seed categories...');

  // Xóa các danh mục cũ trước
  const existingCategories = await categoriesService.findAll();
  for (const category of existingCategories) {
    await categoriesService.remove((category as any)._id.toString());
  }
  console.log('🗑️ Cleared existing categories');

  // Tạo các danh mục mới
    const categoriesData = [
      {
        name: 'Laptop Gaming',
        slug: 'laptop-gaming',
        description: 'Laptop gaming hiệu suất cao cho game thủ',
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
        sort: 1,
        isActive: true
      },
      {
        name: 'MacBook',
        slug: 'macbook',
        description: 'MacBook của Apple - Thiết kế đẹp, hiệu năng vượt trội',
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop',
        sort: 2,
        isActive: true
      },
      {
        name: 'Laptop Văn phòng',
        slug: 'laptop-van-phong',
        description: 'Laptop văn phòng - Làm việc hiệu quả, giá cả hợp lý',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        sort: 3,
        isActive: true
      },
      {
        name: 'Ultrabook',
        slug: 'ultrabook',
        description: 'Ultrabook mỏng nhẹ, di động cao',
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop',
        sort: 4,
        isActive: true
      },
      {
        name: 'Laptop Doanh nghiệp',
        slug: 'laptop-doanh-nghiep',
        description: 'Laptop doanh nghiệp - Bảo mật cao, ổn định',
        image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop',
        sort: 5,
        isActive: true
      },
      {
        name: 'Laptop Sinh viên',
        slug: 'laptop-sinh-vien',
        description: 'Laptop sinh viên - Giá tốt, phù hợp học tập',
        image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop',
        sort: 6,
        isActive: true
      }
    ];

    const createdCategories = [];
  
    for (const categoryData of categoriesData) {
    try {
      const category = await categoriesService.create(categoryData);
      console.log(`✅ Created category: ${categoryData.name} with ID: ${(category as any)._id}`);
      createdCategories.push(category);
    } catch (error) {
      console.error(`❌ Error creating category ${categoryData.name}:`, error);
    }
  }

  console.log('🎉 Category seeding completed successfully!');
  console.log(`📊 Total categories created: ${createdCategories.length}`);

  await app.close();
}

seedCategories().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
