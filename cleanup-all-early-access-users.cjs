const mongoose = require('mongoose');

async function cleanupAllEarlyAccessUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const SocialAccounts = mongoose.connection.collection('socialaccounts');
    const Users = mongoose.connection.collection('users');
    const Workspaces = mongoose.connection.collection('workspaces');
    
    // Find the current user
    const currentUser = await Users.findOne({ email: 'arpit9996363@gmail.com' });
    if (!currentUser) {
      console.log('❌ Current user not found');
      return;
    }
    
    console.log('\n=== CURRENT USER ===');
    console.log(`User ID: ${currentUser._id}`);
    console.log(`Email: ${currentUser.email}`);
    console.log(`Username: ${currentUser.username}`);
    
    // Find user's workspace
    const userWorkspace = await Workspaces.findOne({ 
      $or: [
        { ownerId: currentUser._id.toString() },
        { userId: currentUser._id.toString() },
        { ownerId: currentUser._id },
        { userId: currentUser._id }
      ]
    });
    
    if (!userWorkspace) {
      console.log('❌ No workspace found for current user');
      return;
    }
    
    console.log(`\n=== USER WORKSPACE ===`);
    console.log(`Workspace ID: ${userWorkspace._id}`);
    console.log(`Workspace Name: ${userWorkspace.name}`);
    
    // Get all social accounts in database
    console.log('\n=== ALL SOCIAL ACCOUNTS IN DATABASE ===');
    const allSocialAccounts = await SocialAccounts.find({}).toArray();
    console.log(`Total social accounts: ${allSocialAccounts.length}`);
    
    const instagramAccounts = allSocialAccounts.filter(acc => acc.platform === 'instagram');
    console.log(`Instagram accounts: ${instagramAccounts.length}`);
    
    // Show all Instagram accounts
    for (const account of instagramAccounts) {
      console.log(`Account: @${account.username}`);
      console.log(`  - ID: ${account._id}`);
      console.log(`  - WorkspaceId: ${account.workspaceId}`);
      console.log(`  - Belongs to user workspace: ${account.workspaceId === userWorkspace._id.toString() ? 'YES' : 'NO'}`);
      console.log(`  - Has token: ${account.accessToken ? 'YES' : 'NO'}`);
      console.log(`  - Is Active: ${account.isActive}`);
      console.log('  ---');
    }
    
    // Delete ALL social accounts that don't belong to current user's workspace
    const accountsToDelete = instagramAccounts.filter(acc => 
      acc.workspaceId !== userWorkspace._id.toString()
    );
    
    if (accountsToDelete.length > 0) {
      console.log(`\n🧹 REMOVING ${accountsToDelete.length} ORPHANED INSTAGRAM ACCOUNTS:`);
      for (const account of accountsToDelete) {
        console.log(`  - Removing: @${account.username} (ID: ${account._id}) - WorkspaceId: ${account.workspaceId}`);
        await SocialAccounts.deleteOne({ _id: account._id });
      }
      console.log('✅ Removed all orphaned accounts');
    } else {
      console.log('✅ No orphaned accounts to remove');
    }
    
    // Now check accounts in user's workspace
    const userWorkspaceAccounts = instagramAccounts.filter(acc => 
      acc.workspaceId === userWorkspace._id.toString()
    );
    
    console.log(`\n=== ACCOUNTS IN USER WORKSPACE ===`);
    console.log(`Instagram accounts in user workspace: ${userWorkspaceAccounts.length}`);
    
    for (const account of userWorkspaceAccounts) {
      console.log(`  - @${account.username} (ID: ${account._id})`);
    }
    
    // If there are multiple accounts in user workspace, keep only @rahulc1020
    if (userWorkspaceAccounts.length > 1) {
      const rahulAccount = userWorkspaceAccounts.find(acc => acc.username === 'rahulc1020');
      
      if (rahulAccount) {
        console.log(`\n✅ Found @rahulc1020 account: ${rahulAccount._id}`);
        
        // Remove all other accounts from user workspace
        const accountsToRemoveFromWorkspace = userWorkspaceAccounts.filter(acc => acc.username !== 'rahulc1020');
        
        if (accountsToRemoveFromWorkspace.length > 0) {
          console.log(`\n🧹 REMOVING ${accountsToRemoveFromWorkspace.length} EXTRA ACCOUNTS FROM USER WORKSPACE:`);
          for (const account of accountsToRemoveFromWorkspace) {
            console.log(`  - Removing: @${account.username} (ID: ${account._id})`);
            await SocialAccounts.deleteOne({ _id: account._id });
          }
          console.log('✅ Removed extra accounts from user workspace');
        }
      } else {
        console.log('❌ @rahulc1020 account not found in user workspace');
      }
    }
    
    // Final verification
    console.log('\n=== FINAL STATE ===');
    const finalSocialAccounts = await SocialAccounts.find({}).toArray();
    const finalInstagramAccounts = finalSocialAccounts.filter(acc => acc.platform === 'instagram');
    const finalUserWorkspaceAccounts = finalInstagramAccounts.filter(acc => 
      acc.workspaceId === userWorkspace._id.toString()
    );
    
    console.log(`Total Instagram accounts in database: ${finalInstagramAccounts.length}`);
    console.log(`Instagram accounts in user workspace: ${finalUserWorkspaceAccounts.length}`);
    
    for (const account of finalUserWorkspaceAccounts) {
      console.log(`  - @${account.username} (ID: ${account._id})`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

cleanupAllEarlyAccessUsers()
  .then(() => {
    console.log('✅ Early access users cleanup completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  });