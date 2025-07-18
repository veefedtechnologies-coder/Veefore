const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const baseURL = 'http://localhost:5000';

async function testCommentToDMWithCorrectWorkspace() {
  const client = new MongoClient(DATABASE_URL);
  await client.connect();
  const db = client.db('veeforedb');
  
  try {
    console.log('[TEST] Testing comment-to-DM with correct workspace targeting...');
    
    // First, create a fresh comment-to-DM rule in the workspace with most rules
    const workspaceId = '684402c2fd2cd4eb6521b386'; // This workspace has more rules
    
    // Clean up any old rules first
    await db.collection('automationrules').deleteMany({
      workspaceId: workspaceId,
      type: 'dm',
      postInteraction: true
    });
    
    console.log('[TEST] Cleaned up old rules');
    
    // Create the rule
    const commentToDMRule = {
      name: 'Comment to DM Test - Correct Workspace',
      workspaceId: workspaceId,
      type: 'dm',
      postInteraction: true,
      isActive: true,
      keywords: ['free', 'info', 'details', 'product'],
      responses: ['Hi! I\'ll send you the details in a direct message.'],
      action: {
        type: 'dm',
        responses: ['Thank you for your interest! Here are the details you requested about our product.'],
        dmResponses: ['Thank you for your interest! Here are the details you requested about our product.'],
        aiPersonality: 'helpful',
        responseLength: 'medium'
      },
      platform: 'instagram',
      triggers: {
        keywords: ['free', 'info', 'details', 'product'],
        aiMode: 'keyword'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('automationrules').insertOne(commentToDMRule);
    console.log(`[TEST] Created rule: ${result.insertedId}`);
    
    // Verify the rule was created
    const rule = await db.collection('automationrules').findOne({
      workspaceId: workspaceId,
      type: 'dm',
      postInteraction: true
    });
    
    if (!rule) {
      console.error('[TEST] Rule creation failed');
      return;
    }
    
    console.log(`[TEST] Rule verified: ${rule.name}`);
    
    // Get the account for this workspace
    const account = await db.collection('socialaccounts').findOne({ 
      workspaceId: workspaceId,
      platform: 'instagram' 
    });
    
    if (!account) {
      console.error('[TEST] No Instagram account found in target workspace');
      return;
    }
    
    console.log(`[TEST] Target account: ${account.username} (${account.accountId}) in workspace ${account.workspaceId}`);
    
    // Check how many accounts have this same accountId
    const duplicateAccounts = await db.collection('socialaccounts').find({
      accountId: account.accountId,
      platform: 'instagram'
    }).toArray();
    
    console.log(`[TEST] Found ${duplicateAccounts.length} accounts with same accountId:`);
    duplicateAccounts.forEach(acc => {
      console.log(`  - ${acc.username} in workspace ${acc.workspaceId}`);
    });
    
    // Now send the webhook
    const webhookPayload = {
      object: 'instagram',
      entry: [{
        id: account.accountId,
        time: Date.now(),
        changes: [{
          field: 'comments',
          value: {
            from: {
              id: 'test_user_correct_workspace',
              username: 'test_user_correct_workspace'
            },
            post_id: '17856498618156045',
            comment_id: `correct_workspace_test_${Date.now()}`,
            created_time: Date.now(),
            text: 'Can you send me free info about this product?'
          }
        }]
      }]
    };
    
    console.log('[TEST] Sending webhook to test comment-to-DM...');
    
    const response = await fetch(`${baseURL}/api/instagram/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });
    
    const result2 = await response.text();
    console.log(`[TEST] Webhook response: ${result2}`);
    
    if (response.ok) {
      console.log('[TEST] ✅ Webhook sent successfully');
      console.log('[TEST] Check the server logs to see if it selected the correct workspace');
    } else {
      console.error('[TEST] ❌ Webhook failed:', response.status, result2);
    }
    
  } catch (error) {
    console.error('[TEST] Error:', error);
  } finally {
    await client.close();
  }
}

testCommentToDMWithCorrectWorkspace().catch(console.error);