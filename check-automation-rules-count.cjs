const { MongoClient } = require('mongodb');

async function checkAutomationRulesCount() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    console.log('=== AUTOMATION RULES COUNT ANALYSIS ===\n');
    
    const wrongWorkspace = '684402c2fd2cd4eb6521b386';
    const yourWorkspace = '6847b9cdfabaede1706f2994';
    
    // Get rules for wrong workspace
    const wrongRules = await db.collection('automationrules').find({
      workspaceId: wrongWorkspace,
      isActive: true
    }).toArray();
    
    console.log(`WRONG WORKSPACE (${wrongWorkspace}) - ${wrongRules.length} active rules:`);
    wrongRules.forEach(rule => {
      console.log(`- ${rule.name || 'Unnamed'} (${rule.type})`);
      console.log(`  Keywords: ${rule.keywords}`);
      console.log(`  Comment replies: ${rule.commentReplies?.length || 0}`);
      console.log(`  DM responses: ${rule.dmResponses?.length || 0}`);
      console.log('');
    });
    
    // Get rules for your workspace
    const yourRules = await db.collection('automationrules').find({
      workspaceId: yourWorkspace,
      isActive: true
    }).toArray();
    
    console.log(`YOUR WORKSPACE (${yourWorkspace}) - ${yourRules.length} active rules:`);
    yourRules.forEach(rule => {
      console.log(`- ${rule.name || 'Unnamed'} (${rule.type})`);
      console.log(`  Keywords: ${rule.keywords}`);
      console.log(`  Comment replies: ${rule.commentReplies?.length || 0}`);
      console.log(`  DM responses: ${rule.dmResponses?.length || 0}`);
      if (rule.action) {
        console.log(`  Action responses: ${rule.action.responses?.length || 0}`);
        console.log(`  Action dmResponses: ${rule.action.dmResponses?.length || 0}`);
      }
      console.log('');
    });
    
    if (yourRules.length >= wrongRules.length) {
      console.log('✅ Your workspace has equal or more rules - should be selected');
    } else {
      console.log('❌ Wrong workspace has more rules - explains why it\'s being selected');
    }
    
  } finally {
    await client.close();
  }
}

checkAutomationRulesCount();