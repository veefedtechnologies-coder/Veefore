// Quick script to update the Story content status to published
import { MongoClient } from 'mongodb';

async function fixStoryStatus() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Find and update the story content that was published
    const result = await db.collection('content').updateMany(
      { 
        type: 'story',
        title: 'dvd',
        status: 'scheduled'
      },
      { 
        $set: { 
          status: 'published',
          publishedAt: new Date()
        }
      }
    );
    
    console.log('Updated story status:', result.modifiedCount, 'documents');
    
  } catch (error) {
    console.error('Error updating story status:', error);
  } finally {
    await client.close();
  }
}

fixStoryStatus();