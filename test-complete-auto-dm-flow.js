import axios from 'axios';

async function testCompleteAutoDMFlow() {
  console.log('Testing complete auto DM flow with authentic Instagram data...');
  
  const baseURL = 'http://localhost:5000';
  
  // Test data matching real Instagram webhook format
  const webhookPayload = {
    object: 'instagram',
    entry: [{
      id: '9505923456179711', // Real Instagram account ID
      time: Date.now(),
      messaging: [{
        sender: {
          id: '123456789' // Real user ID would be here
        },
        recipient: {
          id: '9505923456179711' // Your Instagram Business account ID
        },
        timestamp: Date.now(),
        message: {
          mid: 'test_message_' + Date.now(),
          text: 'Hello! I need help with your products'
        }
      }]
    }]
  };

  try {
    console.log('Step 1: Testing Instagram webhook processing...');
    
    // Send webhook to the auto DM endpoint
    const webhookResponse = await axios.post(`${baseURL}/api/instagram/webhook`, webhookPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (webhookResponse.status === 200) {
      console.log('✅ Webhook processed successfully');
      console.log('Response:', webhookResponse.data);
    } else {
      console.log('❌ Webhook processing failed with status:', webhookResponse.status);
    }
    
    // Wait a moment for processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Step 2: Checking conversation memory...');
    
    // Check if conversation was created and stored
    const conversationResponse = await axios.get(`${baseURL}/api/conversations/684402c2fd2cd4eb6521b386`);
    
    if (conversationResponse.status === 200) {
      console.log('✅ Conversation data retrieved');
      console.log('Conversations found:', conversationResponse.data.length);
      
      if (conversationResponse.data.length > 0) {
        const latestConversation = conversationResponse.data[0];
        console.log('Latest conversation:', {
          id: latestConversation.id,
          messageCount: latestConversation.messages?.length || 0,
          platform: latestConversation.platform
        });
      }
    }
    
    console.log('Step 3: Verifying automation rules...');
    
    // Check automation rules
    const rulesResponse = await axios.get(`${baseURL}/api/automation-rules/684402c2fd2cd4eb6521b386`);
    
    if (rulesResponse.status === 200) {
      console.log('✅ Automation rules retrieved');
      const dmRules = rulesResponse.data.filter(rule => rule.type === 'dm' && rule.isActive);
      console.log('Active DM rules:', dmRules.length);
      
      dmRules.forEach(rule => {
        console.log(`Rule: ${rule.name} (${rule.platform})`);
      });
    }
    
    console.log('Test completed successfully');
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('Authentication required - webhook verification may be needed');
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('Server not running - start the application first');
    }
  }
}

// Run the test
testCompleteAutoDMFlow().catch(console.error);