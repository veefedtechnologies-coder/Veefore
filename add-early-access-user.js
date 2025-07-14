/**
 * Add User to Early Access Waitlist
 * This script adds a user to the early access waitlist and grants them approval
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function addEarlyAccessUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');
    
    // Get the database
    const db = mongoose.connection.db;
    
    // User details to add - CHANGE THESE VALUES
    const newUser = {
      email: 'example@gmail.com',  // CHANGE THIS EMAIL
      name: 'Example User',        // CHANGE THIS NAME
      status: 'early_access',      // Grant early access immediately
      referralCode: `REF${Date.now()}`,
      joinedAt: new Date(),
      approvedAt: new Date(),
      updatedAt: new Date(),
      deviceFingerprint: {
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    // Check if user already exists
    const existingUser = await db.collection('waitlist_users').findOne({
      email: newUser.email
    });
    
    if (existingUser) {
      console.log('❌ User already exists:', existingUser.email);
      console.log('Current status:', existingUser.status);
      
      // Update existing user to early access
      const updateResult = await db.collection('waitlist_users').updateOne(
        { email: newUser.email },
        { 
          $set: { 
            status: 'early_access',
            approvedAt: new Date(),
            updatedAt: new Date()
          }
        }
      );
      
      console.log('✅ Updated existing user to early access:', updateResult.modifiedCount);
    } else {
      // Add new user
      const result = await db.collection('waitlist_users').insertOne(newUser);
      console.log('✅ Successfully added new early access user:', newUser.email);
      console.log('User ID:', result.insertedId);
    }
    
    // Show current early access users
    console.log('\n📋 Current Early Access Users:');
    const earlyAccessUsers = await db.collection('waitlist_users').find({
      status: 'early_access'
    }).toArray();
    
    earlyAccessUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Instructions for use
console.log('🚀 Early Access User Manager');
console.log('');
console.log('To add a new user:');
console.log('1. Edit the newUser object above with the desired email and name');
console.log('2. Run: node add-early-access-user.js');
console.log('');
console.log('Current configuration will add: example@gmail.com');
console.log('⚠️  Please change this email before running!');
console.log('');

addEarlyAccessUser();