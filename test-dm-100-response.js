import { MongoDBStorage } from './server/mongodb-storage.js';
import { InstagramAutomation } from './server/instagram-automation.js';

async function testDMResponseRate() {
  console.log('[TEST] Testing 100% DM response rate system...');
  
  try {
    const storage = new MongoDBStorage();
    await storage.connect();
    
    const automation = new InstagramAutomation(storage);
    
    // Test DM automation rule data
    const testWorkspaceId = '684402c2fd2cd4eb6521b386';
    
    // Create test DM rule
    const dmRule = {
      id: 'test-dm-rule-100',
      workspaceId: testWorkspaceId,
      name: 'Test DM Auto Response',
      platform: 'instagram',
      type: 'dm',
      trigger: {
        type: 'dm',
        keywords: ['test', 'hello', 'price'],
        aiMode: 'contextual'
      },
      action: {
        type: 'dm',
        responseType: 'ai',
        aiPersonality: 'friendly',
        responseLength: 'short'
      },
      isActive: true,
      schedule: {
        timezone: 'UTC',
        activeHours: {
          start: '00:00',
          end: '23:59'
        },
        activeDays: [0, 1, 2, 3, 4, 5, 6]
      }
    };
    
    console.log('[TEST] Created DM rule:', dmRule.name);
    
    // Test multiple DM scenarios to verify 100% response rate
    const testMessages = [
      'Hello! What is the price?',
      'Hi there, interested in your product',
      'Can you tell me more about this?',
      'Thanks for the amazing content!',
      'Where can I buy this?'
    ];
    
    let responseCount = 0;
    let totalMessages = testMessages.length;
    
    for (let i = 0; i < testMessages.length; i++) {
      const message = testMessages[i];
      const testUsername = `testuser${i + 1}`;
      
      console.log(`\n[TEST] Testing message ${i + 1}: "${message}"`);
      
      try {
        // Simulate DM automation processing
        const response = await automation.generateContextualResponse(
          message,
          dmRule,
          { username: testUsername }
        );
        
        if (response) {
          responseCount++;
          console.log(`[TEST] ✅ Response generated: "${response}"`);
        } else {
          console.log(`[TEST] ❌ No response generated`);
        }
      } catch (error) {
        console.log(`[TEST] ❌ Error generating response:`, error.message);
      }
    }
    
    const responseRate = (responseCount / totalMessages) * 100;
    
    console.log(`\n[TEST] === DM Response Rate Test Results ===`);
    console.log(`[TEST] Total messages tested: ${totalMessages}`);
    console.log(`[TEST] Responses generated: ${responseCount}`);
    console.log(`[TEST] Response rate: ${responseRate}%`);
    
    if (responseRate === 100) {
      console.log(`[TEST] ✅ SUCCESS: 100% DM response rate achieved!`);
    } else {
      console.log(`[TEST] ❌ FAILED: Expected 100% response rate, got ${responseRate}%`);
    }
    
    // Test stealth responder stats
    console.log('\n[TEST] === Stealth Responder Stats ===');
    const stealthStats = automation.stealthResponder?.getStealthStats?.();
    if (stealthStats) {
      console.log('[TEST] Stealth stats:', stealthStats);
    }
    
    await storage.disconnect();
    console.log('\n[TEST] DM response rate test completed');
    
  } catch (error) {
    console.error('[TEST] Error in DM response rate test:', error);
  }
}

testDMResponseRate();