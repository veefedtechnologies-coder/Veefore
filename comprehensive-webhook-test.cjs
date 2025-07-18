const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const baseURL = 'http://localhost:5000';

async function checkRule(db, stepName) {
  const rule = await db.collection('automationrules').findOne({
    workspaceId: '6847b9cdfabaede1706f2994',
    type: 'dm',
    postInteraction: true
  });
  
  if (rule) {
    console.log(`[${stepName}] ✓ Rule exists: ${rule.name} (${rule._id})`);
    return rule;
  } else {
    console.log(`[${stepName}] ❌ Rule not found`);
    return null;
  }
}

async function comprehensiveTest() {
  const client = new MongoClient(DATABASE_URL);
  await client.connect();
  const db = client.db('veeforedb');
  
  try {
    console.log('[TEST] Starting comprehensive webhook test...');
    
    // Step 1: Create the automation rule
    console.log('\n=== STEP 1: Create automation rule ===');
    const workspaceId = '6847b9cdfabaede1706f2994';
    
    const commentToDMRule = {
      name: 'Comment to DM Test Automation',
      workspaceId: workspaceId,
      type: 'dm',
      postInteraction: true,
      isActive: true,
      keywords: ['free', 'info', 'details', 'product'],
      responses: ['Hi! I\'ll send you the details in a direct message.'],
      action: {
        type: 'dm',
        responses: ['Thank you for your interest! Here are the details you requested about our product.'],
        dmResponses: ['Thank you for your interest! Here are the details you requested about our product.'],
        aiPersonality: 'helpful',
        responseLength: 'medium'
      },
      platform: 'instagram',
      triggers: {
        keywords: ['free', 'info', 'details', 'product'],
        aiMode: 'keyword'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('automationrules').insertOne(commentToDMRule);
    console.log(`[CREATE] Created rule: ${result.insertedId}`);
    
    // Step 2: Verify rule creation
    console.log('\n=== STEP 2: Verify rule creation ===');
    const rule = await checkRule(db, 'AFTER_CREATE');
    if (!rule) {
      console.error('[ERROR] Rule creation failed');
      return;
    }
    
    // Step 3: Get account information
    console.log('\n=== STEP 3: Get account information ===');
    const account = await db.collection('socialaccounts').findOne({ 
      workspaceId: workspaceId,
      platform: 'instagram' 
    });
    
    if (!account) {
      console.error('[ERROR] No Instagram account found');
      return;
    }
    
    console.log(`[ACCOUNT] Found: ${account.username} (${account.accountId})`);
    
    // Step 4: Check rule before webhook
    console.log('\n=== STEP 4: Check rule before webhook ===');
    await checkRule(db, 'BEFORE_WEBHOOK');
    
    // Step 5: Send webhook
    console.log('\n=== STEP 5: Send webhook ===');
    const webhookPayload = {
      object: 'instagram',
      entry: [{
        id: account.accountId,
        time: Date.now(),
        changes: [{
          field: 'comments',
          value: {
            from: {
              id: 'test_user_comprehensive',
              username: 'test_user_comprehensive'
            },
            post_id: '17856498618156045',
            comment_id: `comprehensive_test_${Date.now()}`,
            created_time: Date.now(),
            text: 'Can you send me free info about this product?'
          }
        }]
      }]
    };
    
    console.log(`[WEBHOOK] Sending to account: ${account.accountId}`);
    const response = await fetch(`${baseURL}/api/instagram/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });
    
    const result2 = await response.text();
    console.log(`[WEBHOOK] Response: ${result2}`);
    
    // Step 6: Check rule after webhook
    console.log('\n=== STEP 6: Check rule after webhook ===');
    await checkRule(db, 'AFTER_WEBHOOK');
    
    // Step 7: Check all automation rules in workspace
    console.log('\n=== STEP 7: Check all automation rules ===');
    const allRules = await db.collection('automationrules').find({ workspaceId: workspaceId }).toArray();
    console.log(`[ALL_RULES] Found ${allRules.length} rules in workspace`);
    allRules.forEach(rule => {
      console.log(`[RULE] ${rule.name} - type: ${rule.type} - active: ${rule.isActive} - postInteraction: ${rule.postInteraction}`);
    });
    
    console.log('\n=== TEST COMPLETED ===');
    
  } catch (error) {
    console.error('[ERROR]', error);
  } finally {
    await client.close();
  }
}

comprehensiveTest().catch(console.error);