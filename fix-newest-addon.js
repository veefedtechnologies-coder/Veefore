import { MongoClient } from 'mongodb';

async function fixNewestAddon() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('veeforedb');
    const addonsCollection = db.collection('addons');
    
    // Find the newest team-member addon with wrong userId format
    const newestAddon = await addonsCollection.findOne(
      { 
        type: 'team-member',
        userId: 6844027426
      },
      { sort: { createdAt: -1 } }
    );
    
    if (newestAddon) {
      console.log('Found newest addon created:', newestAddon.createdAt);
      
      // Update it with correct userId format
      const result = await addonsCollection.updateOne(
        { _id: newestAddon._id },
        { 
          $set: { 
            userId: '6844027426cae0200f88b5db',
            updatedAt: new Date()
          }
        }
      );
      
      console.log('Update result:', result.modifiedCount, 'documents modified');
      
      // Count total active team-member addons
      const totalCount = await addonsCollection.countDocuments({
        type: 'team-member',
        isActive: true,
        $or: [
          { userId: '6844027426cae0200f88b5db' },
          { userId: 6844027426 }
        ]
      });
      
      console.log('Total active team-member addons after fix:', totalCount);
      
    } else {
      console.log('No addon found with truncated userId');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixNewestAddon();