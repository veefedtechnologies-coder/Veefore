/**
 * Fix Admin Password Script
 * Updates the existing admin user's password to be properly hashed
 */

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function fixAdminPassword() {
  console.log('🔐 Fixing admin user password hash...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('veeforedb');
    const adminsCollection = db.collection('admins');
    
    // Find the admin user
    const admin = await adminsCollection.findOne({ email: 'admin@veefore.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('👤 Found admin user, updating password hash...');
    
    // Hash the password properly
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Update the admin user with properly hashed password
    const result = await adminsCollection.updateOne(
      { email: 'admin@veefore.com' },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin password updated successfully!');
      console.log('📧 Email: admin@veefore.com');
      console.log('🔑 Password: admin123');
      console.log('🚀 Admin login should now work properly');
    } else {
      console.log('⚠️  No changes made to admin user');
    }
    
  } catch (error) {
    console.error('❌ Error fixing admin password:', error);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
fixAdminPassword();