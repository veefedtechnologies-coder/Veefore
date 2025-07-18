import mongoose from 'mongoose';

async function testNewWebhookProcessor() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Check all possible collections for automation rules
    const collections = await db.listCollections().toArray();
    console.log('\n=== ALL COLLECTIONS IN DATABASE ===');
    collections.forEach(collection => {
      console.log('- ' + collection.name);
    });
    
    // Try different collection names
    const possibleCollections = ['automationrules', 'automation_rules', 'rules', 'automations'];
    let rules = [];
    let usedCollection = '';
    
    for (const collectionName of possibleCollections) {
      try {
        const collectionRules = await db.collection(collectionName).find({}).toArray();
        if (collectionRules.length > 0) {
          rules = collectionRules;
          usedCollection = collectionName;
          break;
        }
      } catch (error) {
        // Collection doesn't exist, continue
      }
    }
    
    console.log(`\n=== AUTOMATION RULES from '${usedCollection}' (${rules.length} total) ===`);
    
    rules.forEach((rule, index) => {
      console.log(`\nRule ${index + 1}: ${rule.name || 'Unnamed'}`);
      console.log('Workspace ID:', rule.workspaceId);
      console.log('Type:', rule.type);
      console.log('Keywords:', rule.keywords);
      console.log('Is Active:', rule.isActive);
      console.log('Comment replies:', rule.commentReplies);
      console.log('DM responses:', rule.dmResponses);
      console.log('Action responses:', rule.action?.responses);
      console.log('Action DM responses:', rule.action?.dmResponses);
    });
    
    // Test a webhook event against workspace 6847b9cdfabaede1706f2994
    const testWorkspaceId = '6847b9cdfabaede1706f2994';
    const testKeyword = 'free';
    
    console.log(`\n=== TESTING WEBHOOK FOR WORKSPACE ${testWorkspaceId} ===`);
    console.log(`Testing keyword: "${testKeyword}"`);
    
    // Find rules for this workspace
    const workspaceRules = rules.filter(rule => 
      rule.workspaceId === testWorkspaceId && 
      rule.isActive && 
      rule.keywords && 
      rule.keywords.some(keyword => keyword.toLowerCase().includes(testKeyword.toLowerCase()))
    );
    
    console.log(`Found ${workspaceRules.length} matching rules for workspace`);
    
    workspaceRules.forEach((rule, index) => {
      console.log(`\nMatching Rule ${index + 1}:`);
      console.log('Name:', rule.name);
      console.log('Type:', rule.type);
      console.log('Keywords:', rule.keywords);
      console.log('Comment replies that would be used:', rule.commentReplies || rule.action?.responses || []);
      console.log('DM responses that would be used:', rule.dmResponses || rule.action?.dmResponses || []);
      
      // Simulate what the webhook processor would do
      const commentResponses = rule.commentReplies || rule.action?.responses || [];
      const dmResponses = rule.dmResponses || rule.action?.dmResponses || [];
      
      if (rule.type === 'comment_dm') {
        console.log('\n--- SIMULATION: Comment → DM automation ---');
        if (commentResponses.length > 0) {
          console.log('✅ Would reply to comment:', commentResponses[0]);
        } else {
          console.log('❌ No comment response configured');
        }
        if (dmResponses.length > 0) {
          console.log('✅ Would send DM:', dmResponses[0]);
        } else {
          console.log('❌ No DM response configured');
        }
      }
    });
    
    if (workspaceRules.length === 0) {
      console.log('❌ No active rules found for this workspace and keyword combination');
      console.log('\nDEBUG: All rules for workspace:');
      const allWorkspaceRules = rules.filter(rule => rule.workspaceId === testWorkspaceId);
      console.log(`Found ${allWorkspaceRules.length} total rules for workspace`);
      allWorkspaceRules.forEach(rule => {
        console.log(`- ${rule.name}: active=${rule.isActive}, keywords=${rule.keywords}`);
      });
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

testNewWebhookProcessor();