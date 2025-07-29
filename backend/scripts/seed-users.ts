import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { UserRole } from '../src/common/schemas/user.schema';

async function seedUsers() {
  console.log('🌱 Starting to seed users...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Create admin user
    console.log('Creating admin user...');
    await usersService.create({
      email: 'admin@example.com',
      password: '123456',
      fullName: 'Admin User',
      phone: '0123456789',
      role: UserRole.ADMIN,
    });

    // Create another admin user
    console.log('Creating second admin user...');
    await usersService.create({
      email: 'admin2@example.com',
      password: '123456',
      fullName: 'Admin User 2',
      phone: '0123456790',
      role: UserRole.ADMIN,
    });

    // Create customer user
    console.log('Creating customer user...');
    await usersService.create({
      email: 'customer@example.com',
      password: '123456',
      fullName: 'Customer User',
      phone: '0123456791',
      role: UserRole.CUSTOMER,
    });

    // Create more test customers
    console.log('Creating additional test users...');
    for (let i = 1; i <= 5; i++) {
      await usersService.create({
        email: `user${i}@example.com`,
        password: '123456',
        fullName: `Test User ${i}`,
        phone: `012345679${i}`,
        role: UserRole.CUSTOMER,
      });
    }

    console.log('✅ Users seeded successfully!');
    console.log('📧 Test accounts:');
    console.log('   Admin: admin@example.com / 123456');
    console.log('   Admin 2: admin2@example.com / 123456');
    console.log('   Customer: customer@example.com / 123456');
    console.log('   Users: user1@example.com to user5@example.com / 123456');

  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
  } finally {
    await app.close();
  }
}

seedUsers();
