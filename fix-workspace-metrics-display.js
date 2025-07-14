/**
 * Fix Workspace Metrics Display - Repair Workspace ID Mismatch
 * 
 * This script fixes the workspace ID mismatch that causes some workspaces
 * to show limited metrics by ensuring all social accounts have correct workspace IDs.
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// Define social account schema
const socialAccountSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.Mixed, required: true },
  platform: { type: String, required: true },
  username: { type: String, required: true },
  followersCount: { type: Number, default: 0 },
  mediaCount: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  totalComments: { type: Number, default: 0 },
  totalReach: { type: Number, default: 0 },
  avgEngagement: { type: Number, default: 0 },
  lastSyncAt: { type: Date },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'socialaccounts'
});

const SocialAccountModel = mongoose.model('SocialAccount', socialAccountSchema);

// Define workspace schema
const workspaceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'workspaces'
});

const WorkspaceModel = mongoose.model('Workspace', workspaceSchema);

async function fixWorkspaceMetricsDisplay() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      dbName: 'veeforedb'
    });
    console.log('✅ Connected to MongoDB');

    // Get all workspaces
    const workspaces = await WorkspaceModel.find({});
    console.log(`📊 Found ${workspaces.length} workspaces`);

    for (const workspace of workspaces) {
      const workspaceId = workspace._id.toString();
      const workspaceIdFirst6 = workspaceId.substring(0, 6);
      
      console.log(`\n🔍 Processing workspace: ${workspace.name} (ID: ${workspaceId})`);
      
      // Find social accounts with truncated workspace IDs
      const truncatedAccounts = await SocialAccountModel.find({
        $or: [
          { workspaceId: workspaceIdFirst6 },
          { workspaceId: parseInt(workspaceIdFirst6) }
        ]
      });
      
      if (truncatedAccounts.length > 0) {
        console.log(`🔧 Found ${truncatedAccounts.length} accounts with truncated workspace IDs`);
        
        for (const account of truncatedAccounts) {
          console.log(`   → Fixing @${account.username} (${account.platform}): ${account.workspaceId} → ${workspaceId}`);
          
          await SocialAccountModel.updateOne(
            { _id: account._id },
            { 
              workspaceId: workspaceId,
              updatedAt: new Date()
            }
          );
        }
        
        console.log(`✅ Fixed ${truncatedAccounts.length} social accounts for workspace: ${workspace.name}`);
      } else {
        console.log(`✅ No fixes needed for workspace: ${workspace.name}`);
      }
      
      // Verify current accounts for this workspace
      const currentAccounts = await SocialAccountModel.find({ workspaceId: workspaceId });
      console.log(`📈 Workspace "${workspace.name}" now has ${currentAccounts.length} connected accounts:`);
      
      for (const account of currentAccounts) {
        console.log(`   • @${account.username} (${account.platform}) - ${account.followersCount} followers, ${account.mediaCount} posts`);
      }
    }

    console.log('\n🎯 Workspace metrics display fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing workspace metrics display:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

// Run the fix
fixWorkspaceMetricsDisplay();