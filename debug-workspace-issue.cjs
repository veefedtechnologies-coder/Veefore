const { MongoClient, ObjectId } = require('mongodb');

async function debugWorkspaceIssue() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log('=== DEBUGGING WORKSPACE ISSUE ===');
    
    // Get all workspaces for user
    const workspaces = await db.collection('workspaces').find({
      userId: new ObjectId('68419e8d8f6646f9b10b8c13')
    }).toArray();
    
    console.log('\n=== USER WORKSPACES ===');
    workspaces.forEach(w => {
      console.log(`ID: ${w._id}, Name: ${w.name}, IsDefault: ${w.isDefault}`);
    });
    
    // Get all social accounts
    const socialAccounts = await db.collection('socialAccounts').find({}).toArray();
    
    console.log('\n=== ALL SOCIAL ACCOUNTS ===');
    socialAccounts.forEach(a => {
      console.log(`ID: ${a._id}, WorkspaceId: ${a.workspaceId}, Platform: ${a.platform}, Username: ${a.username}`);
    });
    
    // Check specific workspace mappings
    const ghhWorkspace = workspaces.find(w => w.name === 'ghhh');
    if (ghhWorkspace) {
      console.log(`\n=== GHHH WORKSPACE DETAILS ===`);
      console.log(`ID: ${ghhWorkspace._id}`);
      
      // Find social accounts for ghhh workspace
      const ghhAccounts = await db.collection('socialAccounts').find({
        workspaceId: ghhWorkspace._id.toString()
      }).toArray();
      
      console.log(`Social accounts for ghhh workspace: ${ghhAccounts.length}`);
      ghhAccounts.forEach(a => {
        console.log(`  - ${a.platform}: ${a.username}`);
      });
    }
    
    await client.close();
  } catch (error) {
    console.error('Debug error:', error);
    await client.close();
  }
}

debugWorkspaceIssue();