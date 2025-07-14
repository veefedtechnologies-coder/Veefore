import { MongoStorage } from './server/mongodb-storage.js';

async function createTestNotification() {
  const storage = new MongoStorage();
  
  try {
    await storage.connect();
    console.log('✅ Connected to MongoDB');
    
    // Create a test notification for all users
    const notification = {
      title: 'Welcome to VeeFore!',
      message: 'Your AI-powered social media management platform is ready. Start creating amazing content today!',
      type: 'info',
      targetUsers: 'all'
    };
    
    const result = await storage.createNotification(notification);
    console.log('✅ Created notification:', result);
    
    // Test fetching notifications for a user
    const userNotifications = await storage.getUserNotifications('6844027426cae0200f88b5db');
    console.log('✅ User notifications:', userNotifications.length);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestNotification();