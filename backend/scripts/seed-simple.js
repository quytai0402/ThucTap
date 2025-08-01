const mongoose = require('mongoose');

// Define schemas
const CategorySchema = new mongoose.Schema({
  name: String,
  description: String,
  slug: String,
  isActive: { type: Boolean, default: true },
  productCount: { type: Number, default: 0 }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  brand: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  slug: String,
  specifications: Object,
  images: [String],
  isActive: { type: Boolean, default: true },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  orderNumber: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  subtotal: Number,
  shippingFee: { type: Number, default: 0 },
  total: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cod', 'bank_transfer', 'vnpay', 'momo'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    district: String,
    ward: String
  }
}, { timestamps: true });

async function seedData() {
  try {
    await mongoose.connect('mongodb+srv://quytai:quytai@tranquytai.ggro6.mongodb.net/doanthuctap');
    console.log('Connected to MongoDB');

    // Register models
    const Category = mongoose.model('Category', CategorySchema);
    const Product = mongoose.model('Product', ProductSchema);
    const User = mongoose.model('User', UserSchema);
    const Order = mongoose.model('Order', OrderSchema);

    // Create categories
    const category1 = await Category.create({
      name: 'Laptop Gaming',
      description: 'Laptop Gaming cao cấp',
      slug: 'laptop-gaming',
      isActive: true,
      productCount: 0
    });

    const category2 = await Category.create({
      name: 'Laptop Văn Phòng',
      description: 'Laptop cho công việc văn phòng',
      slug: 'laptop-van-phong',
      isActive: true,
      productCount: 0
    });

    console.log('Created categories:', category1._id, category2._id);

    // Create products
    const product1 = await Product.create({
      name: 'Laptop Gaming ASUS ROG',
      description: 'Laptop gaming cao cấp',
      price: 25000000,
      brand: 'ASUS',
      category: category1._id,
      slug: 'laptop-gaming-asus-rog',
      specifications: {
        processor: 'Intel Core i7',
        ram: '16GB',
        storage: '512GB SSD'
      },
      images: [],
      isActive: true,
      inStock: true,
      stockQuantity: 10
    });

    const product2 = await Product.create({
      name: 'Laptop Dell Inspiron',
      description: 'Laptop văn phòng tiết kiệm',
      price: 15000000,
      brand: 'Dell',
      category: category2._id,
      slug: 'laptop-dell-inspiron',
      specifications: {
        processor: 'Intel Core i5',
        ram: '8GB',
        storage: '256GB SSD'
      },
      images: [],
      isActive: true,
      inStock: true,
      stockQuantity: 15
    });

    console.log('Created products:', product1._id, product2._id);

    // Create customer user  
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const customer = await User.create({
      name: 'Khách Hàng Test',
      email: 'customer@test.com',
      password: hashedPassword,
      phone: '0123456789',
      role: 'customer',
      isVerified: true
    });

    console.log('Created customer:', customer._id);

    // Create orders
    // Order 1 - Delivered (should count in revenue)
    const order1 = await Order.create({
      orderNumber: 'ORD001',
      customer: customer._id,
      items: [
        {
          product: product1._id,
          name: product1.name,
          price: product1.price,
          quantity: 1,
          image: ''
        }
      ],
      subtotal: 25000000,
      shippingFee: 0,
      total: 25000000,
      status: 'delivered',
      paymentMethod: 'cod',
      paymentStatus: 'paid',
      shippingAddress: {
        name: 'Khách Hàng Test',
        phone: '0123456789',
        address: '123 Test Street',
        city: 'Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường 1'
      }
    });

    // Order 2 - Delivered (should count in revenue)
    const order2 = await Order.create({
      orderNumber: 'ORD002',
      customer: customer._id,
      items: [
        {
          product: product2._id,
          name: product2.name,
          price: product2.price,
          quantity: 2,
          image: ''
        }
      ],
      subtotal: 30000000,
      shippingFee: 50000,
      total: 30050000,
      status: 'delivered',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      shippingAddress: {
        name: 'Khách Hàng Test',
        phone: '0123456789',
        address: '123 Test Street',
        city: 'Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường 1'
      }
    });

    // Order 3 - Pending (should NOT count in revenue)
    const order3 = await Order.create({
      orderNumber: 'ORD003',
      customer: customer._id,
      items: [
        {
          product: product1._id,
          name: product1.name,
          price: product1.price,
          quantity: 1,
          image: ''
        }
      ],
      subtotal: 25000000,
      shippingFee: 0,
      total: 25000000,
      status: 'pending',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      shippingAddress: {
        name: 'Khách Hàng Test',
        phone: '0123456789',
        address: '123 Test Street',
        city: 'Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường 1'
      }
    });

    console.log('Created orders:', order1._id, order2._id, order3._id);

    // Update category product counts
    await Category.findByIdAndUpdate(category1._id, { productCount: 1 });
    await Category.findByIdAndUpdate(category2._id, { productCount: 1 });

    console.log('✅ Seed data created successfully!');
    console.log('');
    console.log('📊 EXPECTED ANALYTICS:');
    console.log('Total revenue (only delivered): 55,050,000 VND');
    console.log('- Order 1 (delivered): 25,000,000 VND');
    console.log('- Order 2 (delivered): 30,050,000 VND');
    console.log('- Order 3 (pending): 25,000,000 VND (NOT counted)');
    console.log('');
    console.log('Total orders: 3');
    console.log('Delivered orders: 2');
    console.log('Pending orders: 1');
    console.log('');
    console.log('🎯 Dashboard should show consistent revenue across all sections!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seedData();
