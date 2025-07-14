/**
 * Create Admin User Script
 * Creates a default admin user for testing the admin panel
 */

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdminUser() {
  console.log('🔐 Creating admin user for VeeFore admin panel...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('veeforedb');
    const adminsCollection = db.collection('admins');
    
    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({ email: 'admin@veefore.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email: admin@veefore.com');
      console.log('📧 Email: admin@veefore.com');
      console.log('🔑 Password: admin123');
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Create admin user
    const adminUser = {
      email: 'admin@veefore.com',
      username: 'admin',
      password: hashedPassword,
      role: 'superadmin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };
    
    const result = await adminsCollection.insertOne(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@veefore.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: superadmin');
    console.log(`🆔 Admin ID: ${result.insertedId}`);
    console.log('\n🚀 You can now access the admin panel at /admin/login');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
createAdminUser();