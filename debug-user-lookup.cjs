const mongoose = require('mongoose');

async function debugUserLookup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find the user first
    const Users = mongoose.connection.collection('users');
    const user = await Users.findOne({ email: 'arpit9996363@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('\n=== USER FOUND ===');
    console.log(`User ID: ${user._id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Username: ${user.username}`);
    console.log(`Firebase UID: ${user.firebaseUid}`);
    
    // Find user's workspaces
    const Workspaces = mongoose.connection.collection('workspaces');
    const workspaces = await Workspaces.find({ ownerId: user._id.toString() }).toArray();
    
    console.log(`\n=== USER WORKSPACES ===`);
    console.log(`Found ${workspaces.length} workspaces:`);
    
    for (const workspace of workspaces) {
      console.log(`Workspace: ${workspace.name}`);
      console.log(`  - ID: ${workspace._id}`);
      console.log(`  - Owner ID: ${workspace.ownerId}`);
    }
    
    // Now check all possible collections for social accounts
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const workspace of workspaces) {
      console.log(`\n=== CHECKING ALL COLLECTIONS FOR WORKSPACE ${workspace._id} ===`);
      
      for (const collection of collections) {
        try {
          const Collection = mongoose.connection.collection(collection.name);
          
          // Try different possible field names
          const queries = [
            { workspaceId: workspace._id.toString() },
            { workspaceId: workspace._id },
            { workspace_id: workspace._id.toString() },
            { workspace_id: workspace._id }
          ];
          
          for (const query of queries) {
            const docs = await Collection.find(query).toArray();
            if (docs.length > 0) {
              console.log(`Found ${docs.length} documents in ${collection.name} with query:`, query);
              docs.forEach(doc => {
                if (doc.platform || doc.username || doc.accountId) {
                  console.log(`  - Platform: ${doc.platform || 'N/A'}`);
                  console.log(`  - Username: ${doc.username || 'N/A'}`);
                  console.log(`  - Account ID: ${doc.accountId || 'N/A'}`);
                  console.log(`  - Access Token: ${doc.accessToken ? 'YES' : 'NO'}`);
                  console.log(`  - Document ID: ${doc._id}`);
                  console.log('  ---');
                }
              });
            }
          }
        } catch (error) {
          // Skip collections that don't exist or have issues
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

debugUserLookup()
  .then(() => {
    console.log('✅ User lookup completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ User lookup failed:', error.message);
    process.exit(1);
  });