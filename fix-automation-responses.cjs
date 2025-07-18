const { MongoClient, ObjectId } = require('mongodb');

async function fixAutomationResponses() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    console.log('=== FIXING AUTOMATION RULE RESPONSES ===\n');
    
    // Your workspace ID
    const yourWorkspaceId = '6847b9cdfabaede1706f2994';
    
    // Update your automation rule to have the exact responses you configured
    const ruleId = '687a7f8cddfb1a23078c0887'; // Your UI-created rule
    
    console.log(`Updating rule ${ruleId} with your configured responses...`);
    
    const updateResult = await db.collection('automationrules').updateOne(
      { _id: new ObjectId(ruleId) },
      {
        $set: {
          commentReplies: [
            'Message sent!',
            'Found it? 😊', 
            'Sent just now! 🚀'
          ],
          dmResponses: [
            'hi'
          ],
          keywords: ['info', 'free', 'details', 'product'] // Add more keywords
        },
        $unset: { 
          action: "" 
        }
      }
    );
    
    console.log('Update result:', updateResult);
    
    // Verify the update
    const updatedRule = await db.collection('automationrules').findOne(
      { _id: new ObjectId(ruleId) }
    );
    
    console.log('\n=== UPDATED RULE ===');
    console.log('Name:', updatedRule.name);
    console.log('Keywords:', updatedRule.keywords);
    console.log('Comment replies:', updatedRule.commentReplies);
    console.log('DM responses:', updatedRule.dmResponses);
    console.log('Action field:', updatedRule.action);
    
    console.log('\n✅ SUCCESS: Rule updated with your exact responses!');
    console.log('✅ Webhook will now use: "Message sent!" and "hi"');
    
  } finally {
    await client.close();
  }
}

fixAutomationResponses();