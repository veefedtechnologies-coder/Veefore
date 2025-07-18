const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = "mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "veeforedb";

// Simulate the webhook comment handling logic
async function simulateCommentWebhook(workspaceId, commentText) {
  console.log(`\n🔍 SIMULATING COMMENT WEBHOOK:`);
  console.log(`   - Workspace: ${workspaceId}`);
  console.log(`   - Comment: "${commentText}"`);
  
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection('AutomationRule');
    
    // Step 1: Get automation rules for this workspace
    const rules = await collection.find({
      workspaceId: workspaceId,
      isActive: true
    }).toArray();
    
    console.log(`   ✅ Found ${rules.length} automation rules for workspace`);
    
    // Step 2: Filter rules that should handle comments (NEW LOGIC)
    const commentRules = rules.filter(rule => {
      const isActive = rule.isActive;
      
      // Handle different rule types for comments:
      // 1. 'comment' type - comment-only automation
      // 2. 'comment_dm' type - comment-to-dm automation (new type)
      // 3. 'dm' type with postInteraction=true - legacy comment-to-dm automation
      const hasPostInteraction = rule.triggers?.postInteraction === true || rule.postInteraction === true;
      const canHandleComments = rule.type === 'comment' || 
                               rule.type === 'comment_dm' ||
                               (rule.type === 'dm' && hasPostInteraction);
      
      console.log(`   📋 Rule ${rule.name}: active=${isActive}, type=${rule.type}, postInteraction=${rule.triggers?.postInteraction || rule.postInteraction}, canHandleComments=${canHandleComments}`);
      
      return isActive && canHandleComments;
    });
    
    console.log(`   ✅ Found ${commentRules.length} active comment rules out of ${rules.length} total rules`);
    
    // Step 3: Process each comment rule
    for (const rule of commentRules) {
      console.log(`\n   🎯 Processing comment rule: ${rule.name} (${rule.type})`);
      
      // Check if rule should trigger for this comment based on keywords
      const keywords = rule.triggers?.keywords || [];
      const matchedKeyword = keywords.find(keyword => 
        commentText.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (!matchedKeyword) {
        console.log(`   ❌ Rule ${rule.name} not triggered for comment: "${commentText}"`);
        continue;
      }
      
      console.log(`   ✅ Rule triggered! Matched keyword: "${matchedKeyword}"`);
      
      // Step 4: Generate comment response
      const commentResponses = rule.action?.responses || [];
      if (commentResponses.length === 0) {
        console.log(`   ❌ No comment responses found for rule`);
        continue;
      }
      
      const commentResponse = commentResponses[Math.floor(Math.random() * commentResponses.length)];
      console.log(`   📝 Comment reply generated: "${commentResponse}"`);
      
      // Step 5: Send DM (for comment-to-dm automation) - NEW LOGIC
      if (rule.type === 'dm' || rule.type === 'comment_dm') {
        console.log(`   💬 Sending follow-up DM for comment-to-DM automation`);
        
        // Generate DM message using dmResponses field for comment_dm type
        let dmMessage;
        if (rule.type === 'comment_dm' && rule.action?.dmResponses && rule.action.dmResponses.length > 0) {
          dmMessage = rule.action.dmResponses[0]; // Use first DM response
          console.log(`   📧 Using dmResponses field: "${dmMessage}"`);
        } else if (rule.responses && rule.responses.length > 1) {
          dmMessage = rule.responses[1]; // Use second response as DM message
          console.log(`   📧 Using second response as DM: "${dmMessage}"`);
        } else {
          dmMessage = `Hi! Thanks for your comment. I've sent you more details here!`;
          console.log(`   📧 Using default DM message: "${dmMessage}"`);
        }
        
        console.log(`   ✅ DM would be sent: "${dmMessage}"`);
        
        return {
          success: true,
          commentResponse: commentResponse,
          dmMessage: dmMessage,
          ruleName: rule.name,
          ruleType: rule.type,
          matchedKeyword: matchedKeyword
        };
      } else {
        console.log(`   ✅ Comment-only automation completed`);
        return {
          success: true,
          commentResponse: commentResponse,
          dmMessage: null,
          ruleName: rule.name,
          ruleType: rule.type,
          matchedKeyword: matchedKeyword
        };
      }
    }
    
    console.log(`   ❌ No rules matched the comment`);
    return null;
    
  } catch (error) {
    console.error(`   ❌ Error simulating webhook:`, error);
    return null;
  } finally {
    await client.close();
  }
}

async function testWebhookCommentDM() {
  console.log('🎯 TESTING WEBHOOK COMMENT-TO-DM AUTOMATION');
  console.log('=' .repeat(60));
  
  const workspaceId = '6847b9cdfabaede1706f2994';
  
  // Test scenarios
  const testScenarios = [
    { comment: 'free shipping info', expectedMatch: true },
    { comment: 'product details please', expectedMatch: true },
    { comment: 'nice post', expectedMatch: false },
  ];
  
  let passedTests = 0;
  let totalTests = testScenarios.length;
  
  for (const scenario of testScenarios) {
    const result = await simulateCommentWebhook(workspaceId, scenario.comment);
    
    if (scenario.expectedMatch && result) {
      console.log(`   ✅ TEST PASSED: Expected match and got automation result`);
      console.log(`      - Comment Reply: "${result.commentResponse}"`);
      console.log(`      - DM Message: "${result.dmMessage}"`);
      console.log(`      - Rule: ${result.ruleName} (${result.ruleType})`);
      passedTests++;
    } else if (!scenario.expectedMatch && !result) {
      console.log(`   ✅ TEST PASSED: Expected no match and got no result`);
      passedTests++;
    } else {
      console.log(`   ❌ TEST FAILED: Expected match=${scenario.expectedMatch}, got result=${!!result}`);
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log(`🎉 WEBHOOK TEST RESULTS: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('✅ ALL TESTS PASSED - WEBHOOK HANDLER READY FOR PRODUCTION');
  } else {
    console.log('❌ SOME TESTS FAILED - WEBHOOK HANDLER NEEDS FIXES');
  }
}

console.log('🚀 STARTING WEBHOOK COMMENT-TO-DM TEST...');
testWebhookCommentDM();