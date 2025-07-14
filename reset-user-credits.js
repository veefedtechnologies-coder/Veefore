import { MongoClient } from 'mongodb';

async function resetUserCredits() {
  try {
    const client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    const db = client.db();
    
    // Reset the specific user's credits to 2 for testing
    const result = await db.collection('users').updateOne(
      { firebaseUid: 'XG0OYy2RkmYMhgRzT4cVjb4H0rY2' },
      { $set: { credits: 2 } }
    );
    
    console.log('User credits reset to 2. Modified count:', result.modifiedCount);
    
    // Verify the update
    const user = await db.collection('users').findOne({ firebaseUid: 'XG0OYy2RkmYMhgRzT4cVjb4H0rY2' });
    console.log('User current credits:', user?.credits);
    
    await client.close();
  } catch (error) {
    console.error('Error resetting user credits:', error);
  }
}

resetUserCredits();