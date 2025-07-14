/**
 * Direct Workspace Cleanup Test - Using Application Database Connection
 * 
 * This script directly uses the application's MongoDB storage to clean up
 * duplicate workspaces without relying on external connections.
 */

const { MongoStorage } = require('./server/mongodb-storage.ts');

async function testDirectWorkspaceCleanup() {
  console.log('🔧 Starting direct workspace cleanup test...');
  
  const storage = new MongoStorage();
  
  try {
    // Initialize the storage connection
    await storage.connect();
    console.log('✅ Connected to MongoDB via application storage');
    
    const cleanupResults = {
      usersProcessed: 0,
      duplicatesRemoved: 0,
      errors: []
    };

    // Get all users using the storage method
    const allUsers = await storage.getAllUsers();
    console.log(`📊 Found ${allUsers.length} users to process`);
    
    for (const user of allUsers) {
      try {
        const workspaces = await storage.getWorkspacesByUserId(user.id);
        
        if (workspaces.length > 1) {
          console.log(`👤 User ${user.email || user.username} has ${workspaces.length} workspaces`);
          
          // Keep the oldest workspace (first created)
          const sortedWorkspaces = workspaces.sort((a, b) => 
            new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
          );
          const keepWorkspace = sortedWorkspaces[0];
          const duplicateWorkspaces = sortedWorkspaces.slice(1);
          
          console.log(`   ✅ Keeping workspace: ${keepWorkspace.name} (${keepWorkspace.id})`);
          
          for (const duplicateWorkspace of duplicateWorkspaces) {
            console.log(`   🔄 Removing duplicate: ${duplicateWorkspace.name} (${duplicateWorkspace.id})`);
            
            try {
              // Migrate social accounts
              const socialAccounts = await storage.getSocialAccountsByWorkspace(duplicateWorkspace.id);
              for (const account of socialAccounts) {
                await storage.updateSocialAccount(account.id, { workspaceId: keepWorkspace.id });
              }
              console.log(`      📱 Migrated ${socialAccounts.length} social accounts`);
              
              // Migrate content
              const content = await storage.getContentByWorkspace(duplicateWorkspace.id);
              for (const item of content) {
                await storage.updateContent(item.id, { workspaceId: keepWorkspace.id });
              }
              console.log(`      📝 Migrated ${content.length} content items`);
              
              // Migrate automation rules (if method exists)
              try {
                const rules = await storage.getAutomationRulesByWorkspaceId?.(duplicateWorkspace.id) || [];
                for (const rule of rules) {
                  await storage.updateAutomationRule(rule.id, { workspaceId: keepWorkspace.id });
                }
                console.log(`      🤖 Migrated ${rules.length} automation rules`);
              } catch (automationError) {
                console.log(`      ⚠️ Automation rules migration skipped: ${automationError.message}`);
              }
              
              // Delete the duplicate workspace
              await storage.deleteWorkspace(duplicateWorkspace.id);
              console.log(`      🗑️ Deleted duplicate workspace`);
              
              cleanupResults.duplicatesRemoved++;
            } catch (migrationError) {
              console.error(`      ❌ Migration error for workspace ${duplicateWorkspace.id}:`, migrationError);
              cleanupResults.errors.push(`Workspace ${duplicateWorkspace.id}: ${migrationError.message}`);
            }
          }
          
          // Ensure the kept workspace is marked as default
          await storage.updateWorkspace(keepWorkspace.id, { isDefault: true });
        }
        
        cleanupResults.usersProcessed++;
      } catch (userError) {
        console.error(`❌ Error processing user ${user.id}:`, userError);
        cleanupResults.errors.push(`User ${user.id}: ${userError.message}`);
      }
    }
    
    console.log(`\n🎉 Direct cleanup completed!`);
    console.log(`📊 Summary: ${cleanupResults.usersProcessed} users processed, ${cleanupResults.duplicatesRemoved} duplicates removed`);
    
    if (cleanupResults.errors.length > 0) {
      console.log(`⚠️ Errors encountered:`);
      cleanupResults.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    return cleanupResults;
    
  } catch (error) {
    console.error('❌ Direct cleanup error:', error);
    throw error;
  }
}

// Run the cleanup
testDirectWorkspaceCleanup()
  .then(results => {
    console.log('\n✅ Workspace cleanup test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Workspace cleanup test failed:', error);
    process.exit(1);
  });