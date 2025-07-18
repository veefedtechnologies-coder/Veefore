const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const baseURL = 'http://localhost:5000';

async function testFreshCommentToDM() {
  const client = new MongoClient(DATABASE_URL);
  await client.connect();
  const db = client.db('veeforedb');
  
  try {
    console.log('\n=== FRESH COMMENT-TO-DM TEST ===');
    
    // Clean up previous tests
    await db.collection('automationrules').deleteMany({ 
      name: { $regex: /Fresh Test/ }
    });
    
    const workspaceId = '684402c2fd2cd4eb6521b386';
    
    // Create a fresh test rule with "details" keyword
    const rule = await db.collection('automationrules').insertOne({
      name: 'Fresh Test - Comment to DM',
      workspaceId: workspaceId,
      type: 'dm',
      postInteraction: true,
      isActive: true,
      keywords: ['details'],
      responses: ['I will send you details!'],
      action: {
        type: 'dm',
        responses: ['Here are the details you requested!'],
        dmResponses: ['Here are the details you requested!'],
        aiPersonality: 'helpful',
        responseLength: 'short'
      },
      platform: 'instagram',
      triggers: {
        keywords: ['details'],
        aiMode: 'keyword'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Created fresh test rule with keyword "details"');
    
    // Send webhook with unique comment ID
    const uniqueCommentId = `fresh_test_${Date.now()}`;
    const webhookPayload = {
      object: 'instagram',
      entry: [{
        id: '9505923456179711',
        time: Date.now(),
        changes: [{
          field: 'comments',
          value: {
            from: {
              id: 'fresh_test_user',
              username: 'fresh_test_user'
            },
            post_id: '17856498618156045',
            comment_id: uniqueCommentId,
            created_time: Date.now(),
            text: 'I need details please' // Should trigger the rule
          }
        }]
      }]
    };
    
    console.log(`\n🚀 Sending webhook with comment: "I need details please"`);
    console.log(`📝 Comment ID: ${uniqueCommentId}`);
    
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
      console.log('   1. Detect comment contains "details"');
      console.log('   2. Match keyword trigger');
      console.log('   3. Process comment-to-DM automation');
      console.log('   4. Send comment reply + DM');
      console.log('\n🔍 Check logs for:');
      console.log('   - "Rule Fresh Test - Comment to DM: postInteraction=true"');
      console.log('   - "Keyword match found: details"');
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

testFreshCommentToDM().catch(console.error);