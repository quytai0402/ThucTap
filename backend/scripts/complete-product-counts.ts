import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ProductsService, CreateProductDto } from '../src/products/products.service';
import { CategoriesService } from '../src/categories/categories.service';

async function completeProductCounts() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);
  const categoriesService = app.get(CategoriesService);

  console.log('🚀 Completing product counts for all categories...');

  // Lấy danh sách categories
  const categories = await categoriesService.findAll();
  const categoryMap = categories.reduce((map, cat: any) => {
    map[cat.name] = cat._id.toString();
    return map;
  }, {} as Record<string, string>);

  // Target counts theo hình
  const targets = {
    'Laptop Gaming': 24,
    'MacBook': 12,
    'Laptop Văn phòng': 36,
    'Ultrabook': 18,
    'Laptop Doanh nghiệp': 15,
    'Laptop Sinh viên': 28
  };

  for (const [categoryName, targetCount] of Object.entries(targets)) {
    const categoryId = categoryMap[categoryName];
    if (!categoryId) continue;

    // Đếm sản phẩm hiện tại
    const currentProducts = await productsService.findAll(1, 100, { category: categoryId });
    const currentCount = currentProducts.total;
    const needed = targetCount - currentCount;

    if (needed <= 0) {
      console.log(`✅ ${categoryName}: ${currentCount}/${targetCount} (đủ rồi)`);
      continue;
    }

    console.log(`📈 ${categoryName}: ${currentCount}/${targetCount} (cần thêm ${needed})`);

    // Tạo sản phẩm để đạt target
    for (let i = 0; i < needed; i++) {
      const productData: CreateProductDto = {
        name: `${categoryName} Product ${currentCount + i + 1}`,
        description: `Sản phẩm ${categoryName} chất lượng cao số ${currentCount + i + 1}`,
        shortDescription: `${categoryName} #${currentCount + i + 1}`,
        price: Math.floor(Math.random() * 30000000) + 15000000, // 15-45M VND
        stock: Math.floor(Math.random() * 20) + 5, // 5-25 units
        category: categoryId,
        brand: getBrandForCategory(categoryName),
        images: [`/images/${categoryName.toLowerCase().replace(/\s+/g, '-')}-${i + 1}.jpg`],
        specifications: getSpecsForCategory(categoryName),
        tags: [categoryName.toLowerCase().replace(/\s+/g, '')],
        isFeatured: Math.random() > 0.7,
        isOnSale: Math.random() > 0.6
      };

      try {
        await productsService.create(productData);
        console.log(`  ✅ Tạo: ${productData.name}`);
      } catch (error) {
        console.error(`  ❌ Lỗi tạo ${productData.name}:`, error.message);
      }
    }
  }

  // Kiểm tra kết quả cuối cùng
  console.log('\n📊 Kết quả cuối cùng:');
  for (const [categoryName, targetCount] of Object.entries(targets)) {
    const categoryId = categoryMap[categoryName];
    if (!categoryId) continue;

    const finalProducts = await productsService.findAll(1, 100, { category: categoryId });
    const finalCount = finalProducts.total;
    const icon = getCategoryIcon(categoryName);
    console.log(`${icon} ${categoryName}: ${finalCount}/${targetCount} sản phẩm`);
  }

  await app.close();
}

function getBrandForCategory(categoryName: string): string {
  const brands = {
    'Laptop Gaming': ['ASUS', 'MSI', 'HP', 'Acer', 'Lenovo'],
    'MacBook': ['Apple'],
    'Laptop Văn phòng': ['HP', 'Dell', 'Lenovo', 'ASUS'],
    'Ultrabook': ['Dell', 'ASUS', 'HP', 'LG'],
    'Laptop Doanh nghiệp': ['Lenovo', 'Dell', 'HP'],
    'Laptop Sinh viên': ['ASUS', 'Acer', 'HP', 'Lenovo']
  };
  
  const categoryBrands = brands[categoryName] || ['Generic'];
  return categoryBrands[Math.floor(Math.random() * categoryBrands.length)];
}

function getSpecsForCategory(categoryName: string): any {
  const specs = {
    'Laptop Gaming': {
      cpu: 'Intel Core i7-12700H',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      gpu: 'NVIDIA RTX 3060',
      display: '15.6" FHD 144Hz'
    },
    'MacBook': {
      cpu: 'Apple M2',
      ram: '16GB Unified Memory',
      storage: '512GB SSD',
      gpu: '10-core GPU',
      display: '13.6" Liquid Retina'
    },
    'Laptop Văn phòng': {
      cpu: 'Intel Core i5-1235U',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      gpu: 'Intel UHD Graphics',
      display: '15.6" FHD IPS'
    },
    'Ultrabook': {
      cpu: 'Intel Core i7-1260P',
      ram: '16GB LPDDR5',
      storage: '512GB SSD',
      gpu: 'Intel Iris Xe',
      display: '14" 2.8K IPS'
    },
    'Laptop Doanh nghiệp': {
      cpu: 'Intel Core i7-1265U',
      ram: '16GB DDR5',
      storage: '512GB SSD',
      gpu: 'Intel Iris Xe',
      display: '14" QHD+'
    },
    'Laptop Sinh viên': {
      cpu: 'AMD Ryzen 5 5500U',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      gpu: 'AMD Radeon Graphics',
      display: '15.6" FHD IPS'
    }
  };
  
  return specs[categoryName] || specs['Laptop Văn phòng'];
}

function getCategoryIcon(categoryName: string): string {
  const icons = {
    'Laptop Gaming': '🎮',
    'MacBook': '🍎',
    'Laptop Văn phòng': '💼',
    'Ultrabook': '💻',
    'Laptop Doanh nghiệp': '🏢',
    'Laptop Sinh viên': '🎓'
  };
  
  return icons[categoryName] || '📱';
}

completeProductCounts().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
