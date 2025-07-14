/**
 * Test User Conversion Issue
 * 
 * This script tests the specific user conversion issue where the database
 * shows isOnboarded: true but the server converts it to false.
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veefore';

async function testUserConversion() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Get the specific user that's having issues
    const problemUser = await usersCollection.findOne({ username: 'arpit9996363' });
    
    if (problemUser) {
      console.log('\n=== RAW DATABASE USER ===');
      console.log('_id:', problemUser._id.toString());
      console.log('email:', problemUser.email);
      console.log('username:', problemUser.username);
      console.log('firebaseUid:', problemUser.firebaseUid);
      console.log('isOnboarded:', problemUser.isOnboarded);
      console.log('isOnboarded type:', typeof problemUser.isOnboarded);
      console.log('isOnboarded === true:', problemUser.isOnboarded === true);
      console.log('isOnboarded == true:', problemUser.isOnboarded == true);
      console.log('Boolean(isOnboarded):', Boolean(problemUser.isOnboarded));
      console.log('isEmailVerified:', problemUser.isEmailVerified);
      console.log('isEmailVerified type:', typeof problemUser.isEmailVerified);
      
      console.log('\n=== SIMULATED CONVERSION ===');
      // Simulate the convertUser function logic
      const converted = {
        id: problemUser._id.toString(),
        firebaseUid: problemUser.firebaseUid,
        email: problemUser.email,
        username: problemUser.username,
        displayName: problemUser.displayName || null,
        avatar: problemUser.avatar || null,
        credits: problemUser.credits ?? 0,
        plan: problemUser.plan || 'Free',
        stripeCustomerId: problemUser.stripeCustomerId || null,
        stripeSubscriptionId: problemUser.stripeSubscriptionId || null,
        referralCode: problemUser.referralCode || null,
        totalReferrals: problemUser.totalReferrals || 0,
        totalEarned: problemUser.totalEarned || 0,
        referredBy: problemUser.referredBy || null,
        preferences: problemUser.preferences || {},
        isOnboarded: problemUser.isOnboarded === true,
        isEmailVerified: problemUser.isEmailVerified || false,
        emailVerificationCode: problemUser.emailVerificationCode || null,
        emailVerificationExpiry: problemUser.emailVerificationExpiry || null,
        createdAt: problemUser.createdAt,
        updatedAt: problemUser.updatedAt
      };
      
      console.log('Converted isOnboarded:', converted.isOnboarded);
      console.log('Converted isEmailVerified:', converted.isEmailVerified);
      
      if (problemUser.isOnboarded === true && converted.isOnboarded === false) {
        console.log('\n❌ CONVERSION ERROR DETECTED');
        console.log('Database has isOnboarded: true but conversion results in false');
        console.log('This indicates a bug in the convertUser function');
      } else if (problemUser.isOnboarded === true && converted.isOnboarded === true) {
        console.log('\n✅ CONVERSION IS CORRECT');
        console.log('Database has isOnboarded: true and conversion results in true');
        console.log('The issue might be elsewhere in the authentication flow');
      } else {
        console.log('\n❓ MIXED RESULTS');
        console.log('Database isOnboarded:', problemUser.isOnboarded);
        console.log('Converted isOnboarded:', converted.isOnboarded);
      }
      
      // Check if there are multiple users with the same firebaseUid
      console.log('\n=== CHECKING FOR DUPLICATE USERS ===');
      const duplicateUsers = await usersCollection.find({ 
        firebaseUid: problemUser.firebaseUid 
      }).toArray();
      
      console.log(`Found ${duplicateUsers.length} users with firebaseUid: ${problemUser.firebaseUid}`);
      
      if (duplicateUsers.length > 1) {
        console.log('❌ MULTIPLE USERS DETECTED - This could be the issue!');
        duplicateUsers.forEach((user, index) => {
          console.log(`User ${index + 1}:`);
          console.log(`  - _id: ${user._id.toString()}`);
          console.log(`  - email: ${user.email}`);
          console.log(`  - username: ${user.username}`);
          console.log(`  - isOnboarded: ${user.isOnboarded}`);
          console.log(`  - createdAt: ${user.createdAt}`);
        });
        
        // Find which user is being returned first
        const firstUser = await usersCollection.findOne({ firebaseUid: problemUser.firebaseUid });
        console.log(`\nFirst user returned by findOne: ${firstUser._id.toString()}`);
        console.log(`First user isOnboarded: ${firstUser.isOnboarded}`);
        
        if (firstUser.isOnboarded !== true) {
          console.log('❌ The first user returned has isOnboarded: false - This is the bug!');
          console.log('The database lookup is returning the wrong user or an outdated user');
        }
      } else {
        console.log('✅ No duplicate users found');
      }
      
    } else {
      console.log('❌ User "arpit9996363" not found in database');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testUserConversion();