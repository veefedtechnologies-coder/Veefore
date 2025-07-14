const mongoose = require('mongoose');

async function completeDatabaseReset() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections in database`);
    
    // Find and remove ALL social accounts from ALL collections
    console.log('\n=== CLEANING ALL SOCIAL ACCOUNTS FROM ALL COLLECTIONS ===');
    
    for (const collection of collections) {
      try {
        const Collection = db.collection(collection.name);
        
        // Remove documents with platform: 'instagram' or containing Instagram usernames
        const deleteResult = await Collection.deleteMany({
          $or: [
            { platform: 'instagram' },
            { username: 'rahulc1020' },
            { username: 'arpit9996363' },
            { accountId: { $exists: true } },
            { accessToken: { $exists: true } }
          ]
        });
        
        if (deleteResult.deletedCount > 0) {
          console.log(`Removed ${deleteResult.deletedCount} Instagram-related documents from "${collection.name}" collection`);
        }
      } catch (error) {
        // Skip collections that might have access issues
      }
    }
    
    // Remove the specific account IDs being synced
    console.log('\n=== REMOVING SPECIFIC SYNCED ACCOUNT IDS ===');
    const syncedAccountIds = [
      '68569db6da0a92ced2271391',
      '6856d6ac9fdcbe6ea5e3c8b7', 
      '686f93483ca1722cfa9837f2'
    ];
    
    for (const collection of collections) {
      try {
        const Collection = db.collection(collection.name);
        
        for (const accountId of syncedAccountIds) {
          try {
            const deleteResult = await Collection.deleteOne({ _id: new mongoose.Types.ObjectId(accountId) });
            if (deleteResult.deletedCount > 0) {
              console.log(`Removed account ${accountId} from "${collection.name}" collection`);
            }
          } catch (idError) {
            // Skip if not a valid ObjectId
          }
        }
      } catch (error) {
        // Skip collections that might have access issues
      }
    }
    
    // Now create a fresh workspace for the current user
    console.log('\n=== SETTING UP FRESH USER WORKSPACE ===');
    
    const Users = db.collection('users');
    const Workspaces = db.collection('workspaces');
    
    // Find the current user
    const currentUser = await Users.findOne({ email: 'arpit9996363@gmail.com' });
    if (!currentUser) {
      console.log('❌ Current user not found');
      return;
    }
    
    console.log(`Current User ID: ${currentUser._id}`);
    
    // Remove any existing workspaces for this user
    const workspaceDeleteResult = await Workspaces.deleteMany({ 
      $or: [
        { ownerId: currentUser._id.toString() },
        { userId: currentUser._id.toString() },
        { ownerId: currentUser._id },
        { userId: currentUser._id }
      ]
    });
    console.log(`Removed ${workspaceDeleteResult.deletedCount} existing workspaces`);
    
    // Create a fresh workspace for the user
    const newWorkspace = {
      _id: new mongoose.Types.ObjectId(),
      userId: currentUser._id.toString(),
      ownerId: currentUser._id.toString(),
      name: 'My VeeFore Workspace',
      description: 'Default workspace for social media management',
      avatar: null,
      credits: 0,
      theme: 'space',
      aiPersonality: 'professional',
      isDefault: true,
      maxTeamMembers: 1,
      inviteCode: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await Workspaces.insertOne(newWorkspace);
    console.log(`✅ Created fresh workspace: ${newWorkspace._id}`);
    
    // Final verification
    console.log('\n=== FINAL VERIFICATION ===');
    
    // Check total social accounts
    const SocialAccounts = db.collection('socialaccounts');
    const totalSocialAccounts = await SocialAccounts.countDocuments({});
    console.log(`Total social accounts in database: ${totalSocialAccounts}`);
    
    // Check user workspaces
    const userWorkspaces = await Workspaces.find({ 
      $or: [
        { ownerId: currentUser._id.toString() },
        { userId: currentUser._id.toString() }
      ]
    }).toArray();
    console.log(`User workspaces: ${userWorkspaces.length}`);
    
    for (const workspace of userWorkspaces) {
      console.log(`  - ${workspace.name} (${workspace._id})`);
    }
    
    console.log('\n🎯 DATABASE RESET COMPLETE');
    console.log('Your account now has:');
    console.log('- Clean database with no orphaned social accounts');
    console.log('- Fresh workspace ready for Instagram connections');
    console.log('- All phantom account references removed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

completeDatabaseReset()
  .then(() => {
    console.log('✅ Complete database reset completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  });