/**
 * Simple Workspace Cleanup - Direct MongoDB Connection
 * Using CommonJS for better compatibility
 */

const mongoose = require('mongoose');

// MongoDB connection string from environment
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable not found');
  process.exit(1);
}

// Define schemas
const UserSchema = new mongoose.Schema({
  firebaseUid: String,
  email: String,
  username: String,
  credits: Number,
  plan: String,
  totalReferrals: Number,
  totalEarned: Number,
  isOnboarded: Boolean,
  preferences: mongoose.Schema.Types.Mixed,
  createdAt: Date,
  updatedAt: Date
});

const WorkspaceSchema = new mongoose.Schema({
  userId: String,
  name: String,
  description: String,
  avatar: String,
  credits: Number,
  theme: String,
  aiPersonality: String,
  isDefault: Boolean,
  maxTeamMembers: Number,
  inviteCode: String,
  createdAt: Date,
  updatedAt: Date
});

const SocialAccountSchema = new mongoose.Schema({
  workspaceId: String,
  platform: String,
  username: String,
  accessToken: String,
  refreshToken: String,
  expiresAt: Date,
  followersCount: Number,
  followingCount: Number,
  mediaCount: Number,
  createdAt: Date,
  updatedAt: Date
});

const ContentSchema = new mongoose.Schema({
  workspaceId: String,
  title: String,
  description: String,
  type: String,
  platform: String,
  status: String,
  contentData: mongoose.Schema.Types.Mixed,
  creditsUsed: Number,
  createdAt: Date,
  updatedAt: Date
});

async function cleanupDuplicateWorkspaces() {
  console.log('🔧 Starting simple workspace cleanup...');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const User = mongoose.model('User', UserSchema);
    const Workspace = mongoose.model('Workspace', WorkspaceSchema);
    const SocialAccount = mongoose.model('SocialAccount', SocialAccountSchema);
    const Content = mongoose.model('Content', ContentSchema);
    
    const cleanupResults = {
      usersProcessed: 0,
      duplicatesRemoved: 0,
      errors: []
    };

    // Get all users
    const allUsers = await User.find({}).lean();
    console.log(`📊 Found ${allUsers.length} users to process`);
    
    for (const user of allUsers) {
      try {
        // Get all workspaces for this user
        const workspaces = await Workspace.find({ userId: user._id.toString() }).lean();
        
        if (workspaces.length > 1) {
          console.log(`👤 User ${user.email || user.username} has ${workspaces.length} workspaces`);
          
          // Keep the oldest workspace (first created)
          const sortedWorkspaces = workspaces.sort((a, b) => 
            new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
          );
          const keepWorkspace = sortedWorkspaces[0];
          const duplicateWorkspaces = sortedWorkspaces.slice(1);
          
          console.log(`   ✅ Keeping workspace: ${keepWorkspace.name} (${keepWorkspace._id})`);
          
          for (const duplicateWorkspace of duplicateWorkspaces) {
            console.log(`   🔄 Removing duplicate: ${duplicateWorkspace.name} (${duplicateWorkspace._id})`);
            
            try {
              // Migrate social accounts
              const socialAccountsResult = await SocialAccount.updateMany(
                { workspaceId: duplicateWorkspace._id.toString() },
                { workspaceId: keepWorkspace._id.toString() }
              );
              console.log(`      📱 Migrated ${socialAccountsResult.modifiedCount} social accounts`);
              
              // Migrate content
              const contentResult = await Content.updateMany(
                { workspaceId: duplicateWorkspace._id.toString() },
                { workspaceId: keepWorkspace._id.toString() }
              );
              console.log(`      📝 Migrated ${contentResult.modifiedCount} content items`);
              
              // Delete the duplicate workspace
              await Workspace.findByIdAndDelete(duplicateWorkspace._id);
              console.log(`      🗑️ Deleted duplicate workspace`);
              
              cleanupResults.duplicatesRemoved++;
            } catch (migrationError) {
              console.error(`      ❌ Migration error for workspace ${duplicateWorkspace._id}:`, migrationError);
              cleanupResults.errors.push(`Workspace ${duplicateWorkspace._id}: ${migrationError.message}`);
            }
          }
          
          // Ensure the kept workspace is marked as default
          await Workspace.findByIdAndUpdate(keepWorkspace._id, { isDefault: true });
        }
        
        cleanupResults.usersProcessed++;
      } catch (userError) {
        console.error(`❌ Error processing user ${user._id}:`, userError);
        cleanupResults.errors.push(`User ${user._id}: ${userError.message}`);
      }
    }
    
    console.log(`\n🎉 Simple cleanup completed!`);
    console.log(`📊 Summary: ${cleanupResults.usersProcessed} users processed, ${cleanupResults.duplicatesRemoved} duplicates removed`);
    
    if (cleanupResults.errors.length > 0) {
      console.log(`⚠️ Errors encountered:`);
      cleanupResults.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    return cleanupResults;
    
  } catch (error) {
    console.error('❌ Simple cleanup error:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('📋 Database connection closed');
  }
}

// Run the cleanup
cleanupDuplicateWorkspaces()
  .then(results => {
    console.log('\n✅ Workspace cleanup completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Workspace cleanup failed:', error);
    process.exit(1);
  });