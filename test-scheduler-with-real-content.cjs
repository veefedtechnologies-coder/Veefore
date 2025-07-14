/**
 * Test Scheduler with Real Video Content
 * Creates scheduled content with actual video files to verify the publishing fix
 */

const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  contentData: { type: mongoose.Schema.Types.Mixed, default: {} },
  platform: String,
  status: { type: String, default: 'draft' },
  scheduledAt: Date,
  publishedAt: Date,
  creditsUsed: { type: Number, default: 0 },
  prompt: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ContentModel = mongoose.model('Content', ContentSchema, 'contents');

async function testSchedulerWithRealContent() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');
    
    // Create scheduled content with a real video URL
    const realVideoContent = {
      workspaceId: '684402c2fd2cd4eb6521b386',
      type: 'reel',
      title: 'Scheduler Test - Real Video Content',
      description: 'Testing scheduler with actual video content instead of placeholders',
      platform: 'instagram',
      status: 'scheduled', // EXPLICIT STATUS
      scheduledAt: new Date(Date.now() + 120000), // 2 minutes from now
      creditsUsed: 0,
      contentData: {
        // Use an actual image that Instagram can accept
        mediaUrl: 'https://picsum.photos/1080/1080',
        caption: 'Test content with real media URL'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('\nCreating scheduled content with real media URL...');
    console.log('Media URL:', realVideoContent.contentData.mediaUrl);
    console.log('Status:', realVideoContent.status);
    console.log('Scheduled for:', realVideoContent.scheduledAt);
    
    const contentDoc = new ContentModel(realVideoContent);
    const saved = await contentDoc.save();
    
    console.log('\n✓ Real content scheduled successfully!');
    console.log('MongoDB _id:', saved._id.toString());
    console.log('Status in DB:', saved.status);
    console.log('Media URL in DB:', saved.contentData.mediaUrl);
    
    // Verify scheduler will find it
    console.log('\nVerifying scheduler can find the content...');
    const scheduledItems = await ContentModel.find({ status: 'scheduled' });
    
    console.log(`Found ${scheduledItems.length} scheduled items total`);
    scheduledItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title} - Scheduled: ${item.scheduledAt}`);
    });
    
    console.log('\n✅ TEST COMPLETED - Watch scheduler logs for publishing attempt in 2 minutes!');
    console.log('The scheduler should now use the real media URL instead of placeholders.');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testSchedulerWithRealContent();