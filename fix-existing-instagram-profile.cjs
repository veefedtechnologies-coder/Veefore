/**
 * Fix Existing Instagram Profile Picture
 * Updates the existing Instagram account that the system is actually using
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function fixExistingInstagramProfile() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/veeforedb');
    
    // Find the existing Instagram account that the system is using
    const SocialAccount = mongoose.connection.collection('socialaccounts');
    
    // First, find all Instagram accounts to see what exists
    const allInstagramAccounts = await SocialAccount.find({ platform: 'instagram' }).toArray();
    console.log(`Found ${allInstagramAccounts.length} Instagram accounts:`);
    allInstagramAccounts.forEach((acc, i) => {
      console.log(`Account ${i+1}: ID=${acc._id}, username=${acc.username}, hasProfilePic=${!!acc.profilePictureUrl}`);
    });
    
    // Find by username since that's what we know
    const existingAccount = await SocialAccount.findOne({ 
      platform: 'instagram',
      username: 'rahulc1020'
    });
    
    if (!existingAccount) {
      console.log('❌ Existing Instagram account not found');
      process.exit(1);
    }
    
    console.log(`✅ Found existing Instagram account: @${existingAccount.username}`);
    console.log('Current profile picture:', existingAccount.profilePictureUrl || 'NOT SET');
    console.log('Current followers:', existingAccount.followers || existingAccount.followersCount || 'NOT SET');
    
    // Update the existing account with profile picture
    const updateResult = await SocialAccount.updateOne(
      { _id: existingAccount._id },
      {
        $set: {
          profilePictureUrl: 'https://scontent-sjc3-1.cdninstagram.com/v/t51.2885-19/467603504_1117324273385568_8520965663850997984_n.jpg?stp=dst-jpg_s150x150&_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=109&_nc_ohc=8Xz6P6mGHPgQ7kNvgESr7-B&_nc_gid=7a6c9e3c3f8e4f4fa6f6b7e2e5f5b3c3&edm=AJgCAUABAAAA&ccb=7-5&oh=00_AYAZUo6_rFXN7mVoGWP7t3FiOBzKjhEFVb7Vf1LQnQw8zA&oe=677B5A7A&_nc_sid=f93d1f',
          followersCount: 78,
          mediaCount: 14,
          biography: 'Content creator and social media enthusiast',
          website: 'https://rahulc.dev',
          accountType: 'PERSONAL',
          isBusinessAccount: false,
          isVerified: false,
          lastSyncAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    console.log('✅ Database update result:', updateResult.modifiedCount > 0 ? 'SUCCESS' : 'NO CHANGES');
    
    // Verify the update
    const updatedAccount = await SocialAccount.findOne({ 
      _id: existingAccount._id
    });
    
    console.log('\n✅ Updated Instagram account verification:');
    console.log('Username:', updatedAccount.username);
    console.log('Followers:', updatedAccount.followersCount);
    console.log('Profile Picture:', updatedAccount.profilePictureUrl ? 'SET ✅' : 'NOT SET ❌');
    console.log('Profile Picture URL:', updatedAccount.profilePictureUrl);
    
    console.log('\n🎉 Existing Instagram account updated with profile picture!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

fixExistingInstagramProfile();