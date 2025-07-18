const { MongoClient } = require('mongodb');

async function debugSocialAccounts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    console.log('=== SOCIAL ACCOUNTS DEBUG ===\n');
    
    const accounts = await db.collection('socialaccounts').find({
      platform: 'instagram',
      username: 'rahulc1020'
    }).toArray();
    
    console.log(`Found ${accounts.length} @rahulc1020 Instagram accounts:\n`);
    
    accounts.forEach((account, index) => {
      console.log(`Account ${index + 1}:`);
      console.log(`  _id: ${account._id}`);
      console.log(`  username: ${account.username}`);
      console.log(`  workspaceId: ${account.workspaceId}`);
      console.log(`  platform: ${account.platform}`);
      console.log(`  isActive: ${account.isActive}`);
      console.log(`  accountId: ${account.accountId}`);
      console.log(`  pageId: ${account.pageId}`);
      console.log(`  instagramPageId: ${account.instagramPageId}`);
      console.log('');
    });
    
    console.log('=== PAGE ID ANALYSIS ===');
    console.log('Target Page ID: 17841474747481653');
    
    accounts.forEach((account, index) => {
      console.log(`\nAccount ${index + 1} (@${account.username} in workspace ${account.workspaceId}):`);
      console.log(`  accountId matches: ${account.accountId === '17841474747481653'}`);
      console.log(`  pageId matches: ${account.pageId === '17841474747481653'}`);
      console.log(`  instagramPageId matches: ${account.instagramPageId === '17841474747481653'}`);
      
      if (account.accountId === '17841474747481653' || account.pageId === '17841474747481653' || account.instagramPageId === '17841474747481653') {
        console.log(`  ✅ This account should be selected by webhook`);
      } else {
        console.log(`  ❌ This account won't be selected by webhook`);
      }
    });
    
  } finally {
    await client.close();
  }
}

debugSocialAccounts();