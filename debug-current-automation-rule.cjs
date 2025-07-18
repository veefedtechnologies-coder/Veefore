const { MongoClient } = require('mongodb');

async function debugCurrentRule() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    // Get all automation rules
    const rules = await db.collection('automationrules').find({}).toArray();
    
    console.log('=== ALL AUTOMATION RULES IN DATABASE ===\n');
    
    rules.forEach((rule, index) => {
      console.log(`Rule ${index + 1}: ${rule.name}`);
      console.log('ID:', rule._id);
      console.log('Workspace:', rule.workspaceId);
      console.log('Type:', rule.type);
      console.log('Active:', rule.isActive);
      console.log('Keywords:', rule.keywords);
      console.log('Comment replies (rule.commentReplies):', rule.commentReplies);
      console.log('DM responses (rule.dmResponses):', rule.dmResponses);
      console.log('Action responses (rule.action.responses):', rule.action?.responses);
      console.log('Action DM responses (rule.action.dmResponses):', rule.action?.dmResponses);
      console.log('Full rule structure:', JSON.stringify(rule, null, 2));
      console.log('\n' + '='.repeat(60) + '\n');
    });
    
    // Check what the webhook is actually getting
    const workspaceId = '6847b9cdfabaede1706f2994';
    const activeRules = await db.collection('automationrules').find({
      workspaceId: workspaceId,
      isActive: true
    }).toArray();
    
    console.log(`=== ACTIVE RULES FOR WORKSPACE ${workspaceId} ===\n`);
    console.log(`Found ${activeRules.length} active rules`);
    
    activeRules.forEach((rule, index) => {
      console.log(`Active Rule ${index + 1}:`);
      console.log('Name:', rule.name);
      console.log('Keywords:', rule.keywords);
      
      // Show exactly what webhook processor would use
      const commentResponses = rule.commentReplies || rule.action?.responses || [];
      const dmResponses = rule.dmResponses || rule.action?.dmResponses || [];
      
      console.log('WEBHOOK WOULD USE:');
      console.log('- Comment responses:', commentResponses);
      console.log('- DM responses:', dmResponses);
      console.log('');
    });
    
  } finally {
    await client.close();
  }
}

debugCurrentRule();