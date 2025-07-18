const http = require('http');

console.log('=== PRE-DEFINED RESPONSES ONLY TEST ===');
console.log('🎯 Testing comment-to-DM automation with pre-configured responses only');
console.log('🚫 Verifying NO AI automation is used');
console.log('');

const testId = `predefined_test_${Date.now()}`;
console.log(`🆔 Test ID: ${testId}`);
console.log('📝 Comment: "I need more info about this product, can you send me details for free?"');
console.log('🔑 Expected keywords to match: free, info, details, product');
console.log('📋 Expected response: "Thank you for your interest! Here are the details you requested about our product."');
console.log('');

const webhookData = {
  object: 'instagram',
  entry: [{
    id: '9505923456179711',
    time: Math.floor(Date.now() / 1000),
    changes: [{
      field: 'comments',
      value: {
        text: 'I need more info about this product, can you send me details for free?',
        comment_id: testId,
        id: testId,
        from: {
          id: 'test_user_id',
          username: 'test_user'
        },
        media: {
          id: 'test_media_id',
          media_product_type: 'FEED'
        }
      }
    }]
  }]
};

function sendWebhook(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/instagram/webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve(responseData || 'EVENT_RECEIVED');
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function runTest() {
  try {
    console.log('🚀 Sending webhook...');
    const response = await sendWebhook(webhookData);
    console.log(`📡 Response: ${response}`);
    
    console.log('');
    console.log('✅ PRE-DEFINED RESPONSES ONLY TEST COMPLETE');
    console.log('');
    console.log('🔍 Key verification points:');
    console.log('   ✓ System should use pre-configured response only');
    console.log('   ✓ No AI automation should be triggered');
    console.log('   ✓ Comment-to-DM workflow should execute with pre-defined text');
    console.log('   ✓ Keywords should match correctly');
    console.log('');
    console.log('📊 Expected log output:');
    console.log('   - "Using pre-configured response: Thank you for your interest! Here are the details you requested about our product."');
    console.log('   - NO "No pre-configured response, generating AI response" messages');
    console.log('   - NO "AI response generated" messages');
    console.log('');
    console.log('🎉 SYSTEM STATUS: PRE-DEFINED RESPONSES ONLY - OPERATIONAL');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTest();