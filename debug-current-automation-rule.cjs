const { MongoClient } = require('mongodb');

async function debugAutomationRule() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    const rulesCollection = db.collection('automationrules');
    
    // Find the current rule for the workspace
    const currentRule = await rulesCollection.findOne({ 
      workspaceId: '684402c2fd2cd4eb6521b386' 
    });
    
    console.log('Current automation rule:', JSON.stringify(currentRule, null, 2));
    
    if (currentRule) {
      console.log('Current commentReplies:', currentRule.commentReplies);
      console.log('Current dmResponses:', currentRule.dmResponses);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugAutomationRule();