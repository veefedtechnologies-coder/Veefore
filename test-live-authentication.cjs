/**
 * Test Live Authentication Issue
 * 
 * This script will help identify the exact issue during live authentication
 * by monitoring what happens when a user tries to sign in.
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veefore';

async function testLiveAuthentication() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Get the problem user
    const email = 'arpit9996363@gmail.com';
    const firebaseUid = 'skO8UqUZMBMmPVfSEQxTlPcercq2';
    
    console.log('\n=== LIVE AUTHENTICATION TEST ===');
    console.log('This test will help identify the exact issue during live authentication');
    console.log('Problem user:', email);
    console.log('Firebase UID:', firebaseUid);
    
    // 1. Verify current database state
    console.log('\n1. Checking current database state...');
    const currentUser = await usersCollection.findOne({ email });
    
    if (!currentUser) {
      console.log('❌ User not found in database');
      return;
    }
    
    console.log('✅ Current user state:');
    console.log('   - _id:', currentUser._id.toString());
    console.log('   - email:', currentUser.email);
    console.log('   - username:', currentUser.username);
    console.log('   - firebaseUid:', currentUser.firebaseUid);
    console.log('   - isOnboarded:', currentUser.isOnboarded);
    console.log('   - isEmailVerified:', currentUser.isEmailVerified);
    console.log('   - createdAt:', currentUser.createdAt);
    console.log('   - updatedAt:', currentUser.updatedAt);
    
    // 2. Test the exact server authentication flow
    console.log('\n2. Testing server authentication flow...');
    
    // Simulate getUserByFirebaseUid
    const userByFirebaseUid = await usersCollection.findOne({ firebaseUid });
    console.log('   getUserByFirebaseUid result:', userByFirebaseUid ? 'Found' : 'Not found');
    
    if (userByFirebaseUid) {
      console.log('   Found user:', userByFirebaseUid.email);
      console.log('   User isOnboarded:', userByFirebaseUid.isOnboarded);
      console.log('   User isOnboarded type:', typeof userByFirebaseUid.isOnboarded);
    }
    
    // 3. Test the exact convertUser function logic
    console.log('\n3. Testing convertUser function...');
    
    function convertUser(mongoUser) {
      return {
        id: mongoUser._id.toString(),
        firebaseUid: mongoUser.firebaseUid,
        email: mongoUser.email,
        username: mongoUser.username,
        displayName: mongoUser.displayName || null,
        avatar: mongoUser.avatar || null,
        credits: mongoUser.credits ?? 0,
        plan: mongoUser.plan || 'Free',
        stripeCustomerId: mongoUser.stripeCustomerId || null,
        stripeSubscriptionId: mongoUser.stripeSubscriptionId || null,
        referralCode: mongoUser.referralCode || null,
        totalReferrals: mongoUser.totalReferrals || 0,
        totalEarned: mongoUser.totalEarned || 0,
        referredBy: mongoUser.referredBy || null,
        preferences: mongoUser.preferences || {},
        isOnboarded: mongoUser.isOnboarded === true,
        isEmailVerified: mongoUser.isEmailVerified || false,
        emailVerificationCode: mongoUser.emailVerificationCode || null,
        emailVerificationExpiry: mongoUser.emailVerificationExpiry || null,
        createdAt: mongoUser.createdAt,
        updatedAt: mongoUser.updatedAt
      };
    }
    
    if (userByFirebaseUid) {
      const convertedUser = convertUser(userByFirebaseUid);
      console.log('   Converted user isOnboarded:', convertedUser.isOnboarded);
      console.log('   Converted user isOnboarded type:', typeof convertedUser.isOnboarded);
      
      if (convertedUser.isOnboarded === true) {
        console.log('   ✅ Conversion successful - user should go to dashboard');
      } else {
        console.log('   ❌ Conversion failed - user will be redirected to onboarding');
      }
    }
    
    // 4. Test the /api/user endpoint simulation
    console.log('\n4. Testing /api/user endpoint simulation...');
    
    if (userByFirebaseUid) {
      // This simulates the exact logic in server/routes.ts line 286
      const freshUser = await usersCollection.findOne({ _id: userByFirebaseUid._id });
      
      if (freshUser) {
        console.log('   Fresh user lookup successful');
        console.log('   Fresh user isOnboarded:', freshUser.isOnboarded);
        console.log('   Fresh user isOnboarded type:', typeof freshUser.isOnboarded);
        
        const freshConverted = convertUser(freshUser);
        console.log('   Fresh converted isOnboarded:', freshConverted.isOnboarded);
        
        if (freshConverted.isOnboarded === true) {
          console.log('   ✅ Fresh user data is correct - should go to dashboard');
        } else {
          console.log('   ❌ Fresh user data is incorrect - will be redirected to onboarding');
        }
      }
    }
    
    // 5. Check for any database inconsistencies
    console.log('\n5. Checking for database inconsistencies...');
    
    const allUsers = await usersCollection.find({
      $or: [
        { email: email },
        { firebaseUid: firebaseUid }
      ]
    }).toArray();
    
    console.log(`   Found ${allUsers.length} users matching email or firebaseUid`);
    
    allUsers.forEach((user, index) => {
      console.log(`   User ${index + 1}:`);
      console.log(`     - _id: ${user._id.toString()}`);
      console.log(`     - email: ${user.email}`);
      console.log(`     - firebaseUid: ${user.firebaseUid || 'null'}`);
      console.log(`     - isOnboarded: ${user.isOnboarded}`);
      console.log(`     - createdAt: ${user.createdAt}`);
    });
    
    // 6. Final recommendations
    console.log('\n=== FINAL RECOMMENDATIONS ===');
    
    if (userByFirebaseUid && userByFirebaseUid.isOnboarded === true) {
      console.log('✅ DATABASE AND BACKEND LOGIC ARE CORRECT');
      console.log('   The issue is likely in the frontend or authentication flow');
      console.log('   Recommended actions:');
      console.log('   1. Check the browser console when user signs in');
      console.log('   2. Verify Firebase authentication is working correctly');
      console.log('   3. Check if there are any network errors during authentication');
      console.log('   4. Verify the JWT token is being generated correctly');
      console.log('   5. Check if the frontend is receiving the correct user data');
      
      console.log('\n   To debug further:');
      console.log('   - Ask the user to sign in and check browser console logs');
      console.log('   - Look for [AUTH] and [APP.TSX] debug messages');
      console.log('   - Check if the user data contains isOnboarded: true');
      console.log('   - Verify the authentication flow completes successfully');
    } else {
      console.log('❌ DATABASE OR BACKEND ISSUE');
      console.log('   The user data in the database needs to be corrected');
      console.log('   Current isOnboarded:', userByFirebaseUid?.isOnboarded);
      console.log('   Expected isOnboarded: true');
    }
    
    console.log('\n   Current debugging is in place:');
    console.log('   - Frontend App.tsx will log user authentication check');
    console.log('   - useAuth hook will log complete user data received from backend');
    console.log('   - Server routes will log user lookup and conversion');
    console.log('   - When user signs in, all these logs will appear in the console');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testLiveAuthentication();