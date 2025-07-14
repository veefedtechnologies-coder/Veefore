import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DATABASE_URL;
if (!uri) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

// Define simple schemas for this script
const ContentSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  platform: String,
  status: String,
  workspaceId: Number,
  scheduledFor: Date,
  caption: String,
  createdAt: { type: Date, default: Date.now }
});

const NotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: String,
  isActive: Boolean,
  targetUsers: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ContentModel = mongoose.model('Content', ContentSchema);
const NotificationModel = mongoose.model('Notification', NotificationSchema);

async function populateAdminData() {
  try {
    await mongoose.connect(uri);
    console.log('[ADMIN DATA] Connected to MongoDB');
    
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
    
    // Insert notifications using Mongoose
    const notifResult = await NotificationModel.insertMany(notifications);
    console.log(`[ADMIN DATA] Created ${notifResult.length} notifications`);
    
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
        caption: 'Exploring the future of technology #TechTrends #AI #Innovation'
      },
      {
        title: 'LinkedIn Article: Business Growth',
        description: 'Professional article about business scaling strategies',
        type: 'article',
        platform: 'linkedin',
        status: 'scheduled',
        workspaceId: 2,
        scheduledFor: new Date(Date.now() + 86400000),
        caption: 'Key strategies for sustainable business growth in 2025'
      },
      {
        title: 'Twitter Thread: Marketing Tips',
        description: 'Thread about digital marketing best practices',
        type: 'thread',
        platform: 'twitter',
        status: 'draft',
        workspaceId: 1,
        scheduledFor: null,
        caption: 'Essential marketing tips every startup should know'
      },
      {
        title: 'YouTube Short: Product Demo',
        description: 'Short video demonstrating platform features',
        type: 'video',
        platform: 'youtube',
        status: 'published',
        workspaceId: 3,
        scheduledFor: null,
        caption: 'Quick demo of our latest features #ProductDemo #SaaS'
      }
    ];
    
    // Insert content using Mongoose
    const contentResult = await ContentModel.insertMany(content);
    console.log(`[ADMIN DATA] Created ${contentResult.length} content items`);
    
    console.log('[ADMIN DATA] Successfully populated admin panel data');
    
  } catch (error) {
    console.error('[ADMIN DATA] Error:', error);
  } finally {
    await client.close();
  }
}

populateAdminData();