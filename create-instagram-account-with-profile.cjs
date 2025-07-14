/**
 * Create Instagram Account with Profile Picture
 * Creates a test Instagram account with profile picture for development
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function createInstagramAccountWithProfile() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/veeforedb');
    
    // Find workspace ID first
    const Workspace = mongoose.connection.collection('workspaces');
    const workspace = await Workspace.findOne({});
    
    if (!workspace) {
      console.log('❌ No workspace found');
      process.exit(1);
    }
    
    console.log(`✅ Found workspace: ${workspace.name} (ID: ${workspace._id})`);
    
    // Create Instagram account with profile picture
    const SocialAccount = mongoose.connection.collection('socialaccounts');
    
    // First check if account already exists
    const existingAccount = await SocialAccount.findOne({ 
      platform: 'instagram',
      workspaceId: workspace._id.toString()
    });
    
    if (existingAccount) {
      console.log(`✅ Found existing Instagram account: @${existingAccount.username}`);
      
      // Update with profile picture
      const updateResult = await SocialAccount.updateOne(
        { _id: existingAccount._id },
        {
          $set: {
            profilePictureUrl: 'https://scontent-sjc3-1.cdninstagram.com/v/t51.2885-19/467603504_1117324273385568_8520965663850997984_n.jpg?stp=dst-jpg_s150x150&_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=109&_nc_ohc=8Xz6P6mGHPgQ7kNvgESr7-B&_nc_gid=7a6c9e3c3f8e4f4fa6f6b7e2e5f5b3c3&edm=AJgCAUABAAAA&ccb=7-5&oh=00_AYAZUo6_rFXN7mVoGWP7t3FiOBzKjhEFVb7Vf1LQnQw8zA&oe=677B5A7A&_nc_sid=f93d1f',
            followersCount: 78,
            mediaCount: 14,
            lastSyncAt: new Date(),
            updatedAt: new Date()
          }
        }
      );
      
      console.log('✅ Updated existing account with profile picture');
    } else {
      // Create new Instagram account
      const instagramAccount = {
        workspaceId: workspace._id.toString(),
        platform: 'instagram',
        username: 'rahulc1020',
        accountId: '17841460024815691',
        accessToken: 'test_access_token',
        isActive: true,
        followersCount: 78,
        followingCount: 200,
        mediaCount: 14,
        biography: 'Content creator and social media enthusiast',
        website: 'https://rahulc.dev',
        profilePictureUrl: 'https://scontent-sjc3-1.cdninstagram.com/v/t51.2885-19/467603504_1117324273385568_8520965663850997984_n.jpg?stp=dst-jpg_s150x150&_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=109&_nc_ohc=8Xz6P6mGHPgQ7kNvgESr7-B&_nc_gid=7a6c9e3c3f8e4f4fa6f6b7e2e5f5b3c3&edm=AJgCAUABAAAA&ccb=7-5&oh=00_AYAZUo6_rFXN7mVoGWP7t3FiOBzKjhEFVb7Vf1LQnQw8zA&oe=677B5A7A&_nc_sid=f93d1f',
        accountType: 'PERSONAL',
        isBusinessAccount: false,
        isVerified: false,
        lastSyncAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await SocialAccount.insertOne(instagramAccount);
      console.log('✅ Created new Instagram account with ID:', result.insertedId);
    }
    
    // Verify the account exists with profile picture
    const finalAccount = await SocialAccount.findOne({ 
      platform: 'instagram',
      workspaceId: workspace._id.toString()
    });
    
    console.log('\n✅ Final Instagram account verification:');
    console.log('Username:', finalAccount.username);
    console.log('Followers:', finalAccount.followersCount);
    console.log('Profile Picture:', finalAccount.profilePictureUrl ? 'SET ✅' : 'NOT SET ❌');
    console.log('Profile Picture URL:', finalAccount.profilePictureUrl);
    
    console.log('\n🎉 Instagram account with profile picture ready!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Creation failed:', error);
    process.exit(1);
  }
}

createInstagramAccountWithProfile();