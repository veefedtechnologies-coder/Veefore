import { MongoStorage } from './server/mongodb-storage.ts';

async function createTestNotificationViaStorage() {
  const storage = new MongoStorage();
  
  try {
    console.log('Creating test notification through storage interface...');
    
    // Create a test notification using the storage interface
    const notification = await storage.createNotification({
      title: 'Welcome to VeeFore!',
      message: 'Your AI-powered social media management platform is ready. Start creating amazing content today!',
      type: 'info',
      targetUsers: 'all'
    });
    
    console.log('✅ Created notification:', notification.id);
    
    // Test fetching notifications for the current user
    const userNotifications = await storage.getUserNotifications('6844027426cae0200f88b5db');
    console.log('✅ User notifications found:', userNotifications.length);
    
    if (userNotifications.length > 0) {
      console.log('✅ First notification title:', userNotifications[0].title);
    }
    
    return notification;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Execute the test
createTestNotificationViaStorage()
  .then(result => {
    console.log('✅ Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  });