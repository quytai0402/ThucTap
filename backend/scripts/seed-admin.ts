import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from '../src/common/schemas/user.schema';

async function seedAdminUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userModel = app.get<Model<UserDocument>>('UserModel');
  
  const adminUsers = [
    {
      email: 'admin@admin.com',
      password: 'admin',
      fullName: 'System Administrator',
      role: UserRole.ADMIN,
    }
  ];

  for (const userData of adminUsers) {
    try {
      // Check if user already exists
      const existingUser = await userModel.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`✅ User ${userData.email} already exists, updating role to ${userData.role}`);
        await userModel.findByIdAndUpdate(existingUser._id, { role: userData.role });
      } else {
        console.log(`🆕 Creating new user: ${userData.email}`);
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        await userModel.create({
          ...userData,
          password: hashedPassword,
          emailVerified: true,
        });
      }
      console.log(`✅ ${userData.email} - Role: ${userData.role}`);
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error.message);
    }
  }

  await app.close();
  console.log('🎉 Admin users seeding completed!');
}

seedAdminUsers().catch(console.error);
