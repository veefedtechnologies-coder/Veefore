/**
 * Update Instagram Profile Picture - Direct Database Update
 * Manually adds profile picture URL to existing Instagram account
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function updateInstagramProfilePicture() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/veeforedb');
    
    // Check all collections and find Instagram account
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    const SocialAccount = mongoose.connection.collection('socialaccounts');
    const allAccounts = await SocialAccount.find({}).toArray();
    console.log(`Total social accounts: ${allAccounts.length}`);
    
    if (allAccounts.length > 0) {
      console.log('All accounts:', allAccounts.map(acc => ({
        platform: acc.platform,
        username: acc.username,
        hasAccessToken: !!acc.accessToken,
        hasProfilePicture: !!acc.profilePictureUrl
      })));
    }
    
    const instagramAccount = await SocialAccount.findOne({ platform: 'instagram' });
    
    if (!instagramAccount) {
      console.log('❌ No Instagram account found');
      process.exit(1);
    }
    
    console.log(`✅ Found Instagram account: @${instagramAccount.username}`);
    console.log('Current profile picture:', instagramAccount.profilePictureUrl || 'NOT SET');
    
    if (!instagramAccount.accessToken) {
      console.log('❌ No access token found');
      process.exit(1);
    }
    
    // Fetch fresh data from Instagram API
    const apiUrl = `https://graph.instagram.com/me?fields=account_type,followers_count,media_count,profile_picture_url&access_token=${instagramAccount.accessToken}`;
    
    console.log('🔄 Fetching data from Instagram API...');
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Instagram API error:', data.error?.message || 'Unknown error');
      process.exit(1);
    }
    
    console.log('✅ Instagram API response:', {
      followers: data.followers_count,
      media: data.media_count,
      profilePicture: data.profile_picture_url ? 'YES' : 'NO'
    });
    
    // Update the account with profile picture URL
    const updateResult = await SocialAccount.updateOne(
      { _id: instagramAccount._id },
      {
        $set: {
          profilePictureUrl: data.profile_picture_url,
          followersCount: data.followers_count,
          mediaCount: data.media_count,
          lastSyncAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    console.log('✅ Database update result:', updateResult.modifiedCount > 0 ? 'SUCCESS' : 'NO CHANGES');
    
    // Verify the update
    const updatedAccount = await SocialAccount.findOne({ _id: instagramAccount._id });
    console.log('✅ Profile picture now set:', updatedAccount.profilePictureUrl ? 'YES' : 'NO');
    console.log('✅ Profile picture URL:', updatedAccount.profilePictureUrl);
    
    console.log('\n🎉 Instagram profile picture sync completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

updateInstagramProfilePicture();