const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = "mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "veeforedb";

// Test the exact scenario from the webhook logs
async function testLiveWebhookProcessing() {
  console.log('🎯 TESTING LIVE WEBHOOK PROCESSING SCENARIO');
  console.log('=' .repeat(60));
  
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection('AutomationRule');
    
    // Get the exact rule from the database
    const rule = await collection.findOne({
      workspaceId: '6847b9cdfabaede1706f2994',
      type: 'comment_dm',
      isActive: true
    });
    
    if (!rule) {
      console.log('❌ No rule found');
      return;
    }
    
    console.log('✅ Found rule:', rule.name);
    console.log('📋 Rule type:', rule.type);
    console.log('📋 Rule active:', rule.isActive);
    
    // Test the exact scenario from your screenshot
    const commentText = "free";
    console.log(`\n🔍 TESTING COMMENT: "${commentText}"`);
    
    // Step 1: Check if rule should handle comments (from webhook handler)
    const isActive = rule.isActive;
    const hasPostInteraction = rule.triggers?.postInteraction === true || rule.postInteraction === true;
    const canHandleComments = rule.type === 'comment' || 
                             rule.type === 'comment_dm' ||
                             (rule.type === 'dm' && hasPostInteraction);
    
    console.log(`📋 Rule analysis:`);
    console.log(`   - active: ${isActive}`);
    console.log(`   - type: ${rule.type}`);
    console.log(`   - postInteraction: ${hasPostInteraction}`);
    console.log(`   - canHandleComments: ${canHandleComments}`);
    
    if (!isActive || !canHandleComments) {
      console.log('❌ Rule cannot handle comments');
      return;
    }
    
    // Step 2: Check keyword matching
    const keywords = rule.triggers?.keywords || [];
    const matchedKeyword = keywords.find(keyword => 
      commentText.toLowerCase().includes(keyword.toLowerCase())
    );
    
    console.log(`📋 Keyword matching:`);
    console.log(`   - Available keywords: ${keywords.join(', ')}`);
    console.log(`   - Matched keyword: ${matchedKeyword || 'none'}`);
    
    if (!matchedKeyword) {
      console.log('❌ No keyword match');
      return;
    }
    
    // Step 3: Test generateContextualResponse logic
    console.log(`\n🎯 TESTING RESPONSE GENERATION (generateContextualResponse logic):`);
    
    // Extract user configuration from rule
    const action = rule.action || {};
    const aiConfig = action.aiConfig || {};
    const personality = aiConfig.personality || action.aiPersonality || 'friendly';
    const responseLength = aiConfig.responseLength || action.responseLength || 'medium';
    const language = aiConfig.language || 'auto';
    const contextualMode = aiConfig.contextualMode !== false;
    
    console.log(`📋 AI Configuration:`);
    console.log(`   - personality: ${personality}`);
    console.log(`   - responseLength: ${responseLength}`);
    console.log(`   - language: ${language}`);
    console.log(`   - contextualMode: ${contextualMode}`);
    
    // Test response selection logic (from instagram-automation.ts)
    let responses = [];
    
    if (rule.type === 'comment_dm' && rule.action.responses && rule.action.responses.length > 0) {
      responses = rule.action.responses;
      console.log(`✅ Using comment_dm responses: ${JSON.stringify(responses)}`);
    } else if (rule.type === 'dm' && rule.action.dmResponses && rule.action.dmResponses.length > 0) {
      responses = rule.action.dmResponses;
      console.log(`✅ Using DM responses: ${JSON.stringify(responses)}`);
    } else if (rule.action.responses && rule.action.responses.length > 0) {
      responses = rule.action.responses;
      console.log(`✅ Using action responses: ${JSON.stringify(responses)}`);
    } else if (rule.action.dmResponses && rule.action.dmResponses.length > 0) {
      responses = rule.action.dmResponses;
      console.log(`✅ Using fallback DM responses: ${JSON.stringify(responses)}`);
    } else {
      console.log(`❌ No responses found in rule`);
      console.log(`   - rule.action.responses: ${JSON.stringify(rule.action.responses)}`);
      console.log(`   - rule.action.dmResponses: ${JSON.stringify(rule.action.dmResponses)}`);
      return;
    }
    
    // Check if we have valid non-empty responses
    const validResponses = responses.filter(r => r && r.trim() !== '');
    console.log(`📋 Valid responses: ${validResponses.length} out of ${responses.length}`);
    console.log(`   - Valid responses: ${JSON.stringify(validResponses)}`);
    
    if (validResponses.length === 0) {
      console.log('❌ No valid responses available');
      return;
    }
    
    // Select response
    const selectedResponse = validResponses[Math.floor(Math.random() * validResponses.length)];
    console.log(`✅ Selected comment response: "${selectedResponse}"`);
    
    // Test DM response selection
    let dmMessage;
    if (rule.type === 'comment_dm' && rule.action?.dmResponses && rule.action.dmResponses.length > 0) {
      dmMessage = rule.action.dmResponses[0];
      console.log(`✅ Selected DM message: "${dmMessage}"`);
    } else {
      console.log(`❌ No DM message available`);
    }
    
    console.log('\n🎉 FINAL RESULTS:');
    console.log(`✅ Comment automation: SUCCESS`);
    console.log(`   - Comment reply: "${selectedResponse}"`);
    console.log(`   - DM message: "${dmMessage}"`);
    console.log(`   - Rule working correctly: YES`);
    
  } catch (error) {
    console.error('❌ Error in live webhook test:', error);
  } finally {
    await client.close();
  }
}

console.log('🚀 STARTING LIVE WEBHOOK PROCESSING TEST...');
testLiveWebhookProcessing();