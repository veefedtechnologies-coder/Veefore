const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const baseURL = 'http://localhost:5000';

async function createCommentToDMRule() {
  console.log('[TEST] Creating comment-to-DM automation rule...');
  
  const client = new MongoClient(DATABASE_URL);
  await client.connect();
  const db = client.db('veeforedb');
  
  try {
    // Get user's workspace ID 
    const user = await db.collection('users').findOne({ email: 'arpit9996363@gmail.com' });
    if (!user) {
      console.error('[TEST] User not found');
      return;
    }
    
    console.log(`[TEST] User found: ${user._id}`);
    
    // Use the workspace ID from the logs
    const workspaceId = '6847b9cdfabaede1706f2994';
    console.log(`[TEST] Using workspace: ${workspaceId}`);
    
    // Create a comment-to-DM automation rule directly in database
    const commentToDMRule = {
      name: 'Comment to DM Test Automation',
      workspaceId: workspaceId,
      type: 'dm',
      triggers: {
        aiMode: 'contextual',
        keywords: ['free', 'info', 'details', 'product'],
        hashtags: [],
        mentions: false,
        newFollowers: false,
        postInteraction: true // This is key - indicates it handles comment interactions
      },
      responses: [
        'Thanks for your comment! Check your DMs 📩',
        'Hi there! I\'ve sent you more details in your DMs 💫'
      ],
      aiPersonality: 'friendly',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('automationRules').insertOne(commentToDMRule);
    console.log(`[TEST] Created comment-to-DM rule: ${result.insertedId}`);
    
    // Verify the rule was created
    const createdRule = await db.collection('automationRules').findOne({ _id: result.insertedId });
    console.log(`[TEST] Verification - Rule created:`, {
      name: createdRule.name,
      type: createdRule.type,
      postInteraction: createdRule.triggers.postInteraction,
      keywords: createdRule.triggers.keywords,
      active: createdRule.isActive
    });
    
    console.log('[TEST] ✅ Comment-to-DM automation rule created successfully');
    
  } catch (error) {
    console.error('[TEST] Error creating automation rule:', error);
  } finally {
    await client.close();
  }
}

// Run the test
createCommentToDMRule().catch(console.error);