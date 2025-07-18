const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = "mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "veeforedb";

// Test webhook comment-to-DM automation
async function testWebhookCommentToDM() {
  console.log('🎯 TESTING WEBHOOK COMMENT-TO-DM AUTOMATION');
  console.log('=' .repeat(60));
  
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    // Send a test webhook request to the server
    const webhookPayload = {
      "object": "instagram",
      "entry": [
        {
          "id": "9505923456179711",
          "time": Math.floor(Date.now() / 1000),
          "changes": [
            {
              "value": {
                "from": {
                  "id": "test_user_123",
                  "username": "test_user"
                },
                "media": {
                  "id": "test_media_456",
                  "media_product_type": "POST"
                },
                "text": "free",
                "id": "test_comment_789"
              },
              "field": "comments"
            }
          ]
        }
      ]
    };
    
    console.log('📤 Sending webhook request...');
    
    // Send webhook to the server
    const response = await fetch('http://localhost:5000/webhook/instagram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': 'test-signature' // Skip signature verification for testing
      },
      body: JSON.stringify(webhookPayload)
    });
    
    console.log('📥 Webhook response status:', response.status);
    
    if (response.ok) {
      const result = await response.text();
      console.log('✅ Webhook processed successfully');
      console.log('Response:', result);
    } else {
      const error = await response.text();
      console.log('❌ Webhook failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Error testing webhook:', error);
  } finally {
    await client.close();
  }
}

console.log('🚀 STARTING WEBHOOK COMMENT-TO-DM TEST...');
testWebhookCommentToDM();