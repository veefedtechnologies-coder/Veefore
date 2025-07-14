const mongoose = require('mongoose');

// MongoDB connection
async function connectToMongoDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
}

// Define the SocialAccount schema
const socialAccountSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  username: { type: String, required: true },
  accountId: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  tokenExpiresAt: { type: Date },
  isActive: { type: Boolean, default: true },
  workspaceId: { type: String, required: true },
  followersCount: { type: Number, default: 0 },
  profilePictureUrl: { type: String },
  lastSyncAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SocialAccount = mongoose.model('SocialAccount', socialAccountSchema);

async function fixSocialAccountsData() {
  try {
    await connectToMongoDB();
    
    const targetWorkspaceId = '6847b9cdfabaede1706f2994'; // arpit9996363's workspace
    
    // Find all Instagram accounts for this workspace
    console.log('\n=== CURRENT STATE ===');
    const allInstagramAccounts = await SocialAccount.find({ platform: 'instagram' });
    console.log(`Total Instagram accounts in database: ${allInstagramAccounts.length}`);
    
    for (const account of allInstagramAccounts) {
      console.log(`Account: ${account.username}`);
      console.log(`  - ID: ${account._id}`);
      console.log(`  - Workspace: ${account.workspaceId}`);
      console.log(`  - Belongs to target workspace: ${account.workspaceId === targetWorkspaceId ? 'YES' : 'NO'}`);
      console.log('  ---');
    }
    
    // Keep only @rahulc1020 for the target workspace, remove others
    const targetWorkspaceAccounts = await SocialAccount.find({ 
      workspaceId: targetWorkspaceId,
      platform: 'instagram'
    });
    
    console.log(`\nInstagram accounts in target workspace: ${targetWorkspaceAccounts.length}`);
    
    // Find the @rahulc1020 account
    const rahulAccount = targetWorkspaceAccounts.find(acc => acc.username === 'rahulc1020');
    
    if (rahulAccount) {
      console.log(`\nFound @rahulc1020 account: ${rahulAccount._id}`);
      
      // Remove all other Instagram accounts from this workspace
      const accountsToRemove = targetWorkspaceAccounts.filter(acc => acc.username !== 'rahulc1020');
      
      if (accountsToRemove.length > 0) {
        console.log(`\nRemoving ${accountsToRemove.length} incorrect Instagram accounts:`);
        for (const account of accountsToRemove) {
          console.log(`  - Removing: ${account.username} (ID: ${account._id})`);
          await SocialAccount.deleteOne({ _id: account._id });
        }
        console.log('✅ Removed incorrect accounts');
      } else {
        console.log('✅ No incorrect accounts to remove');
      }
      
    } else {
      console.log('❌ Could not find @rahulc1020 account in the target workspace');
    }
    
    // Verify final state
    console.log('\n=== FINAL STATE ===');
    const finalAccounts = await SocialAccount.find({ 
      workspaceId: targetWorkspaceId,
      platform: 'instagram'
    });
    
    console.log(`Instagram accounts in workspace after cleanup: ${finalAccounts.length}`);
    for (const account of finalAccounts) {
      console.log(`  - ${account.username} (ID: ${account._id})`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the fix
fixSocialAccountsData()
  .then(() => {
    console.log('✅ Social accounts data fix completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fix failed:', error.message);
    process.exit(1);
  });