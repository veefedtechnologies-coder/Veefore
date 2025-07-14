/**
 * Clean up specific user from database to allow fresh signup
 * This script removes the user entry for aasthachoudhary0111@gmail.com
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

async function cleanupSpecificUser() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('veeforedb');
    const usersCollection = db.collection('users');
    
    const email = 'aasthachoudhary1804@gmail.com';
    
    // Find the user first
    const user = await usersCollection.findOne({ email });
    
    if (user) {
      console.log(`Found user: ${user.username} with Firebase UID: ${user.firebaseUid}`);
      
      // Note: Skipping Firebase deletion as it's not essential for this cleanup
      console.log(`Firebase UID: ${user.firebaseUid || 'none'} - skipping Firebase cleanup`);
      
      // Delete from MongoDB
      const result = await usersCollection.deleteOne({ email });
      console.log(`Deleted ${result.deletedCount} user record from MongoDB`);
      
      // Also clean up related data
      const workspacesCollection = db.collection('workspaces');
      const workspaceResult = await workspacesCollection.deleteMany({ userId: user._id.toString() });
      console.log(`Deleted ${workspaceResult.deletedCount} workspace records`);
      
      console.log(`✅ Successfully cleaned up user: ${email}`);
      console.log(`✅ User can now sign up fresh with this email`);
      
    } else {
      console.log(`No user found with email: ${email}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

cleanupSpecificUser();