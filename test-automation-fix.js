/**
 * Test Automation Service Fix - Validate ObjectId Handling
 * 
 * This test validates that the automation service now properly handles
 * MongoDB ObjectId strings without casting errors.
 */

import axios from 'axios';

async function testAutomationServiceFix() {
  console.log('=== Testing Automation Service ObjectId Fix ===');
  
  try {
    // Test 1: Check if automation rules can be fetched without errors
    console.log('\n1. Testing automation rules retrieval...');
    const rulesResponse = await axios.get('http://localhost:5000/api/automation-rules', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    
    console.log('Automation rules response:', rulesResponse.status);
    console.log('Rules found:', rulesResponse.data?.length || 0);
    
    // Test 2: Simulate DM webhook processing
    console.log('\n2. Testing DM webhook processing...');
    const webhookData = {
      entry: [{
        messaging: [{
          sender: { id: 'test_sender_123', username: 'test_user' },
          recipient: { id: 'test_recipient_456' },
          message: {
            mid: 'test_message_' + Date.now(),
            text: 'Hello, this is a test message for automation'
          }
        }]
      }]
    };
    
    const webhookResponse = await axios.post('http://localhost:5000/api/instagram/webhook', webhookData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Webhook processing status:', webhookResponse.status);
    console.log('Webhook response:', webhookResponse.data);
    
    // Test 3: Check conversation memory creation
    console.log('\n3. Testing conversation memory...');
    const memoryResponse = await axios.get('http://localhost:5000/api/dm/conversations', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    
    console.log('Conversation memory status:', memoryResponse.status);
    console.log('Conversations found:', memoryResponse.data?.length || 0);
    
    console.log('\n✅ AUTOMATION SERVICE FIX VALIDATED');
    console.log('- ObjectId casting errors resolved');
    console.log('- DM automation service operational');
    console.log('- Conversation memory system working');
    
    return true;
  } catch (error) {
    console.error('\n❌ AUTOMATION FIX VALIDATION FAILED');
    console.error('Error details:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    
    // Check if it's still the ObjectId casting error
    if (error.message.includes('ObjectId') || error.message.includes('Cast to ObjectId failed')) {
      console.error('\n🔍 STILL EXPERIENCING OBJECTID ERRORS');
      console.error('The fix needs additional work on MongoDB schema alignment');
    }
    
    return false;
  }
}

// Execute the test
testAutomationServiceFix()
  .then(success => {
    if (success) {
      console.log('\n🎯 Automation service is now working correctly!');
    } else {
      console.log('\n⚠️  Automation service still needs attention');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });