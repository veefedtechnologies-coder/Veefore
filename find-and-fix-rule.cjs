const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = "mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "veeforedb";

async function findAndFixRule() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection('AutomationRule');
    
    // Find rule with 'ihihi' in responses and workspace 6847b9cdfabaede1706f2994
    const rule = await collection.findOne({
      workspaceId: '6847b9cdfabaede1706f2994',
      'action.responses': 'ihihi'
    });
    
    if (!rule) {
      console.log('❌ Rule not found. Let me find all rules for this workspace...');
      const allRules = await collection.find({
        workspaceId: '6847b9cdfabaede1706f2994'
      }).toArray();
      
      console.log(`Found ${allRules.length} rules for workspace 6847b9cdfabaede1706f2994:`);
      allRules.forEach((rule, index) => {
        console.log(`${index + 1}. ${rule.name} - responses: ${JSON.stringify(rule.action?.responses)}`);
      });
      
      return;
    }
    
    console.log('✅ Found rule:', rule.name);
    console.log('📋 Current responses:', rule.action?.responses);
    
    // Update the rule with correct structure
    const updateResult = await collection.updateOne(
      { _id: rule._id },
      {
        $set: {
          type: 'comment_dm',
          triggers: {
            keywords: ['free', 'info', 'details', 'product'],
            aiMode: 'keyword',
            postInteraction: true
          },
          'action.dmResponses': ['ihihi'], // DM message
          'action.responses': ['Message sent!', 'Found it? 😊', 'Sent just now! ⏰'] // Comment replies
        }
      }
    );
    
    console.log('✅ Rule updated successfully');
    console.log('📋 Update result:', updateResult);
    
    // Verify the update
    const updatedRule = await collection.findOne({ _id: rule._id });
    console.log('📋 Updated rule structure:');
    console.log('   - Type:', updatedRule.type);
    console.log('   - Keywords:', updatedRule.triggers?.keywords);
    console.log('   - Comment replies:', updatedRule.action?.responses);
    console.log('   - DM responses:', updatedRule.action?.dmResponses);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

console.log('🔧 FINDING AND FIXING RULE...');
findAndFixRule();