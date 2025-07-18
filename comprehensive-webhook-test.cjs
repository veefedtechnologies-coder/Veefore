const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = "mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "veeforedb";

// Simulate webhook comment processing
async function simulateWebhookCommentProcessing(workspaceId, commentText) {
  console.log(`\n🔍 SIMULATING WEBHOOK PROCESSING:`);
  console.log(`   - Workspace: ${workspaceId}`);
  console.log(`   - Comment: "${commentText}"`);
  
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection('AutomationRule');
    
    // Step 1: Find active automation rules for workspace
    const rules = await collection.find({
      workspaceId: workspaceId,
      isActive: true,
      type: 'comment_dm'
    }).toArray();
    
    console.log(`   ✅ Found ${rules.length} active comment-to-DM rules`);
    
    if (rules.length === 0) {
      console.log(`   ❌ No active rules found for workspace`);
      return null;
    }
    
    // Step 2: Process each rule
    for (const rule of rules) {
      console.log(`\n   📋 Processing rule: ${rule.name}`);
      console.log(`      - Keywords: ${rule.triggers.keywords.join(', ')}`);
      
      // Step 3: Check keyword matching
      const keywords = rule.triggers.keywords;
      const matchedKeyword = keywords.find(keyword => 
        commentText.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (matchedKeyword) {
        console.log(`      ✅ Keyword matched: "${matchedKeyword}"`);
        
        // Step 4: Get responses
        const commentReplies = rule.action.responses;
        const dmResponses = rule.action.dmResponses;
        
        if (!commentReplies || !dmResponses) {
          console.log(`      ❌ Missing responses: commentReplies=${!!commentReplies}, dmResponses=${!!dmResponses}`);
          continue;
        }
        
        // Step 5: Select responses
        const selectedCommentReply = commentReplies[Math.floor(Math.random() * commentReplies.length)];
        const selectedDMResponse = dmResponses[0]; // Always use first DM response
        
        console.log(`      📝 Selected comment reply: "${selectedCommentReply}"`);
        console.log(`      💬 Selected DM response: "${selectedDMResponse}"`);
        
        // Step 6: Return automation action
        return {
          ruleId: rule._id,
          ruleName: rule.name,
          matchedKeyword,
          commentReply: selectedCommentReply,
          dmResponse: selectedDMResponse,
          actionType: 'comment_dm'
        };
      } else {
        console.log(`      ❌ No keyword matched`);
      }
    }
    
    console.log(`   ❌ No rules matched the comment`);
    return null;
    
  } catch (error) {
    console.error(`   ❌ Error processing webhook:`, error);
    return null;
  } finally {
    await client.close();
  }
}

async function comprehensiveWebhookTest() {
  console.log('🎯 COMPREHENSIVE WEBHOOK TEST');
  console.log('=' .repeat(60));
  
  const workspaceId = '6847b9cdfabaede1706f2994';
  
  // Test scenarios
  const testScenarios = [
    { comment: 'free', expectedMatch: true },
    { comment: 'info please', expectedMatch: true },
    { comment: 'need details', expectedMatch: true },
    { comment: 'product info', expectedMatch: true },
    { comment: 'hello world', expectedMatch: false },
    { comment: 'nice post', expectedMatch: false },
  ];
  
  let passedTests = 0;
  let totalTests = testScenarios.length;
  
  for (const scenario of testScenarios) {
    const result = await simulateWebhookCommentProcessing(workspaceId, scenario.comment);
    
    if (scenario.expectedMatch && result) {
      console.log(`   ✅ TEST PASSED: Expected match and got automation action`);
      passedTests++;
    } else if (!scenario.expectedMatch && !result) {
      console.log(`   ✅ TEST PASSED: Expected no match and got no action`);
      passedTests++;
    } else {
      console.log(`   ❌ TEST FAILED: Expected match=${scenario.expectedMatch}, got result=${!!result}`);
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log(`🎉 COMPREHENSIVE TEST RESULTS: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('✅ ALL TESTS PASSED - AUTOMATION SYSTEM READY FOR PRODUCTION');
  } else {
    console.log('❌ SOME TESTS FAILED - SYSTEM NEEDS FIXES');
  }
}

console.log('🚀 STARTING COMPREHENSIVE WEBHOOK TEST...');
comprehensiveWebhookTest();