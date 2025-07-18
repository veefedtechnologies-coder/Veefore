// Test the webhook directly through the actual endpoint
import fetch from 'node-fetch';

async function testWebhookWithRule() {
  console.log('=== TESTING NEW WEBHOOK PROCESSOR WITH SAVED RULE ===');
  
  const processor = new NewWebhookProcessor();
  
  // Simulate Instagram comment webhook for workspace with saved rule
  const webhookData = {
    entry: [{
      messaging: [{
        sender: { id: '12345' },
        recipient: { id: '17841474747481653' },
        timestamp: Date.now(),
        message: {
          text: 'free shipping available?'  // Contains keyword "free"
        }
      }]
    }],
    object: 'instagram'
  };
  
  // Test workspace that has the saved automation rule
  const workspaceId = '6847b9cdfabaede1706f2994';
  
  console.log('Testing webhook with comment containing "free" keyword...');
  console.log('Expected: Should use saved rule responses instead of hardcoded ones');
  
  try {
    const result = await processor.processWebhook(webhookData, workspaceId);
    
    console.log('\n=== WEBHOOK PROCESSING RESULT ===');
    console.log('Result:', result);
    console.log('✅ Webhook processing completed successfully');
    
  } catch (error) {
    console.error('❌ Webhook processing failed:', error.message);
  }
}

testWebhookWithRule();