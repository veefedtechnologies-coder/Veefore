/**
 * Test Direct Publishing System - Quick verification
 */

const { MongoClient } = require('mongodb');

async function testDirectPublishing() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    console.log('Creating test scheduled content...');
    
    const testContent = {
      title: 'Test Direct Publishing',
      description: 'Testing the direct publisher approach',
      type: 'photo',
      platform: 'instagram',
      status: 'scheduled',
      scheduledAt: new Date(Date.now() + 5000), // 5 seconds from now
      workspaceId: '684402c2fd2cd4eb6521b386',
      creditsUsed: 0,
      contentData: {
        mediaUrl: 'https://via.placeholder.com/1080x1080/4F46E5/FFFFFF?text=Direct+Test'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('content').insertOne(testContent);
    console.log(`✓ Created test content: ${result.insertedId}`);
    console.log('Monitor scheduler logs for publishing...');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await client.close();
  }
}

testDirectPublishing();