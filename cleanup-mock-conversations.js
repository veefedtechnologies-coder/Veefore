/**
 * Direct Database Cleanup for Mock Usernames
 * Uses the existing MongoStorage to remove mock conversations
 */

import { MongoStorage } from './server/mongodb-storage.js';

async function cleanupMockConversations() {
  try {
    const storage = new MongoStorage();
    await storage.connect();
    
    console.log('[CLEANUP] Connected to database');
    
    // Get all conversations to check current state
    console.log('[CLEANUP] Current conversations in database:');
    const allConversations = await storage.getDmConversations('684402c2fd2cd4eb6521b386');
    
    allConversations.forEach(conv => {
      console.log(`- ID: ${conv.id}, Username: ${conv.participantUsername}`);
    });
    
    // Define mock username patterns to remove
    const mockPatterns = [
      'tech_enthusiast_99',
      'creative_mind_2024', 
      'startup_founder'
    ];
    
    console.log('[CLEANUP] Removing conversations with mock usernames...');
    
    // Remove each mock conversation
    let removedCount = 0;
    for (const conversation of allConversations) {
      if (mockPatterns.includes(conversation.participantUsername)) {
        console.log(`[CLEANUP] Removing conversation with ${conversation.participantUsername}`);
        
        // Access the MongoDB collection directly
        const db = storage.db;
        const conversationsCollection = db.collection('dmconversations');
        
        const deleteResult = await conversationsCollection.deleteOne({
          _id: conversation.id
        });
        
        if (deleteResult.deletedCount > 0) {
          console.log(`[CLEANUP] ✅ Deleted conversation: ${conversation.participantUsername}`);
          removedCount++;
        }
      }
    }
    
    console.log(`[CLEANUP] Removed ${removedCount} conversations with mock usernames`);
    
    // Verify cleanup
    const remainingConversations = await storage.getDmConversations('684402c2fd2cd4eb6521b386');
    console.log('[CLEANUP] Remaining conversations after cleanup:');
    
    remainingConversations.forEach(conv => {
      console.log(`- ID: ${conv.id}, Username: ${conv.participantUsername}`);
    });
    
    const hasRemainingMockUsernames = remainingConversations.some(conv => 
      mockPatterns.includes(conv.participantUsername)
    );
    
    if (hasRemainingMockUsernames) {
      console.log('[CLEANUP] ⚠️ Warning: Some mock usernames still remain');
    } else {
      console.log('[CLEANUP] ✅ SUCCESS: All mock usernames have been removed');
    }
    
    await storage.disconnect();
    
  } catch (error) {
    console.error('[CLEANUP] Error:', error);
    throw error;
  }
}

// Run the cleanup
cleanupMockConversations().then(() => {
  console.log('[CLEANUP] Cleanup completed');
  process.exit(0);
}).catch(error => {
  console.error('[CLEANUP] Cleanup failed:', error);
  process.exit(1);
});