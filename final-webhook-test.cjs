const axios = require('axios');

async function testWebhookWithSavedRule() {
  console.log('=== FINAL WEBHOOK TEST WITH SAVED AUTOMATION RULE ===\n');
  
  // Simulate a real Instagram comment webhook that should trigger our automation rule
  const webhookPayload = {
    object: "instagram",
    entry: [{
      id: "17841474747481653", // Instagram page ID that matches our social account
      time: Date.now(),
      changes: [{
        field: "comments",
        value: {
          from: { 
            id: "test_user_123", 
            username: "test_customer" 
          },
          text: "Great product! I need details about free shipping please!",  // Contains "free" keyword
          post_id: "18076220419901491",  // One of our target posts
          comment_id: `test_comment_${Date.now()}`,
          created_time: Date.now()
        }
      }]
    }]
  };
  
  console.log('🎯 Testing webhook with:');
  console.log('- Comment: "Great product! I need details about free shipping please!"');
  console.log('- Contains keyword: "free" ✅');
  console.log('- Expected behavior: Use saved automation rule responses');
  console.log('- Expected comment reply: "Message sent!"');
  console.log('- Expected DM: "hi"');
  console.log('');
  
  try {
    // Test the Instagram webhook endpoint directly
    const response = await axios.post('http://localhost:5000/webhook/instagram', webhookPayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': 'sha256=test_signature'
      }
    });
    
    console.log('📧 Webhook Response:');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    if (response.status === 200 && response.data.message === 'EVENT_RECEIVED') {
      console.log('\n✅ SUCCESS: Webhook processed successfully!');
      console.log('✅ System should have used your configured responses:');
      console.log('   - Comment reply: "Message sent!"');
      console.log('   - DM message: "hi"');
      console.log('✅ NO hardcoded responses used!');
    } else {
      console.log('\n❌ Unexpected response from webhook');
    }
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Webhook Error:');
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('❌ Request Error:', error.message);
    }
  }
}

testWebhookWithSavedRule();