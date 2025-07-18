const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const baseURL = 'http://localhost:5000';

async function finalWebhookTest() {
  const client = new MongoClient(DATABASE_URL);
  await client.connect();
  const db = client.db('veeforedb');
  
  try {
    console.log('\n=== FINAL WEBHOOK ACCOUNT SELECTION TEST ===');
    
    // Check the current state of both workspaces
    const workspace1 = '684402c2fd2cd4eb6521b386';
    const workspace2 = '6847b9cdfabaede1706f2994';
    
    console.log('\n1. Checking workspace automation rule counts:');
    
    const rules1 = await db.collection('automationrules').find({ workspaceId: workspace1, isActive: true }).toArray();
    const rules2 = await db.collection('automationrules').find({ workspaceId: workspace2, isActive: true }).toArray();
    
    console.log(`   Workspace ${workspace1}: ${rules1.length} active rules`);
    console.log(`   Workspace ${workspace2}: ${rules2.length} active rules`);
    
    // List the rules for each workspace
    console.log('\n2. Workspace 1 rules:');
    rules1.forEach(rule => {
      console.log(`   - ${rule.name} (${rule.type})`);
    });
    
    console.log('\n3. Workspace 2 rules:');
    rules2.forEach(rule => {
      console.log(`   - ${rule.name} (${rule.type})`);
    });
    
    // Check social accounts
    console.log('\n4. Social accounts with accountId 9505923456179711:');
    const accounts = await db.collection('socialaccounts').find({ 
      accountId: '9505923456179711',
      platform: 'instagram'
    }).toArray();
    
    accounts.forEach(acc => {
      console.log(`   - @${acc.username} in workspace ${acc.workspaceId}`);
    });
    
    // Based on the improved logic, which workspace should be selected?
    const expectedWorkspace = rules1.length > rules2.length ? workspace1 : workspace2;
    const expectedCount = Math.max(rules1.length, rules2.length);
    
    console.log(`\n5. Expected webhook selection: workspace ${expectedWorkspace} (${expectedCount} rules)`);
    
    // Send the webhook
    const webhookPayload = {
      object: 'instagram',
      entry: [{
        id: '9505923456179711',
        time: Date.now(),
        changes: [{
          field: 'comments',
          value: {
            from: {
              id: 'final_test_user',
              username: 'final_test_user'
            },
            post_id: '17856498618156045',
            comment_id: `final_test_${Date.now()}`,
            created_time: Date.now(),
            text: 'Final test comment for webhook account selection'
          }
        }]
      }]
    };
    
    console.log('\n6. Sending webhook...');
    
    const response = await fetch(`${baseURL}/api/instagram/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });
    
    const result = await response.text();
    console.log(`   Response: ${result}`);
    
    if (response.ok) {
      console.log('\n✅ Webhook sent successfully');
      console.log('📊 Check the server logs to verify:');
      console.log('   - Multiple account detection message');
      console.log('   - Automation rule counting for each workspace');
      console.log(`   - Selection of workspace ${expectedWorkspace} with ${expectedCount} rules`);
    } else {
      console.error('\n❌ Webhook failed:', response.status, result);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await client.close();
  }
}

finalWebhookTest().catch(console.error);