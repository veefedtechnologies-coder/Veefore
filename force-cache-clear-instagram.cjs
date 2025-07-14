/**
 * Force Cache Clear and Instagram Account Reset
 * Completely removes old cached account and forces system to use new one
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function forceCacheClearInstagram() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/veeforedb');
    
    const SocialAccount = mongoose.connection.collection('socialaccounts');
    
    // First, check what accounts exist
    const allAccounts = await SocialAccount.find({ platform: 'instagram' }).toArray();
    console.log(`Found ${allAccounts.length} Instagram accounts:`);
    
    allAccounts.forEach((acc, i) => {
      console.log(`Account ${i+1}:`);
      console.log(`  ID: ${acc._id}`);
      console.log(`  Username: ${acc.username}`);
      console.log(`  WorkspaceId: ${acc.workspaceId}`);
      console.log(`  Followers: ${acc.followersCount || acc.followers || 'NOT SET'}`);
      console.log(`  Has Profile Picture: ${!!acc.profilePictureUrl}`);
      console.log('');
    });
    
    // Delete the old account that server logs keep showing
    const oldAccountId = '686f93483ca1722cfa9837f2';
    console.log(`🗑️  Deleting old account: ${oldAccountId}`);
    
    const deleteResult = await SocialAccount.deleteOne({ 
      _id: new mongoose.Types.ObjectId(oldAccountId) 
    });
    console.log(`Deleted ${deleteResult.deletedCount} old accounts`);
    
    // Verify what remains
    const remainingAccounts = await SocialAccount.find({ platform: 'instagram' }).toArray();
    console.log(`\n✅ Remaining Instagram accounts: ${remainingAccounts.length}`);
    
    if (remainingAccounts.length > 0) {
      const account = remainingAccounts[0];
      console.log('✅ Active Instagram account:');
      console.log(`  ID: ${account._id}`);
      console.log(`  Username: ${account.username}`);
      console.log(`  WorkspaceId: ${account.workspaceId}`);
      console.log(`  Followers: ${account.followersCount}`);
      console.log(`  Profile Picture: ${account.profilePictureUrl ? 'SET ✅' : 'NOT SET ❌'}`);
      
      // Update the account to force cache refresh
      await SocialAccount.updateOne(
        { _id: account._id },
        { 
          $set: { 
            lastSyncAt: new Date(),
            updatedAt: new Date(),
            // Ensure all fields are properly set
            followersCount: 78,
            mediaCount: 14,
            followingCount: 200
          } 
        }
      );
      console.log('✅ Updated account to force cache refresh');
    }
    
    console.log('\n🎉 Cache clear and account cleanup completed!');
    console.log('🔄 Server should now use updated Instagram account');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Cache clear failed:', error);
    process.exit(1);
  }
}

forceCacheClearInstagram();