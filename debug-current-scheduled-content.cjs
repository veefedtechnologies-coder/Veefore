/**
 * Debug Current Scheduled Content - Check what's in the database right now
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

async function debugCurrentScheduledContent() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');
    
    const now = new Date();
    console.log(`\nCurrent time: ${now.toISOString()}`);
    
    // Get ALL content to see what's in the database
    console.log('\n=== ALL CONTENT IN DATABASE ===');
    const allContent = await ContentModel.find({}).sort({ createdAt: -1 }).limit(10);
    
    console.log(`Found ${allContent.length} total content items:`);
    allContent.forEach((content, index) => {
      console.log(`${index + 1}. ${content.title}`);
      console.log(`   Status: ${content.status}`);
      console.log(`   Type: ${content.type}`);
      console.log(`   Platform: ${content.platform}`);
      console.log(`   ScheduledAt: ${content.scheduledAt ? content.scheduledAt.toISOString() : 'null'}`);
      console.log(`   CreatedAt: ${content.createdAt.toISOString()}`);
      console.log(`   ID: ${content._id}`);
      console.log(`   WorkspaceId: ${content.workspaceId}`);
      
      if (content.contentData && content.contentData.mediaUrl) {
        console.log(`   MediaURL: ${content.contentData.mediaUrl}`);
      }
      
      // Check if it should be published
      if (content.status === 'scheduled' && content.scheduledAt) {
        const shouldPublish = new Date(content.scheduledAt) <= now;
        console.log(`   Should Publish: ${shouldPublish} (scheduled for ${content.scheduledAt.toISOString()})`);
      }
      console.log('');
    });
    
    // Check specifically for scheduled content
    console.log('\n=== SCHEDULED CONTENT ONLY ===');
    const scheduledContent = await ContentModel.find({ status: 'scheduled' });
    
    console.log(`Found ${scheduledContent.length} scheduled items:`);
    scheduledContent.forEach((content, index) => {
      console.log(`${index + 1}. ${content.title} - ${content.scheduledAt ? content.scheduledAt.toISOString() : 'no date'}`);
      
      if (content.scheduledAt) {
        const timeUntilPublish = new Date(content.scheduledAt) - now;
        const minutesUntil = Math.round(timeUntilPublish / 60000);
        console.log(`   Time until publish: ${minutesUntil} minutes`);
      }
    });
    
    // Check for recent content (last 10 minutes)
    console.log('\n=== RECENT CONTENT (Last 10 minutes) ===');
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const recentContent = await ContentModel.find({ 
      createdAt: { $gte: tenMinutesAgo } 
    }).sort({ createdAt: -1 });
    
    console.log(`Found ${recentContent.length} recent items:`);
    recentContent.forEach((content, index) => {
      console.log(`${index + 1}. ${content.title} - Status: ${content.status}`);
      console.log(`   Created: ${content.createdAt.toISOString()}`);
      console.log(`   Scheduled: ${content.scheduledAt ? content.scheduledAt.toISOString() : 'not scheduled'}`);
    });
    
    console.log('\n=== DIAGNOSIS ===');
    if (scheduledContent.length === 0) {
      console.log('❌ No scheduled content found - this explains why scheduler finds 0 items');
      console.log('💡 Check if content is being saved with status="draft" instead of "scheduled"');
    } else {
      console.log('✅ Scheduled content exists');
      const readyToPublish = scheduledContent.filter(c => 
        c.scheduledAt && new Date(c.scheduledAt) <= now
      );
      console.log(`📅 ${readyToPublish.length} items ready to publish now`);
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Debug failed:', error.message);
  }
}

debugCurrentScheduledContent();