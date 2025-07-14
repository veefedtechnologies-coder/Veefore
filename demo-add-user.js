/**
 * Demo: Add New Early Access User
 * This script demonstrates how to add a new user to the early access system
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function addDemoUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');
    
    // Get the database
    const db = mongoose.connection.db;
    
    // Demo user - you can change this email to test
    const demoUser = {
      email: 'demo@example.com',  // Change this to test with different email
      name: 'Demo User',
      status: 'early_access',
      referralCode: `DEMO${Date.now()}`,
      joinedAt: new Date(),
      approvedAt: new Date(),
      updatedAt: new Date(),
      deviceFingerprint: {
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    // Clean up existing demo user first
    await db.collection('waitlist_users').deleteMany({ 
      email: demoUser.email 
    });
    
    // Add new demo user
    const result = await db.collection('waitlist_users').insertOne(demoUser);
    console.log('✅ Added demo user:', demoUser.email);
    console.log('User ID:', result.insertedId);
    
    // Show all current early access users
    console.log('\n📋 All Early Access Users:');
    const users = await db.collection('waitlist_users').find({
      status: 'early_access'
    }).toArray();
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name})`);
    });
    
    console.log('\n🎯 Testing Instructions:');
    console.log(`1. Try signing in with: ${demoUser.email}`);
    console.log('2. Should work - user gets access');
    console.log('3. Try signing in with different email');
    console.log('4. Should show access restricted modal');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

console.log('🚀 VeeFore Early Access Demo');
console.log('This will add demo@example.com to early access');
console.log('');

addDemoUser();