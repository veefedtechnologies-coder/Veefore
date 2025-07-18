import axios from 'axios';
import { MongoClient } from 'mongodb';

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const baseURL = 'http://localhost:5000';

async function testCommentToDMWebhook() {
  console.log('[TEST] Testing Comment-to-DM webhook automation...');
  
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
    
    const workspace = await db.collection('workspaces').findOne({ ownerId: user._id });
    if (!workspace) {
      console.error('[TEST] Workspace not found');
      return;
    }
    
    console.log(`[TEST] Using workspace: ${workspace._id}`);
    
    // Get automation rules to verify they exist
    const rules = await db.collection('automationRules').find({ workspaceId: workspace._id.toString() }).toArray();
    console.log(`[TEST] Found ${rules.length} automation rules`);
    
    rules.forEach(rule => {
      console.log(`[TEST] Rule: ${rule.name} (${rule.type}) - Active: ${rule.isActive}`);
      console.log(`[TEST] Keywords: ${JSON.stringify(rule.triggers?.keywords || [])}`);
    });
    
    // Test comment webhook payload
    const webhookPayload = {
      object: "instagram",
      entry: [{
        id: "17841400008460056", // Instagram page ID
        time: Date.now(),
        changes: [{
          field: "comments",
          value: {
            from: {
              id: "test_user_123",
              username: "test_customer"
            },
            post_id: "17856498618156045",
            comment_id: `test_comment_${Date.now()}`,
            created_time: Date.now(),
            text: "Amazing product! free me details please!" // Should match "free" keyword
          }
        }]
      }]
    };
    
    console.log('[TEST] Sending webhook payload...');
    console.log('[TEST] Comment text:', webhookPayload.entry[0].changes[0].value.text);
    
    // Send webhook to Instagram webhook endpoint
    const response = await axios.post(`${baseURL}/api/instagram/webhook`, webhookPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`[TEST] Webhook response status: ${response.status}`);
    console.log(`[TEST] Webhook response data:`, response.data);
    
    if (response.status === 200) {
      console.log('[TEST] ✅ Webhook processed successfully');
      console.log('[TEST] Comment-to-DM automation should have been triggered');
      console.log('[TEST] Expected behavior:');
      console.log('[TEST] 1. Reply to Instagram comment with AI-generated response');
      console.log('[TEST] 2. Send DM to commenter with additional information');
    } else {
      console.log('[TEST] ❌ Webhook processing failed');
    }
    
  } catch (error) {
    console.error('[TEST] Error during webhook test:', error.message);
    if (error.response) {
      console.error('[TEST] Response error:', error.response.data);
    }
  } finally {
    await client.close();
  }
}

// Run the test
testCommentToDMWebhook().catch(console.error);