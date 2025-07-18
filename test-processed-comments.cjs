const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const baseURL = 'http://localhost:5000';

async function testProcessedComments() {
  console.log('\n=== TESTING PROCESSED COMMENTS TRACKING ===');
  
  // Send first webhook - should fail but not mark as processed
  const commentId1 = `test_comment_${Date.now()}_1`;
  const webhook1 = {
    object: 'instagram',
    entry: [{
      id: '9505923456179711',
      time: Date.now(),
      changes: [{
        field: 'comments',
        value: {
          from: {
            id: 'test_user_1',
            username: 'test_user_1'
          },
          post_id: '17856498618156045',
          comment_id: commentId1,
          created_time: Date.now(),
          text: 'This is a test comment that should fail'
        }
      }]
    }]
  };
  
  console.log(`🚀 Sending first webhook with comment ID: ${commentId1}`);
  const response1 = await fetch(`${baseURL}/api/instagram/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webhook1)
  });
  
  console.log(`📥 First webhook response: ${await response1.text()}`);
  
  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Send second webhook with same comment ID - should still process if first failed
  console.log(`🚀 Sending second webhook with SAME comment ID: ${commentId1}`);
  const response2 = await fetch(`${baseURL}/api/instagram/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webhook1)
  });
  
  console.log(`📥 Second webhook response: ${await response2.text()}`);
  
  console.log('\n🔍 Expected behavior:');
  console.log('   - First webhook: Comment fails to send, not marked as processed');
  console.log('   - Second webhook: Same comment should still be processed since first failed');
  console.log('   - If second webhook shows "already processed", there is a bug');
}

testProcessedComments().catch(console.error);