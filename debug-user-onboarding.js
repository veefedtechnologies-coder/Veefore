import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Define User schema to match mongodb-storage.ts
const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  displayName: String,
  avatar: String,
  credits: { type: Number, default: 50 },
  plan: { type: String, default: 'Free' },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  referralCode: String,
  totalReferrals: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  referredBy: String,
  preferences: { type: Object, default: {} },
  isOnboarded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

async function debugUserOnboarding() {
  try {
    // Use the same connection string pattern as the main app
    const mongoUrl = process.env.DATABASE_URL || 'mongodb+srv://veefore:SIGaFT1mSpA7rCdE@cluster0.i6ctr.mongodb.net/veeforedb?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');

    const UserModel = mongoose.model('User', UserSchema);

    // Find the latest users
    const users = await UserModel.find({}).sort({ createdAt: -1 }).limit(5);
    
    console.log('\n=== Latest 5 Users ===');
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`  ID: ${user._id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  isOnboarded: ${user.isOnboarded} (type: ${typeof user.isOnboarded})`);
      console.log(`  Raw isOnboarded: ${JSON.stringify(user.isOnboarded)}`);
      console.log(`  CreatedAt: ${user.createdAt}`);
    });

    // Check for any users that might have isOnboarded as true
    const onboardedUsers = await UserModel.find({ isOnboarded: true });
    console.log(`\n=== Users marked as onboarded: ${onboardedUsers.length} ===`);
    
    onboardedUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} - isOnboarded: ${user.isOnboarded}`);
    });

    // Test specific user if provided
    const targetUserId = '6845a5514d71a73ad1716f7f'; // The user from the logs
    const targetUser = await UserModel.findById(targetUserId);
    
    if (targetUser) {
      console.log(`\n=== Target User ${targetUserId} ===`);
      console.log(`  Email: ${targetUser.email}`);
      console.log(`  isOnboarded: ${targetUser.isOnboarded} (type: ${typeof targetUser.isOnboarded})`);
      console.log(`  Raw document:`, JSON.stringify({
        _id: targetUser._id,
        email: targetUser.email,
        isOnboarded: targetUser.isOnboarded
      }, null, 2));
    } else {
      console.log(`\n=== Target User ${targetUserId} NOT FOUND ===`);
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugUserOnboarding();