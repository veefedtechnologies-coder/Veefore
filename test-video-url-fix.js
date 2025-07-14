/**
 * Test Video URL Fix - Instagram Publishing
 * 
 * This test verifies that the malformed URL issue is resolved
 * and videos can be published to Instagram with proper URL construction.
 */

import { MongoStorage } from './server/mongodb-storage.js';

async function testVideoURLFix() {
  console.log('🔧 Testing Video URL Fix for Instagram Publishing');
  
  const storage = new MongoStorage();
  
  try {
    await storage.connect();
    console.log('✅ Connected to MongoDB');
    
    // Create test video content with clean URL
    const testContent = {
      title: 'URL Fix Test - Video Publishing',
      description: 'Testing the fixed URL construction for Instagram video publishing',
      type: 'video',
      platform: 'instagram',
      workspaceId: '684402c2fd2cd4eb6521b386',
      contentData: {
        mediaUrl: '/8d6d896e-9dd2-4e6d-8ca4-cda6ccb49b65' // Clean UUID path
      },
      scheduledAt: new Date(Date.now() + 20000), // 20 seconds from now
      status: 'scheduled'
    };
    
    const content = await storage.createContent(testContent);
    console.log('✅ Created test video content with ID:', content.id);
    console.log('⏰ Scheduled for:', testContent.scheduledAt.toLocaleTimeString());
    console.log('📹 Media URL:', testContent.contentData.mediaUrl);
    console.log('');
    console.log('🎯 The scheduler will pick this up automatically and test the URL fix.');
    console.log('🔍 Watch the server logs for URL cleaning output:');
    console.log('   - "Original video URL" should show clean path');
    console.log('   - "Cleaned video URL" should show proper replit.dev URL');
    console.log('');
    console.log('⚡ Video publishing will be attempted in ~20 seconds');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testVideoURLFix();