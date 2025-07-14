#!/usr/bin/env node
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createDefaultAdmin() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    
    const db = client.db('veeforedb');
    const adminCollection = db.collection('admin_users');
    
    // Check if admin already exists
    const existingAdmin = await adminCollection.findOne({ email: 'admin@veefore.com' });
    
    if (existingAdmin) {
      console.log('Default admin user already exists');
      await client.close();
      return;
    }
    
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const defaultAdmin = {
      email: 'admin@veefore.com',
      password: hashedPassword,
      name: 'System Admin',
      role: 'superadmin',
      isActive: true,
      lastLogin: null,
      loginAttempts: 0,
      lockoutUntil: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await adminCollection.insertOne(defaultAdmin);
    
    console.log('Default admin user created successfully');
    console.log('Email: admin@veefore.com');
    console.log('Password: admin123');
    console.log('Role: superadmin');
    
    await client.close();
  } catch (error) {
    console.error('Error creating default admin:', error);
    process.exit(1);
  }
}

createDefaultAdmin();