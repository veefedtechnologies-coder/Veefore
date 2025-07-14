const mongoose = require('mongoose');

async function findSocialAccountsCollection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // List all collections in the database
    console.log('\n=== ALL COLLECTIONS IN DATABASE ===');
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections:`);
    
    for (const collection of collections) {
      console.log(`- ${collection.name}`);
    }
    
    // Check each collection for social account-like data
    console.log('\n=== SEARCHING FOR SOCIAL ACCOUNT DATA ===');
    
    for (const collection of collections) {
      try {
        const Collection = db.collection(collection.name);
        
        // Look for Instagram-related documents
        const instagramDocs = await Collection.find({
          $or: [
            { platform: 'instagram' },
            { username: 'rahulc1020' },
            { username: 'arpit9996363' },
            { accountId: { $exists: true } },
            { accessToken: { $exists: true } }
          ]
        }).toArray();
        
        if (instagramDocs.length > 0) {
          console.log(`\n🔍 Found ${instagramDocs.length} Instagram-related documents in "${collection.name}" collection:`);
          
          for (const doc of instagramDocs) {
            console.log(`Document ID: ${doc._id}`);
            console.log(`  - Platform: ${doc.platform || 'N/A'}`);
            console.log(`  - Username: ${doc.username || 'N/A'}`);
            console.log(`  - WorkspaceId: ${doc.workspaceId || 'N/A'}`);
            console.log(`  - Has AccessToken: ${doc.accessToken ? 'YES' : 'NO'}`);
            console.log(`  - Followers: ${doc.followersCount || 0}`);
            console.log(`  - MediaCount: ${doc.mediaCount || 0}`);
            console.log(`  - Last Sync: ${doc.lastSyncAt || 'Never'}`);
            console.log('  ---');
          }
        }
      } catch (error) {
        // Skip collections that might have access issues
      }
    }
    
    // Now check the specific IDs being synced from the logs
    console.log('\n=== CHECKING SPECIFIC ACCOUNT IDS FROM LOGS ===');
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
            const doc = await Collection.findOne({ _id: new mongoose.Types.ObjectId(accountId) });
            if (doc) {
              console.log(`Account ${accountId} found in "${collection.name}" collection:`);
              console.log(`  - Platform: ${doc.platform || 'N/A'}`);
              console.log(`  - Username: ${doc.username || 'N/A'}`);
              console.log(`  - WorkspaceId: ${doc.workspaceId || 'N/A'}`);
              console.log(`  - Has AccessToken: ${doc.accessToken ? 'YES' : 'NO'}`);
              console.log(`  - Followers: ${doc.followersCount || 0}`);
              console.log(`  - MediaCount: ${doc.mediaCount || 0}`);
              console.log('  ---');
            }
          } catch (idError) {
            // Skip if not a valid ObjectId
          }
        }
      } catch (error) {
        // Skip collections that might have access issues
      }
    }
    
    // Check for the target workspace ID from logs
    console.log('\n=== CHECKING TARGET WORKSPACE ID ===');
    const targetWorkspaceId = '6847b9cdfabaede1706f2994';
    
    for (const collection of collections) {
      try {
        const Collection = db.collection(collection.name);
        
        try {
          const doc = await Collection.findOne({ _id: new mongoose.Types.ObjectId(targetWorkspaceId) });
          if (doc) {
            console.log(`Workspace ${targetWorkspaceId} found in "${collection.name}" collection:`);
            console.log(`  - Name: ${doc.name || 'N/A'}`);
            console.log(`  - Owner ID: ${doc.ownerId || doc.userId || 'N/A'}`);
            console.log(`  - User ID: ${doc.userId || 'N/A'}`);
            console.log('  ---');
          }
        } catch (idError) {
          // Skip if not a valid ObjectId
        }
      } catch (error) {
        // Skip collections that might have access issues
      }
    }
    
    // Check for the user ID from logs
    console.log('\n=== CHECKING LOG USER ID ===');
    const logUserId = '6847b9cdfabaede1706f2990';
    
    for (const collection of collections) {
      try {
        const Collection = db.collection(collection.name);
        
        try {
          const doc = await Collection.findOne({ _id: new mongoose.Types.ObjectId(logUserId) });
          if (doc) {
            console.log(`User ${logUserId} found in "${collection.name}" collection:`);
            console.log(`  - Email: ${doc.email || 'N/A'}`);
            console.log(`  - Username: ${doc.username || 'N/A'}`);
            console.log(`  - Firebase UID: ${doc.firebaseUid || 'N/A'}`);
            console.log(`  - Is Onboarded: ${doc.isOnboarded || 'N/A'}`);
            console.log('  ---');
          }
        } catch (idError) {
          // Skip if not a valid ObjectId
        }
      } catch (error) {
        // Skip collections that might have access issues
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

findSocialAccountsCollection()
  .then(() => {
    console.log('✅ Social accounts collection search completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Search failed:', error.message);
    process.exit(1);
  });