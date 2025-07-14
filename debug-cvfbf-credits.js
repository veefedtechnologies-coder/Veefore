// Direct MongoDB update to fix cvfbf workspace credits
import { MongoClient } from 'mongodb';

async function debugCvfbfCredits() {
  let client;
  try {
    console.log('=== DEBUGGING CVFBF WORKSPACE CREDITS ===');
    
    // Connect directly to MongoDB
    client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    const db = client.db();
    
    const userId = '6844027426cae0200f88b5db';
    
    // First, check current workspace state
    const workspaces = await db.collection('workspaces').find({
      userId: userId
    }).toArray();
    
    console.log('\n=== CURRENT WORKSPACE STATE ===');
    workspaces.forEach(ws => {
      console.log(`${ws.name}: ${ws.credits} credits (Default: ${ws.isDefault})`);
    });
    
    // Find cvfbf workspace
    const cvfbfWorkspace = workspaces.find(ws => ws.name === 'cvfbf');
    if (!cvfbfWorkspace) {
      console.log('❌ cvfbf workspace not found');
      return;
    }
    
    console.log(`\n=== UPDATING CVFBF WORKSPACE ===`);
    console.log(`Current cvfbf credits: ${cvfbfWorkspace.credits}`);
    
    // Update cvfbf workspace: set credits to 2 and make it default
    const updateResult = await db.collection('workspaces').updateOne(
      { 
        _id: cvfbfWorkspace._id
      },
      { 
        $set: { 
          credits: 2,
          isDefault: true,
          updatedAt: new Date()
        }
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log('✅ cvfbf workspace updated: 2 credits, set as default');
    } else {
      console.log('❌ Failed to update cvfbf workspace');
    }
    
    // Remove default from all other workspaces
    await db.collection('workspaces').updateMany(
      { 
        userId: userId,
        _id: { $ne: cvfbfWorkspace._id }
      },
      { 
        $set: { 
          isDefault: false,
          updatedAt: new Date()
        }
      }
    );
    console.log('✅ Removed default from other workspaces');
    
    // Verify final state
    const updatedWorkspaces = await db.collection('workspaces').find({
      userId: userId
    }).toArray();
    
    console.log('\n=== FINAL WORKSPACE STATE ===');
    updatedWorkspaces.forEach(ws => {
      console.log(`${ws.name}: ${ws.credits} credits (Default: ${ws.isDefault})`);
    });
    
    console.log('\n✅ cvfbf workspace configuration updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

debugCvfbfCredits();