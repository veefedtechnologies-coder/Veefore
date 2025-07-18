const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const baseURL = 'http://localhost:5000';

async function testWorkingCommentToDM() {
  console.log('\n=== TESTING WORKING COMMENT-TO-DM AUTOMATION ===');
  
  // Use a comment that matches existing keywords
  const commentId = `working_test_${Date.now()}`;
  const webhook = {
    object: 'instagram',
    entry: [{
      id: '9505923456179711',
      time: Date.now(),
      changes: [{
        field: 'comments',
        value: {
          from: {
            id: 'working_test_user',
            username: 'working_test_user'
          },
          post_id: '17856498618156045',
          comment_id: commentId,
          created_time: Date.now(),
          text: 'Can you send me more details about this product?' // Contains "details" and "product" keywords
        }
      }]
    }]
  };
  
  console.log(`🚀 Testing comment-to-DM with keyword match`);
  console.log(`📝 Comment: "Can you send me more details about this product?"`);
  console.log(`🎯 Expected keywords to match: "details", "product"`);
  console.log(`📋 Comment ID: ${commentId}`);
  
  const response = await fetch(`${baseURL}/api/instagram/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webhook)
  });
  
  const result = await response.text();
  console.log(`📥 Response: ${result}`);
  
  if (response.ok) {
    console.log('\n✅ Webhook processed successfully');
    console.log('🔍 Expected automation workflow:');
    console.log('   1. Instagram Auto-Reply: Triggers but stealth responder declines');
    console.log('   2. Comment to DM Test: Matches "details" and "product" keywords');
    console.log('   3. Generates comment reply');
    console.log('   4. Sends comment reply (will fail with test comment ID)');
    console.log('   5. Sends follow-up DM');
    console.log('   6. Marks comment as processed');
    console.log('\n📊 Success indicators in logs:');
    console.log('   - "Keyword \"details\" matches": true');
    console.log('   - "Keyword \"product\" matches": true');
    console.log('   - "Starting comment-to-DM automation"');
    console.log('   - "Comment reply generated"');
    console.log('   - "Sending follow-up DM"');
  } else {
    console.error('\n❌ Webhook failed:', response.status, result);
  }
  
  console.log('\n🎉 If you see keyword matches and automation processing, the system is working!');
}

testWorkingCommentToDM().catch(console.error);