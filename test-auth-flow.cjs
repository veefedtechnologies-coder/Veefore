/**
 * Test Authentication Flow
 * 
 * This script simulates the exact authentication flow that happens
 * when a user signs in with Google to identify where isOnboarded becomes false.
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veefore';

// Simulate the exact convertUser function logic from server/mongodb-storage.ts
function convertUser(mongoUser) {
  console.log(`[USER CONVERT] Raw MongoDB user isOnboarded:`, mongoUser.isOnboarded, `(type: ${typeof mongoUser.isOnboarded})`);
  
  const converted = {
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
  
  console.log(`[USER CONVERT] Converted user isOnboarded:`, converted.isOnboarded);
  return converted;
}

async function testAuthFlow() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Test the exact authentication flow
    const targetFirebaseUid = 'skO8UqUZMBMmPVfSEQxTlPcercq2';
    
    console.log('\n=== SIMULATING AUTHENTICATION FLOW ===');
    console.log('1. Firebase user signs in with UID:', targetFirebaseUid);
    
    console.log('2. Server calls getUserByFirebaseUid...');
    const mongoUser = await usersCollection.findOne({ firebaseUid: targetFirebaseUid });
    
    if (!mongoUser) {
      console.log('❌ No user found with firebaseUid:', targetFirebaseUid);
      return;
    }
    
    console.log('3. MongoDB findOne result:');
    console.log('   - _id:', mongoUser._id.toString());
    console.log('   - email:', mongoUser.email);
    console.log('   - username:', mongoUser.username);
    console.log('   - isOnboarded:', mongoUser.isOnboarded);
    console.log('   - isOnboarded type:', typeof mongoUser.isOnboarded);
    
    console.log('4. Server calls convertUser...');
    const convertedUser = convertUser(mongoUser);
    
    console.log('5. Converted user result:');
    console.log('   - id:', convertedUser.id);
    console.log('   - email:', convertedUser.email);
    console.log('   - username:', convertedUser.username);
    console.log('   - isOnboarded:', convertedUser.isOnboarded);
    
    console.log('6. Server responds with user data...');
    console.log('7. Frontend receives user data...');
    console.log('8. App.tsx checks if (!user.isOnboarded)...');
    
    if (convertedUser.isOnboarded === false) {
      console.log('❌ PROBLEM: User will be redirected to signup!');
      console.log('   - Database has isOnboarded:', mongoUser.isOnboarded);
      console.log('   - But converted user has isOnboarded:', convertedUser.isOnboarded);
      
      // Debug the conversion logic
      console.log('\n=== DEBUGGING CONVERSION LOGIC ===');
      console.log('mongoUser.isOnboarded:', mongoUser.isOnboarded);
      console.log('typeof mongoUser.isOnboarded:', typeof mongoUser.isOnboarded);
      console.log('mongoUser.isOnboarded === true:', mongoUser.isOnboarded === true);
      console.log('mongoUser.isOnboarded == true:', mongoUser.isOnboarded == true);
      console.log('Boolean(mongoUser.isOnboarded):', Boolean(mongoUser.isOnboarded));
      
      if (mongoUser.isOnboarded === true) {
        console.log('✅ Database value is correct (true)');
        console.log('❌ But conversion logic is failing');
        console.log('This should not happen - there might be a server-side issue');
      } else {
        console.log('❌ Database value is wrong:', mongoUser.isOnboarded);
        console.log('This user needs to be fixed in the database');
      }
    } else {
      console.log('✅ SUCCESS: User will be taken to dashboard');
      console.log('   - Database has isOnboarded:', mongoUser.isOnboarded);
      console.log('   - Converted user has isOnboarded:', convertedUser.isOnboarded);
    }
    
    // Check if there's a caching issue or multiple users
    console.log('\n=== CHECKING FOR POTENTIAL ISSUES ===');
    
    // Check for multiple users with same firebaseUid
    const allUsersWithSameUid = await usersCollection.find({ firebaseUid: targetFirebaseUid }).toArray();
    console.log(`Found ${allUsersWithSameUid.length} users with firebaseUid: ${targetFirebaseUid}`);
    
    if (allUsersWithSameUid.length > 1) {
      console.log('❌ MULTIPLE USERS FOUND - This could cause issues!');
      allUsersWithSameUid.forEach((user, index) => {
        console.log(`   User ${index + 1}: ${user.username} (${user.email}) - isOnboarded: ${user.isOnboarded}`);
      });
    }
    
    // Check if the user returned by findOne is the most recent
    const sortedUsers = allUsersWithSameUid.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const mostRecentUser = sortedUsers[0];
    
    if (mostRecentUser._id.toString() !== mongoUser._id.toString()) {
      console.log('❌ WRONG USER RETURNED BY FINDONE');
      console.log('   findOne returned:', mongoUser._id.toString());
      console.log('   Most recent user:', mostRecentUser._id.toString());
    } else {
      console.log('✅ findOne returned the correct (most recent) user');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testAuthFlow();