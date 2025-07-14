/**
 * Debug Google Sign-In Issue
 * 
 * This script debugs the specific issue where Google sign-in users
 * are redirected to onboarding instead of the dashboard.
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veefore';

async function debugGoogleSignInIssue() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Get user by email (same as the problem user)
    const email = 'arpit9996363@gmail.com';
    const firebaseUid = 'skO8UqUZMBMmPVfSEQxTlPcercq2';
    
    console.log('\n=== DEBUGGING GOOGLE SIGN-IN ISSUE ===');
    console.log('Problem: User arpit9996363@gmail.com is redirected to onboarding instead of dashboard');
    console.log('Expected: User should go to dashboard because isOnboarded: true');
    
    // 1. Check if user exists by email
    console.log('\n1. Checking user by email...');
    const userByEmail = await usersCollection.findOne({ email });
    
    if (userByEmail) {
      console.log('✅ User found by email:', userByEmail.email);
      console.log('   - _id:', userByEmail._id.toString());
      console.log('   - username:', userByEmail.username);
      console.log('   - firebaseUid:', userByEmail.firebaseUid);
      console.log('   - isOnboarded:', userByEmail.isOnboarded);
    } else {
      console.log('❌ User not found by email');
      return;
    }
    
    // 2. Check if user exists by firebaseUid
    console.log('\n2. Checking user by firebaseUid...');
    const userByFirebaseUid = await usersCollection.findOne({ firebaseUid });
    
    if (userByFirebaseUid) {
      console.log('✅ User found by firebaseUid:', userByFirebaseUid.email);
      console.log('   - _id:', userByFirebaseUid._id.toString());
      console.log('   - username:', userByFirebaseUid.username);
      console.log('   - firebaseUid:', userByFirebaseUid.firebaseUid);
      console.log('   - isOnboarded:', userByFirebaseUid.isOnboarded);
    } else {
      console.log('❌ User not found by firebaseUid');
    }
    
    // 3. Check if they're the same user
    console.log('\n3. Checking if they are the same user...');
    if (userByEmail && userByFirebaseUid) {
      const sameUser = userByEmail._id.toString() === userByFirebaseUid._id.toString();
      console.log('Same user?', sameUser);
      
      if (sameUser) {
        console.log('✅ Same user found by both email and firebaseUid');
        console.log('   This is the expected scenario');
        
        if (userByEmail.isOnboarded === true) {
          console.log('✅ User is correctly onboarded');
          console.log('   This user should go to dashboard');
        } else {
          console.log('❌ User is not onboarded');
          console.log('   This explains why they are redirected to onboarding');
        }
      } else {
        console.log('❌ DIFFERENT USERS - This is the problem!');
        console.log('   Email user _id:', userByEmail._id.toString());
        console.log('   Firebase user _id:', userByFirebaseUid._id.toString());
        console.log('   This could cause authentication issues');
      }
    }
    
    // 4. Check for duplicate users
    console.log('\n4. Checking for duplicate users...');
    const duplicatesByEmail = await usersCollection.find({ email }).toArray();
    const duplicatesByFirebaseUid = await usersCollection.find({ firebaseUid }).toArray();
    
    console.log(`Users with email ${email}:`, duplicatesByEmail.length);
    console.log(`Users with firebaseUid ${firebaseUid}:`, duplicatesByFirebaseUid.length);
    
    if (duplicatesByEmail.length > 1) {
      console.log('❌ DUPLICATE USERS BY EMAIL FOUND!');
      duplicatesByEmail.forEach((user, index) => {
        console.log(`   User ${index + 1}: ${user._id.toString()} - isOnboarded: ${user.isOnboarded}, firebaseUid: ${user.firebaseUid || 'null'}`);
      });
    }
    
    if (duplicatesByFirebaseUid.length > 1) {
      console.log('❌ DUPLICATE USERS BY FIREBASE UID FOUND!');
      duplicatesByFirebaseUid.forEach((user, index) => {
        console.log(`   User ${index + 1}: ${user._id.toString()} - isOnboarded: ${user.isOnboarded}, email: ${user.email}`);
      });
    }
    
    // 5. Simulate the authentication flow
    console.log('\n5. Simulating authentication flow...');
    console.log('   a) User signs in with Google');
    console.log('   b) Server gets firebaseUid from JWT token');
    console.log('   c) Server calls getUserByFirebaseUid()');
    
    const authUser = await usersCollection.findOne({ firebaseUid });
    
    if (authUser) {
      console.log('   d) User found:', authUser.email);
      console.log('   e) User isOnboarded:', authUser.isOnboarded);
      
      if (authUser.isOnboarded === true) {
        console.log('   f) ✅ User should go to dashboard');
      } else {
        console.log('   f) ❌ User will be redirected to onboarding');
        console.log('      This is where the problem occurs!');
      }
    } else {
      console.log('   d) ❌ User not found by firebaseUid');
      console.log('   e) Server will look for user by email...');
      
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        console.log('   f) Found existing user by email:', existingUser.email);
        console.log('   g) User isOnboarded:', existingUser.isOnboarded);
        console.log('   h) Server will update user with firebaseUid');
        
        // This is the critical update that might be causing issues
        console.log('   i) 🔧 This update should preserve isOnboarded status');
        
        if (existingUser.isOnboarded === true) {
          console.log('   j) ✅ After update, user should go to dashboard');
        } else {
          console.log('   j) ❌ After update, user will still be redirected to onboarding');
        }
      }
    }
    
    // 6. Check if there's an issue with the database query
    console.log('\n6. Testing database query performance...');
    const queryStart = Date.now();
    const testUser = await usersCollection.findOne({ firebaseUid });
    const queryEnd = Date.now();
    
    console.log(`Query time: ${queryEnd - queryStart}ms`);
    console.log('Query result:', testUser ? 'Found' : 'Not found');
    
    if (testUser) {
      console.log('Query result isOnboarded:', testUser.isOnboarded);
      console.log('Query result type:', typeof testUser.isOnboarded);
    }
    
    // 7. Final diagnosis
    console.log('\n=== FINAL DIAGNOSIS ===');
    
    if (userByEmail && userByFirebaseUid && userByEmail._id.toString() === userByFirebaseUid._id.toString()) {
      if (userByEmail.isOnboarded === true) {
        console.log('✅ DATABASE IS CORRECT');
        console.log('   - User exists with correct email and firebaseUid');
        console.log('   - User has isOnboarded: true');
        console.log('   - Issue must be in the application logic, not the database');
        console.log('   - Check server logs during actual authentication');
        console.log('   - Possible causes: caching, token issues, frontend state management');
      } else {
        console.log('❌ DATABASE ISSUE');
        console.log('   - User exists but isOnboarded is false');
        console.log('   - This user needs to be updated in the database');
      }
    } else {
      console.log('❌ USER MISMATCH ISSUE');
      console.log('   - Different users found by email vs firebaseUid');
      console.log('   - This will cause authentication problems');
      console.log('   - Need to consolidate or fix user records');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugGoogleSignInIssue();