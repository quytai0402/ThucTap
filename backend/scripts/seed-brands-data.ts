import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ProductsService } from '../src/products/products.service';
import { CategoriesService } from '../src/categories/categories.service';
import { ProductStatus } from '../src/common/schemas/product.schema';

async function seedBrandsData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);
  const categoriesService = app.get(CategoriesService);

  try {
    console.log('🌱 Starting brands data seeding...');

    // Get or create a default category
    let categories = await categoriesService.findAll();
    if (categories.length === 0) {
      console.log('📁 Creating default category...');
      const category = await categoriesService.create({
        name: 'Laptop',
        description: 'Các loại laptop gaming, văn phòng, học tập',
        sort: 1
      });
      categories = [category];
    }

    const defaultCategory = categories[0];

    // Famous laptop brands with sample products
    const brandsData = [
      {
        brand: 'Apple',
        products: [
          { name: 'MacBook Air M2', price: 25000000 },
          { name: 'MacBook Pro 14" M3', price: 45000000 },
        ]
      },
      {
        brand: 'Dell',
        products: [
          { name: 'Dell XPS 13', price: 22000000 },
          { name: 'Dell Inspiron 15', price: 15000000 },
        ]
      },
      {
        brand: 'HP',
        products: [
          { name: 'HP Spectre x360', price: 24000000 },
          { name: 'HP Pavilion 15', price: 16000000 },
        ]
      },
      {
        brand: 'Asus',
        products: [
          { name: 'ASUS ROG Strix G15', price: 35000000 },
          { name: 'ASUS VivoBook 15', price: 12000000 },
        ]
      },
      {
        brand: 'Lenovo',
        products: [
          { name: 'ThinkPad X1 Carbon', price: 32000000 },
          { name: 'IdeaPad 3', price: 14000000 },
        ]
      },
      {
        brand: 'MSI',
        products: [
          { name: 'MSI Gaming GF63', price: 18000000 },
          { name: 'MSI Creator 15', price: 40000000 },
        ]
      },
      {
        brand: 'Acer',
        products: [
          { name: 'Acer Predator Helios', price: 28000000 },
          { name: 'Acer Aspire 5', price: 13000000 },
        ]
      },
      {
        brand: 'LG',
        products: [
          { name: 'LG Gram 17', price: 30000000 },
          { name: 'LG UltraPC 15', price: 20000000 },
        ]
      },
      {
        brand: 'Gigabyte',
        products: [
          { name: 'GIGABYTE AERO 15', price: 35000000 },
          { name: 'GIGABYTE G5', price: 22000000 },
        ]
      },
      {
        brand: 'Razer',
        products: [
          { name: 'Razer Blade 15', price: 45000000 },
          { name: 'Razer Book 13', price: 32000000 },
        ]
      }
    ];

    let totalCreated = 0;

    for (const brandData of brandsData) {
      console.log(`📱 Creating products for brand: ${brandData.brand}`);
      
      for (const productData of brandData.products) {
        try {
          // Skip check for existing products, just create them
          await productsService.create({
            name: productData.name,
            description: `${productData.name} - Laptop ${brandData.brand} chính hãng với hiệu năng cao`,
            shortDescription: `Laptop ${brandData.brand} ${productData.name}`,
            price: productData.price,
            originalPrice: productData.price + 2000000,
            images: ['/images/laptop-placeholder.jpg'],
            category: (defaultCategory as any)._id.toString(),
            brand: brandData.brand,
            stock: 10,
            specifications: {
              processor: 'Intel Core i7 / AMD Ryzen 7',
              ram: '16GB DDR4',
              storage: '512GB SSD',
              graphics: 'Integrated / Dedicated GPU',
              display: '15.6" Full HD',
              battery: '8-10 hours',
              weight: '1.8kg',
              screenSize: '15.6"',
              resolution: '1920x1080',
              os: 'Windows 11',
              ports: ['USB-C', 'USB 3.0', 'HDMI', 'Audio Jack'],
              features: ['Backlit Keyboard', 'Fingerprint Reader', 'WiFi 6']
            },
            isFeatured: Math.random() > 0.7,
            isOnSale: Math.random() > 0.5
          });

          totalCreated++;
          console.log(`   ✅ Created: ${productData.name}`);
        } catch (error) {
          console.error(`   ❌ Error creating ${productData.name}:`, error.message);
        }
      }
    }

    // Verify brands are available
    const availableBrands = await productsService.getBrands();
    console.log(`\n🎯 Available brands in database:`, availableBrands);
    
    console.log(`\n✅ Brands data seeding completed!`);
    console.log(`📊 Total products created: ${totalCreated}`);
    console.log(`🏷️  Total brands available: ${availableBrands.length}`);

  } catch (error) {
    console.error('❌ Error seeding brands data:', error);
  } finally {
    await app.close();
  }
}

// Check if this script is being run directly
if (require.main === module) {
  seedBrandsData().catch(console.error);
}

export default seedBrandsData;
