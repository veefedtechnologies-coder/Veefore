/**
 * Fix Existing User Plan Field - Update Current User to Starter Plan
 * 
 * This script updates the current early access user's plan field to 'starter' 
 * to match their subscription fields that were already set during welcome bonus claim.
 */

import { MongoClient, ObjectId } from 'mongodb';

async function fixExistingUserPlan() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    const usersCollection = db.collection('users');
    
    console.log('🔍 Finding users with starter subscriptionPlan but missing plan field...');
    
    // Find user by firebaseUid 
    const user = await usersCollection.findOne({
      firebaseUid: '7ONwldsHUeSwVFxqRoFrRIlEOLm1'
    });
    
    if (!user) {
      console.log('❌ User not found or doesn\'t have starter subscription');
      return;
    }
    
    console.log('✅ Found user:', {
      email: user.email,
      currentPlan: user.plan,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
      hasClaimedWelcomeBonus: user.hasClaimedWelcomeBonus
    });
    
    // Update the user's plan field to match subscriptionPlan
    const updateResult = await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          plan: 'starter',
          updatedAt: new Date()
        }
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log('✅ Successfully updated user plan field to "starter"');
      console.log('📊 Frontend will now correctly show "Starter Plan Trial" instead of "Free Plan"');
      
      // Verify the update
      const updatedUser = await usersCollection.findOne({ _id: user._id });
      console.log('🔍 Verification - Updated user fields:', {
        plan: updatedUser.plan,
        subscriptionPlan: updatedUser.subscriptionPlan,
        subscriptionStatus: updatedUser.subscriptionStatus,
        credits: updatedUser.credits
      });
    } else {
      console.log('❌ Failed to update user plan field');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Run the fix
fixExistingUserPlan()
  .then(() => console.log('✅ Fix completed'))
  .catch(console.error);