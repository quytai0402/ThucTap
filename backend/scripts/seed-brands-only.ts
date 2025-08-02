import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from '../src/common/schemas/brand.schema';

async function seedBrandsOnly() {
  console.log('🚀 Bắt đầu thêm thương hiệu laptop...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // Thêm BrandsModule vào imports của AppModule hoặc sử dụng trực tiếp model
  const brandModel = app.get<Model<BrandDocument>>('BrandModel');

  // Danh sách thương hiệu laptop nổi tiếng toàn cầu với thông tin chi tiết
  const brandsData = [
    { name: 'Apple', description: 'Thương hiệu công nghệ hàng đầu từ Mỹ, nổi tiếng với MacBook' },
    { name: 'Dell', description: 'Thương hiệu máy tính Mỹ, chuyên về laptop doanh nghiệp và gaming' },
    { name: 'HP', description: 'Hewlett-Packard, thương hiệu máy tính lâu đời và uy tín' },
    { name: 'ASUS', description: 'Thương hiệu Đài Loan, nổi tiếng với laptop gaming và ultrabook' },
    { name: 'Lenovo', description: 'Thương hiệu Trung Quốc, kế thừa dòng ThinkPad từ IBM' },
    { name: 'MSI', description: 'Micro-Star International, chuyên về laptop gaming cao cấp' },
    { name: 'Acer', description: 'Thương hiệu Đài Loan, đa dạng từ laptop văn phòng đến gaming' },
    { name: 'LG', description: 'Thương hiệu Hàn Quốc, nổi tiếng với laptop mỏng nhẹ' },
    { name: 'Samsung', description: 'Tập đoàn công nghệ Hàn Quốc, laptop thiết kế đẹp' },
    { name: 'Microsoft', description: 'Thương hiệu từ Mỹ với dòng Surface Book và Surface Laptop' },
    { name: 'Razer', description: 'Thương hiệu gaming cao cấp từ Singapore' },
    { name: 'Alienware', description: 'Thương hiệu gaming thuộc Dell, thiết kế độc đáo' },
    { name: 'Gigabyte', description: 'Thương hiệu Đài Loan, chuyên về laptop gaming AORUS' },
    { name: 'Huawei', description: 'Thương hiệu Trung Quốc với laptop MateBook thiết kế đẹp' },
    { name: 'Xiaomi', description: 'Thương hiệu Trung Quốc với laptop Mi Book giá tốt' },
    { name: 'Vaio', description: 'Thương hiệu laptop cao cấp từ Nhật Bản' },
    { name: 'Framework', description: 'Thương hiệu laptop modular có thể nâng cấp' },
    { name: 'System76', description: 'Thương hiệu laptop Linux từ Mỹ' },
    { name: 'Origin PC', description: 'Thương hiệu laptop gaming tùy chỉnh cao cấp' },
    { name: 'Toshiba', description: 'Thương hiệu laptop Nhật Bản lâu đời' },
    { name: 'Fujitsu', description: 'Thương hiệu laptop doanh nghiệp từ Nhật Bản' },
    { name: 'Panasonic', description: 'Thương hiệu laptop bền bỉ Toughbook từ Nhật Bản' }
  ];

  try {
    // Kiểm tra số lượng brands hiện có
    const existingBrands = await brandModel.find().countDocuments();
    console.log(`📋 Có ${existingBrands} thương hiệu hiện tại trong database`);

    let addedCount = 0;
    let skippedCount = 0;

    // Thêm từng thương hiệu
    for (const brandData of brandsData) {
      try {
        // Kiểm tra xem brand đã tồn tại chưa
        const existingBrand = await brandModel.findOne({ 
          name: { $regex: new RegExp(`^${brandData.name}$`, 'i') } 
        });

        if (existingBrand) {
          console.log(`⚠️  Thương hiệu ${brandData.name} đã tồn tại, bỏ qua...`);
          skippedCount++;
          continue;
        }

        // Tạo slug từ tên
        const slug = brandData.name
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        // Tạo brand mới
        const newBrand = new brandModel({
          name: brandData.name,
          slug: slug,
          description: brandData.description,
          isActive: true,
          productCount: 0
        });

        await newBrand.save();
        console.log(`✅ Đã thêm thương hiệu: ${brandData.name}`);
        addedCount++;

      } catch (error) {
        console.log(`❌ Lỗi khi thêm thương hiệu ${brandData.name}:`, error.message);
      }
    }

    // Kiểm tra kết quả cuối cùng
    const finalBrands = await brandModel.find({ isActive: true }).sort({ name: 1 });
    console.log(`\n🎉 Hoàn thành!`);
    console.log(`📊 Thống kê:`);
    console.log(`   - Đã thêm: ${addedCount} thương hiệu`);
    console.log(`   - Đã bỏ qua: ${skippedCount} thương hiệu`);
    console.log(`   - Tổng cộng: ${finalBrands.length} thương hiệu trong database`);
    
    console.log(`\n📋 Danh sách thương hiệu:`);
    finalBrands.forEach((brand, index) => console.log(`   ${index + 1}. ${brand.name}`));

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await app.close();
  }
}

seedBrandsOnly().catch(console.error);
