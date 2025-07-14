const mongoose = require('mongoose');

async function findMysteryUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // The logs show user ID: 6847b9cdfabaede1706f2990 but mongodb found: 686fadc75a78f3701c4cb261
    // Let's check both users
    
    const Users = mongoose.connection.collection('users');
    const Workspaces = mongoose.connection.collection('workspaces');
    const SocialAccounts = mongoose.connection.collection('socialaccounts');
    
    console.log('\n=== CHECKING LOG USER ID ===');
    const logUser = await Users.findOne({ _id: new mongoose.Types.ObjectId('6847b9cdfabaede1706f2990') });
    if (logUser) {
      console.log('Log User Found:');
      console.log(`  - ID: ${logUser._id}`);
      console.log(`  - Email: ${logUser.email}`);
      console.log(`  - Username: ${logUser.username}`);
      
      // Check workspaces for this user
      const logUserWorkspaces = await Workspaces.find({ ownerId: '6847b9cdfabaede1706f2990' }).toArray();
      console.log(`  - Workspaces: ${logUserWorkspaces.length}`);
      
      for (const workspace of logUserWorkspaces) {
        console.log(`    Workspace: ${workspace.name} (${workspace._id})`);
        
        // Check social accounts in this workspace
        const socialAccounts = await SocialAccounts.find({ workspaceId: workspace._id.toString() }).toArray();
        console.log(`    Social Accounts: ${socialAccounts.length}`);
        
        for (const account of socialAccounts) {
          console.log(`      - ${account.platform}: ${account.username} (${account._id})`);
        }
      }
    } else {
      console.log('Log User NOT found in database');
    }
    
    console.log('\n=== CHECKING EMAIL USER ID ===');
    const emailUser = await Users.findOne({ _id: new mongoose.Types.ObjectId('686fadc75a78f3701c4cb261') });
    if (emailUser) {
      console.log('Email User Found:');
      console.log(`  - ID: ${emailUser._id}`);
      console.log(`  - Email: ${emailUser.email}`);
      console.log(`  - Username: ${emailUser.username}`);
      
      // Check workspaces for this user
      const emailUserWorkspaces = await Workspaces.find({ ownerId: '686fadc75a78f3701c4cb261' }).toArray();
      console.log(`  - Workspaces: ${emailUserWorkspaces.length}`);
      
      for (const workspace of emailUserWorkspaces) {
        console.log(`    Workspace: ${workspace.name} (${workspace._id})`);
        
        // Check social accounts in this workspace
        const socialAccounts = await SocialAccounts.find({ workspaceId: workspace._id.toString() }).toArray();
        console.log(`    Social Accounts: ${socialAccounts.length}`);
        
        for (const account of socialAccounts) {
          console.log(`      - ${account.platform}: ${account.username} (${account._id})`);
        }
      }
    } else {
      console.log('Email User NOT found in database');
    }
    
    // Let's also check the specific workspace ID from logs
    console.log('\n=== CHECKING WORKSPACE FROM LOGS ===');
    const workspace = await Workspaces.findOne({ _id: new mongoose.Types.ObjectId('6847b9cdfabaede1706f2994') });
    if (workspace) {
      console.log(`Workspace found: ${workspace.name}`);
      console.log(`  - ID: ${workspace._id}`);
      console.log(`  - Owner ID: ${workspace.ownerId}`);
      
      const socialAccounts = await SocialAccounts.find({ workspaceId: workspace._id.toString() }).toArray();
      console.log(`  - Social Accounts: ${socialAccounts.length}`);
      
      for (const account of socialAccounts) {
        console.log(`    - ${account.platform}: ${account.username} (${account._id})`);
      }
    }
    
    // Check all social accounts that are being synced
    console.log('\n=== CHECKING SYNCED ACCOUNT IDS ===');
    const syncedIds = ['68569db6da0a92ced2271391', '6856d6ac9fdcbe6ea5e3c8b7', '686f93483ca1722cfa9837f2'];
    
    for (const id of syncedIds) {
      const account = await SocialAccounts.findOne({ _id: new mongoose.Types.ObjectId(id) });
      if (account) {
        console.log(`Account ${id}:`);
        console.log(`  - Platform: ${account.platform}`);
        console.log(`  - Username: ${account.username}`);
        console.log(`  - Workspace ID: ${account.workspaceId}`);
        console.log(`  - Access Token: ${account.accessToken ? 'YES' : 'NO'}`);
      } else {
        console.log(`Account ${id}: NOT FOUND`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

findMysteryUser()
  .then(() => {
    console.log('✅ Mystery user search completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Mystery user search failed:', error.message);
    process.exit(1);
  });