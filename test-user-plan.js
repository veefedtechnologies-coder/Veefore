/**
 * Test User Plan - Check Current User Subscription Status
 */

import { MongoStorage } from './server/mongodb-storage.js';

async function testUserPlan() {
  const storage = new MongoStorage();
  
  try {
    console.log('Testing user plan status...');
    
    // Test the user ID that was trying to upgrade
    const userId = '6844027426cae0200f88b5db';
    
    // Get user data
    const user = await storage.getUser(userId);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('User ID:', user.id);
      console.log('User plan:', user.plan);
      console.log('User credits:', user.credits);
      console.log('User username:', user.username);
    }
    
    // Test the update subscription method
    console.log('\nTesting updateUserSubscription method...');
    try {
      await storage.updateUserSubscription(userId, 'starter');
      console.log('✅ Update successful');
      
      // Check the plan after update
      const updatedUser = await storage.getUser(userId);
      if (updatedUser) {
        console.log('Updated user plan:', updatedUser.plan);
      }
    } catch (error) {
      console.error('❌ Update failed:', error.message);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testUserPlan();