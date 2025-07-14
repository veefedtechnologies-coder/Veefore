const mongoose = require('mongoose');

async function consolidateWorkspaceAccounts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const SocialAccounts = mongoose.connection.collection('socialaccounts');
    const Users = mongoose.connection.collection('users');
    const Workspaces = mongoose.connection.collection('workspaces');
    
    // Find both user records for arpit9996363@gmail.com
    console.log('\n=== FINDING ALL USER RECORDS ===');
    const allUsersWithEmail = await Users.find({ email: 'arpit9996363@gmail.com' }).toArray();
    console.log(`Found ${allUsersWithEmail.length} users with email arpit9996363@gmail.com:`);
    
    for (const user of allUsersWithEmail) {
      console.log(`User ID: ${user._id}`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Username: ${user.username}`);
      console.log(`  - Firebase UID: ${user.firebaseUid}`);
      console.log(`  - Is Onboarded: ${user.isOnboarded}`);
      console.log('  ---');
    }
    
    // Find workspaces for both users
    console.log('\n=== FINDING WORKSPACES FOR ALL USERS ===');
    let targetWorkspace = null;
    let targetUserId = null;
    
    for (const user of allUsersWithEmail) {
      const workspaces = await Workspaces.find({ 
        $or: [
          { ownerId: user._id.toString() },
          { userId: user._id.toString() },
          { ownerId: user._id },
          { userId: user._id }
        ]
      }).toArray();
      
      console.log(`User ${user._id} has ${workspaces.length} workspaces:`);
      for (const workspace of workspaces) {
        console.log(`  - Workspace: ${workspace.name} (${workspace._id})`);
        console.log(`    Owner ID: ${workspace.ownerId || workspace.userId}`);
        
        // This should be the target workspace based on logs
        if (workspace._id.toString() === '6847b9cdfabaede1706f2994') {
          targetWorkspace = workspace;
          targetUserId = user._id.toString();
          console.log(`    *** THIS IS THE TARGET WORKSPACE ***`);
        }
      }
    }
    
    if (!targetWorkspace) {
      console.log('❌ Target workspace 6847b9cdfabaede1706f2994 not found');
      return;
    }
    
    console.log(`\n=== TARGET WORKSPACE FOUND ===`);
    console.log(`Workspace ID: ${targetWorkspace._id}`);
    console.log(`Workspace Name: ${targetWorkspace.name}`);
    console.log(`Target User ID: ${targetUserId}`);
    
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
      console.log(`  - Target workspace: ${account.workspaceId === targetWorkspace._id.toString() ? 'YES' : 'NO'}`);
      console.log(`  - Has token: ${account.accessToken ? 'YES' : 'NO'}`);
      console.log(`  - Followers: ${account.followersCount || 0}`);
      console.log('  ---');
    }
    
    // Find @rahulc1020 account to keep
    const rahulAccounts = instagramAccounts.filter(acc => acc.username === 'rahulc1020');
    console.log(`\n=== @RAHULC1020 ACCOUNTS ===`);
    console.log(`Found ${rahulAccounts.length} @rahulc1020 accounts:`);
    
    let bestRahulAccount = null;
    for (const account of rahulAccounts) {
      console.log(`@rahulc1020 Account: ${account._id}`);
      console.log(`  - WorkspaceId: ${account.workspaceId}`);
      console.log(`  - Target workspace: ${account.workspaceId === targetWorkspace._id.toString() ? 'YES' : 'NO'}`);
      console.log(`  - Has token: ${account.accessToken ? 'YES' : 'NO'}`);
      console.log(`  - Followers: ${account.followersCount || 0}`);
      
      // Prefer account in target workspace, or one with access token
      if (account.workspaceId === targetWorkspace._id.toString() || account.accessToken) {
        bestRahulAccount = account;
        console.log(`  *** SELECTING THIS AS BEST ACCOUNT ***`);
      }
    }
    
    if (!bestRahulAccount && rahulAccounts.length > 0) {
      // Fallback to first account if none in target workspace
      bestRahulAccount = rahulAccounts[0];
      console.log(`  *** USING FIRST ACCOUNT AS FALLBACK ***`);
    }
    
    if (bestRahulAccount) {
      console.log(`\n=== CONSOLIDATING TO BEST @RAHULC1020 ACCOUNT ===`);
      console.log(`Keeping account: ${bestRahulAccount._id}`);
      
      // Update the best account to be in target workspace if not already
      if (bestRahulAccount.workspaceId !== targetWorkspace._id.toString()) {
        console.log(`Updating workspace ID from ${bestRahulAccount.workspaceId} to ${targetWorkspace._id}`);
        await SocialAccounts.updateOne(
          { _id: bestRahulAccount._id },
          { 
            workspaceId: targetWorkspace._id.toString(),
            updatedAt: new Date()
          }
        );
      }
      
      // Remove all other Instagram accounts
      const accountsToRemove = instagramAccounts.filter(acc => 
        acc._id.toString() !== bestRahulAccount._id.toString()
      );
      
      if (accountsToRemove.length > 0) {
        console.log(`\n🧹 REMOVING ${accountsToRemove.length} OTHER INSTAGRAM ACCOUNTS:`);
        for (const account of accountsToRemove) {
          console.log(`  - Removing: @${account.username} (ID: ${account._id})`);
          await SocialAccounts.deleteOne({ _id: account._id });
        }
        console.log('✅ Removed all other Instagram accounts');
      }
    } else {
      console.log('❌ No @rahulc1020 account found to keep');
    }
    
    // Final verification
    console.log('\n=== FINAL STATE ===');
    const finalSocialAccounts = await SocialAccounts.find({}).toArray();
    const finalInstagramAccounts = finalSocialAccounts.filter(acc => acc.platform === 'instagram');
    
    console.log(`Total Instagram accounts in database: ${finalInstagramAccounts.length}`);
    
    for (const account of finalInstagramAccounts) {
      console.log(`  - @${account.username} (ID: ${account._id}) - Workspace: ${account.workspaceId}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

consolidateWorkspaceAccounts()
  .then(() => {
    console.log('✅ Workspace accounts consolidation completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Consolidation failed:', error.message);
    process.exit(1);
  });