import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ProductsService, CreateProductDto } from '../src/products/products.service';
import { CategoriesService } from '../src/categories/categories.service';

async function seedProducts() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);
  const categoriesService = app.get(CategoriesService);

  try {
    console.log('🌱 Starting to seed products...');

    // Tạo categories trước
    const laptopGamingCat = await categoriesService.create({
      name: 'Laptop Gaming',
      description: 'Laptop gaming hiệu suất cao'
    });

    const macbookCat = await categoriesService.create({
      name: 'MacBook',
      description: 'MacBook của Apple'
    });

    const ultrabookCat = await categoriesService.create({
      name: 'Ultrabook',
      description: 'Laptop mỏng nhẹ'
    });

    console.log('✅ Categories created');

    // Tạo sản phẩm
    const products: CreateProductDto[] = [
      {
        name: 'ASUS ROG Strix G15',
        description: 'Laptop gaming mạnh mẽ với CPU AMD Ryzen 7 và GPU RTX 3060',
        shortDescription: 'Laptop gaming hiệu suất cao',
        price: 35990000,
        originalPrice: 39990000,
        stock: 15,
        category: (laptopGamingCat as any)._id.toString(),
        brand: 'ASUS',
        images: ['/images/asus-rog-strix-g15.jpg'],
        specifications: {
          cpu: 'AMD Ryzen 7 5800H',
          ram: '16GB DDR4',
          storage: '512GB SSD',
          gpu: 'NVIDIA RTX 3060 6GB',
          display: '15.6" FHD 144Hz'
        },
        tags: ['gaming', 'amd', 'rtx'],
        isFeatured: true,
        isOnSale: true
      },
      {
        name: 'Dell XPS 13 Plus',
        description: 'Ultrabook cao cấp với thiết kế hiện đại và hiệu suất mạnh mẽ',
        shortDescription: 'Ultrabook cao cấp',
        price: 45990000,
        stock: 10,
        category: (ultrabookCat as any)._id.toString(),
        brand: 'Dell',
        images: ['/images/dell-xps-13-plus.jpg'],
        specifications: {
          cpu: 'Intel Core i7-12700H',
          ram: '16GB LPDDR5',
          storage: '1TB SSD',
          gpu: 'Intel Iris Xe',
          display: '13.4" OLED 3.5K'
        },
        tags: ['ultrabook', 'intel', 'oled'],
        isFeatured: true
      },
      {
        name: 'MacBook Pro 14" M3',
        description: 'MacBook Pro với chip M3 mới nhất, hiệu suất vượt trội',
        shortDescription: 'MacBook Pro M3 mới nhất',
        price: 52990000,
        stock: 8,
        category: (macbookCat as any)._id.toString(),
        brand: 'Apple',
        images: ['/images/macbook-pro-14-m3.jpg'],
        specifications: {
          cpu: 'Apple M3',
          ram: '18GB Unified Memory',
          storage: '512GB SSD',
          gpu: '10-core GPU',
          display: '14.2" Liquid Retina XDR'
        },
        tags: ['macbook', 'apple', 'm3'],
        isFeatured: true
      }
    ];

    for (const productData of products) {
      const product = await productsService.create(productData);
      console.log(`✅ Created product: ${product.name} with ID: ${(product as any)._id}`);
    }

    console.log('🎉 Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await app.close();
  }
}

seedProducts();
