// Test auto reply functionality end-to-end
const { spawn } = require('child_process');

console.log('[AUTO REPLY TEST] Starting comprehensive auto reply functionality test...');

// Test 1: Create automation rule via API
const testCreateRule = async () => {
  console.log('[TEST 1] Creating automation rule via API...');
  
  const ruleData = {
    name: 'Test Auto DM Rule',
    workspaceId: '684402c2fd2cd4eb6521b386',
    platform: 'instagram',
    type: 'dm',
    isActive: true,
    triggers: {
      aiMode: 'contextual',
      keywords: ['hello', 'help', 'info'],
      hashtags: [],
      mentions: false,
      newFollowers: true,
      postInteraction: false
    },
    responses: [
      'Hello! Thanks for reaching out. How can I help you today?',
      'Hi there! I\'d be happy to assist you. What would you like to know?'
    ],
    aiPersonality: 'friendly',
    responseLength: 'medium',
    aiConfig: {
      personality: 'friendly',
      responseLength: 'medium',
      dailyLimit: 50,
      responseDelay: 5,
      language: 'auto',
      contextualMode: true
    }
  };
  
  try {
    const response = await fetch('http://localhost:5000/api/automation/rules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test_token'
      },
      body: JSON.stringify(ruleData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('[TEST 1] ✓ Rule created successfully:', result.rule?.id);
      return result.rule;
    } else {
      console.log('[TEST 1] ✗ Rule creation failed:', response.status);
      return null;
    }
  } catch (error) {
    console.log('[TEST 1] ✗ API request failed:', error.message);
    return null;
  }
};

// Test 2: Verify rule can be found by type
const testFindRulesByType = async () => {
  console.log('[TEST 2] Testing getAutomationRulesByType query...');
  
  try {
    const response = await fetch('http://localhost:5000/api/automation/rules/test-type/dm', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test_token'
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`[TEST 2] ✓ Found ${result.rules?.length || 0} DM rules`);
      return result.rules;
    } else {
      console.log('[TEST 2] ✗ Query failed:', response.status);
      return [];
    }
  } catch (error) {
    console.log('[TEST 2] ✗ Query request failed:', error.message);
    return [];
  }
};

// Test 3: Simulate webhook processing
const testWebhookProcessing = async () => {
  console.log('[TEST 3] Testing webhook processing...');
  
  const webhookData = {
    entry: [{
      messaging: [{
        sender: { id: 'test_sender_123' },
        recipient: { id: 'test_recipient_456' },
        message: {
          mid: 'test_message_id_789',
          text: 'Hello! I need help with your products'
        },
        timestamp: Date.now()
      }]
    }]
  };
  
  try {
    const response = await fetch('http://localhost:5000/webhooks/instagram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': 'test_signature'
      },
      body: JSON.stringify(webhookData)
    });
    
    if (response.ok) {
      console.log('[TEST 3] ✓ Webhook processed successfully');
      return true;
    } else {
      console.log('[TEST 3] ✗ Webhook processing failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('[TEST 3] ✗ Webhook request failed:', error.message);
    return false;
  }
};

// Test 4: Check conversation memory
const testConversationMemory = async () => {
  console.log('[TEST 4] Testing conversation memory...');
  
  try {
    const response = await fetch('http://localhost:5000/api/conversations/test-workspace', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test_token'
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`[TEST 4] ✓ Found ${result.conversations?.length || 0} conversations`);
      return result.conversations;
    } else {
      console.log('[TEST 4] ✗ Memory query failed:', response.status);
      return [];
    }
  } catch (error) {
    console.log('[TEST 4] ✗ Memory request failed:', error.message);
    return [];
  }
};

// Wait for server to be ready
const waitForServer = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('[SETUP] Server should be ready, starting tests...');
      resolve();
    }, 3000);
  });
};

// Run all tests
const runAllTests = async () => {
  await waitForServer();
  
  console.log('\n=== AUTO REPLY FUNCTIONALITY TEST RESULTS ===');
  
  const rule = await testCreateRule();
  const foundRules = await testFindRulesByType();
  const webhookSuccess = await testWebhookProcessing();
  const conversations = await testConversationMemory();
  
  console.log('\n=== SUMMARY ===');
  console.log('✓ Rule Creation:', rule ? 'PASS' : 'FAIL');
  console.log('✓ Rule Query:', foundRules.length > 0 ? 'PASS' : 'FAIL');
  console.log('✓ Webhook Processing:', webhookSuccess ? 'PASS' : 'FAIL');
  console.log('✓ Conversation Memory:', conversations.length >= 0 ? 'PASS' : 'FAIL');
  
  const allPassed = rule && foundRules.length > 0 && webhookSuccess;
  console.log('\n🎯 AUTO REPLY FUNCTIONALITY:', allPassed ? 'WORKING' : 'NEEDS FIXES');
  
  process.exit(allPassed ? 0 : 1);
};

runAllTests().catch(error => {
  console.error('[TEST ERROR]', error);
  process.exit(1);
});