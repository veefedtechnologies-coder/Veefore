/**
 * Debug Admin User - Check what's actually stored in MongoDB
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function debugAdminUser() {
  console.log('🔍 Debugging admin user in MongoDB...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('veeforedb');
    const adminsCollection = db.collection('admins');
    
    // Find all admin users
    const admins = await adminsCollection.find({}).toArray();
    
    console.log('📊 Total admin users found:', admins.length);
    
    for (const admin of admins) {
      console.log('\n👤 Admin User:');
      console.log('  ID:', admin._id);
      console.log('  Email:', admin.email);
      console.log('  Username:', admin.username);
      console.log('  Password exists:', !!admin.password);
      console.log('  Password type:', typeof admin.password);
      console.log('  Password length:', admin.password ? admin.password.length : 'N/A');
      console.log('  Password (first 20 chars):', admin.password ? admin.password.substring(0, 20) + '...' : 'UNDEFINED');
      console.log('  Role:', admin.role);
      console.log('  Is Active:', admin.isActive);
      console.log('  Created At:', admin.createdAt);
      console.log('  Updated At:', admin.updatedAt);
    }
    
  } catch (error) {
    console.error('❌ Error debugging admin user:', error);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
debugAdminUser();