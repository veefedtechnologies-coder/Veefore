const { MongoClient } = require('mongodb');

async function debugAccountPageId() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    console.log('=== DEBUGGING ACCOUNT PAGE ID ===\n');
    
    // Find your account
    const { ObjectId } = require('mongodb');
    const yourAccount = await db.collection('socialaccounts').findOne({
      _id: new ObjectId('6874fd385198371413e93cf4')
    });
    
    console.log('Your account details:');
    console.log(`  _id: ${yourAccount._id}`);
    console.log(`  username: ${yourAccount.username}`);
    console.log(`  workspaceId: ${yourAccount.workspaceId}`);
    console.log(`  pageId: ${yourAccount.pageId}`);
    console.log(`  accountId: ${yourAccount.accountId}`);
    console.log(`  platform: ${yourAccount.platform}`);
    console.log(`  isActive: ${yourAccount.isActive}`);
    
    console.log('\n=== WEBHOOK SEARCH LOGIC TEST ===');
    
    const webhookPageId = '17841474747481653';
    console.log(`Webhook looking for pageId: ${webhookPageId}`);
    
    // Test the exact filter logic from webhook
    const matchingAccounts = await db.collection('socialaccounts').find({
      platform: 'instagram',
      $or: [
        { accountId: webhookPageId },
        { pageId: webhookPageId }
      ],
      isActive: true
    }).toArray();
    
    console.log(`\nMatching accounts found: ${matchingAccounts.length}`);
    matchingAccounts.forEach((account, index) => {
      console.log(`\nAccount ${index + 1}:`);
      console.log(`  _id: ${account._id}`);
      console.log(`  username: ${account.username}`);
      console.log(`  workspaceId: ${account.workspaceId}`);
      console.log(`  pageId: ${account.pageId}`);
      console.log(`  accountId: ${account.accountId}`);
    });
    
    // Test individual conditions
    console.log('\n=== TESTING INDIVIDUAL CONDITIONS ===');
    
    const accountIdMatch = await db.collection('socialaccounts').find({
      platform: 'instagram',
      accountId: webhookPageId,
      isActive: true
    }).toArray();
    console.log(`accountId matches: ${accountIdMatch.length}`);
    
    const pageIdMatch = await db.collection('socialaccounts').find({
      platform: 'instagram', 
      pageId: webhookPageId,
      isActive: true
    }).toArray();
    console.log(`pageId matches: ${pageIdMatch.length}`);
    
    if (pageIdMatch.length > 0) {
      console.log('✅ Your account SHOULD be found by pageId match');
    } else {
      console.log('❌ Your account is NOT being found by pageId match');
      console.log(`Expected pageId: ${webhookPageId}`);
      console.log(`Actual pageId: ${yourAccount.pageId}`);
      console.log(`Match: ${yourAccount.pageId === webhookPageId}`);
    }
    
  } finally {
    await client.close();
  }
}

debugAccountPageId();