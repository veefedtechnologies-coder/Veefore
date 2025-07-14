/**
 * Test Simple Instagram Publisher
 * This creates test scheduled content to verify the publishing system works
 */

const mongoose = require('mongoose');

async function testSimplePublisher() {
  try {
    console.log('Testing Simple Instagram Publisher');
    console.log('===================================');
    
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✓ Connected to MongoDB');
    
    const { MongoDBStorage } = require('./server/mongodb-storage');
    const storage = new MongoDBStorage();
    
    // Create test content that will be published immediately
    const testContent = {
      title: 'Test Photo Post',
      description: 'This is a test photo post to verify publishing works',
      type: 'photo',
      platform: 'instagram',
      status: 'scheduled',
      scheduledAt: new Date(Date.now() - 30000), // 30 seconds ago (ready to publish)
      workspaceId: '684402c2fd2cd4eb6521b386',
      creditsUsed: 0,
      contentData: {
        mediaUrl: 'https://via.placeholder.com/1080x1080/4F46E5/FFFFFF?text=Test+Photo'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating test photo content...');
    const savedContent = await storage.createContent(testContent);
    console.log(`✓ Created test content: ${savedContent.id}`);
    
    // Wait for scheduler to pick it up
    console.log('Waiting for scheduler to process content...');
    await new Promise(resolve => setTimeout(resolve, 65000)); // Wait 65 seconds for scheduler
    
    // Check if content was published
    const updatedContent = await storage.getContentById(savedContent.id);
    console.log(`Content status: ${updatedContent.status}`);
    
    if (updatedContent.status === 'published') {
      console.log('✅ TEST SUCCESSFUL - Content was published!');
      console.log(`Instagram Post ID: ${updatedContent.instagramPostId}`);
    } else if (updatedContent.status === 'failed') {
      console.log('❌ Publishing failed');
      console.log(`Error: ${updatedContent.error}`);
    } else {
      console.log(`⏳ Content still in status: ${updatedContent.status}`);
    }
    
    console.log('\nTest complete');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testSimplePublisher().catch(console.error);