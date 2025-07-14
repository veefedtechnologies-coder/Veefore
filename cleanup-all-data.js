import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function cleanupAllData() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not found in environment');
    return;
  }
  
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    console.log('Starting cleanup of all addons and invitations...');
    
    // Remove all addons for the user
    const addonResult = await db.collection('addons').deleteMany({
      $or: [
        { userId: '6844027426cae0200f88b5db' },
        { userId: '6844027426' },
        { userId: 6844027426 }
      ]
    });
    console.log(`Deleted ${addonResult.deletedCount} addon records`);
    
    // Remove all team invitations for the workspace
    const invitationResult = await db.collection('teaminvitations').deleteMany({
      workspaceId: '684402c2fd2cd4eb6521b386'
    });
    console.log(`Deleted ${invitationResult.deletedCount} invitation records`);
    
    // Remove all workspace members except owner
    const memberResult = await db.collection('workspacemembers').deleteMany({
      workspaceId: '684402c2fd2cd4eb6521b386',
      role: { $ne: 'owner' }
    });
    console.log(`Deleted ${memberResult.deletedCount} member records`);
    
    console.log('Cleanup completed successfully');
    
  } catch (error) {
    console.error('Cleanup failed:', error);
  } finally {
    await client.close();
  }
}

cleanupAllData();