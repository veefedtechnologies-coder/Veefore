// Force cleanup script using direct MongoDB connection
const { MongoClient } = require('mongodb');

async function forceCleanup() {
  const client = new MongoClient(process.env.DATABASE_URL || process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('veeforedb');
    
    // Delete all addons for the test user
    const addonResult = await db.collection('addons').deleteMany({
      $or: [
        { userId: '6844027426cae0200f88b5db' },
        { userId: 6844027426 }
      ]
    });
    
    console.log(`Deleted ${addonResult.deletedCount} addons`);
    
    // Delete all team invitations for the workspace
    const invitationResult = await db.collection('teaminvitations').deleteMany({
      $or: [
        { workspaceId: 684402 },
        { workspaceId: '684402c2fd2cd4eb6521b386' }
      ]
    });
    
    console.log(`Deleted ${invitationResult.deletedCount} invitations`);
    
    // Verify cleanup
    const remainingAddons = await db.collection('addons').countDocuments({
      $or: [
        { userId: '6844027426cae0200f88b5db' },
        { userId: 6844027426 }
      ]
    });
    
    const remainingInvitations = await db.collection('teaminvitations').countDocuments({
      $or: [
        { workspaceId: 684402 },
        { workspaceId: '684402c2fd2cd4eb6521b386' }
      ]
    });
    
    console.log(`Remaining: ${remainingAddons} addons, ${remainingInvitations} invitations`);
    
    if (remainingAddons === 0 && remainingInvitations === 0) {
      console.log('✅ Cleanup successful - team invitations should now be blocked');
    } else {
      console.log('❌ Cleanup incomplete');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

forceCleanup();