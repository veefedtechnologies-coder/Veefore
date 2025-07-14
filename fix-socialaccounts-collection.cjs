const mongoose = require('mongoose');

async function fixSocialAccountsCollection() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const targetWorkspaceId = '6847b9cdfabaede1706f2994'; // arpit9996363's workspace
    
    // Access the socialaccounts collection directly
    const SocialAccounts = mongoose.connection.collection('socialaccounts');
    
    console.log('\n=== CURRENT SOCIAL ACCOUNTS ===');
    const allSocialAccounts = await SocialAccounts.find({}).toArray();
    console.log(`Total social accounts: ${allSocialAccounts.length}`);
    
    // Show all accounts to understand the data structure
    allSocialAccounts.forEach(account => {
      console.log(`Account: ${account.username || account.accountId || 'N/A'}`);
      console.log(`  - Platform: ${account.platform}`);
      console.log(`  - WorkspaceId: ${account.workspaceId}`);
      console.log(`  - ID: ${account._id}`);
      console.log(`  - Has Access Token: ${account.accessToken ? 'YES' : 'NO'}`);
      console.log(`  - Is Active: ${account.isActive}`);
      console.log('  ---');
    });
    
    // Find accounts in the target workspace
    const workspaceAccounts = await SocialAccounts.find({ workspaceId: targetWorkspaceId }).toArray();
    console.log(`\nAccounts in target workspace (${targetWorkspaceId}): ${workspaceAccounts.length}`);
    
    // Show Instagram accounts in target workspace
    const instagramAccounts = workspaceAccounts.filter(acc => acc.platform === 'instagram');
    console.log(`Instagram accounts in target workspace: ${instagramAccounts.length}`);
    
    instagramAccounts.forEach(account => {
      console.log(`Instagram Account: ${account.username}`);
      console.log(`  - ID: ${account._id}`);
      console.log(`  - Account ID: ${account.accountId || 'N/A'}`);
      console.log(`  - Has Token: ${account.accessToken ? 'YES' : 'NO'}`);
      console.log(`  - Is Active: ${account.isActive}`);
    });
    
    // Keep only @rahulc1020, remove others
    const rahulAccount = instagramAccounts.find(acc => acc.username === 'rahulc1020');
    
    if (rahulAccount) {
      console.log(`\n✅ Found @rahulc1020 account: ${rahulAccount._id}`);
      
      // Remove all other Instagram accounts from this workspace
      const accountsToRemove = instagramAccounts.filter(acc => acc.username !== 'rahulc1020');
      
      if (accountsToRemove.length > 0) {
        console.log(`\n🧹 Removing ${accountsToRemove.length} incorrect Instagram accounts:`);
        for (const account of accountsToRemove) {
          console.log(`  - Removing: ${account.username} (ID: ${account._id})`);
          await SocialAccounts.deleteOne({ _id: account._id });
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
    const finalWorkspaceAccounts = await SocialAccounts.find({ workspaceId: targetWorkspaceId }).toArray();
    console.log(`Total accounts in workspace after cleanup: ${finalWorkspaceAccounts.length}`);
    
    const finalInstagramAccounts = finalWorkspaceAccounts.filter(acc => acc.platform === 'instagram');
    console.log(`Instagram accounts after cleanup: ${finalInstagramAccounts.length}`);
    
    finalInstagramAccounts.forEach(account => {
      console.log(`  - ${account.username} (ID: ${account._id})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

fixSocialAccountsCollection()
  .then(() => {
    console.log('✅ Social accounts cleanup completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  });