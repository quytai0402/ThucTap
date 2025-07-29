import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole, CustomerLevel } from '../common/schemas/user.schema';
import { Category, CategoryDocument } from '../common/schemas/category.schema';
import { Product, ProductDocument, ProductStatus } from '../common/schemas/product.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    // Temporarily disabled auto-seeding
    // this.logger.log('🌱 Starting database seeding...');
    // await this.seedUsers();
    // await this.seedCategories();
    // await this.seedProducts();
    // this.logger.log('✅ Database seeding completed successfully!');
    this.logger.log('🚫 Auto-seeding is disabled');
  }

  private async seedUsers() {
    this.logger.log('👥 Seeding users...');
    const existingUsers = await this.userModel.countDocuments();
    if (existingUsers > 0) {
      this.logger.log(`📊 Found ${existingUsers} existing users, skipping user seeding`);
      return;
    }

    const hashedPassword = await bcrypt.hash('123456', 10);

    const users = [
      {
        email: 'admin@laptopstore.vn',
        password: hashedPassword,
        fullName: 'Admin System',
        phone: '0901234567',
        role: UserRole.ADMIN,
        emailVerified: true,
      },
      {
        email: 'sales@laptopstore.vn',
        password: hashedPassword,
        fullName: 'Nguyễn Minh Khách',
        phone: '0901234568',
        role: UserRole.CUSTOMER,
        emailVerified: true,
      },
      {
        email: 'customer1@gmail.com',
        password: hashedPassword,
        fullName: 'Trần Thị Bình',
        phone: '0987654321',
        role: UserRole.CUSTOMER,
        customerLevel: CustomerLevel.GOLD,
        totalSpent: 25000000,
        totalOrders: 8,
        loyaltyPoints: 2500,
        emailVerified: true,
        addresses: [
          {
            name: 'Nguyễn Minh Khách',
            phone: '0987654321',
            address: '123 Nguyễn Huệ',
            city: 'TP. Hồ Chí Minh',
            district: 'Quận 1',
            ward: 'Phường Bến Nghé',
            isDefault: true,
          },
        ],
        preferences: {
          newsletter: true,
          smsNotifications: true,
          pushNotifications: true,
          language: 'vi',
          currency: 'VND',
        },
      },
      {
        email: 'customer2@gmail.com',
        password: hashedPassword,
        fullName: 'Trần Thị Bình',
        phone: '0987654322',
        role: UserRole.CUSTOMER,
        customerLevel: CustomerLevel.SILVER,
        totalSpent: 12000000,
        totalOrders: 4,
        loyaltyPoints: 1200,
        emailVerified: true,
        addresses: [
          {
            name: 'Trần Thị Bình',
            phone: '0987654322',
            address: '456 Lê Lợi',
            city: 'Hà Nội',
            district: 'Quận Hoàn Kiếm',
            ward: 'Phường Hàng Bài',
            isDefault: true,
          },
        ],
        preferences: {
          newsletter: true,
          smsNotifications: false,
          pushNotifications: true,
          language: 'vi',
          currency: 'VND',
        },
      },
    ];

    await this.userModel.insertMany(users);
    this.logger.log(`✅ Successfully seeded ${users.length} users`);
  }

  private async seedCategories() {
    this.logger.log('📁 Seeding categories...');
    const existingCategories = await this.categoryModel.countDocuments();
    if (existingCategories > 0) {
      this.logger.log(`📊 Found ${existingCategories} existing categories, skipping category seeding`);
      return;
    }

    const categories = [
      {
        name: 'Laptop Gaming',
        slug: 'laptop-gaming',
        description: 'Laptop chuyên game với cấu hình mạnh mẽ',
        image: '/images/categories/gaming.jpg',
        isActive: true,
        featured: true,
        seoTitle: 'Laptop Gaming - Cấu hình khủng, giá tốt',
        seoDescription: 'Mua laptop gaming chính hãng với cấu hình mạnh mẽ, card đồ họa rời, giá tốt nhất thị trường',
      },
      {
        name: 'Laptop Văn Phòng',
        slug: 'laptop-van-phong',
        description: 'Laptop phù hợp cho công việc văn phòng',
        image: '/images/categories/office.jpg',
        isActive: true,
        featured: true,
        seoTitle: 'Laptop Văn Phòng - Mỏng nhẹ, pin lâu',
        seoDescription: 'Laptop văn phòng mỏng nhẹ, thời lượng pin cao, phù hợp làm việc di động',
      },
      {
        name: 'Laptop Đồ Họa',
        slug: 'laptop-do-hoa',
        description: 'Laptop chuyên đồ họa, thiết kế',
        image: '/images/categories/graphics.jpg',
        isActive: true,
        featured: true,
        seoTitle: 'Laptop Đồ Họa - Màn hình chất lượng cao, card rời mạnh',
        seoDescription: 'Laptop đồ họa với màn hình chất lượng cao, card đồ họa mạnh mẽ cho designer',
      },
      {
        name: 'Laptop Đa Năng',
        slug: 'laptop-da-nang',
        description: 'Laptop đa năng phù hợp mọi công việc',
        image: '/images/categories/versatile.jpg',
        isActive: true,
        featured: true,
        seoTitle: 'Laptop Đa Năng - Linh hoạt cho mọi tác vụ',
        seoDescription: 'Laptop đa năng với cấu hình cân bằng, phù hợp cho học tập, làm việc và giải trí',
      },
      {
        name: 'Laptop Giá Rẻ',
        slug: 'laptop-gia-re',
        description: 'Laptop giá rẻ chất lượng tốt',
        image: '/images/categories/budget.jpg',
        isActive: true,
        featured: true,
        seoTitle: 'Laptop Giá Rẻ - Chất lượng tốt, giá cả phải chăng',
        seoDescription: 'Laptop giá rẻ với chất lượng tốt, phù hợp cho sinh viên và người dùng phổ thông',
      },
    ];

    await this.categoryModel.insertMany(categories);
    this.logger.log(`✅ Successfully seeded ${categories.length} categories`);
  }

  private async seedProducts() {
    this.logger.log('💻 Seeding products...');
    const existingProducts = await this.productModel.countDocuments();
    if (existingProducts > 0) {
      this.logger.log(`📊 Found ${existingProducts} existing products, skipping product seeding`);
      return;
    }

    const categories = await this.categoryModel.find();
    const gamingCategory = categories.find(c => c.slug === 'laptop-gaming');
    const officeCategory = categories.find(c => c.slug === 'laptop-van-phong');
    const graphicsCategory = categories.find(c => c.slug === 'laptop-do-hoa');
    const versatileCategory = categories.find(c => c.slug === 'laptop-da-nang');
    const budgetCategory = categories.find(c => c.slug === 'laptop-gia-re');

    const products = [
      {
        name: 'MacBook Pro 14" M3 Pro 512GB',
        slug: 'macbook-pro-14-m3-pro-512gb',
        description: 'MacBook Pro 14 inch với chip M3 Pro mạnh mẽ, màn hình Liquid Retina XDR tuyệt đẹp, thời lượng pin ấn tượng lên đến 18 giờ. Thiết kế sang trọng, hiệu năng vượt trội cho công việc chuyên nghiệp.',
        shortDescription: 'MacBook Pro 14" M3 Pro - Hiệu năng vượt trội, thiết kế sang trọng',
        price: 52990000,
        originalPrice: 54990000,
        stock: 15,
        status: ProductStatus.ACTIVE,
        category: versatileCategory._id,
        brand: 'Apple',
        images: [
          '/images/products/macbook-pro-m3-1.jpg',
          '/images/products/macbook-pro-m3-2.jpg',
          '/images/products/macbook-pro-m3-3.jpg',
        ],
        specifications: {
          cpu: 'Apple M3 Pro 12-core CPU',
          ram: '18GB Unified Memory',
          storage: '512GB SSD',
          gpu: '18-core GPU',
          screen: 'Liquid Retina XDR',
          screenSize: '14.2 inch',
          resolution: '3024 x 1964 pixels',
          battery: 'Lên đến 18 giờ',
          weight: '1.6 kg',
          os: 'macOS Sonoma',
          ports: ['3x Thunderbolt 4', 'HDMI', 'SDXC', 'MagSafe 3'],
          features: ['Touch ID', 'Force Touch trackpad', 'Backlit keyboard'],
        },
        tags: ['apple', 'macbook', 'm3', 'pro', 'cao cấp', 'thiết kế'],
        isFeatured: true,
        isOnSale: true,
        views: 2850,
        sold: 342,
        rating: 4.9,
        reviewCount: 125,
      },
      {
        name: 'ASUS ROG Strix G16 RTX 4060',
        slug: 'asus-rog-strix-g16-rtx-4060',
        description: 'ASUS ROG Strix G16 - laptop gaming với RTX 4060, màn hình 165Hz, tản nhiệt hiệu quả ROG Intelligent Cooling. Thiết kế gaming đậm chất với RGB Aura Sync, âm thanh Dolby Atmos.',
        shortDescription: 'ASUS ROG Strix G16 - Gaming đỉnh cao với RTX 4060',
        price: 28990000,
        originalPrice: 31990000,
        stock: 22,
        status: ProductStatus.ACTIVE,
        category: gamingCategory._id,
        brand: 'ASUS',
        images: [
          '/images/products/asus-rog-strix-1.jpg',
          '/images/products/asus-rog-strix-2.jpg',
          '/images/products/asus-rog-strix-3.jpg',
        ],
        specifications: {
          cpu: 'Intel Core i7-13650HX',
          ram: '16GB DDR5-4800',
          storage: '512GB PCIe 4.0 SSD',
          gpu: 'NVIDIA GeForce RTX 4060 8GB',
          screen: 'IPS Anti-glare',
          screenSize: '16 inch',
          resolution: '1920 x 1200 pixels 165Hz',
          battery: 'Lên đến 8 giờ',
          weight: '2.5 kg',
          os: 'Windows 11 Home',
          ports: ['USB 3.2', 'USB-C', 'HDMI 2.1', 'RJ45', '3.5mm'],
          features: ['RGB Backlit Keyboard', 'ROG Keystone II', 'Dolby Atmos'],
        },
        tags: ['asus', 'rog', 'gaming', 'rtx4060', 'rgb', '165hz'],
        isFeatured: true,
        isOnSale: true,
        views: 3420,
        sold: 445,
        rating: 4.6,
        reviewCount: 234,
      },
      {
        name: 'Dell XPS 13 Plus Core i7',
        slug: 'dell-xps-13-plus-core-i7',
        description: 'Dell XPS 13 Plus với thiết kế sang trọng, viền màn hình siêu mỏng InfinityEdge, bàn phím cảm ứng độc đáo. Hiệu năng mạnh mẽ với Intel Core i7 thế hệ 13 cho công việc di động.',
        shortDescription: 'Dell XPS 13 Plus - Thiết kế sang trọng, hiệu năng mạnh mẽ',
        price: 42990000,
        stock: 8,
        status: ProductStatus.ACTIVE,
        category: officeCategory._id,
        brand: 'Dell',
        images: [
          '/images/products/dell-xps-13-1.jpg',
          '/images/products/dell-xps-13-2.jpg',
          '/images/products/dell-xps-13-3.jpg',
        ],
        specifications: {
          cpu: 'Intel Core i7-1360P',
          ram: '16GB LPDDR5',
          storage: '512GB PCIe SSD',
          gpu: 'Intel Iris Xe Graphics',
          screen: 'InfinityEdge Touch',
          screenSize: '13.4 inch',
          resolution: '1920 x 1200 pixels',
          battery: 'Lên đến 12 giờ',
          weight: '1.26 kg',
          os: 'Windows 11 Home',
          ports: ['2x Thunderbolt 4', '3.5mm'],
          features: ['Touch Display', 'Fingerprint Reader', 'Capacitive Touch Bar'],
        },
        tags: ['dell', 'xps', 'văn phòng', 'mỏng nhẹ', 'touch', 'premium'],
        isFeatured: true,
        isOnSale: false,
        views: 1920,
        sold: 156,
        rating: 4.7,
        reviewCount: 89,
      },
      {
        name: 'HP Pavilion 15 Core i5',
        slug: 'hp-pavilion-15-core-i5',
        description: 'HP Pavilion 15 - laptop phù hợp cho sinh viên với giá cả hợp lý và hiệu năng ổn định. Thiết kế trẻ trung, pin lâu, đáp ứng tốt nhu cầu học tập và giải trí.',
        shortDescription: 'HP Pavilion 15 - Laptop sinh viên giá tốt',
        price: 15990000,
        stock: 0,
        status: ProductStatus.OUT_OF_STOCK,
        category: budgetCategory._id,
        brand: 'HP',
        images: [
          '/images/products/hp-pavilion-1.jpg',
          '/images/products/hp-pavilion-2.jpg',
        ],
        specifications: {
          cpu: 'Intel Core i5-1235U',
          ram: '8GB DDR4',
          storage: '512GB PCIe SSD',
          gpu: 'Intel Iris Xe Graphics',
          screen: 'IPS Micro-edge',
          screenSize: '15.6 inch',
          resolution: '1920 x 1080 pixels',
          battery: 'Lên đến 8 giờ',
          weight: '1.75 kg',
          os: 'Windows 11 Home',
          ports: ['USB 3.2', 'USB-C', 'HDMI', 'SD Card', '3.5mm'],
          features: ['Backlit Keyboard', 'HP Fast Charge', 'HP Audio by B&O'],
        },
        tags: ['hp', 'pavilion', 'sinh viên', 'giá rẻ', 'học tập'],
        isFeatured: false,
        isOnSale: false,
        views: 1560,
        sold: 289,
        rating: 4.3,
        reviewCount: 67,
      },
      {
        name: 'Lenovo ThinkPad X1 Carbon Gen 11',
        slug: 'lenovo-thinkpad-x1-carbon-gen-11',
        description: 'Lenovo ThinkPad X1 Carbon Gen 11 - laptop doanh nghiệp cao cấp với độ bền vượt trội, bàn phím TrackPoint huyền thoại, bảo mật tối đa với TPM 2.0 và Windows Hello.',
        shortDescription: 'ThinkPad X1 Carbon - Laptop doanh nghiệp cao cấp',
        price: 48990000,
        stock: 5,
        status: ProductStatus.ACTIVE,
        category: officeCategory._id,
        brand: 'Lenovo',
        images: [
          '/images/products/thinkpad-x1-1.jpg',
          '/images/products/thinkpad-x1-2.jpg',
          '/images/products/thinkpad-x1-3.jpg',
        ],
        specifications: {
          cpu: 'Intel Core i7-1365U vPro',
          ram: '16GB LPDDR5',
          storage: '1TB PCIe SSD',
          gpu: 'Intel Iris Xe Graphics',
          screen: 'Low Blue Light',
          screenSize: '14 inch',
          resolution: '1920 x 1200 pixels',
          battery: 'Lên đến 15 giờ',
          weight: '1.12 kg',
          os: 'Windows 11 Pro',
          ports: ['2x Thunderbolt 4', '2x USB-A', 'HDMI', '3.5mm'],
          features: ['TrackPoint', 'Fingerprint Reader', 'IR Camera', 'MIL-STD-810H'],
        },
        tags: ['lenovo', 'thinkpad', 'doanh nghiệp', 'cao cấp', 'bảo mật'],
        isFeatured: true,
        isOnSale: false,
        views: 2150,
        sold: 203,
        rating: 4.8,
        reviewCount: 156,
      },
      {
        name: 'Acer Nitro 5 GTX 1650',
        slug: 'acer-nitro-5-gtx-1650',
        description: 'Acer Nitro 5 - laptop gaming entry level với hiệu năng tốt trong tầm giá. Card GTX 1650, màn hình 144Hz, tản nhiệt CoolBoost, phù hợp cho game thủ mới bắt đầu.',
        shortDescription: 'Acer Nitro 5 - Gaming entry level, giá cả phải chăng',
        price: 18990000,
        stock: 12,
        status: ProductStatus.INACTIVE,
        category: gamingCategory._id,
        brand: 'Acer',
        images: [
          '/images/products/acer-nitro-1.jpg',
          '/images/products/acer-nitro-2.jpg',
        ],
        specifications: {
          cpu: 'AMD Ryzen 5 5600H',
          ram: '8GB DDR4',
          storage: '512GB PCIe SSD',
          gpu: 'NVIDIA GeForce GTX 1650 4GB',
          screen: 'IPS ComfyView',
          screenSize: '15.6 inch',
          resolution: '1920 x 1080 pixels 144Hz',
          battery: 'Lên đến 6 giờ',
          weight: '2.3 kg',
          os: 'Windows 11 Home',
          ports: ['USB 3.2', 'USB-C', 'HDMI', 'RJ45', '3.5mm'],
          features: ['Red Backlit Keyboard', 'CoolBoost Technology', 'DTS X Ultra'],
        },
        tags: ['acer', 'nitro', 'gaming', 'gtx1650', 'entry level'],
        isFeatured: false,
        isOnSale: false,
        views: 2890,
        sold: 567,
        rating: 4.2,
        reviewCount: 178,
      },
    ];

    await this.productModel.insertMany(products);
    this.logger.log(`✅ Successfully seeded ${products.length} products`);
  }
}
