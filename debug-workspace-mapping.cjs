const { MongoClient } = require('mongodb');

async function debugWorkspaceMapping() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    console.log('=== WORKSPACE AND SOCIAL ACCOUNT MAPPING DEBUG ===\n');
    
    // Get all social accounts
    const socialAccounts = await db.collection('socialaccounts').find({}).toArray();
    
    console.log('ALL SOCIAL ACCOUNTS:');
    socialAccounts.forEach((account, index) => {
      console.log(`${index + 1}. Account: @${account.username}`);
      console.log(`   - ID: ${account._id}`);
      console.log(`   - Platform: ${account.platform}`);
      console.log(`   - Workspace: ${account.workspaceId}`);
      console.log(`   - Page ID: ${account.pageId || 'N/A'}`);
      console.log(`   - Instagram ID: ${account.instagramId || 'N/A'}`);
      console.log('');
    });
    
    // Get all workspaces
    const workspaces = await db.collection('workspaces').find({}).toArray();
    
    console.log('ALL WORKSPACES:');
    workspaces.forEach((workspace, index) => {
      console.log(`${index + 1}. Workspace: ${workspace.name || 'Unnamed'}`);
      console.log(`   - ID: ${workspace._id}`);
      console.log(`   - Owner: ${workspace.ownerId}`);
      console.log('');
    });
    
    // Get all automation rules
    const rules = await db.collection('automationrules').find({}).toArray();
    
    console.log('ALL AUTOMATION RULES:');
    rules.forEach((rule, index) => {
      console.log(`${index + 1}. Rule: ${rule.name || 'Unnamed'}`);
      console.log(`   - ID: ${rule._id}`);
      console.log(`   - Workspace: ${rule.workspaceId}`);
      console.log(`   - Type: ${rule.type}`);
      console.log(`   - Keywords: ${rule.keywords}`);
      console.log(`   - Active: ${rule.isActive}`);
      console.log('');
    });
    
    // Test webhook pageId matching
    const testPageId = "17841474747481653"; // The pageId we're testing with
    console.log(`=== TESTING PAGE ID MATCHING FOR: ${testPageId} ===\n`);
    
    const matchingAccount = socialAccounts.find(account => 
      account.pageId === testPageId || 
      account.instagramId === testPageId ||
      account.accountId === testPageId
    );
    
    if (matchingAccount) {
      console.log('FOUND MATCHING SOCIAL ACCOUNT:');
      console.log(`- Username: @${matchingAccount.username}`);
      console.log(`- Workspace: ${matchingAccount.workspaceId}`);
      console.log(`- Page ID: ${matchingAccount.pageId}`);
      console.log(`- Instagram ID: ${matchingAccount.instagramId}`);
      console.log(`- Account ID: ${matchingAccount.accountId}`);
      
      // Find rules for this workspace
      const workspaceRules = rules.filter(rule => rule.workspaceId === matchingAccount.workspaceId);
      console.log(`\nRULES FOR THIS WORKSPACE (${workspaceRules.length}):`);
      workspaceRules.forEach(rule => {
        console.log(`- ${rule.name || 'Unnamed'} (${rule.type})`);
        console.log(`  Keywords: ${rule.keywords}`);
      });
    } else {
      console.log('❌ NO MATCHING SOCIAL ACCOUNT FOUND');
      console.log('Available Page IDs in database:');
      socialAccounts.forEach(account => {
        console.log(`- @${account.username}: pageId=${account.pageId}, instagramId=${account.instagramId}, accountId=${account.accountId}`);
      });
    }
    
  } finally {
    await client.close();
  }
}

debugWorkspaceMapping();