import { MongoClient } from 'mongodb';

async function debugInstagramData() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    const collection = db.collection('socialAccounts');
    
    console.log('=== DEBUGGING INSTAGRAM ACCOUNT DATA ===');
    
    const instagramAccounts = await collection.find({ platform: 'instagram' }).toArray();
    
    console.log(`Found ${instagramAccounts.length} Instagram accounts:`);
    
    instagramAccounts.forEach((account, index) => {
      console.log(`\n--- Account ${index + 1} ---`);
      console.log(`ID: ${account._id}`);
      console.log(`Username: ${account.username}`);
      console.log(`Account ID: ${account.accountId}`);
      console.log(`Average Likes: ${account.avgLikes}`);
      console.log(`Average Comments: ${account.avgComments}`);
      console.log(`Followers: ${account.followersCount}`);
      console.log(`Media Count: ${account.mediaCount}`);
      console.log(`Last Sync: ${account.lastSyncAt}`);
      console.log(`Has Access Token: ${!!account.accessToken}`);
      console.log(`Token Length: ${account.accessToken ? account.accessToken.length : 0}`);
      console.log(`Is Active: ${account.isActive}`);
      console.log(`Expires At: ${account.expiresAt}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugInstagramData();