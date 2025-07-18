const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = "mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "veeforedb";

async function createWorkingAutomationRule() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection('AutomationRule');
    
    // Create the correct automation rule for your workspace
    const newRule = {
      name: 'Working Comment to DM Automation',
      workspaceId: '6847b9cdfabaede1706f2994', // Your current workspace
      description: 'Comment-to-DM automation with predefined responses',
      type: 'comment_dm',
      isActive: true,
      triggers: {
        keywords: ['free', 'info', 'details', 'product'],
        aiMode: 'keyword',
        postInteraction: true
      },
      action: {
        type: 'dm', // For comment-to-DM automation
        responses: ['Message sent!', 'Found it? 😊', 'Sent just now! ⏰'], // Comment replies
        dmResponses: ['ihihi'], // DM message
        aiPersonality: 'friendly',
        responseLength: 'medium',
        aiConfig: {
          personality: 'friendly',
          responseLength: 'medium',
          dailyLimit: 17,
          responseDelay: 0.5,
          language: 'auto',
          contextualMode: false // Use predefined responses only
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newRule);
    console.log('✅ Created new automation rule');
    console.log('📋 Rule ID:', result.insertedId);
    console.log('📋 Rule structure:');
    console.log('   - Workspace:', newRule.workspaceId);
    console.log('   - Type:', newRule.type);
    console.log('   - Keywords:', newRule.triggers.keywords);
    console.log('   - Comment replies:', newRule.action.responses);
    console.log('   - DM responses:', newRule.action.dmResponses);
    console.log('   - Active:', newRule.isActive);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

console.log('🔧 CREATING WORKING AUTOMATION RULE...');
createWorkingAutomationRule();