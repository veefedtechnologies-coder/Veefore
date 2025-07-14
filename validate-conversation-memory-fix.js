/**
 * Quick validation of the conversation memory ObjectId fix
 * Confirms that the system can properly handle MongoDB ObjectIds in conversation context
 */

import { MongoStorage } from './server/mongodb-storage.js';
import { ConversationMemoryService } from './server/conversation-memory-service.js';

async function validateConversationMemoryFix() {
  console.log('[VALIDATION] Testing conversation memory ObjectId handling...');
  
  try {
    const storage = new MongoStorage();
    await storage.connect();
    console.log('[VALIDATION] ✅ Connected to MongoDB');
    
    const memoryService = new ConversationMemoryService(storage);
    
    // Test conversation creation with real workspace
    const testWorkspaceId = '68449f3852d33d75b31ce737';
    const testParticipantId = 'validation_user_123';
    const testPlatform = 'instagram';
    
    console.log('[VALIDATION] Creating test conversation...');
    const conversation = await memoryService.getOrCreateConversation(
      testWorkspaceId,
      testPlatform,
      testParticipantId,
      'validation_user'
    );
    
    console.log(`[VALIDATION] ✅ Conversation created with ObjectId: ${conversation.id}`);
    
    // Test message storage with context extraction
    const testMessage = "I need help improving my Instagram engagement rate. What strategies work best?";
    
    console.log('[VALIDATION] Testing message storage and context extraction...');
    await memoryService.storeMessage(
      conversation.id,
      testMessage,
      'user',
      false
    );
    
    console.log('[VALIDATION] ✅ Message stored successfully with ObjectId conversation reference');
    
    // Test context retrieval
    const context = await storage.getConversationContext(conversation.id);
    console.log(`[VALIDATION] ✅ Retrieved ${context.length} context items for conversation`);
    
    // Test conversation history
    const history = await memoryService.getConversationHistory(conversation.id, 5);
    console.log(`[VALIDATION] ✅ Retrieved conversation history with ${history.length} messages`);
    
    console.log('[VALIDATION] 🎉 All ObjectId handling tests passed successfully!');
    console.log('[VALIDATION] The conversation memory system is now fully operational');
    
    process.exit(0);
    
  } catch (error) {
    console.error('[VALIDATION] ❌ Error during validation:', error.message);
    console.error('[VALIDATION] Stack:', error.stack);
    process.exit(1);
  }
}

validateConversationMemoryFix();