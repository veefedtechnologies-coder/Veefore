/**
 * Reset Database via Storage System
 * Uses the existing storage system to clear all user data
 */

const mongoose = require('mongoose');

// Use the same connection string that's working in the app
const MONGODB_URI = 'mongodb+srv://veeforeuser:veeforepassword@veeforecluster.j8pko.mongodb.net/veeforedb?retryWrites=true&w=majority';

async function resetViaStorage() {
  console.log('🔄 Starting database reset via storage system...');
  
  try {
    // Connect to MongoDB using mongoose
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB via mongoose');
    
    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📋 Found ${collections.length} collections`);
    
    // Collections to reset
    const collectionsToReset = [
      'users',
      'social_accounts', 
      'workspaces',
      'content',
      'scheduled_content',
      'conversations',
      'messages',
      'automation_rules',
      'notifications',
      'transactions',
      'subscriptions',
      'team_members',
      'team_invitations',
      'referrals',
      'waitlist_users',
      'early_access_users',
      'user_sessions',
      'email_verifications',
      'password_resets',
      'api_keys',
      'webhooks',
      'analytics',
      'content_analytics',
      'ai_generations',
      'thumbnail_generations',
      'roi_calculations',
      'ab_tests',
      'social_listening',
      'content_theft_reports',
      'emotion_analyses',
      'persona_suggestions',
      'legal_documents',
      'affiliate_links',
      'trend_analyses',
      'competitor_analyses',
      'gamification_data',
      'user_preferences',
      'workspace_settings',
      'integration_tokens',
      'upload_metadata'
    ];
    
    let totalDeleted = 0;
    
    // Reset each collection
    for (const collectionName of collectionsToReset) {
      try {
        const collection = mongoose.connection.db.collection(collectionName);
        const result = await collection.deleteMany({});
        if (result.deletedCount > 0) {
          console.log(`🗑️  Cleared ${collectionName}: ${result.deletedCount} documents`);
        }
        totalDeleted += result.deletedCount;
      } catch (error) {
        console.log(`⚠️  Error clearing ${collectionName}: ${error.message}`);
      }
    }
    
    // Reset admin users but keep one default admin
    try {
      const adminCollection = mongoose.connection.db.collection('admin_users');
      const existingCount = await adminCollection.countDocuments({});
      await adminCollection.deleteMany({});
      
      if (existingCount > 0) {
        console.log(`🗑️  Cleared admin_users: ${existingCount} documents`);
      }
      
      // Create default admin user
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await adminCollection.insertOne({
        username: 'admin',
        email: 'admin@veefore.com',
        password: hashedPassword,
        role: 'superadmin',
        isActive: true,
        createdAt: new Date(),
        lastLogin: null
      });
      
      console.log('👤 Created default admin user');
    } catch (error) {
      console.log(`⚠️  Admin reset error: ${error.message}`);
    }
    
    console.log(`\n✅ DATABASE RESET COMPLETED`);
    console.log(`📊 Total documents deleted: ${totalDeleted}`);
    console.log(`🔄 Database is now clean and ready for new registrations`);
    console.log(`👤 Default admin login: admin@veefore.com / admin123`);
    
  } catch (error) {
    console.error('❌ Reset failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

// Execute the reset
resetViaStorage().catch(console.error);