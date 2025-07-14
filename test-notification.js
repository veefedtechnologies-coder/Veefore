import { MongoClient } from 'mongodb';

async function createTestNotification() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('notifications');
    
    // Create a test notification for all users
    const notification = {
      title: 'Welcome to VeeFore!',
      message: 'Your AI-powered social media management platform is ready. Start creating amazing content today!',
      type: 'info',
      targetUsers: 'all',
      priority: 'medium',
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(notification);
    console.log('✅ Created notification with ID:', result.insertedId);
    
    // Verify the notification was created
    const count = await collection.countDocuments({ targetUsers: 'all' });
    console.log('✅ Total notifications with targetUsers "all":', count);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

createTestNotification();