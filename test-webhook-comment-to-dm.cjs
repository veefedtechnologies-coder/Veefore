const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const baseURL = 'http://localhost:5000';

async function testWebhookCommentToDM() {
  const client = new MongoClient(DATABASE_URL);
  await client.connect();
  const db = client.db('veeforedb');
  
  try {
    console.log('[TEST] Testing webhook comment-to-DM automation...');
    
    // Get the correct account ID for workspace 6847b9cdfabaede1706f2994
    const account = await db.collection('socialaccounts').findOne({ 
      workspaceId: '6847b9cdfabaede1706f2994',
      platform: 'instagram' 
    });
    
    if (!account) {
      console.error('[TEST] No Instagram account found in workspace 6847b9cdfabaede1706f2994');
      return;
    }
    
    console.log(`[TEST] Found account: ${account.username} (${account.accountId})`);
    
    // Check if automation rule exists
    const rule = await db.collection('automationrules').findOne({
      workspaceId: '6847b9cdfabaede1706f2994',
      type: 'dm',
      postInteraction: true
    });
    
    if (!rule) {
      console.error('[TEST] No comment-to-DM automation rule found');
      return;
    }
    
    console.log(`[TEST] Found comment-to-DM rule: ${rule.name}`);
    console.log(`[TEST] Rule keywords: ${JSON.stringify(rule.keywords)}`);
    
    // Send webhook test with correct account ID
    const webhookPayload = {
      object: 'instagram',
      entry: [{
        id: account.accountId, // Use the correct account ID
        time: Date.now(),
        changes: [{
          field: 'comments',
          value: {
            from: {
              id: 'test_user_dm_123',
              username: 'test_user_dm'
            },
            post_id: '17856498618156045',
            comment_id: `test_comment_dm_${Date.now()}`,
            created_time: Date.now(),
            text: 'Can you send me free details about this product?'
          }
        }]
      }]
    };
    
    console.log('[TEST] Sending webhook with account ID:', account.accountId);
    
    const response = await fetch(`${baseURL}/api/instagram/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });
    
    const result = await response.text();
    console.log('[TEST] Webhook response:', result);
    
    if (response.ok) {
      console.log('[TEST] ✅ Webhook sent successfully');
    } else {
      console.error('[TEST] ❌ Webhook failed:', response.status, result);
    }
    
  } catch (error) {
    console.error('[TEST] Error:', error);
  } finally {
    await client.close();
  }
}

testWebhookCommentToDM().catch(console.error);