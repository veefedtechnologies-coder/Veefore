const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = "mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "veeforedb";

async function debugRuleStructure() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection('AutomationRule');
    
    // Find the rule we created
    const rule = await collection.findOne({
      workspaceId: '6847b9cdfabaede1706f2994',
      name: 'Working Comment to DM Automation'
    });
    
    if (!rule) {
      console.log('❌ Rule not found');
      return;
    }
    
    console.log('✅ Found rule:', rule.name);
    console.log('📋 Full rule structure:');
    console.log(JSON.stringify(rule, null, 2));
    
    // Check the specific fields that might be causing issues
    console.log('\n🔍 DETAILED FIELD ANALYSIS:');
    console.log('- Rule ID:', rule._id);
    console.log('- Workspace ID:', rule.workspaceId);
    console.log('- Type:', rule.type);
    console.log('- Is Active:', rule.isActive);
    console.log('- Triggers:', rule.triggers);
    console.log('- Action:', rule.action);
    console.log('- Comment Responses:', rule.action?.responses);
    console.log('- DM Responses:', rule.action?.dmResponses);
    
    // Check if responses exist and are properly structured
    if (rule.action?.responses && rule.action.responses.length > 0) {
      console.log('✅ Comment responses found:', rule.action.responses.length);
    } else {
      console.log('❌ No comment responses found');
    }
    
    if (rule.action?.dmResponses && rule.action.dmResponses.length > 0) {
      console.log('✅ DM responses found:', rule.action.dmResponses.length);
    } else {
      console.log('❌ No DM responses found');
    }
    
    console.log('\n🔧 WEBHOOK PROCESSING SIMULATION:');
    const testComment = "free";
    const keywords = rule.triggers?.keywords || [];
    const matchedKeyword = keywords.find(keyword => 
      testComment.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (matchedKeyword) {
      console.log('✅ Keyword match found:', matchedKeyword);
      const responses = rule.action?.responses || [];
      const dmResponses = rule.action?.dmResponses || [];
      
      console.log('📝 Available comment responses:', responses);
      console.log('💬 Available DM responses:', dmResponses);
      
      if (responses.length > 0 && dmResponses.length > 0) {
        console.log('✅ Rule should work - all required fields present');
      } else {
        console.log('❌ Rule missing required responses');
      }
    } else {
      console.log('❌ No keyword match for test comment');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

console.log('🔍 DEBUGGING RULE STRUCTURE...');
debugRuleStructure();