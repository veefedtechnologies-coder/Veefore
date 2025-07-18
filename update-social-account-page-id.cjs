const { MongoClient } = require('mongodb');

async function updateSocialAccountPageId() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    const collection = db.collection('socialaccounts');
    
    // Find the rahulc1020 account and update its accountId to match the webhook page ID
    const result = await collection.updateOne(
      { username: 'rahulc1020', platform: 'instagram' },
      { 
        $set: { 
          accountId: '17841474747481653',  // Page ID from webhook
          pageId: '17841474747481653',      // Also store as pageId
          updatedAt: new Date()
        }
      }
    );
    
    console.log('Update result:', result);
    
    // Verify the update
    const updatedAccount = await collection.findOne({ accountId: '17841474747481653' });
    console.log('Updated account:', updatedAccount);
    
  } catch (error) {
    console.error('Error updating social account:', error);
  } finally {
    await client.close();
  }
}

updateSocialAccountPageId();