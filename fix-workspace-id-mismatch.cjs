/**
 * Fix Workspace ID Mismatch for Instagram Account
 * Updates Instagram account to use the correct workspace ID from server logs
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function fixWorkspaceIdMismatch() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/veeforedb');
    
    const SocialAccount = mongoose.connection.collection('socialaccounts');
    const instagramAccount = await SocialAccount.findOne({ 
      platform: 'instagram',
      username: 'rahulc1020'
    });
    
    if (!instagramAccount) {
      console.log('❌ Instagram account not found');
      process.exit(1);
    }
    
    console.log(`✅ Found Instagram account: @${instagramAccount.username}`);
    console.log('Current workspace ID:', instagramAccount.workspaceId);
    console.log('Expected workspace ID:', '6847b9cdfabaede1706f2994');
    console.log('Profile picture:', instagramAccount.profilePictureUrl ? 'SET ✅' : 'NOT SET ❌');
    
    // Update workspace ID to match what the server expects
    const correctWorkspaceId = '6847b9cdfabaede1706f2994';
    const updateResult = await SocialAccount.updateOne(
      { _id: instagramAccount._id },
      {
        $set: {
          workspaceId: correctWorkspaceId,
          updatedAt: new Date()
        }
      }
    );
    
    console.log('✅ Workspace ID update result:', updateResult.modifiedCount > 0 ? 'SUCCESS' : 'NO CHANGES');
    
    // Verify the update
    const updatedAccount = await SocialAccount.findOne({ _id: instagramAccount._id });
    console.log('\n✅ Updated Instagram account verification:');
    console.log('Username:', updatedAccount.username);
    console.log('New workspace ID:', updatedAccount.workspaceId);
    console.log('Profile Picture:', updatedAccount.profilePictureUrl ? 'SET ✅' : 'NOT SET ❌');
    console.log('Followers:', updatedAccount.followersCount);
    
    // Test the query that the server uses
    const serverQuery = await SocialAccount.findOne({
      platform: 'instagram',
      workspaceId: '6847b9cdfabaede1706f2994'
    });
    
    console.log('\n✅ Server query test:');
    console.log('Found account:', serverQuery ? `@${serverQuery.username}` : 'NOT FOUND');
    console.log('Has profile picture:', serverQuery?.profilePictureUrl ? 'YES ✅' : 'NO ❌');
    
    console.log('\n🎉 Workspace ID mismatch fixed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  }
}

fixWorkspaceIdMismatch();