const { ObjectId } = require('mongodb');
const { storage } = require('./server/mongodb-storage');

async function debugWorkspaceMapping() {
  try {
    console.log('=== DEBUGGING WORKSPACE MAPPING ===');
    
    // Get all workspaces
    const workspaces = await storage.getWorkspacesByUser('68419e8d8f6646f9b10b8c13');
    console.log('\n=== ALL WORKSPACES ===');
    workspaces.forEach(w => {
      console.log(`ID: ${w.id}, Name: ${w.name}`);
    });
    
    // Get social accounts for each workspace
    for (const workspace of workspaces) {
      console.log(`\n=== SOCIAL ACCOUNTS FOR WORKSPACE: ${workspace.name} (${workspace.id}) ===`);
      const accounts = await storage.getSocialAccountsByWorkspace(workspace.id);
      accounts.forEach(a => {
        console.log(`  Platform: ${a.platform}, Username: ${a.username}`);
      });
    }
    
    // Check specific workspace IDs
    console.log('\n=== CHECKING SPECIFIC IDS ===');
    console.log('ghhh workspace ID should be: 6842b7b079c6bf1e517505f3');
    console.log('My VeeFore workspace ID should be: 6841a7d5d70118ce230574f8');
    
    const ghhhhAccounts = await storage.getSocialAccountsByWorkspace('6842b7b079c6bf1e517505f3');
    console.log(`ghhh workspace accounts:`, ghhhhAccounts.map(a => a.username));
    
    const myVeeForeAccounts = await storage.getSocialAccountsByWorkspace('6841a7d5d70118ce230574f8');
    console.log(`My VeeFore workspace accounts:`, myVeeForeAccounts.map(a => a.username));
    
  } catch (error) {
    console.error('Debug error:', error);
  }
}

debugWorkspaceMapping();