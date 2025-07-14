const { MongoClient } = require('mongodb');

async function testCleanupAndAddon() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    const userId = '6844027426cae0200f88b5db';
    
    console.log('=== BEFORE CLEANUP ===');
    
    // Check current addons
    const addons = await db.collection('addons').find({
      $or: [
        { userId: userId },
        { userId: parseInt(userId) }
      ]
    }).toArray();
    
    console.log(`Found ${addons.length} addons for user ${userId}`);
    addons.forEach((addon, index) => {
      console.log(`Addon ${index + 1}: ${addon.type} - ${addon.name}, active: ${addon.isActive}`);
    });
    
    // Check current invitations
    const invitations = await db.collection('team_invitations').find({
      workspaceId: { $in: [684402, 'My VeeFore Workspace'] }
    }).toArray();
    
    console.log(`Found ${invitations.length} invitations`);
    
    console.log('\n=== PERFORMING CLEANUP ===');
    
    // Delete all addons for user
    const addonResult = await db.collection('addons').deleteMany({
      $or: [
        { userId: userId },
        { userId: parseInt(userId) }
      ]
    });
    
    console.log(`Deleted ${addonResult.deletedCount} addons`);
    
    // Delete all invitations for user's workspaces
    const invitationResult = await db.collection('team_invitations').deleteMany({
      workspaceId: { $in: [684402, 'My VeeFore Workspace'] }
    });
    
    console.log(`Deleted ${invitationResult.deletedCount} invitations`);
    
    console.log('\n=== AFTER CLEANUP ===');
    
    // Verify cleanup
    const remainingAddons = await db.collection('addons').find({
      $or: [
        { userId: userId },
        { userId: parseInt(userId) }
      ]
    }).toArray();
    
    const remainingInvitations = await db.collection('team_invitations').find({
      workspaceId: { $in: [684402, 'My VeeFore Workspace'] }
    }).toArray();
    
    console.log(`Remaining addons: ${remainingAddons.length}`);
    console.log(`Remaining invitations: ${remainingInvitations.length}`);
    
    console.log('\n=== CLEANUP COMPLETED ===');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testCleanupAndAddon();