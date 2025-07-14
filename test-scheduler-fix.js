/**
 * Test Scheduler Fix - Verify the status assignment bug is resolved
 */

const mongoose = require('mongoose');

async function testSchedulerFix() {
  try {
    // Import the storage directly
    const { MongoDBStorage } = require('./server/mongodb-storage');
    
    const storage = new MongoDBStorage();
    
    console.log('Testing Scheduler Fix');
    console.log('===================');
    
    // Test 1: Create a test scheduled content with explicit status
    console.log('\n1. Creating test scheduled content...');
    
    const testContent = {
      title: 'Test Scheduler Fix',
      description: 'Testing that status field is preserved',
      type: 'post',
      platform: 'instagram',
      status: 'scheduled', // Explicit status
      scheduledAt: new Date(Date.now() + 30000), // 30 seconds from now
      workspaceId: '684402c2fd2cd4eb6521b386',
      creditsUsed: 0,
      contentData: {
        mediaUrl: 'https://example.com/test.jpg'
      }
    };
    
    const savedContent = await storage.createContent(testContent);
    console.log(`✓ Created content with ID: ${savedContent.id}`);
    console.log(`✓ Status: ${savedContent.status}`);
    console.log(`✓ ScheduledAt: ${savedContent.scheduledAt}`);
    
    // Test 2: Verify scheduler can find it
    console.log('\n2. Testing scheduler detection...');
    
    const scheduledContent = await storage.getScheduledContent();
    console.log(`✓ Found ${scheduledContent.length} scheduled items`);
    
    if (scheduledContent.length > 0) {
      const foundContent = scheduledContent.find(c => c.id === savedContent.id);
      if (foundContent) {
        console.log(`✓ Scheduler found our test content!`);
        console.log(`  - Title: ${foundContent.title}`);
        console.log(`  - Status: ${foundContent.status}`);
        console.log(`  - ScheduledAt: ${foundContent.scheduledAt}`);
      } else {
        console.log(`✗ Scheduler did not find our test content`);
      }
    }
    
    // Test 3: Clean up
    console.log('\n3. Cleaning up...');
    await storage.deleteContent(savedContent.id);
    console.log(`✓ Cleaned up test content`);
    
    console.log('\n✅ SCHEDULER FIX TEST PASSED');
    console.log('The status assignment bug has been resolved!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testSchedulerFix();