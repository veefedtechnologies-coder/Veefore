/**
 * Cleanup Duplicate Instagram Accounts
 * Removes old Instagram accounts and keeps only the one with profile picture
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function cleanupDuplicateInstagramAccounts() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/veeforedb');
    
    const SocialAccount = mongoose.connection.collection('socialaccounts');
    const allInstagramAccounts = await SocialAccount.find({ platform: 'instagram' }).toArray();
    
    console.log(`Found ${allInstagramAccounts.length} Instagram accounts:`);
    allInstagramAccounts.forEach((acc, i) => {
      console.log(`Account ${i+1}:`);
      console.log(`  ID: ${acc._id}`);
      console.log(`  Username: ${acc.username}`);
      console.log(`  WorkspaceId: ${acc.workspaceId}`);
      console.log(`  Has Profile Picture: ${!!acc.profilePictureUrl}`);
      console.log(`  Followers: ${acc.followers || acc.followersCount || 'NOT SET'}`);
      console.log('');
    });
    
    if (allInstagramAccounts.length > 1) {
      // Find accounts without profile pictures to delete
      const accountsToDelete = allInstagramAccounts.filter(acc => !acc.profilePictureUrl);
      const accountsToKeep = allInstagramAccounts.filter(acc => !!acc.profilePictureUrl);
      
      console.log(`Accounts to delete (no profile picture): ${accountsToDelete.length}`);
      console.log(`Accounts to keep (has profile picture): ${accountsToKeep.length}`);
      
      // Delete accounts without profile pictures
      for (const account of accountsToDelete) {
        console.log(`🗑️  Deleting account without profile picture: ${account._id} (@${account.username})`);
        await SocialAccount.deleteOne({ _id: account._id });
      }
      
      // Ensure the kept account has the correct workspace ID
      if (accountsToKeep.length > 0) {
        const keepAccount = accountsToKeep[0];
        console.log(`✅ Keeping account: ${keepAccount._id} (@${keepAccount.username})`);
        
        // Make sure this account has the correct workspace ID from the server logs
        const correctWorkspaceId = '6847b9cdfabaede1706f2994';
        if (keepAccount.workspaceId !== correctWorkspaceId) {
          console.log(`🔄 Updating workspace ID from ${keepAccount.workspaceId} to ${correctWorkspaceId}`);
          await SocialAccount.updateOne(
            { _id: keepAccount._id },
            { $set: { workspaceId: correctWorkspaceId } }
          );
        }
      }
    }
    
    // Final verification
    const finalAccounts = await SocialAccount.find({ platform: 'instagram' }).toArray();
    console.log(`\n✅ Final result: ${finalAccounts.length} Instagram account(s):`);
    finalAccounts.forEach((acc, i) => {
      console.log(`Account ${i+1}: ${acc._id} (@${acc.username}) - WorkspaceId: ${acc.workspaceId} - Profile Pic: ${!!acc.profilePictureUrl ? 'YES' : 'NO'}`);
    });
    
    console.log('\n🎉 Instagram account cleanup completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanupDuplicateInstagramAccounts();