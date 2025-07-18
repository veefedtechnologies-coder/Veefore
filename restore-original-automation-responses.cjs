const { MongoClient } = require('mongodb');

async function restoreOriginalResponses() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    const rulesCollection = db.collection('automationrules');
    
    // Get the current rule to see what you originally configured
    const currentRule = await rulesCollection.findOne({ 
      workspaceId: '684402c2fd2cd4eb6521b386' 
    });
    
    console.log('Current rule found:', currentRule ? 'Yes' : 'No');
    
    // Let's look at what the original responses should be
    // Based on your UI showing "3 comment + 1 DM", let's check the original data
    console.log('Current commentReplies count:', currentRule.commentReplies?.length || 0);
    console.log('Current dmResponses count:', currentRule.dmResponses?.length || 0);
    
    // Let's restore with the original responses you configured
    // Can you tell me what your original responses were?
    console.log('Please tell me what your original comment and DM responses were so I can restore them');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

restoreOriginalResponses();