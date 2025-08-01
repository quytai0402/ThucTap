import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CategoriesService } from '../src/categories/categories.service';
import { ProductsService } from '../src/products/products.service';
import { UsersService } from '../src/users/users.service';
import { OrdersService } from '../src/orders/orders.service';

async function seedTestData() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const categoriesService = app.get(CategoriesService);
    const productsService = app.get(ProductsService);
    const usersService = app.get(UsersService);
    const ordersService = app.get(OrdersService);

    console.log('Connected to services');

    // Create categories
    const category1 = await categoriesService.create({
      name: 'Laptop Gaming',
      description: 'Laptop Gaming cao cấp',
      slug: 'laptop-gaming',
      isActive: true
    });

    const category2 = await categoriesService.create({
      name: 'Laptop Văn Phòng',
      description: 'Laptop cho công việc văn phòng',
      slug: 'laptop-van-phong',
      isActive: true
    });

    console.log('Created categories:', category1._id, category2._id);

    // Create products
    const product1 = await productsService.create({
      name: 'Laptop Gaming ASUS ROG',
      description: 'Laptop gaming cao cấp',
      price: 25000000,
      brand: 'ASUS',
      category: category1._id,
      specifications: {
        processor: 'Intel Core i7',
        ram: '16GB',
        storage: '512GB SSD'
      },
      images: [],
      stockQuantity: 10
    });

    const product2 = await productsService.create({
      name: 'Laptop Dell Inspiron',
      description: 'Laptop văn phòng tiết kiệm',
      price: 15000000,
      brand: 'Dell',
      category: category2._id,
      specifications: {
        processor: 'Intel Core i5',
        ram: '8GB',
        storage: '256GB SSD'
      },
      images: [],
      stockQuantity: 15
    });

    console.log('Created products:', product1._id, product2._id);

    // Create customer user
    const customer = await usersService.create({
      name: 'Khách Hàng Test',
      email: 'customer@test.com',
      password: 'password123',
      phone: '0123456789',
      role: 'customer'
    });

    console.log('Created customer:', customer._id);

    // Create orders directly via mongoose to have more control
    const mongoose = require('mongoose');
    const Order = mongoose.model('Order');
    
    // Order 1 - Delivered
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

    // Order 2 - Delivered  
    const order2 = await Order.create({
      orderNumber: 'ORD002',
      customer: customer._id,
      items: [
        {
          product: product2._id,
          name: product2.name,
          price: product2.price,
          quantity: 1,
          image: ''
        }
      ],
      subtotal: 15000000,
      shippingFee: 0,
      total: 15000000,
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

    // Order 3 - Pending (should not count in revenue)
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

    console.log('✅ Seed data created successfully!');
    console.log('Expected revenue: 40,000,000 VND (only delivered orders)');
    console.log('Total orders: 3');
    console.log('Delivered orders: 2');
    console.log('Pending orders: 1');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await app.close();
  }
}

seedTestData();
