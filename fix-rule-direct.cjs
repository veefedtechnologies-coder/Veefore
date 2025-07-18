const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = "mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "veeforedb";

async function fixRuleDirect() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection('AutomationRule');
    
    // Get the rule ID from the debug output - the one with "ihihi" response
    const ruleId = new ObjectId('687a417dddfdd9efa5793524');
    
    // Update the rule directly with the correct structure
    const updateResult = await collection.updateOne(
      { _id: ruleId },
      {
        $set: {
          type: 'comment_dm',
          triggers: {
            keywords: ['free', 'info', 'details', 'product'],
            aiMode: 'keyword',
            postInteraction: true
          },
          'action.dmResponses': ['ihihi'], // Move the DM response to correct field
          'action.responses': ['Message sent!', 'Found it? 😊', 'Sent just now! ⏰'] // Keep comment replies
        }
      }
    );
    
    console.log('✅ Rule updated successfully');
    console.log('📋 Update result:', updateResult);
    
    // Verify the update
    const updatedRule = await collection.findOne({ _id: ruleId });
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

console.log('🔧 FIXING RULE DIRECTLY...');
fixRuleDirect();