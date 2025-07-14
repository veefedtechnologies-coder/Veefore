/**
 * Debug Live Instagram Data
 * Check what Instagram account is actually being returned to frontend
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function debugLiveInstagramData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/veeforedb');
    
    const SocialAccount = mongoose.connection.collection('socialaccounts');
    const targetWorkspaceId = '6847b9cdfabaede1706f2994';
    
    console.log('🔍 Checking ALL Instagram accounts in database:');
    const allInstagramAccounts = await SocialAccount.find({ platform: 'instagram' }).toArray();
    
    console.log(`Found ${allInstagramAccounts.length} total Instagram accounts:`);
    allInstagramAccounts.forEach((acc, i) => {
      console.log(`\nAccount ${i+1}:`);
      console.log(`  ID: ${acc._id}`);
      console.log(`  Username: ${acc.username}`);
      console.log(`  WorkspaceId: ${acc.workspaceId}`);
      console.log(`  Followers: ${acc.followersCount || acc.followers || 'NOT SET'}`);
      console.log(`  Profile Picture: ${acc.profilePictureUrl ? 'HAS URL ✅' : 'NO URL ❌'}`);
      if (acc.profilePictureUrl) {
        console.log(`  URL: ${acc.profilePictureUrl.substring(0, 100)}...`);
      }
    });
    
    console.log('\n🎯 Checking specific workspace Instagram account:');
    const workspaceAccount = await SocialAccount.findOne({
      platform: 'instagram',
      workspaceId: targetWorkspaceId
    });
    
    if (workspaceAccount) {
      console.log('✅ Workspace Instagram account found:');
      console.log(`  ID: ${workspaceAccount._id}`);
      console.log(`  Username: ${workspaceAccount.username}`);
      console.log(`  WorkspaceId: ${workspaceAccount.workspaceId}`);
      console.log(`  Followers: ${workspaceAccount.followersCount}`);
      console.log(`  Profile Picture: ${workspaceAccount.profilePictureUrl ? 'HAS URL ✅' : 'NO URL ❌'}`);
      console.log(`  Last Sync: ${workspaceAccount.lastSyncAt}`);
      
      // Simulate what API returns
      console.log('\n📡 Simulated API response:');
      const apiResponse = {
        id: workspaceAccount._id.toString(),
        workspaceId: workspaceAccount.workspaceId,
        platform: workspaceAccount.platform,
        username: workspaceAccount.username,
        accountId: workspaceAccount.accountId || '',
        isActive: workspaceAccount.isActive,
        followersCount: workspaceAccount.followersCount || 0,
        followingCount: workspaceAccount.followingCount || 0,
        mediaCount: workspaceAccount.mediaCount || 0,
        profilePictureUrl: workspaceAccount.profilePictureUrl,
        isBusinessAccount: workspaceAccount.isBusinessAccount || false,
        lastSyncAt: workspaceAccount.lastSyncAt
      };
      
      console.log(JSON.stringify(apiResponse, null, 2));
      
    } else {
      console.log('❌ No Instagram account found for workspace:', targetWorkspaceId);
    }
    
    console.log('\n🔍 Checking for any old accounts that might be interfering:');
    const oldAccountId = '686f93483ca1722cfa9837f2';
    const oldAccount = await SocialAccount.findOne({ _id: new mongoose.Types.ObjectId(oldAccountId) });
    
    if (oldAccount) {
      console.log('⚠️  OLD ACCOUNT STILL EXISTS:', oldAccount);
    } else {
      console.log('✅ Old account successfully deleted');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    process.exit(1);
  }
}

debugLiveInstagramData();