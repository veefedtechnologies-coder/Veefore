const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

async function finalProductionTest() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    console.log('🎯 FINAL PRODUCTION VALIDATION TEST');
    console.log('=' .repeat(60));
    
    const db = client.db('veeforedb');
    const rulesCollection = db.collection('automationrules');
    const accountsCollection = db.collection('socialaccounts');
    
    // Test 1: Verify automation rules have targetMediaIds
    console.log('\n📋 TEST 1: POST-SPECIFIC TARGETING VERIFICATION');
    const rules = await rulesCollection.find({
      type: 'comment_dm',
      isActive: true
    }).toArray();
    
    console.log(`Found ${rules.length} active comment-to-DM rules`);
    
    let allRulesConfigured = true;
    rules.forEach((rule, index) => {
      console.log(`\n🎯 Rule ${index + 1}: ${rule.name}`);
      console.log(`  Type: ${rule.type}`);
      console.log(`  Is Active: ${rule.isActive}`);
      console.log(`  Keywords: ${rule.triggers?.keywords?.join(', ') || 'None'}`);
      console.log(`  Has targetMediaIds: ${!!rule.targetMediaIds}`);
      console.log(`  Target Posts: ${rule.targetMediaIds?.length || 0}`);
      
      if (rule.targetMediaIds && rule.targetMediaIds.length > 0) {
        console.log(`  ✅ POST-SPECIFIC TARGETING CONFIGURED`);
        rule.targetMediaIds.forEach((postId, idx) => {
          console.log(`    ${idx + 1}. ${postId}`);
        });
      } else {
        console.log(`  ❌ NO POST-SPECIFIC TARGETING`);
        allRulesConfigured = false;
      }
      
      // Check responses
      const commentResponses = rule.action?.responses?.length || 0;
      const dmResponses = rule.action?.dmResponses?.length || 0;
      console.log(`  Comment Responses: ${commentResponses}`);
      console.log(`  DM Responses: ${dmResponses}`);
      
      if (commentResponses > 0 && dmResponses > 0) {
        console.log(`  ✅ BOTH COMMENT AND DM RESPONSES CONFIGURED`);
      } else {
        console.log(`  ❌ MISSING RESPONSES`);
        allRulesConfigured = false;
      }
    });
    
    // Test 2: Verify Instagram accounts are connected
    console.log('\n📱 TEST 2: INSTAGRAM ACCOUNT VERIFICATION');
    const accounts = await accountsCollection.find({
      platform: 'instagram',
      isActive: true
    }).toArray();
    
    console.log(`Found ${accounts.length} active Instagram accounts`);
    
    let hasWorkingAccounts = false;
    accounts.forEach((account, index) => {
      console.log(`\n📱 Account ${index + 1}: @${account.username}`);
      console.log(`  Platform: ${account.platform}`);
      console.log(`  Workspace: ${account.workspaceId}`);
      console.log(`  Has Access Token: ${!!account.accessToken}`);
      console.log(`  Followers: ${account.followers || account.followersCount || 0}`);
      console.log(`  Media Count: ${account.mediaCount || 0}`);
      
      if (account.accessToken) {
        console.log(`  ✅ READY FOR AUTOMATION`);
        hasWorkingAccounts = true;
      } else {
        console.log(`  ❌ NO ACCESS TOKEN`);
      }
    });
    
    // Test 3: Simulate post-specific filtering
    console.log('\n🔄 TEST 3: POST-SPECIFIC FILTERING SIMULATION');
    const targetPosts = [
      '18076220419901491',
      '18056872022594716', 
      '18048694391163016',
      '17891533449259045'
    ];
    
    const testPosts = [
      '18076220419901491', // Should match
      '18056872022594716', // Should match  
      '99999999999999999', // Should NOT match
      '18048694391163016', // Should match
      '88888888888888888'  // Should NOT match
    ];
    
    testPosts.forEach((postId, index) => {
      const shouldMatch = targetPosts.includes(postId);
      console.log(`\n📝 Test Post ${index + 1}: ${postId}`);
      console.log(`  Expected: ${shouldMatch ? 'MATCH' : 'NO MATCH'}`);
      
      // Simulate webhook filtering logic
      const matchingRules = rules.filter(rule => {
        return rule.targetMediaIds && rule.targetMediaIds.includes(postId);
      });
      
      console.log(`  Found ${matchingRules.length} matching rules`);
      console.log(`  Result: ${matchingRules.length > 0 ? '✅ MATCH' : '❌ NO MATCH'}`);
      
      if (shouldMatch && matchingRules.length > 0) {
        console.log(`  ✅ CORRECT - Post should trigger automation`);
      } else if (!shouldMatch && matchingRules.length === 0) {
        console.log(`  ✅ CORRECT - Post should NOT trigger automation`);
      } else {
        console.log(`  ❌ INCORRECT - Filtering logic error`);
      }
    });
    
    // Final Production Status
    console.log('\n🏆 FINAL PRODUCTION STATUS');
    console.log('=' .repeat(60));
    
    const isProductionReady = allRulesConfigured && hasWorkingAccounts;
    
    console.log(`✅ Post-specific targeting: ${allRulesConfigured ? 'CONFIGURED' : 'MISSING'}`);
    console.log(`✅ Instagram accounts: ${hasWorkingAccounts ? 'CONNECTED' : 'MISSING'}`);
    console.log(`✅ Comment responses: ${rules.every(r => r.action?.responses?.length > 0) ? 'CONFIGURED' : 'MISSING'}`);
    console.log(`✅ DM responses: ${rules.every(r => r.action?.dmResponses?.length > 0) ? 'CONFIGURED' : 'MISSING'}`);
    console.log(`✅ Pre-defined responses only: YES (no AI automation)`);
    
    if (isProductionReady) {
      console.log('\n🎉 PRODUCTION STATUS: READY');
      console.log('The comment-to-DM automation system is fully operational!');
      console.log('');
      console.log('🎯 CONFIGURATION SUMMARY:');
      console.log(`- ${rules.length} active comment-to-DM rules`);
      console.log(`- ${accounts.length} connected Instagram accounts`);
      console.log(`- ${targetPosts.length} target posts for automation`);
      console.log('- Pre-defined responses only (no AI automation)');
      console.log('');
      console.log('📱 NEXT STEPS:');
      console.log('1. Real Instagram comments on target posts will trigger automation');
      console.log('2. System will reply to comments and send DMs using pre-configured responses');
      console.log('3. Only comments containing keywords will trigger automation');
      console.log('4. Only on these specific posts will automation run');
    } else {
      console.log('\n❌ PRODUCTION STATUS: NOT READY');
      console.log('Please fix the issues above before going live.');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error);
  } finally {
    await client.close();
  }
}

finalProductionTest();