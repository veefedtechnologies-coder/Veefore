// Fix cvfbf workspace as default with 2 credits
import mongoose from 'mongoose';

async function fixCvfbfDefault() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('=== FIXING CVFBF WORKSPACE AS DEFAULT ===');
    
    const db = mongoose.connection.db;
    const userId = '6844027426cae0200f88b5db';
    
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
    console.log('✓ Removed default from all workspaces');
    
    // Set cvfbf as default with 2 credits
    const updateResult = await db.collection('workspaces').updateOne(
      { 
        userId: userId,
        name: 'cvfbf'
      },
      { 
        $set: { 
          isDefault: true,
          credits: 2,
          updatedAt: new Date()
        }
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log('✓ cvfbf workspace set as default with 2 credits');
    } else {
      console.log('❌ Failed to update cvfbf workspace');
    }
    
    // Verify final state
    const workspaces = await db.collection('workspaces').find({
      userId: userId
    }).toArray();
    
    console.log('\n=== FINAL WORKSPACE STATE ===');
    workspaces.forEach(ws => {
      console.log(`${ws.name}: ${ws.credits} credits (Default: ${ws.isDefault})`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Workspace configuration updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixCvfbfDefault();