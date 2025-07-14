/**
 * Fix Duplicate Default Workspaces
 * 
 * This script removes duplicate default workspaces that were created due to
 * the workspace creation bug in user registration flow.
 * 
 * Logic:
 * 1. Find users with multiple workspaces
 * 2. For each user, keep the oldest workspace as default
 * 3. Remove duplicate workspaces (newer ones)
 * 4. Update workspace references in related data
 */

const { MongoClient } = require('mongodb');

// Use the same MongoDB connection string as the application
const MONGODB_URI = 'mongodb+srv://veeforedb:veeforedb@cluster0.fhcru.mongodb.net/veeforedb?retryWrites=true&w=majority&appName=Cluster0';

async function fixDuplicateWorkspaces() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('veeforedb');
    
    // Find all users with multiple workspaces
    const usersWithMultipleWorkspaces = await db.collection('workspaces').aggregate([
      {
        $group: {
          _id: '$userId',
          workspaces: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]).toArray();
    
    console.log(`\n📊 Found ${usersWithMultipleWorkspaces.length} users with multiple workspaces`);
    
    for (const userGroup of usersWithMultipleWorkspaces) {
      const userId = userGroup._id;
      const workspaces = userGroup.workspaces.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      );
      
      console.log(`\n🔍 Processing user ${userId} with ${workspaces.length} workspaces:`);
      workspaces.forEach((ws, index) => {
        console.log(`  ${index + 1}. ${ws.name} (${ws._id}) - Created: ${ws.createdAt}`);
      });
      
      // Keep the oldest workspace as the main one
      const keepWorkspace = workspaces[0];
      const duplicateWorkspaces = workspaces.slice(1);
      
      console.log(`✅ Keeping: ${keepWorkspace.name} (${keepWorkspace._id})`);
      console.log(`❌ Removing: ${duplicateWorkspaces.map(ws => `${ws.name} (${ws._id})`).join(', ')}`);
      
      // Update the kept workspace to be default
      await db.collection('workspaces').updateOne(
        { _id: keepWorkspace._id },
        { 
          $set: { 
            isDefault: true,
            updatedAt: new Date()
          }
        }
      );
      
      // Get IDs of workspaces to remove
      const workspaceIdsToRemove = duplicateWorkspaces.map(ws => ws._id.toString());
      
      // Update all related data to use the kept workspace ID
      for (const duplicateWorkspace of duplicateWorkspaces) {
        const duplicateId = duplicateWorkspace._id.toString();
        const keepId = keepWorkspace._id.toString();
        
        // Update social accounts
        const socialAccountsUpdated = await db.collection('socialaccounts').updateMany(
          { workspaceId: duplicateId },
          { $set: { workspaceId: keepId, updatedAt: new Date() } }
        );
        console.log(`  📱 Updated ${socialAccountsUpdated.modifiedCount} social accounts`);
        
        // Update scheduled content
        const scheduledContentUpdated = await db.collection('scheduledcontents').updateMany(
          { workspaceId: duplicateId },
          { $set: { workspaceId: keepId, updatedAt: new Date() } }
        );
        console.log(`  📅 Updated ${scheduledContentUpdated.modifiedCount} scheduled content items`);
        
        // Update analytics
        const analyticsUpdated = await db.collection('analytics').updateMany(
          { workspaceId: duplicateId },
          { $set: { workspaceId: keepId, updatedAt: new Date() } }
        );
        console.log(`  📊 Updated ${analyticsUpdated.modifiedCount} analytics records`);
        
        // Update suggestions
        const suggestionsUpdated = await db.collection('suggestions').updateMany(
          { workspaceId: duplicateId },
          { $set: { workspaceId: keepId, updatedAt: new Date() } }
        );
        console.log(`  💡 Updated ${suggestionsUpdated.modifiedCount} suggestions`);
        
        // Update automation rules
        const automationRulesUpdated = await db.collection('automationrules').updateMany(
          { workspaceId: duplicateId },
          { $set: { workspaceId: keepId, updatedAt: new Date() } }
        );
        console.log(`  🤖 Updated ${automationRulesUpdated.modifiedCount} automation rules`);
        
        // Update workspace members
        const workspaceMembersUpdated = await db.collection('workspacemembers').updateMany(
          { workspaceId: duplicateId },
          { $set: { workspaceId: keepId, updatedAt: new Date() } }
        );
        console.log(`  👥 Updated ${workspaceMembersUpdated.modifiedCount} workspace members`);
      }
      
      // Remove duplicate workspaces
      const deletedWorkspaces = await db.collection('workspaces').deleteMany({
        _id: { $in: duplicateWorkspaces.map(ws => ws._id) }
      });
      console.log(`🗑️ Deleted ${deletedWorkspaces.deletedCount} duplicate workspaces`);
    }
    
    // Verify final state
    console.log('\n📋 FINAL VERIFICATION:');
    const finalWorkspaces = await db.collection('workspaces').find({}).toArray();
    
    const userWorkspaceCounts = {};
    for (const workspace of finalWorkspaces) {
      const userId = workspace.userId;
      if (!userWorkspaceCounts[userId]) {
        userWorkspaceCounts[userId] = 0;
      }
      userWorkspaceCounts[userId]++;
    }
    
    console.log('Users and their workspace counts:');
    for (const [userId, count] of Object.entries(userWorkspaceCounts)) {
      const user = await db.collection('users').findOne({ _id: userId });
      const username = user ? user.username || user.email : 'Unknown';
      console.log(`  ${username} (${userId}): ${count} workspace${count !== 1 ? 's' : ''}`);
    }
    
    console.log('\n✅ Duplicate workspace cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

fixDuplicateWorkspaces();