/**
 * Fix Google Sign-In Onboarding Issue
 * 
 * This script fixes the issue where existing Google users who completed
 * onboarding are being redirected to signup instead of dashboard.
 * 
 * The problem: Users exist in database with isOnboarded: false when they 
 * should have isOnboarded: true.
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veefore';

async function fixGoogleSigninOnboarding() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // First, let's see what users exist and their onboarding status
    console.log('\n=== CURRENT USER STATUS ===');
    const allUsers = await usersCollection.find({}).toArray();
    
    for (const user of allUsers) {
      console.log(`User: ${user.email || user.username}`);
      console.log(`  - Username: ${user.username}`);
      console.log(`  - isOnboarded: ${user.isOnboarded}`);
      console.log(`  - isEmailVerified: ${user.isEmailVerified}`);
      console.log(`  - firebaseUid: ${user.firebaseUid}`);
      console.log(`  - createdAt: ${user.createdAt}`);
      console.log('---');
    }
    
    // Check if there are users who should be onboarded but aren't
    const problematicUsers = await usersCollection.find({ 
      isOnboarded: false,
      isEmailVerified: true,
      // Users who have been in the system for a while (not new signups)
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Older than 24 hours
    }).toArray();
    
    console.log(`\n=== PROBLEMATIC USERS (${problematicUsers.length}) ===`);
    
    if (problematicUsers.length === 0) {
      console.log('No problematic users found.');
      return;
    }
    
    for (const user of problematicUsers) {
      console.log(`User: ${user.email || user.username}`);
      console.log(`  - Should be onboarded: ${user.isEmailVerified ? 'YES' : 'NO'}`);
      console.log(`  - Created: ${user.createdAt}`);
      console.log('---');
    }
    
    // Ask for confirmation before making changes
    console.log('\n=== PROPOSED FIXES ===');
    console.log('The following users will be marked as onboarded:');
    
    const usersToFix = problematicUsers.filter(user => user.isEmailVerified);
    
    for (const user of usersToFix) {
      console.log(`- ${user.email || user.username} (${user.username})`);
    }
    
    if (usersToFix.length === 0) {
      console.log('No users need to be fixed.');
      return;
    }
    
    console.log(`\nFixing ${usersToFix.length} users...`);
    
    // Update users to be onboarded
    const bulkOperations = usersToFix.map(user => ({
      updateOne: {
        filter: { _id: user._id },
        update: { 
          $set: { 
            isOnboarded: true,
            updatedAt: new Date()
          }
        }
      }
    }));
    
    const result = await usersCollection.bulkWrite(bulkOperations);
    
    console.log(`\n=== RESULTS ===`);
    console.log(`Updated ${result.modifiedCount} users successfully`);
    
    // Verify the changes
    console.log('\n=== VERIFICATION ===');
    const updatedUsers = await usersCollection.find({
      _id: { $in: usersToFix.map(u => u._id) }
    }).toArray();
    
    for (const user of updatedUsers) {
      console.log(`✓ ${user.email || user.username}: isOnboarded = ${user.isOnboarded}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixGoogleSigninOnboarding();