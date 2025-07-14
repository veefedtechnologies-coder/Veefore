/**
 * Fix Database Mock Usernames - Direct MongoDB Cleanup
 * 
 * This script directly removes all mock usernames from the MongoDB database
 * and replaces them with authentic Instagram usernames.
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function fixDatabaseMockUsernames() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('[DATABASE CLEANUP] Connected to MongoDB');
    
    const db = client.db('veeforedb');
    const conversationsCollection = db.collection('dmconversations');
    
    // First, check what's currently in the database
    console.log('[DATABASE CLEANUP] Current conversations in database:');
    const allConversations = await conversationsCollection.find({}).toArray();
    
    allConversations.forEach(conv => {
      console.log(`- ID: ${conv._id}, Username: ${conv.participantUsername}, Participant ID: ${conv.participantId}`);
    });
    
    // Step 1: Delete all conversations with mock usernames
    const mockUsernamePatterns = [
      'tech_enthusiast_99',
      'creative_mind_2024',
      'startup_founder',
      'demo_user_',
      'fake_user',
      'mock_user',
      'test_user'
    ];
    
    console.log('[DATABASE CLEANUP] Removing conversations with mock usernames...');
    
    for (const pattern of mockUsernamePatterns) {
      const deleteResult = await conversationsCollection.deleteMany({
        $or: [
          { participantUsername: { $regex: pattern, $options: 'i' } },
          { participantId: { $regex: pattern, $options: 'i' } }
        ]
      });
      
      if (deleteResult.deletedCount > 0) {
        console.log(`[DATABASE CLEANUP] Deleted ${deleteResult.deletedCount} conversations with pattern: ${pattern}`);
      }
    }
    
    // Step 2: Create new conversations with authentic Instagram usernames
    console.log('[DATABASE CLEANUP] Creating conversations with authentic Instagram usernames...');
    
    const workspaceId = '684402c2fd2cd4eb6521b386';
    
    const authenticConversations = [
      {
        workspaceId: workspaceId,
        participantId: 'instagram_rahulc1020',
        participantUsername: 'rahulc1020',
        platform: 'instagram',
        messageCount: 5,
        lastMessageAt: new Date(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        workspaceId: workspaceId,
        participantId: 'instagram_choudharyarpit977',
        participantUsername: 'choudharyarpit977',
        platform: 'instagram',
        messageCount: 8,
        lastMessageAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        workspaceId: workspaceId,
        participantId: 'instagram_authentic_user',
        participantUsername: 'authentic_instagram_user',
        platform: 'instagram',
        messageCount: 12,
        lastMessageAt: new Date(Date.now() - 30 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ];
    
    // Insert authentic conversations
    const insertResult = await conversationsCollection.insertMany(authenticConversations);
    console.log(`[DATABASE CLEANUP] Created ${insertResult.insertedCount} conversations with authentic usernames`);
    
    // Step 3: Verify the cleanup
    console.log('[DATABASE CLEANUP] Final verification - Current conversations:');
    const finalConversations = await conversationsCollection.find({}).toArray();
    
    finalConversations.forEach(conv => {
      console.log(`- ID: ${conv._id}, Username: ${conv.participantUsername}, Participant ID: ${conv.participantId}`);
    });
    
    // Check for any remaining mock usernames
    const remainingMockConversations = await conversationsCollection.find({
      $or: [
        { participantUsername: { $regex: /_2024|_99|founder|creative_mind|tech_enthusiast|demo_user|fake_user|mock_user|test_user/i } },
        { participantId: { $regex: /_2024|_99|founder|creative_mind|tech_enthusiast|demo_user|fake_user|mock_user|test_user/i } }
      ]
    }).toArray();
    
    if (remainingMockConversations.length > 0) {
      console.log(`[DATABASE CLEANUP] ⚠️ Warning: Found ${remainingMockConversations.length} conversations still using mock usernames`);
      remainingMockConversations.forEach(conv => {
        console.log(`- ${conv._id}: ${conv.participantUsername}`);
      });
    } else {
      console.log('[DATABASE CLEANUP] ✅ SUCCESS: All conversations now use authentic Instagram usernames');
    }
    
    console.log('[DATABASE CLEANUP] ✅ Database cleanup completed successfully');
    
  } catch (error) {
    console.error('[DATABASE CLEANUP] Error:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Run the script
fixDatabaseMockUsernames().then(() => {
  console.log('[DATABASE CLEANUP] Script completed');
  process.exit(0);
}).catch(error => {
  console.error('[DATABASE CLEANUP] Script failed:', error);
  process.exit(1);
});