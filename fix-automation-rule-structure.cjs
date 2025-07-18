const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = "mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "veeforedb";

async function fixAutomationRuleStructure() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection('AutomationRule');
    
    // Find the latest rule with your configured responses
    const latestRule = await collection.findOne(
      { 
        'action.responses': { $in: ['Message sent!', 'ihihi'] }
      },
      { sort: { createdAt: -1 } }
    );
    
    if (!latestRule) {
      console.log('❌ No "Comment to DM Automation" rule found');
      return;
    }
    
    console.log('📋 Found rule:', latestRule.name);
    console.log('📋 Current responses:', latestRule.action?.responses);
    
    // Update the rule structure to match the expected format
    const updatedRule = {
      ...latestRule,
      type: 'comment_dm', // Set proper type for comment-to-DM
      triggers: {
        keywords: ['free', 'info', 'details', 'product'], // Add keywords from your test
        aiMode: 'keyword',
        postInteraction: true
      },
      action: {
        ...latestRule.action,
        type: 'dm', // This should remain 'dm' for comment-to-DM automation
        responses: [
          'Message sent!',
          'Found it? 😊', 
          'Sent just now! ⏰'
        ], // Comment replies
        dmResponses: [
          'ihihi' // DM message
        ], // DM responses
        aiPersonality: 'friendly',
        responseLength: 'medium'
      }
    };
    
    // Update the rule
    const result = await collection.replaceOne(
      { _id: latestRule._id },
      updatedRule
    );
    
    console.log('✅ Rule updated successfully');
    console.log('📋 Updated structure:');
    console.log('   - Type:', updatedRule.type);
    console.log('   - Keywords:', updatedRule.triggers.keywords);
    console.log('   - Comment replies:', updatedRule.action.responses);
    console.log('   - DM responses:', updatedRule.action.dmResponses);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

console.log('🔧 FIXING AUTOMATION RULE STRUCTURE...');
fixAutomationRuleStructure();