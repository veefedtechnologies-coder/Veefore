/**
 * Test Instagram API Response
 * Checks what data the API is returning for Instagram accounts
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function testInstagramAPIResponse() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/veeforedb');
    
    const SocialAccount = mongoose.connection.collection('socialaccounts');
    const targetWorkspaceId = '6847b9cdfabaede1706f2994';
    
    // Get Instagram account like the API does
    const instagramAccount = await SocialAccount.findOne({
      platform: 'instagram',
      workspaceId: targetWorkspaceId
    });
    
    console.log('✅ Instagram account from database:');
    console.log('ID:', instagramAccount?._id);
    console.log('Username:', instagramAccount?.username);
    console.log('Platform:', instagramAccount?.platform);
    console.log('WorkspaceId:', instagramAccount?.workspaceId);
    console.log('Followers:', instagramAccount?.followersCount);
    console.log('Profile Picture URL:', instagramAccount?.profilePictureUrl);
    console.log('Profile Picture (field exists):', !!instagramAccount?.profilePictureUrl);
    
    // Test what the API returns in the exact format
    const apiResponse = {
      id: instagramAccount._id.toString(),
      workspaceId: instagramAccount.workspaceId,
      platform: instagramAccount.platform,
      username: instagramAccount.username,
      accountId: instagramAccount.accountId || '',
      isActive: instagramAccount.isActive,
      followersCount: instagramAccount.followersCount || 0,
      followingCount: instagramAccount.followingCount || 0,
      mediaCount: instagramAccount.mediaCount || 0,
      profilePictureUrl: instagramAccount.profilePictureUrl,
      isBusinessAccount: instagramAccount.isBusinessAccount || false,
      lastSyncAt: instagramAccount.lastSyncAt
    };
    
    console.log('\n✅ API Response format:');
    console.log(JSON.stringify(apiResponse, null, 2));
    
    console.log('\n✅ Profile picture check:');
    console.log('Has profilePictureUrl field:', 'profilePictureUrl' in apiResponse);
    console.log('profilePictureUrl value:', apiResponse.profilePictureUrl);
    console.log('profilePictureUrl is truthy:', !!apiResponse.profilePictureUrl);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testInstagramAPIResponse();