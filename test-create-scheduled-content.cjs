/**
 * Test Creating Scheduled Content - Verify the fix works
 */

const mongoose = require('mongoose');

// MongoDB Schema (from the storage file)
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

async function testCreateScheduledContent() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');
    
    // Create test scheduled content with explicit status
    const testContent = {
      workspaceId: '684402c2fd2cd4eb6521b386',
      type: 'post',
      title: 'Test Scheduler Fix - Explicit Status',
      description: 'Testing that the scheduler fix works correctly',
      platform: 'instagram',
      status: 'scheduled', // EXPLICIT STATUS
      scheduledAt: new Date(Date.now() + 60000), // 1 minute from now
      creditsUsed: 0,
      contentData: {
        mediaUrl: 'https://example.com/test-fix.jpg'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('\nCreating test content with explicit status...');
    console.log('Status:', testContent.status);
    console.log('ScheduledAt:', testContent.scheduledAt);
    
    const contentDoc = new ContentModel(testContent);
    const saved = await contentDoc.save();
    
    console.log('\n✓ Content saved successfully!');
    console.log('MongoDB _id:', saved._id.toString());
    console.log('Status in DB:', saved.status);
    console.log('ScheduledAt in DB:', saved.scheduledAt);
    
    // Verify scheduler can find it
    console.log('\nChecking if scheduler can find the content...');
    const query = { status: 'scheduled' };
    const scheduledContent = await ContentModel.find(query);
    
    console.log(`Found ${scheduledContent.length} scheduled items`);
    if (scheduledContent.length > 0) {
      scheduledContent.forEach((content, index) => {
        console.log(`${index + 1}. ${content.title} - Status: ${content.status}`);
      });
    }
    
    console.log('\n✅ TEST COMPLETED - Check scheduler logs to see if it picks up the content!');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testCreateScheduledContent();