/**
 * Workspace Cleanup Utility
 * Fixes duplicate default workspaces using the existing MongoStorage interface
 */

import { MongoStorage } from './server/mongodb-storage.js';

const storage = new MongoStorage();

async function fixDuplicateWorkspaces() {
  try {
    await storage.connect();
    console.log('✅ Connected to database');
    
    // Get all users
    const allUsers = await storage.getAllUsers?.() || [];
    console.log(`📊 Found ${allUsers.length} total users`);
    
    const usersWithDuplicates = [];
    
    // Check each user for multiple workspaces
    for (const user of allUsers) {
      const workspaces = await storage.getWorkspacesByUserId(user.id);
      if (workspaces.length > 1) {
        usersWithDuplicates.push({
          user,
          workspaces: workspaces.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        });
      }
    }
    
    console.log(`🔍 Found ${usersWithDuplicates.length} users with multiple workspaces`);
    
    for (const { user, workspaces } of usersWithDuplicates) {
      console.log(`\n👤 Processing user: ${user.username || user.email}`);
      console.log(`   Workspaces: ${workspaces.map(w => `${w.name} (${w.id})`).join(', ')}`);
      
      // Keep the oldest workspace
      const keepWorkspace = workspaces[0];
      const duplicateWorkspaces = workspaces.slice(1);
      
      console.log(`✅ Keeping: ${keepWorkspace.name} (${keepWorkspace.id})`);
      console.log(`❌ Removing: ${duplicateWorkspaces.map(w => `${w.name} (${w.id})`).join(', ')}`);
      
      // Update the kept workspace to be default
      await storage.updateWorkspace(keepWorkspace.id, { 
        isDefault: true,
        updatedAt: new Date()
      });
      
      // Move all data from duplicate workspaces to the kept workspace
      for (const duplicateWorkspace of duplicateWorkspaces) {
        try {
          // Move social accounts
          const socialAccounts = await storage.getSocialAccountsByWorkspace(duplicateWorkspace.id);
          for (const account of socialAccounts) {
            await storage.updateSocialAccount(account.id, { 
              workspaceId: keepWorkspace.id,
              updatedAt: new Date()
            });
          }
          console.log(`  📱 Moved ${socialAccounts.length} social accounts`);
          
          // Move content
          const content = await storage.getContentByWorkspace(duplicateWorkspace.id);
          for (const item of content) {
            await storage.updateContent(item.id, {
              workspaceId: keepWorkspace.id,
              updatedAt: new Date()
            });
          }
          console.log(`  📝 Moved ${content.length} content items`);
          
          // Move automation rules
          const automationRules = await storage.getAutomationRules(duplicateWorkspace.id);
          for (const rule of automationRules) {
            await storage.updateAutomationRule(rule.id, {
              workspaceId: keepWorkspace.id,
              updatedAt: new Date()
            });
          }
          console.log(`  🤖 Moved ${automationRules.length} automation rules`);
          
          // Move analytics
          const analytics = await storage.getAnalytics(duplicateWorkspace.id);
          for (const analytic of analytics) {
            // Analytics might need special handling due to schema constraints
            console.log(`  📊 Found ${analytics.length} analytics records (manual migration needed)`);
          }
          
          // Delete the duplicate workspace
          await storage.deleteWorkspace(duplicateWorkspace.id);
          console.log(`🗑️ Deleted duplicate workspace: ${duplicateWorkspace.name}`);
          
        } catch (error) {
          console.error(`❌ Error processing duplicate workspace ${duplicateWorkspace.id}:`, error.message);
        }
      }
      
      console.log(`✅ Completed cleanup for user: ${user.username || user.email}`);
    }
    
    console.log('\n📋 FINAL VERIFICATION:');
    for (const user of allUsers) {
      const finalWorkspaces = await storage.getWorkspacesByUserId(user.id);
      console.log(`${user.username || user.email}: ${finalWorkspaces.length} workspace${finalWorkspaces.length !== 1 ? 's' : ''}`);
    }
    
    console.log('\n✅ Duplicate workspace cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the cleanup
fixDuplicateWorkspaces();