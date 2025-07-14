const { MongoStorage } = require('./server/mongodb-storage.ts');

async function debugSocialAccounts() {
  const storage = new MongoStorage();
  
  try {
    await storage.connect();
    console.log('✅ Connected to MongoDB');
    
    // Check the specific user's workspace and social accounts
    const userId = '6847b9cdfabaede1706f2990'; // arpit9996363@gmail.com
    console.log('\n=== USER ANALYSIS ===');
    console.log('User ID:', userId);
    
    // Get user's workspaces
    const workspaces = await storage.getWorkspacesByUserId(userId);
    console.log('User workspaces:', workspaces.length);
    
    for (const workspace of workspaces) {
      console.log(`\nWorkspace: ${workspace.name} (ID: ${workspace.id})`);
      
      // Get social accounts for this workspace
      const socialAccounts = await storage.getSocialAccountsByWorkspace(workspace.id);
      console.log(`Social accounts in workspace: ${socialAccounts.length}`);
      
      for (const account of socialAccounts) {
        console.log(`  - Platform: ${account.platform}`);
        console.log(`  - Username: ${account.username}`);
        console.log(`  - Account ID: ${account.accountId || 'N/A'}`);
        console.log(`  - MongoDB ID: ${account.id || account._id}`);
        console.log(`  - Access Token: ${account.accessToken ? 'YES' : 'NO'}`);
        console.log(`  - Is Active: ${account.isActive}`);
        console.log(`  - Workspace ID: ${account.workspaceId}`);
        console.log('  ---');
      }
    }
    
    // Check if there are any duplicate or orphaned social accounts
    console.log('\n=== ALL SOCIAL ACCOUNTS CHECK ===');
    const allAccounts = await storage.getAllSocialAccounts();
    const instagramAccounts = allAccounts.filter(acc => acc.platform === 'instagram');
    
    console.log(`Total Instagram accounts in database: ${instagramAccounts.length}`);
    
    for (const account of instagramAccounts) {
      console.log(`Instagram Account: ${account.username}`);
      console.log(`  - Workspace ID: ${account.workspaceId}`);
      console.log(`  - MongoDB ID: ${account.id || account._id}`);
      console.log(`  - Has Token: ${account.accessToken ? 'YES' : 'NO'}`);
      
      // Check if workspace belongs to our user
      const workspace = workspaces.find(w => w.id === account.workspaceId);
      if (workspace) {
        console.log(`  - ✅ Belongs to user ${userId}`);
      } else {
        console.log(`  - ❌ Does NOT belong to user ${userId}`);
      }
      console.log('  ---');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugSocialAccounts()
  .then(() => {
    console.log('✅ Debug completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Debug failed:', error.message);
    process.exit(1);
  });