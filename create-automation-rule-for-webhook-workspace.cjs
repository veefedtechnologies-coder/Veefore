const { MongoClient } = require('mongodb');

async function createAutomationRule() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    const rulesCollection = db.collection('automationrules');
    
    // Create a new automation rule for the workspace that has the rahulc1020 account
    const newRule = {
      workspaceId: '684402c2fd2cd4eb6521b386',  // Workspace that has rahulc1020 account
      socialAccountId: '6856d6ac9fdcbe6ea5e3c8b7',  // The rahulc1020 account ID
      type: 'comment_dm',
      platform: 'instagram',
      isActive: true,
      keywords: ['free', 'info', 'details', 'product'],
      targetMediaIds: [],  // Apply to all posts
      commentReplies: ['Thank you for your interest! Please check your DMs for more details.'],
      dmResponses: ['Thank you for your interest! Here are the details you requested about our product.'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await rulesCollection.insertOne(newRule);
    console.log('Created automation rule:', result.insertedId);
    
    // Verify the rule was created
    const createdRule = await rulesCollection.findOne({ _id: result.insertedId });
    console.log('Created rule details:', createdRule);
    
  } catch (error) {
    console.error('Error creating automation rule:', error);
  } finally {
    await client.close();
  }
}

createAutomationRule();