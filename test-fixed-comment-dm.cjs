const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const baseURL = 'http://localhost:5000';

async function testFixedCommentToDM() {
  const client = new MongoClient(DATABASE_URL);
  await client.connect();
  const db = client.db('veeforedb');
  
  try {
    console.log('\n=== TESTING FIXED COMMENT-TO-DM AUTOMATION ===');
    
    // Clean up previous tests
    await db.collection('automationrules').deleteMany({ 
      name: { $regex: /Fixed Test/ }
    });
    
    const workspaceId = '684402c2fd2cd4eb6521b386';
    
    // Create test rule with "info" keyword
    const rule = await db.collection('automationrules').insertOne({
      name: 'Fixed Test - Comment to DM',
      workspaceId: workspaceId,
      type: 'dm',
      postInteraction: true,
      isActive: true,
      keywords: ['info'],
      responses: ['I will send you info!', 'Here is the information you requested!'],
      action: {
        type: 'dm',
        responses: ['Here is the information you requested!'],
        dmResponses: ['Here is the information you requested!'],
        aiPersonality: 'helpful',
        responseLength: 'short'
      },
      platform: 'instagram',
      triggers: {
        keywords: ['info'],
        aiMode: 'keyword'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Created test rule with keyword "info"');
    
    // Send webhook with comment containing "info"
    const uniqueCommentId = `fixed_test_${Date.now()}`;
    const webhookPayload = {
      object: 'instagram',
      entry: [{
        id: '9505923456179711',
        time: Date.now(),
        changes: [{
          field: 'comments',
          value: {
            from: {
              id: 'fixed_test_user',
              username: 'fixed_test_user'
            },
            post_id: '17856498618156045',
            comment_id: uniqueCommentId,
            created_time: Date.now(),
            text: 'Can you send me more info about this?' // Contains "info" keyword
          }
        }]
      }]
    };
    
    console.log(`\n🚀 Sending webhook with comment: "Can you send me more info about this?"`);
    console.log(`📝 Comment ID: ${uniqueCommentId}`);
    console.log(`🔍 Expected: Keyword "info" should trigger the rule`);
    
    const response = await fetch(`${baseURL}/api/instagram/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });
    
    const result = await response.text();
    console.log(`📥 Response: ${result}`);
    
    if (response.ok) {
      console.log('\n✅ Webhook sent successfully');
      console.log('🔍 Check logs for:');
      console.log('   - "Checking keywords: [\"info\"]"');
      console.log('   - "Keyword \"info\" matches"');
      console.log('   - "Keyword match found, triggering rule"');
      console.log('   - "Starting comment-to-DM automation"');
      console.log('   - "Comment reply generated"');
      console.log('   - "Sending follow-up DM"');
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

testFixedCommentToDM().catch(console.error);