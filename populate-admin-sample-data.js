import { MongoStorage } from './server/mongodb-storage.js';

async function populateAdminSampleData() {
  const storage = new MongoStorage();
  
  try {
    await storage.connect();
    console.log('[ADMIN DATA] Connected to database');
    
    // Get the MongoDB connection from storage
    const db = storage.db;
    
    // Create sample notifications
    const notifications = [
      {
        title: 'System Maintenance Scheduled',
        message: 'Platform maintenance will occur on Sunday 2AM-4AM EST',
        type: 'maintenance',
        isActive: true,
        targetUsers: 'all',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'New Feature: Advanced Analytics',
        message: 'Enhanced analytics dashboard with real-time insights now available',
        type: 'announcement',
        isActive: true,
        targetUsers: 'premium',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        title: 'Security Alert',
        message: 'Suspicious login attempts detected. Please verify your account',
        type: 'alert',
        isActive: false,
        targetUsers: 'affected',
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000)
      }
    ];
    
    // Insert notifications
    const notifResult = await db.collection('notifications').insertMany(notifications);
    console.log(`[ADMIN DATA] Created ${notifResult.insertedCount} notifications`);
    
    // Create sample content entries
    const content = [
      {
        title: 'Instagram Post: Tech Trends 2025',
        description: 'AI-generated content about emerging technology trends',
        type: 'post',
        platform: 'instagram',
        status: 'published',
        workspaceId: 1,
        scheduledFor: null,
        caption: 'Exploring the future of technology #TechTrends #AI #Innovation',
        createdAt: new Date()
      },
      {
        title: 'LinkedIn Article: Business Growth',
        description: 'Professional article about business scaling strategies',
        type: 'article',
        platform: 'linkedin',
        status: 'scheduled',
        workspaceId: 2,
        scheduledFor: new Date(Date.now() + 86400000),
        caption: 'Key strategies for sustainable business growth in 2025',
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        title: 'Twitter Thread: Marketing Tips',
        description: 'Thread about digital marketing best practices',
        type: 'thread',
        platform: 'twitter',
        status: 'draft',
        workspaceId: 1,
        scheduledFor: null,
        caption: 'Essential marketing tips every startup should know',
        createdAt: new Date(Date.now() - 7200000)
      },
      {
        title: 'YouTube Short: Product Demo',
        description: 'Short video demonstrating platform features',
        type: 'video',
        platform: 'youtube',
        status: 'published',
        workspaceId: 3,
        scheduledFor: null,
        caption: 'Quick demo of our latest features #ProductDemo #SaaS',
        createdAt: new Date(Date.now() - 10800000)
      }
    ];
    
    // Insert content
    const contentResult = await db.collection('content').insertMany(content);
    console.log(`[ADMIN DATA] Created ${contentResult.insertedCount} content items`);
    
    console.log('[ADMIN DATA] Successfully populated admin panel data');
    
  } catch (error) {
    console.error('[ADMIN DATA] Error:', error);
  } finally {
    process.exit(0);
  }
}

populateAdminSampleData();