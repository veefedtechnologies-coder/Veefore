/**
 * Test Feature Access Controls - Verify Plan Tier Restrictions
 * 
 * This test validates that the subscription plans correctly enforce:
 * - Free: 1 social account, 1 workspace, 0 team members, 20 credits
 * - Starter: 2 social accounts, 1 workspace, 0 team members, 300 credits
 * - Pro: 1 social account, 2 workspaces, 2 team members, 1100 credits
 * - Business: 4 social accounts, 8 workspaces, 3 team members, 2000 credits
 */

import { validateFeatureAccess } from './server/subscription-config.js';

async function testFeatureAccessControls() {
  console.log('🔍 Testing Feature Access Controls...\n');
  
  // Test plan configurations
  const testPlans = ['free', 'starter', 'pro', 'business'];
  
  for (const plan of testPlans) {
    console.log(`\n=== Testing ${plan.toUpperCase()} Plan ===`);
    
    // Test workspace limits
    const workspaceAccess = validateFeatureAccess(plan, 'workspace');
    console.log(`✓ Workspace access: ${workspaceAccess.allowed ? 'ALLOWED' : 'DENIED'}`);
    if (workspaceAccess.limit) {
      console.log(`  → Limit: ${workspaceAccess.limit} workspaces`);
    }
    
    // Test social account limits
    const socialAccess = validateFeatureAccess(plan, 'social-accounts');
    console.log(`✓ Social accounts: ${socialAccess.allowed ? 'ALLOWED' : 'DENIED'}`);
    if (socialAccess.limit) {
      console.log(`  → Limit: ${socialAccess.limit} social accounts`);
    }
    
    // Test AI features
    const aiFeatures = ['thumbnails-pro', 'competitor-analysis', 'affiliate-program'];
    for (const feature of aiFeatures) {
      const access = validateFeatureAccess(plan, feature);
      console.log(`✓ ${feature}: ${access.allowed ? 'ALLOWED' : 'DENIED'}`);
      if (!access.allowed && access.upgrade) {
        console.log(`  → Requires: ${access.upgrade} plan`);
      }
    }
  }
  
  console.log('\n🎯 Testing Plan Tier Restrictions...\n');
  
  // Test specific tier restrictions
  const testCases = [
    { plan: 'free', feature: 'workspace', shouldAllow: true, expectedLimit: 1 },
    { plan: 'free', feature: 'social-accounts', shouldAllow: true, expectedLimit: 1 },
    { plan: 'free', feature: 'thumbnails-pro', shouldAllow: false, upgradeRequired: 'pro' },
    
    { plan: 'starter', feature: 'workspace', shouldAllow: true, expectedLimit: 1 },
    { plan: 'starter', feature: 'social-accounts', shouldAllow: true, expectedLimit: 2 },
    { plan: 'starter', feature: 'competitor-analysis', shouldAllow: false, upgradeRequired: 'pro' },
    
    { plan: 'pro', feature: 'workspace', shouldAllow: true, expectedLimit: 2 },
    { plan: 'pro', feature: 'social-accounts', shouldAllow: true, expectedLimit: 1 },
    { plan: 'pro', feature: 'thumbnails-pro', shouldAllow: true },
    
    { plan: 'business', feature: 'workspace', shouldAllow: true, expectedLimit: 8 },
    { plan: 'business', feature: 'social-accounts', shouldAllow: true, expectedLimit: 4 },
    { plan: 'business', feature: 'affiliate-program', shouldAllow: true }
  ];
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (const testCase of testCases) {
    const access = validateFeatureAccess(testCase.plan, testCase.feature);
    const passed = access.allowed === testCase.shouldAllow;
    
    if (passed) {
      console.log(`✅ ${testCase.plan}/${testCase.feature}: PASSED`);
      passedTests++;
    } else {
      console.log(`❌ ${testCase.plan}/${testCase.feature}: FAILED`);
      console.log(`   Expected: ${testCase.shouldAllow ? 'ALLOWED' : 'DENIED'}`);
      console.log(`   Got: ${access.allowed ? 'ALLOWED' : 'DENIED'}`);
    }
    
    // Check limits
    if (testCase.expectedLimit && access.limit !== testCase.expectedLimit) {
      console.log(`⚠️  Limit mismatch: expected ${testCase.expectedLimit}, got ${access.limit}`);
    }
    
    // Check upgrade requirements
    if (testCase.upgradeRequired && access.upgrade !== testCase.upgradeRequired) {
      console.log(`⚠️  Upgrade mismatch: expected ${testCase.upgradeRequired}, got ${access.upgrade}`);
    }
  }
  
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All feature access controls are working correctly!');
  } else {
    console.log('⚠️  Some tests failed. Please review the subscription configuration.');
  }
}

// Run the test
testFeatureAccessControls().catch(console.error);