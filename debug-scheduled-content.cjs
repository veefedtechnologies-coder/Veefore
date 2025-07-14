/**
 * Debug Scheduled Content - Find what's actually in the database
 */

const mongoose = require('mongoose');

async function debugScheduledContent() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('contents');
    
    // Check all content in database
    const allContent = await collection.find({}).limit(10).toArray();
    console.log(`\nTotal content in database: ${allContent.length}`);
    
    if (allContent.length > 0) {
      console.log('\nSample content:');
      allContent.forEach((content, index) => {
        console.log(`${index + 1}. ID: ${content._id}`);
        console.log(`   Title: ${content.title}`);
        console.log(`   Status: ${content.status}`);
        console.log(`   Platform: ${content.platform}`);
        console.log(`   WorkspaceId: ${content.workspaceId} (type: ${typeof content.workspaceId})`);
        console.log(`   ScheduledAt: ${content.scheduledAt}`);
        console.log(`   CreatedAt: ${content.createdAt}`);
        console.log('---');
      });
    }
    
    // Check specifically for scheduled content
    const scheduledContent = await collection.find({ status: 'scheduled' }).toArray();
    console.log(`\nScheduled content count: ${scheduledContent.length}`);
    
    if (scheduledContent.length > 0) {
      console.log('\nScheduled content details:');
      scheduledContent.forEach((content, index) => {
        console.log(`${index + 1}. ID: ${content._id}`);
        console.log(`   Title: ${content.title}`);
        console.log(`   Status: ${content.status}`);
        console.log(`   Platform: ${content.platform}`);
        console.log(`   WorkspaceId: ${content.workspaceId}`);
        console.log(`   ScheduledAt: ${content.scheduledAt}`);
        console.log(`   Ready to publish: ${content.scheduledAt && new Date(content.scheduledAt) <= new Date()}`);
        console.log('---');
      });
    }
    
    // Check content by workspace
    const workspaceContent = await collection.find({ 
      workspaceId: '684402c2fd2cd4eb6521b386',
      status: 'scheduled' 
    }).toArray();
    console.log(`\nWorkspace 684402c2fd2cd4eb6521b386 scheduled content: ${workspaceContent.length}`);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Debug failed:', error.message);
  }
}

debugScheduledContent();