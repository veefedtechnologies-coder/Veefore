/**
 * Test Additive Subscription System Fix - Validate All Credit Allocations are Additive
 * 
 * This test validates that the fix for the subscription upgrade bug works correctly:
 * - Monthly credit allocation: ADDITIVE (working)
 * - Credit purchases: ADDITIVE (working)
 * - Subscription upgrades: ADDITIVE (FIXED - was replacing credits)
 * 
 * Complete test scenario:
 * 1. User has 1100 credits from Pro plan
 * 2. Test subscription upgrade to Business plan (2000 credits)
 * 3. Expected result: 1100 + 2000 = 3100 credits (ADDITIVE)
 * 4. Test monthly allocation adds on top
 * 5. Test credit purchase adds on top
 */

import { MongoClient } from 'mongodb';
import { MongoStorage } from './server/mongodb-storage.js';
import mongoose from 'mongoose';

async function testAdditiveSubscriptionFix() {
  console.log('🔧 TESTING ADDITIVE SUBSCRIPTION SYSTEM FIX');
  console.log('='.repeat(60));
  
  const storage = new MongoStorage();
  const userId = '6844027426cae0200f88b5db';
  
  try {
    // Step 1: Check current user status
    console.log('\n1. CHECKING CURRENT USER STATUS');
    const userBefore = await storage.getUser(userId);
    console.log(`   Current Plan: ${userBefore.plan}`);
    console.log(`   Current Credits: ${userBefore.credits}`);
    console.log(`   Expected: Pro plan with 1100 credits`);
    
    // Step 2: Test subscription upgrade (this was the bug)
    console.log('\n2. TESTING SUBSCRIPTION UPGRADE (ADDITIVE)');
    console.log('   Upgrading from Pro (1100 credits) to Business plan (2000 credits)');
    console.log('   Expected: 1100 + 2000 = 3100 credits (ADDITIVE)');
    
    // Simulate the updateUserSubscription call that was causing the bug
    const updatedUser = await storage.updateUserSubscription(userId, 'business');
    console.log(`   ✅ Plan updated to: ${updatedUser.plan}`);
    console.log(`   ✅ Credits after upgrade: ${updatedUser.credits}`);
    
    if (updatedUser.credits === 3100) {
      console.log('   🎉 SUCCESS: Subscription upgrade is now ADDITIVE!');
    } else {
      console.log(`   ❌ FAIL: Expected 3100 credits, got ${updatedUser.credits}`);
    }
    
    // Step 3: Test monthly credit allocation (already working)
    console.log('\n3. TESTING MONTHLY CREDIT ALLOCATION (ADDITIVE)');
    console.log('   Adding monthly Business plan allocation (2000 credits)');
    console.log(`   Expected: ${updatedUser.credits} + 2000 = ${updatedUser.credits + 2000} credits`);
    
    const beforeMonthly = updatedUser.credits;
    await storage.addCreditsToUser(userId, 2000);
    const afterMonthly = await storage.getUser(userId);
    console.log(`   ✅ Credits after monthly allocation: ${afterMonthly.credits}`);
    
    if (afterMonthly.credits === beforeMonthly + 2000) {
      console.log('   🎉 SUCCESS: Monthly allocation is ADDITIVE!');
    } else {
      console.log(`   ❌ FAIL: Expected ${beforeMonthly + 2000} credits, got ${afterMonthly.credits}`);
    }
    
    // Step 4: Test credit purchase (already working)
    console.log('\n4. TESTING CREDIT PURCHASE (ADDITIVE)');
    console.log('   Purchasing 500 additional credits');
    console.log(`   Expected: ${afterMonthly.credits} + 500 = ${afterMonthly.credits + 500} credits`);
    
    const beforePurchase = afterMonthly.credits;
    await storage.addCreditsToUser(userId, 500);
    const afterPurchase = await storage.getUser(userId);
    console.log(`   ✅ Credits after purchase: ${afterPurchase.credits}`);
    
    if (afterPurchase.credits === beforePurchase + 500) {
      console.log('   🎉 SUCCESS: Credit purchase is ADDITIVE!');
    } else {
      console.log(`   ❌ FAIL: Expected ${beforePurchase + 500} credits, got ${afterPurchase.credits}`);
    }
    
    // Step 5: Summary
    console.log('\n5. FINAL VERIFICATION');
    console.log('   Complete credit flow test:');
    console.log(`   Starting credits: 1100`);
    console.log(`   + Business upgrade: 2000`);
    console.log(`   + Monthly allocation: 2000`);
    console.log(`   + Credit purchase: 500`);
    console.log(`   = Total expected: 5600`);
    console.log(`   = Actual total: ${afterPurchase.credits}`);
    
    if (afterPurchase.credits === 5600) {
      console.log('\n🎉 COMPLETE SUCCESS: ALL CREDIT ALLOCATIONS ARE ADDITIVE!');
      console.log('✅ Monthly allocations: ADDITIVE');
      console.log('✅ Credit purchases: ADDITIVE');
      console.log('✅ Subscription upgrades: ADDITIVE (FIXED)');
    } else {
      console.log('\n❌ SYSTEM ISSUE: Credit flow not working correctly');
      console.log(`Expected: 5600, Got: ${afterPurchase.credits}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 ADDITIVE SUBSCRIPTION SYSTEM FIX VALIDATION COMPLETE');
    
    // Create transaction records for audit trail
    await storage.createCreditTransaction({
      userId: userId,
      type: 'subscription_upgrade',
      amount: 2000,
      description: 'Test: Business plan upgrade - additive credits',
      referenceId: 'test_subscription_fix'
    });
    
    await storage.createCreditTransaction({
      userId: userId,
      type: 'monthly_allocation',
      amount: 2000,
      description: 'Test: Monthly Business plan allocation',
      referenceId: 'test_monthly_allocation'
    });
    
    await storage.createCreditTransaction({
      userId: userId,
      type: 'purchase',
      amount: 500,
      description: 'Test: Credit purchase validation',
      referenceId: 'test_credit_purchase'
    });
    
    console.log('✅ Transaction records created for audit trail');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run the test
testAdditiveSubscriptionFix().catch(console.error);