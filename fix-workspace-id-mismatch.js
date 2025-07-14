import mongoose from 'mongoose';

// MongoDB connection
async function fixWorkspaceIdMismatch() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('socialaccounts');

    // Find the Instagram account with incorrect workspace ID
    const account = await collection.findOne({
      username: 'rahulc1020',
      platform: 'instagram',
      workspaceId: 684402
    });

    if (account) {
      console.log('Found account with incorrect workspace ID:', account._id);
      console.log('Current workspaceId:', account.workspaceId, '(type:', typeof account.workspaceId, ')');

      // Update with correct workspace ID
      const result = await collection.updateOne(
        { _id: account._id },
        { 
          $set: { 
            workspaceId: '684402c2fd2cd4eb6521b386',
            updatedAt: new Date()
          } 
        }
      );

      console.log('Update result:', result);
      
      // Verify the update
      const updatedAccount = await collection.findOne({ _id: account._id });
      console.log('Updated workspaceId:', updatedAccount.workspaceId, '(type:', typeof updatedAccount.workspaceId, ')');
      
      console.log('✅ Workspace ID fixed successfully');
    } else {
      console.log('❌ Instagram account not found');
    }

  } catch (error) {
    console.error('Error fixing workspace ID:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixWorkspaceIdMismatch();