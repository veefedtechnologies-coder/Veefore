const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = "mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "veeforedb";

// Test scenarios
const testScenarios = [
  {
    name: "Test 1: 'free' keyword",
    commentText: "free",
    expectedMatch: true,
    expectedCommentReply: "Message sent!",
    expectedDMResponse: "ihihi"
  },
  {
    name: "Test 2: 'info' keyword",
    commentText: "info",
    expectedMatch: true,
    expectedCommentReply: "Found it? 😊",
    expectedDMResponse: "ihihi"
  },
  {
    name: "Test 3: 'details' keyword",
    commentText: "details",
    expectedMatch: true,
    expectedCommentReply: "Sent just now! ⏰",
    expectedDMResponse: "ihihi"
  },
  {
    name: "Test 4: 'product' keyword",
    commentText: "product",
    expectedMatch: true,
    expectedCommentReply: "Message sent!",
    expectedDMResponse: "ihihi"
  },
  {
    name: "Test 5: Non-matching keyword",
    commentText: "hello",
    expectedMatch: false,
    expectedCommentReply: null,
    expectedDMResponse: null
  }
];

// Simple automation logic test
function testAutomationLogic(rule, commentText) {
  console.log(`\n🧪 Testing comment: "${commentText}"`);
  
  // Check if any keyword matches
  const keywords = rule.triggers.keywords;
  const matchedKeyword = keywords.find(keyword => 
    commentText.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (matchedKeyword) {
    console.log(`✅ Keyword matched: "${matchedKeyword}"`);
    
    // Get responses
    const commentReplies = rule.action.responses;
    const dmResponses = rule.action.dmResponses;
    
    // Select a response (using simple index rotation)
    const commentReply = commentReplies[Math.floor(Math.random() * commentReplies.length)];
    const dmResponse = dmResponses[0]; // Always use first DM response
    
    console.log(`📝 Comment reply: "${commentReply}"`);
    console.log(`💬 DM response: "${dmResponse}"`);
    
    return {
      matched: true,
      commentReply,
      dmResponse
    };
  } else {
    console.log(`❌ No keyword matched`);
    return {
      matched: false,
      commentReply: null,
      dmResponse: null
    };
  }
}

async function testAutomationRule() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection('AutomationRule');
    
    // Get the rule we just created
    const rule = await collection.findOne({
      workspaceId: '6847b9cdfabaede1706f2994',
      name: 'Working Comment to DM Automation'
    });
    
    if (!rule) {
      console.log('❌ Rule not found');
      return;
    }
    
    console.log('✅ Found automation rule:', rule.name);
    console.log('📋 Rule configuration:');
    console.log('   - Keywords:', rule.triggers.keywords);
    console.log('   - Comment replies:', rule.action.responses);
    console.log('   - DM responses:', rule.action.dmResponses);
    console.log('   - Active:', rule.isActive);
    
    // Test all scenarios
    console.log('\n🔍 TESTING AUTOMATION SCENARIOS:');
    console.log('='.repeat(50));
    
    testScenarios.forEach(scenario => {
      console.log(`\n📋 ${scenario.name}`);
      const result = testAutomationLogic(rule, scenario.commentText);
      
      if (result.matched === scenario.expectedMatch) {
        console.log(`✅ Match expectation: PASSED`);
      } else {
        console.log(`❌ Match expectation: FAILED`);
      }
      
      if (result.matched && result.dmResponse === scenario.expectedDMResponse) {
        console.log(`✅ DM response: PASSED`);
      } else if (!result.matched && !scenario.expectedDMResponse) {
        console.log(`✅ DM response: PASSED (no response expected)`);
      } else {
        console.log(`❌ DM response: FAILED`);
      }
    });
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 AUTOMATION RULE TESTING COMPLETE');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

console.log('🧪 TESTING AUTOMATION RULE...');
testAutomationRule();