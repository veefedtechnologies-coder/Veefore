const { MongoClient } = require('mongodb');

async function deleteDuplicateAccount() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    console.log('=== DELETING DUPLICATE ACCOUNT ===\n');
    
    // Account to delete: Account 1 in wrong workspace
    const accountToDelete = {
      _id: '6856d6ac9fdcbe6ea5e3c8b7',
      username: 'rahulc1020',
      workspaceId: '684402c2fd2cd4eb6521b386'
    };
    
    console.log('Account to DELETE:');
    console.log(`  _id: ${accountToDelete._id}`);
    console.log(`  username: ${accountToDelete.username}`);
    console.log(`  workspaceId: ${accountToDelete.workspaceId} (wrong workspace)`);
    
    // Delete the account
    const { ObjectId } = require('mongodb');
    const result = await db.collection('socialaccounts').deleteOne({
      _id: new ObjectId(accountToDelete._id)
    });
    
    if (result.deletedCount === 1) {
      console.log('✅ Successfully deleted duplicate account');
    } else {
      console.log('❌ Failed to delete account');
    }
    
    // Verify only your account remains
    const remainingAccounts = await db.collection('socialaccounts').find({
      platform: 'instagram',
      username: 'rahulc1020'
    }).toArray();
    
    console.log(`\n=== VERIFICATION ===`);
    console.log(`Remaining @rahulc1020 accounts: ${remainingAccounts.length}`);
    
    remainingAccounts.forEach((account, index) => {
      console.log(`\nAccount ${index + 1}:`);
      console.log(`  _id: ${account._id}`);
      console.log(`  username: ${account.username}`);
      console.log(`  workspaceId: ${account.workspaceId}`);
      console.log(`  pageId: ${account.pageId}`);
      
      if (account.workspaceId === '6847b9cdfabaede1706f2994') {
        console.log(`  ✅ This is YOUR workspace - webhook will use this account`);
      } else {
        console.log(`  ❌ This is NOT your workspace`);
      }
    });
    
  } finally {
    await client.close();
  }
}

deleteDuplicateAccount();