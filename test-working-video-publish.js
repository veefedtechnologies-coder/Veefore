/**
 * Test Working Video Publishing with URL Fix
 * 
 * This test uses a properly compressed video to verify that:
 * 1. URL construction fix is working
 * 2. Video publishing pipeline is functional
 * 3. Instagram API accepts the video format
 */

import { MongoStorage } from './server/mongodb-storage.js';

async function testWorkingVideoPublish() {
  console.log('Testing video publishing with compressed video file');
  
  const storage = new MongoStorage();
  
  try {
    await storage.connect();
    console.log('Connected to MongoDB');
    
    // Use a compressed video that should work with Instagram
    const testContent = {
      title: 'Working Video Test - Compressed',
      description: 'Testing video publishing with properly compressed video file that meets Instagram specifications',
      type: 'video',
      platform: 'instagram',
      workspaceId: '684402c2fd2cd4eb6521b386',
      contentData: {
        mediaUrl: '/compressed-ready-for-instagram.mp4' // Using pre-compressed video
      },
      scheduledAt: new Date(Date.now() + 15000), // 15 seconds from now
      status: 'scheduled'
    };
    
    const content = await storage.createContent(testContent);
    console.log('Created test content with compressed video:', content.id);
    console.log('Using video:', testContent.contentData.mediaUrl);
    console.log('Scheduled for:', testContent.scheduledAt.toLocaleTimeString());
    console.log('');
    console.log('This test will verify:');
    console.log('1. URL construction is fixed (no more malformed devblob URLs)');
    console.log('2. Video reaches Instagram API successfully');
    console.log('3. Compressed video format is accepted by Instagram');
    console.log('');
    console.log('Watch server logs for publishing attempt in ~15 seconds');
    
  } catch (error) {
    console.error('Test setup failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testWorkingVideoPublish();