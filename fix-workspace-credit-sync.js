import { MongoClient } from 'mongodb';

async function fixWorkspaceCreditSync() {
  try {
    const client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    
    console.log('=== WORKSPACE CREDIT SYNCHRONIZATION FIX ===');
    
    const db = client.db();
    const userId = '6844027426cae0200f88b5db';
    
    // Get all workspaces for the user
    const workspaces = await db.collection('workspaces').find({
      userId: userId
    }).toArray();
    
    console.log('Current workspaces:');
    workspaces.forEach(ws => {
      console.log(`- ${ws.name}: ${ws.credits} credits (ID: ${ws._id})`);
    });
    
    // Find the cvfbf workspace and ensure it has 2 credits
    const cvfbfWorkspace = workspaces.find(ws => ws.name === 'cvfbf');
    if (cvfbfWorkspace) {
      console.log(`\nUpdating cvfbf workspace to have 2 credits...`);
      await db.collection('workspaces').updateOne(
        { _id: cvfbfWorkspace._id },
        { 
          $set: { 
            credits: 2,
            updatedAt: new Date()
          }
        }
      );
      console.log('✓ cvfbf workspace updated to 2 credits');
    }
    
    // Set cvfbf as the default workspace
    if (cvfbfWorkspace) {
      console.log('\nSetting cvfbf as default workspace...');
      
      // First, remove default from all workspaces
      await db.collection('workspaces').updateMany(
        { userId: userId },
        { 
          $set: { 
            isDefault: false,
            updatedAt: new Date()
          }
        }
      );
      
      // Then set cvfbf as default
      await db.collection('workspaces').updateOne(
        { _id: cvfbfWorkspace._id },
        { 
          $set: { 
            isDefault: true,
            updatedAt: new Date()
          }
        }
      );
      console.log('✓ cvfbf workspace set as default');
    }
    
    // Verify the changes
    const updatedWorkspaces = await db.collection('workspaces').find({
      userId: userId
    }).toArray();
    
    console.log('\n=== UPDATED WORKSPACE STATUS ===');
    updatedWorkspaces.forEach(ws => {
      console.log(`- ${ws.name}: ${ws.credits} credits (Default: ${ws.isDefault}) (ID: ${ws._id})`);
    });
    
    await client.close();
    console.log('\n✅ Workspace credit synchronization completed!');
    
  } catch (error) {
    console.error('❌ Error fixing workspace credits:', error);
  }
}

fixWorkspaceCreditSync();