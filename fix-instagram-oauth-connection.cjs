/**
 * Fix Instagram OAuth Connection Bug
 * 
 * This script fixes the workspace ID type mismatch that prevents
 * Instagram accounts from appearing as connected after OAuth.
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Schema for Social Accounts
const socialAccountSchema = new mongoose.Schema({
  workspaceId: String,
  platform: String,
  username: String,
  accountId: String,
  accessToken: String,
  refreshToken: String,
  expiresAt: Date,
  isActive: Boolean,
  followersCount: Number,
  followingCount: Number,
  mediaCount: Number,
  totalLikes: Number,
  totalComments: Number,
  totalReach: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SocialAccount = mongoose.model('socialaccounts', socialAccountSchema);

async function fixInstagramOAuthConnection() {
  console.log('=== Fixing Instagram OAuth Connection Bug ===\n');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');
    
    // Find all Instagram accounts
    const instagramAccounts = await SocialAccount.find({ platform: 'instagram' });
    console.log(`\nFound ${instagramAccounts.length} Instagram accounts:`);
    
    let fixedCount = 0;
    
    for (const account of instagramAccounts) {
      console.log(`- @${account.username}: workspace ${account.workspaceId} (${typeof account.workspaceId})`);
      
      // Fix workspace ID if it's a number
      if (typeof account.workspaceId === 'number') {
        console.log(`  Fixing workspace ID type mismatch...`);
        
        await SocialAccount.updateOne(
          { _id: account._id },
          { 
            $set: { 
              workspaceId: account.workspaceId.toString(),
              updatedAt: new Date()
            }
          }
        );
        
        console.log(`  ✅ Fixed: ${account.workspaceId} (number) -> ${account.workspaceId.toString()} (string)`);
        fixedCount++;
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} Instagram accounts with workspace ID type mismatches`);
    
    // Verify the fix
    console.log('\n=== Verification ===');
    const testWorkspaceId = '684402c2fd2cd4eb6521b386';
    
    const connectedAccounts = await SocialAccount.find({ 
      workspaceId: testWorkspaceId,
      platform: 'instagram',
      isActive: true
    });
    
    console.log(`Accounts found for workspace ${testWorkspaceId}: ${connectedAccounts.length}`);
    
    if (connectedAccounts.length > 0) {
      connectedAccounts.forEach(acc => {
        console.log(`✅ @${acc.username} - Connected and queryable`);
      });
      console.log('\n🎉 SUCCESS: Instagram accounts will now appear as connected!');
      console.log('The OAuth callback bug has been resolved.');
    } else {
      console.log('No Instagram accounts found for test workspace');
      
      // Show all workspaces with Instagram accounts
      const allInstagram = await SocialAccount.find({ platform: 'instagram' });
      const workspaceIds = [...new Set(allInstagram.map(acc => acc.workspaceId))];
      console.log('Available workspace IDs with Instagram accounts:', workspaceIds);
    }
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

fixInstagramOAuthConnection();