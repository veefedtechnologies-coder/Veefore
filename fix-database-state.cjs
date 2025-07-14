// Direct database cleanup script
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function fixDatabaseState() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    const userId = '6844027426cae0200f88b5db';
    const numericUserId = 6844027426;
    
    console.log('=== CURRENT DATABASE STATE ===');
    
    // Check current addons
    const addons = await db.collection('addons').find({
      $or: [
        { userId: userId },
        { userId: numericUserId }
      ]
    }).toArray();
    
    console.log(`Found ${addons.length} addons:`);
    const teamAddons = addons.filter(a => a.type === 'team-member' && a.isActive !== false);
    console.log(`- Team member addons: ${teamAddons.length}`);
    console.log(`- Other addons: ${addons.length - teamAddons.length}`);
    
    // Check current invitations across all workspace formats
    const invitations = await db.collection('team_invitations').find({
      $or: [
        { workspaceId: 684402 },
        { workspaceId: '684402c2fd2cd4eb6521b386' },
        { workspaceId: 'My VeeFore Workspace' }
      ]
    }).toArray();
    
    console.log(`Found ${invitations.length} pending invitations`);
    
    console.log('\n=== PERFORMING COMPLETE CLEANUP ===');
    
    // Delete all addons for user
    const addonResult = await db.collection('addons').deleteMany({
      $or: [
        { userId: userId },
        { userId: numericUserId }
      ]
    });
    
    console.log(`✓ Deleted ${addonResult.deletedCount} addons`);
    
    // Delete all invitations for all workspace formats
    const invitationResult = await db.collection('team_invitations').deleteMany({
      $or: [
        { workspaceId: 684402 },
        { workspaceId: '684402c2fd2cd4eb6521b386' },
        { workspaceId: 'My VeeFore Workspace' }
      ]
    });
    
    console.log(`✓ Deleted ${invitationResult.deletedCount} invitations`);
    
    console.log('\n=== VERIFICATION ===');
    
    // Verify cleanup
    const remainingAddons = await db.collection('addons').find({
      $or: [
        { userId: userId },
        { userId: numericUserId }
      ]
    }).toArray();
    
    const remainingInvitations = await db.collection('team_invitations').find({
      $or: [
        { workspaceId: 684402 },
        { workspaceId: '684402c2fd2cd4eb6521b386' },
        { workspaceId: 'My VeeFore Workspace' }
      ]
    }).toArray();
    
    console.log(`✓ Remaining addons: ${remainingAddons.length}`);
    console.log(`✓ Remaining invitations: ${remainingInvitations.length}`);
    
    if (remainingAddons.length === 0 && remainingInvitations.length === 0) {
      console.log('\n🎉 DATABASE CLEANUP SUCCESSFUL');
      console.log('User now has:');
      console.log('- 0 team-member addons');
      console.log('- 0 pending invitations');
      console.log('- Should be blocked from creating team invitations');
    } else {
      console.log('\n⚠️ Cleanup incomplete - some records remain');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixDatabaseState();