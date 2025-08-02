import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ProductsService } from '../src/products/products.service';

async function seedBrandsOnly() {
  console.log('🚀 Bắt đầu thêm thương hiệu laptop...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);

  // Danh sách 10 thương hiệu laptop nổi tiếng
  const brands = [
    'Apple',
    'Dell',
    'HP',
    'Asus',
    'Lenovo',
    'MSI',
    'Acer',
    'LG',
    'Gigabyte',
    'Razer'
  ];

  try {
    // Lấy danh sách thương hiệu hiện có
    const existingBrands = await productsService.getBrands();
    console.log(`📋 Có ${existingBrands.length} thương hiệu hiện tại trong database`);

    // Tạo một sản phẩm tạm cho mỗi thương hiệu để brand được lưu vào database
    for (const brand of brands) {
      // Kiểm tra xem brand đã tồn tại chưa
      const brandExists = existingBrands.some(existingBrand => 
        existingBrand.toLowerCase() === brand.toLowerCase()
      );

      if (brandExists) {
        console.log(`⚠️  Thương hiệu ${brand} đã tồn tại, bỏ qua...`);
        continue;
      }

      // Tạo sản phẩm tạm để brand được lưu
      const tempProduct = {
        name: `Temp ${brand} Product`,
        description: `Temporary product for ${brand} brand`,
        shortDescription: `Temp ${brand}`,
        price: 1000000,
        brand: brand,
        category: '507f1f77bcf86cd799439011', // ID tạm
        images: [],
        specifications: {
          processor: 'Intel Core i5',
          ram: '8GB',
          storage: '256GB SSD',
          display: '15.6 inch',
          graphics: 'Integrated'
        },
        stock: 0,
        isFeatured: false
      };

      try {
        const product = await productsService.create(tempProduct);
        console.log(`✅ Đã thêm thương hiệu: ${brand}`);
        
        // Xóa sản phẩm tạm ngay sau khi tạo để chỉ giữ lại brand
        await productsService.remove((product as any)._id.toString());
        console.log(`🗑️  Đã xóa sản phẩm tạm cho ${brand}`);
      } catch (error) {
        console.log(`❌ Lỗi khi thêm thương hiệu ${brand}:`, error.message);
      }
    }

    // Kiểm tra kết quả cuối cùng
    const finalBrands = await productsService.getBrands();
    console.log(`\n🎉 Hoàn thành! Hiện có ${finalBrands.length} thương hiệu:`);
    finalBrands.forEach(brand => console.log(`   - ${brand}`));

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await app.close();
  }
}

seedBrandsOnly().catch(console.error);
