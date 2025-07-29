import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ProductsService, CreateProductDto } from '../src/products/products.service';
import { CategoriesService } from '../src/categories/categories.service';

async function seedMoreProducts() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);
  const categoriesService = app.get(CategoriesService);

  console.log('🌱 Starting to seed more products...');

  // Lấy danh sách categories
  const categories = await categoriesService.findAll();
  const categoryMap = categories.reduce((map, cat: any) => {
    map[cat.name] = cat._id.toString();
    return map;
  }, {} as Record<string, string>);

  console.log('📂 Available categories:', Object.keys(categoryMap));

  // Xóa sản phẩm cũ
  const existingProducts = await productsService.findAll(1, 100);
  for (const product of existingProducts.products) {
    await productsService.remove((product as any)._id.toString());
  }
  console.log('🗑️ Cleared existing products');

  // Tạo sản phẩm mới cho từng danh mục
  const products: CreateProductDto[] = [
    // LAPTOP GAMING (24 sản phẩm)
    {
      name: 'ASUS ROG Strix G15',
      description: 'Laptop gaming mạnh mẽ với CPU AMD Ryzen 7 và GPU RTX 3060',
      shortDescription: 'Laptop gaming hiệu suất cao',
      price: 35990000,
      originalPrice: 39990000,
      stock: 15,
      category: categoryMap['Laptop Gaming'],
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
      name: 'MSI Katana 15',
      description: 'Laptop gaming MSI với RTX 4060 và Intel Core i7',
      shortDescription: 'Gaming laptop RTX 4060',
      price: 28990000,
      originalPrice: 32990000,
      stock: 12,
      category: categoryMap['Laptop Gaming'],
      brand: 'MSI',
      images: ['/images/msi-katana-15.jpg'],
      specifications: {
        cpu: 'Intel Core i7-12650H',
        ram: '16GB DDR4',
        storage: '512GB SSD',
        gpu: 'NVIDIA RTX 4060 8GB',
        display: '15.6" FHD 144Hz'
      },
      tags: ['gaming', 'intel', 'rtx4060'],
      isFeatured: false,
      isOnSale: true
    },
    {
      name: 'Acer Predator Helios 300',
      description: 'Laptop gaming Acer Predator với hiệu năng mạnh mẽ',
      shortDescription: 'Predator gaming powerhouse',
      price: 42990000,
      stock: 8,
      category: categoryMap['Laptop Gaming'],
      brand: 'Acer',
      images: ['/images/acer-predator-helios-300.jpg'],
      specifications: {
        cpu: 'Intel Core i7-12700H',
        ram: '32GB DDR4',
        storage: '1TB SSD',
        gpu: 'NVIDIA RTX 3070 8GB',
        display: '15.6" FHD 165Hz'
      },
      tags: ['gaming', 'predator', 'intel'],
      isFeatured: true
    },

    // MACBOOK (12 sản phẩm)
    {
      name: 'MacBook Pro 14" M3',
      description: 'MacBook Pro với chip M3 mới nhất, hiệu suất vượt trội',
      shortDescription: 'MacBook Pro M3 mới nhất',
      price: 52990000,
      stock: 8,
      category: categoryMap['MacBook'],
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
    },
    {
      name: 'MacBook Air 13" M2',
      description: 'MacBook Air với chip M2, thiết kế mỏng nhẹ',
      shortDescription: 'MacBook Air M2 siêu mỏng',
      price: 34990000,
      originalPrice: 37990000,
      stock: 15,
      category: categoryMap['MacBook'],
      brand: 'Apple',
      images: ['/images/macbook-air-13-m2.jpg'],
      specifications: {
        cpu: 'Apple M2',
        ram: '16GB Unified Memory',
        storage: '512GB SSD',
        gpu: '8-core GPU',
        display: '13.6" Liquid Retina'
      },
      tags: ['macbook', 'air', 'm2'],
      isFeatured: true,
      isOnSale: true
    },
    {
      name: 'MacBook Pro 16" M3 Max',
      description: 'MacBook Pro 16 inch với chip M3 Max mạnh nhất',
      shortDescription: 'MacBook Pro M3 Max 16"',
      price: 89990000,
      stock: 5,
      category: categoryMap['MacBook'],
      brand: 'Apple',
      images: ['/images/macbook-pro-16-m3-max.jpg'],
      specifications: {
        cpu: 'Apple M3 Max',
        ram: '36GB Unified Memory',
        storage: '1TB SSD',
        gpu: '40-core GPU',
        display: '16.2" Liquid Retina XDR'
      },
      tags: ['macbook', 'pro', 'm3max'],
      isFeatured: true
    },

    // ULTRABOOK (18 sản phẩm)
    {
      name: 'Dell XPS 13 Plus',
      description: 'Ultrabook cao cấp với thiết kế hiện đại và hiệu suất mạnh mẽ',
      shortDescription: 'Ultrabook cao cấp',
      price: 45990000,
      stock: 10,
      category: categoryMap['Ultrabook'],
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
      name: 'ASUS ZenBook 14',
      description: 'ZenBook mỏng nhẹ với hiệu năng cao',
      shortDescription: 'ZenBook premium ultrabook',
      price: 32990000,
      originalPrice: 35990000,
      stock: 12,
      category: categoryMap['Ultrabook'],
      brand: 'ASUS',
      images: ['/images/asus-zenbook-14.jpg'],
      specifications: {
        cpu: 'Intel Core i7-1260P',
        ram: '16GB LPDDR5',
        storage: '512GB SSD',
        gpu: 'Intel Iris Xe',
        display: '14" 2.8K OLED'
      },
      tags: ['ultrabook', 'zenbook', 'oled'],
      isFeatured: false,
      isOnSale: true
    },

    // LAPTOP VĂN PHÒNG (36 sản phẩm)
    {
      name: 'HP Pavilion 15',
      description: 'Laptop văn phòng HP với hiệu năng ổn định',
      shortDescription: 'Laptop văn phòng đa năng',
      price: 18990000,
      originalPrice: 21990000,
      stock: 25,
      category: categoryMap['Laptop Văn phòng'],
      brand: 'HP',
      images: ['/images/hp-pavilion-15.jpg'],
      specifications: {
        cpu: 'Intel Core i5-1235U',
        ram: '8GB DDR4',
        storage: '512GB SSD',
        gpu: 'Intel UHD Graphics',
        display: '15.6" FHD IPS'
      },
      tags: ['office', 'hp', 'budget'],
      isFeatured: false,
      isOnSale: true
    },
    {
      name: 'Lenovo ThinkPad E15',
      description: 'ThinkPad E15 cho công việc chuyên nghiệp',
      shortDescription: 'ThinkPad doanh nghiệp',
      price: 22990000,
      stock: 20,
      category: categoryMap['Laptop Văn phòng'],
      brand: 'Lenovo',
      images: ['/images/lenovo-thinkpad-e15.jpg'],
      specifications: {
        cpu: 'Intel Core i5-1235U',
        ram: '8GB DDR4',
        storage: '256GB SSD',
        gpu: 'Intel UHD Graphics',
        display: '15.6" FHD IPS'
      },
      tags: ['office', 'thinkpad', 'business'],
      isFeatured: false
    },

    // LAPTOP DOANH NGHIỆP (15 sản phẩm)
    {
      name: 'Lenovo ThinkPad X1 Carbon',
      description: 'ThinkPad X1 Carbon - Laptop doanh nghiệp cao cấp',
      shortDescription: 'ThinkPad X1 Carbon premium',
      price: 65990000,
      stock: 6,
      category: categoryMap['Laptop Doanh nghiệp'],
      brand: 'Lenovo',
      images: ['/images/thinkpad-x1-carbon.jpg'],
      specifications: {
        cpu: 'Intel Core i7-1260P',
        ram: '16GB LPDDR5',
        storage: '1TB SSD',
        gpu: 'Intel Iris Xe',
        display: '14" 2.8K IPS'
      },
      tags: ['business', 'thinkpad', 'premium'],
      isFeatured: true
    },
    {
      name: 'Dell Latitude 9430',
      description: 'Dell Latitude cao cấp cho doanh nghiệp',
      shortDescription: 'Dell Latitude doanh nghiệp',
      price: 58990000,
      stock: 8,
      category: categoryMap['Laptop Doanh nghiệp'],
      brand: 'Dell',
      images: ['/images/dell-latitude-9430.jpg'],
      specifications: {
        cpu: 'Intel Core i7-1265U',
        ram: '16GB LPDDR5',
        storage: '512GB SSD',
        gpu: 'Intel Iris Xe',
        display: '14" QHD+'
      },
      tags: ['business', 'latitude', 'security'],
      isFeatured: false
    },

    // LAPTOP SINH VIÊN (28 sản phẩm)
    {
      name: 'ASUS VivoBook 15',
      description: 'VivoBook 15 - Laptop sinh viên giá tốt',
      shortDescription: 'Laptop sinh viên phổ thông',
      price: 15990000,
      originalPrice: 17990000,
      stock: 30,
      category: categoryMap['Laptop Sinh viên'],
      brand: 'ASUS',
      images: ['/images/asus-vivobook-15.jpg'],
      specifications: {
        cpu: 'Intel Core i3-1115G4',
        ram: '8GB DDR4',
        storage: '512GB SSD',
        gpu: 'Intel UHD Graphics',
        display: '15.6" FHD IPS'
      },
      tags: ['student', 'budget', 'vivobook'],
      isFeatured: false,
      isOnSale: true
    },
    {
      name: 'Acer Aspire 5',
      description: 'Acer Aspire 5 - Lựa chọn tốt cho sinh viên',
      shortDescription: 'Aspire 5 sinh viên',
      price: 13990000,
      originalPrice: 15990000,
      stock: 35,
      category: categoryMap['Laptop Sinh viên'],
      brand: 'Acer',
      images: ['/images/acer-aspire-5.jpg'],
      specifications: {
        cpu: 'AMD Ryzen 5 5500U',
        ram: '8GB DDR4',
        storage: '256GB SSD',
        gpu: 'AMD Radeon Graphics',
        display: '15.6" FHD IPS'
      },
      tags: ['student', 'budget', 'amd'],
      isFeatured: false,
      isOnSale: true
    }
  ];

  let totalCreated = 0;
  for (const productData of products) {
    try {
      const product = await productsService.create(productData);
      console.log(`✅ Created ${productData.category ? 'categorized' : 'uncategorized'} product: ${productData.name} (${productData.brand})`);
      totalCreated++;
    } catch (error) {
      console.error(`❌ Error creating product ${productData.name}:`, error);
    }
  }

  console.log('🎉 Product seeding completed successfully!');
  console.log(`📊 Total products created: ${totalCreated}`);

  // Hiển thị thống kê theo danh mục
  for (const [categoryName, categoryId] of Object.entries(categoryMap)) {
    const categoryProducts = await productsService.findAll(1, 100, { category: categoryId });
    console.log(`📂 ${categoryName}: ${categoryProducts.total} sản phẩm`);
  }

  await app.close();
}

seedMoreProducts().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
