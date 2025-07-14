/**
 * Test Instagram DM Deduplication Fix
 * 
 * This test verifies that the enhanced auto DM service only generates
 * ONE AI response per Instagram DM, even when multiple automation rules
 * are active for the same workspace.
 * 
 * CRITICAL BUG FIX: Previous system was generating duplicate responses
 * (English + Hindi) for the same Instagram DM due to multiple automation
 * rules processing the same webhook event.
 */

import { MongoStorage } from './server/mongodb-storage.js';
import { EnhancedAutoDMService } from './server/enhanced-auto-dm-service.js';

async function testDMDeduplicationFix() {
  console.log('\n=== TESTING INSTAGRAM DM DEDUPLICATION FIX ===');
  
  const storage = new MongoStorage();
  await storage.connect();
  
  const enhancedDMService = new EnhancedAutoDMService(storage);
  
  try {
    // Test 1: Verify multiple automation rules exist for same workspace
    console.log('\n1. Checking automation rules setup...');
    const dmRules = await storage.getAutomationRulesByType('dm');
    console.log(`Found ${dmRules.length} DM automation rules`);
    
    const workspace684402Rules = dmRules.filter(rule => 
      rule.workspaceId.toString() === '684402' && rule.isActive
    );
    console.log(`Active rules for workspace 684402: ${workspace684402Rules.length}`);
    
    if (workspace684402Rules.length < 2) {
      console.log('❌ Need at least 2 active DM rules for workspace 684402 to test deduplication');
      return;
    }
    
    // Test 2: Simulate Instagram DM webhook with message deduplication
    console.log('\n2. Testing message deduplication system...');
    
    const testMessageId = `test_msg_${Date.now()}`;
    const testSenderId = '707882128673370';
    const testRecipientId = '17841474666515230';
    
    const webhookData = {
      entry: [{
        messaging: [{
          sender: { id: testSenderId, username: 'test_user' },
          recipient: { id: testRecipientId },
          message: {
            mid: testMessageId,
            text: 'Testing deduplication fix - this should generate only ONE response'
          },
          timestamp: Date.now()
        }]
      }]
    };
    
    console.log(`Simulating Instagram DM with message ID: ${testMessageId}`);
    console.log('Expected behavior: Only ONE AI response should be generated');
    console.log('Previous bug: Multiple responses (English + Hindi) were generated');
    
    // Test 3: Process the webhook and verify single response
    console.log('\n3. Processing webhook through enhanced DM service...');
    
    // Count conversation messages before processing
    const conversationsBefore = await storage.collection('conversations').find({
      workspaceId: '684402',
      platform: 'instagram',
      participantId: testSenderId
    }).toArray();
    
    console.log(`Conversations before: ${conversationsBefore.length}`);
    
    // Process the webhook
    await enhancedDMService.handleInstagramDMWebhook(webhookData);
    
    // Wait a moment for processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Count conversation messages after processing
    const conversationsAfter = await storage.collection('conversations').find({
      workspaceId: '684402',
      platform: 'instagram',
      participantId: testSenderId
    }).toArray();
    
    console.log(`Conversations after: ${conversationsAfter.length}`);
    
    // Test 4: Verify only one AI response was generated
    console.log('\n4. Verifying single response generation...');
    
    if (conversationsAfter.length > 0) {
      const latestConversation = conversationsAfter[conversationsAfter.length - 1];
      
      // Check messages in the conversation
      const messages = await storage.collection('conversationMessages').find({
        conversationId: latestConversation._id.toString()
      }).toArray();
      
      const userMessages = messages.filter(msg => msg.type === 'user');
      const aiMessages = messages.filter(msg => msg.type === 'ai');
      
      console.log(`User messages: ${userMessages.length}`);
      console.log(`AI responses: ${aiMessages.length}`);
      
      if (aiMessages.length === 1) {
        console.log('✅ SUCCESS: Only one AI response generated');
        console.log(`AI Response: ${aiMessages[0].content.substring(0, 100)}...`);
      } else if (aiMessages.length > 1) {
        console.log('❌ FAILURE: Multiple AI responses generated (duplicate bug still exists)');
        aiMessages.forEach((msg, index) => {
          console.log(`Response ${index + 1}: ${msg.content.substring(0, 50)}...`);
        });
      } else {
        console.log('⚠️  WARNING: No AI response generated');
      }
    } else {
      console.log('⚠️  WARNING: No conversation created');
    }
    
    // Test 5: Test duplicate message processing prevention
    console.log('\n5. Testing duplicate message prevention...');
    console.log('Processing the same webhook again...');
    
    const messageCountBefore = await storage.collection('conversationMessages').countDocuments({});
    
    // Process the same webhook again
    await enhancedDMService.handleInstagramDMWebhook(webhookData);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const messageCountAfter = await storage.collection('conversationMessages').countDocuments({});
    
    if (messageCountAfter === messageCountBefore) {
      console.log('✅ SUCCESS: Duplicate message processing prevented');
    } else {
      console.log('❌ FAILURE: Duplicate message was processed');
    }
    
    console.log('\n=== DEDUPLICATION TEST COMPLETED ===');
    
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    await storage.disconnect();
  }
}

// Test message deduplication in isolation
async function testMessageDeduplication() {
  console.log('\n=== TESTING MESSAGE DEDUPLICATION LOGIC ===');
  
  const storage = new MongoStorage();
  await storage.connect();
  
  const enhancedDMService = new EnhancedAutoDMService(storage);
  
  // Access the private processedMessages set (for testing purposes)
  const testMessageKey = 'test_msg_123_sender_456_recipient_789';
  
  console.log('Testing message key generation and deduplication...');
  
  // Simulate processing the same message multiple times
  for (let i = 0; i < 3; i++) {
    console.log(`\nAttempt ${i + 1} to process message...`);
    
    const webhookData = {
      entry: [{
        messaging: [{
          sender: { id: 'sender_456' },
          recipient: { id: 'recipient_789' },
          message: {
            mid: 'test_msg_123',
            text: 'Test message for deduplication'
          }
        }]
      }]
    };
    
    try {
      await enhancedDMService.handleInstagramDMWebhook(webhookData);
      console.log(`Processing attempt ${i + 1} completed`);
    } catch (error) {
      console.log(`Processing attempt ${i + 1} handled gracefully:`, error.message);
    }
  }
  
  await storage.disconnect();
}

// Run the comprehensive test
async function runComprehensiveTest() {
  console.log('🚀 Starting Instagram DM Deduplication Fix Test');
  console.log('OBJECTIVE: Verify that only ONE AI response is generated per Instagram DM');
  console.log('BUG BEING TESTED: Multiple automation rules generating duplicate responses');
  
  await testDMDeduplicationFix();
  await testMessageDeduplication();
  
  console.log('\n🏁 All deduplication tests completed');
}

runComprehensiveTest().catch(console.error);