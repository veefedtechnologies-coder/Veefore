const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const baseURL = 'http://localhost:5000';

async function testCompleteCommentToDM() {
  const client = new MongoClient(DATABASE_URL);
  await client.connect();
  const db = client.db('veeforedb');
  
  try {
    console.log('\n=== COMPLETE COMMENT-TO-DM AUTOMATION TEST ===');
    
    // Clean up any existing test rules
    await db.collection('automationrules').deleteMany({ 
      name: { $regex: /Complete Test/ }
    });
    
    const workspaceId = '684402c2fd2cd4eb6521b386'; // The workspace with most rules
    
    // Create a new comment-to-DM rule with a specific keyword
    const rule = await db.collection('automationrules').insertOne({
      name: 'Complete Test - Comment to DM',
      workspaceId: workspaceId,
      type: 'dm',
      postInteraction: true,
      isActive: true,
      keywords: ['testdm'],
      responses: ['I\'ll DM you!'],
      action: {
        type: 'dm',
        responses: ['Here are the details you requested!'],
        dmResponses: ['Here are the details you requested!'],
        aiPersonality: 'helpful',
        responseLength: 'medium'
      },
      platform: 'instagram',
      triggers: {
        keywords: ['testdm'],
        aiMode: 'keyword'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Created test rule:', rule.insertedId);
    
    // Verify the rule was created correctly
    const createdRule = await db.collection('automationrules').findOne({ _id: rule.insertedId });
    console.log('📋 Rule verification:');
    console.log(`   Name: ${createdRule.name}`);
    console.log(`   Type: ${createdRule.type}`);
    console.log(`   postInteraction: ${createdRule.postInteraction}`);
    console.log(`   Keywords: ${createdRule.keywords.join(', ')}`);
    console.log(`   Workspace: ${createdRule.workspaceId}`);
    
    // Send webhook with the specific keyword
    const webhookPayload = {
      object: 'instagram',
      entry: [{
        id: '9505923456179711',
        time: Date.now(),
        changes: [{
          field: 'comments',
          value: {
            from: {
              id: 'test_user_complete',
              username: 'test_user_complete'
            },
            post_id: '17856498618156045',
            comment_id: `complete_test_${Date.now()}`,
            created_time: Date.now(),
            text: 'testdm please' // This should trigger the rule
          }
        }]
      }]
    };
    
    console.log('\n🚀 Sending webhook with trigger keyword "testdm"...');
    
    const response = await fetch(`${baseURL}/api/instagram/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });
    
    const result = await response.text();
    console.log(`📥 Response: ${result}`);
    
    if (response.ok) {
      console.log('\n✅ Webhook sent successfully');
      console.log('📊 Expected behavior:');
      console.log('   1. Webhook selects workspace 684402c2fd2cd4eb6521b386 (4 rules)');
      console.log('   2. Finds "Complete Test - Comment to DM" rule');
      console.log('   3. Detects postInteraction=true');
      console.log('   4. Matches keyword "testdm" in comment');
      console.log('   5. Processes comment-to-DM automation');
      console.log('   6. Sends comment reply AND DM');
      console.log('\n📋 Check server logs for:');
      console.log('   - "Rule Complete Test - Comment to DM: postInteraction=true"');
      console.log('   - "canHandleComments=true"');
      console.log('   - "Starting comment-to-DM automation"');
    } else {
      console.error('\n❌ Webhook failed:', response.status, result);
    }
    
    // Clean up
    await db.collection('automationrules').deleteOne({ _id: rule.insertedId });
    console.log('\n🧹 Cleaned up test rule');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await client.close();
  }
}

testCompleteCommentToDM().catch(console.error);