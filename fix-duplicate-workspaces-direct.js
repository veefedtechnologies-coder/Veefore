/**
 * Direct MongoDB Cleanup for Duplicate Workspaces
 * Uses mongoose to connect to MongoDB and fix existing duplicate workspaces
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function fixDuplicateWorkspaces() {
  const mongoUri = process.env.DATABASE_URL;
  
  if (!mongoUri) {
    throw new Error('DATABASE_URL environment variable not found');
  }
  
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Define schemas for direct access
    const UserSchema = new mongoose.Schema({}, { collection: 'users', strict: false });
    const WorkspaceSchema = new mongoose.Schema({}, { collection: 'workspaces', strict: false });
    const SocialAccountSchema = new mongoose.Schema({}, { collection: 'socialaccounts', strict: false });
    const ContentSchema = new mongoose.Schema({}, { collection: 'content', strict: false });
    const AutomationRuleSchema = new mongoose.Schema({}, { collection: 'automationrules', strict: false });
    
    const UserModel = mongoose.model('User', UserSchema);
    const WorkspaceModel = mongoose.model('Workspace', WorkspaceSchema);
    const SocialAccountModel = mongoose.model('SocialAccount', SocialAccountSchema);
    const ContentModel = mongoose.model('Content', ContentSchema);
    const AutomationRuleModel = mongoose.model('AutomationRule', AutomationRuleSchema);
    
    // Find all users
    const users = await UserModel.find({}).lean();
    console.log(`📊 Found ${users.length} total users`);
    
    const usersWithDuplicates = [];
    
    // Check each user for multiple workspaces
    for (const user of users) {
      const workspaces = await WorkspaceModel.find({ userId: user._id }).sort({ createdAt: 1 }).lean();
      if (workspaces.length > 1) {
        usersWithDuplicates.push({
          user,
          workspaces
        });
      }
    }
    
    console.log(`🔍 Found ${usersWithDuplicates.length} users with multiple workspaces`);
    
    for (const { user, workspaces } of usersWithDuplicates) {
      console.log(`\n👤 Processing user: ${user.email}`);
      console.log(`   Workspaces: ${workspaces.map(w => `${w.name} (${w._id})`).join(', ')}`);
      
      // Keep the oldest workspace (first in sorted array)
      const keepWorkspace = workspaces[0];
      const duplicateWorkspaces = workspaces.slice(1);
      
      console.log(`✅ Keeping: ${keepWorkspace.name} (${keepWorkspace._id})`);
      console.log(`❌ Removing: ${duplicateWorkspaces.map(w => `${w.name} (${w._id})`).join(', ')}`);
      
      // Update the kept workspace to be default
      await WorkspaceModel.updateOne(
        { _id: keepWorkspace._id },
        { 
          $set: { 
            isDefault: true,
            updatedAt: new Date()
          }
        }
      );
      
      // Move all data from duplicate workspaces to the kept workspace
      for (const duplicateWorkspace of duplicateWorkspaces) {
        try {
          // Move social accounts
          const socialAccountsResult = await SocialAccountModel.updateMany(
            { workspaceId: duplicateWorkspace._id.toString() },
            { 
              $set: { 
                workspaceId: keepWorkspace._id.toString(),
                updatedAt: new Date()
              }
            }
          );
          console.log(`  📱 Moved ${socialAccountsResult.modifiedCount} social accounts`);
          
          // Move content
          const contentResult = await ContentModel.updateMany(
            { workspaceId: duplicateWorkspace._id.toString() },
            {
              $set: {
                workspaceId: keepWorkspace._id.toString(),
                updatedAt: new Date()
              }
            }
          );
          console.log(`  📝 Moved ${contentResult.modifiedCount} content items`);
          
          // Move automation rules
          const automationResult = await AutomationRuleModel.updateMany(
            { workspaceId: duplicateWorkspace._id.toString() },
            {
              $set: {
                workspaceId: keepWorkspace._id.toString(),
                updatedAt: new Date()
              }
            }
          );
          console.log(`  🤖 Moved ${automationResult.modifiedCount} automation rules`);
          
          // Delete the duplicate workspace
          await WorkspaceModel.deleteOne({ _id: duplicateWorkspace._id });
          console.log(`🗑️ Deleted duplicate workspace: ${duplicateWorkspace.name}`);
          
        } catch (error) {
          console.error(`❌ Error processing duplicate workspace ${duplicateWorkspace._id}:`, error.message);
        }
      }
      
      console.log(`✅ Completed cleanup for user: ${user.email}`);
    }
    
    // Final verification
    console.log('\n📋 FINAL VERIFICATION:');
    for (const user of users) {
      const finalWorkspaces = await WorkspaceModel.find({ userId: user._id }).lean();
      console.log(`${user.email}: ${finalWorkspaces.length} workspace${finalWorkspaces.length !== 1 ? 's' : ''}`);
    }
    
    console.log('\n✅ Duplicate workspace cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📋 Database connection closed');
  }
}

// Run the cleanup
fixDuplicateWorkspaces();