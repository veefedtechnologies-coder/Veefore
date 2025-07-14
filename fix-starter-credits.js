/**
 * Fix Starter Credits - Update User to Have Full 300 Monthly Credits
 * 
 * This script updates the user's account to have the correct 300 credits
 * that come with the Starter plan instead of just the payment credits.
 */

import { MongoStorage } from './server/mongodb-storage.js';

async function fixStarterCredits() {
  const storage = new MongoStorage();
  
  try {
    console.log('🔧 Fixing Starter plan credits...');
    
    const userId = '6844027426cae0200f88b5db';
    const planId = 'starter';
    
    // Get user data before update
    const userBefore = await storage.getUser(userId);
    console.log('Before fix:');
    console.log(`  Plan: ${userBefore.plan}`);
    console.log(`  Credits: ${userBefore.credits}`);
    
    // Update user with correct Starter plan credits (300)
    const updatedUser = await storage.updateUserSubscription(userId, planId);
    
    console.log('\nAfter fix:');
    console.log(`  Plan: ${updatedUser.plan}`);
    console.log(`  Credits: ${updatedUser.credits}`);
    
    // Create a transaction record for the credit adjustment
    const creditDifference = 300 - (userBefore.credits || 0);
    if (creditDifference > 0) {
      await storage.createCreditTransaction({
        userId: userId,
        type: 'plan_adjustment',
        amount: creditDifference,
        description: `Plan credit adjustment - Starter plan includes 300 monthly credits`,
        referenceId: 'starter_plan_fix'
      });
      
      console.log(`\n✅ Added ${creditDifference} credits to reach Starter plan total of 300`);
    }
    
    console.log('\n🎉 Starter plan credits fixed successfully!');
    console.log('User now has the correct 300 credits for the Starter plan.');
    
  } catch (error) {
    console.error('❌ Error fixing Starter credits:', error);
  }
}

fixStarterCredits();