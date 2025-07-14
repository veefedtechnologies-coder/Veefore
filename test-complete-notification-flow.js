import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  targetUsers: { type: [String], default: ['all'] },
  scheduledFor: { type: Date, default: null },
  sentAt: { type: Date, default: null },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const NotificationModel = mongoose.model('Notification', NotificationSchema);

async function testCompleteNotificationFlow() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');
    
    // Create a test notification directly
    const notification = new NotificationModel({
      title: 'Welcome to VeeFore!',
      message: 'Your AI-powered social media management platform is ready. Start creating amazing content today!',
      type: 'info',
      targetUsers: ['all'],
      sentAt: new Date(),
      isRead: false,
      createdAt: new Date()
    });
    
    const savedNotification = await notification.save();
    console.log('✅ Created notification with ID:', savedNotification._id);
    
    // Test the query that the getUserNotifications method uses
    const notifications = await NotificationModel.find({
      targetUsers: 'all'
    }).sort({ createdAt: -1 }).limit(50);
    
    console.log('✅ Found notifications:', notifications.length);
    console.log('✅ First notification:', notifications[0]?.title);
    
    // Clean up
    await NotificationModel.deleteOne({ _id: savedNotification._id });
    console.log('✅ Cleaned up test notification');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testCompleteNotificationFlow();