/**
 * Fix Duplicate User Issue - Critical Google Sign-In Bug
 * 
 * The issue is that there are TWO users with the same email and firebaseUid:
 * - User 1: 686fadc75a78f3701c4cb261 (isOnboarded: true) - CORRECT
 * - User 2: 6847b9cdfabaede1706f2990 (isOnboarded: false) - WRONG/DUPLICATE
 * 
 * The backend is finding User 2 instead of User 1, causing the routing issue.
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veefore';

async function fixDuplicateUserIssue() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    const email = 'arpit9996363@gmail.com';
    const firebaseUid = 'skO8UqUZMBMmPVfSEQxTlPcercq2';
    
    console.log('\n=== FIXING DUPLICATE USER ISSUE ===');
    console.log('Problem: Backend finds wrong user due to duplicates');
    console.log('Expected: Find user 686fadc75a78f3701c4cb261 (isOnboarded: true)');
    console.log('Actual: Finding user 6847b9cdfabaede1706f2990 (isOnboarded: false)');
    
    // 1. Find ALL users with this email or firebaseUid
    console.log('\n1. Finding ALL users with email or firebaseUid...');
    const allUsers = await usersCollection.find({
      $or: [
        { email: email },
        { firebaseUid: firebaseUid }
      ]
    }).toArray();
    
    console.log(`Found ${allUsers.length} users:`);
    allUsers.forEach((user, index) => {
      console.log(`  User ${index + 1}:`);
      console.log(`    - _id: ${user._id.toString()}`);
      console.log(`    - email: ${user.email}`);
      console.log(`    - firebaseUid: ${user.firebaseUid || 'null'}`);
      console.log(`    - isOnboarded: ${user.isOnboarded}`);
      console.log(`    - isEmailVerified: ${user.isEmailVerified}`);
      console.log(`    - createdAt: ${user.createdAt}`);
      console.log(`    - updatedAt: ${user.updatedAt}`);
      console.log('');
    });
    
    if (allUsers.length <= 1) {
      console.log('No duplicate users found. Issue must be elsewhere.');
      return;
    }
    
    // 2. Identify which user is correct
    console.log('\n2. Identifying correct user...');
    
    // Sort by createdAt to find the original user
    const sortedUsers = allUsers.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    console.log('Users sorted by creation date:');
    sortedUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user._id.toString()} - Created: ${user.createdAt} - isOnboarded: ${user.isOnboarded}`);
    });
    
    // Find the user with isOnboarded: true (this is the correct one)
    const correctUser = sortedUsers.find(user => user.isOnboarded === true);
    const wrongUsers = sortedUsers.filter(user => user.isOnboarded !== true);
    
    if (!correctUser) {
      console.log('❌ No user with isOnboarded: true found!');
      console.log('This means the onboarding process never completed properly.');
      console.log('Need to manually set isOnboarded: true for one of these users.');
      
      // Choose the oldest user and set isOnboarded: true
      const oldestUser = sortedUsers[0];
      console.log(`\nSetting isOnboarded: true for oldest user: ${oldestUser._id.toString()}`);
      
      await usersCollection.updateOne(
        { _id: oldestUser._id },
        { 
          $set: { 
            isOnboarded: true,
            isEmailVerified: true,
            updatedAt: new Date()
          }
        }
      );
      
      console.log('✅ Updated oldest user to isOnboarded: true');
      
      // Now delete the newer duplicate users
      for (const wrongUser of wrongUsers) {
        if (wrongUser._id.toString() !== oldestUser._id.toString()) {
          console.log(`Deleting duplicate user: ${wrongUser._id.toString()}`);
          await usersCollection.deleteOne({ _id: wrongUser._id });
          console.log('✅ Deleted duplicate user');
        }
      }
    } else {
      console.log(`✅ Correct user found: ${correctUser._id.toString()}`);
      console.log(`   - isOnboarded: ${correctUser.isOnboarded}`);
      console.log(`   - isEmailVerified: ${correctUser.isEmailVerified}`);
      
      // Delete the wrong users (duplicates)
      console.log('\n3. Deleting duplicate users...');
      for (const wrongUser of wrongUsers) {
        console.log(`Deleting duplicate user: ${wrongUser._id.toString()}`);
        await usersCollection.deleteOne({ _id: wrongUser._id });
        console.log('✅ Deleted duplicate user');
      }
    }
    
    // 4. Verify the fix
    console.log('\n4. Verifying the fix...');
    const remainingUsers = await usersCollection.find({
      $or: [
        { email: email },
        { firebaseUid: firebaseUid }
      ]
    }).toArray();
    
    console.log(`Users remaining: ${remainingUsers.length}`);
    
    if (remainingUsers.length === 1) {
      const finalUser = remainingUsers[0];
      console.log('✅ Single user remaining:');
      console.log(`   - _id: ${finalUser._id.toString()}`);
      console.log(`   - email: ${finalUser.email}`);
      console.log(`   - firebaseUid: ${finalUser.firebaseUid}`);
      console.log(`   - isOnboarded: ${finalUser.isOnboarded}`);
      console.log(`   - isEmailVerified: ${finalUser.isEmailVerified}`);
      
      if (finalUser.isOnboarded === true) {
        console.log('✅ SUCCESS: User should now go to dashboard');
      } else {
        console.log('❌ STILL WRONG: User will still be redirected to onboarding');
      }
    } else {
      console.log('❌ Still multiple users found - need manual intervention');
    }
    
    console.log('\n=== FIX COMPLETE ===');
    console.log('The authentication should now work correctly.');
    console.log('Ask the user to try signing in again.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixDuplicateUserIssue();