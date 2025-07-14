import { MongoClient } from 'mongodb';

async function showRealConversations() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || process.env.DATABASE_URL);
    await client.connect();
    
    const db = client.db('veeforedb');
    
    console.log('=== REAL INSTAGRAM DM CONVERSATIONS ===\n');
    
    // Get real conversations
    const conversations = await db.collection('dmconversations').find({}).sort({ lastActive: -1 }).limit(10).toArray();
    
    console.log(`Found ${conversations.length} real Instagram DM conversations:\n`);
    
    for (const conv of conversations) {
      console.log(`Conversation ID: ${conv._id}`);
      console.log(`Participant: ${conv.participant?.username || conv.participant?.id} (${conv.participant?.platform})`);
      console.log(`Last Active: ${conv.lastActive}`);
      console.log(`Message Count: ${conv.messageCount || 0}`);
      
      // Get recent messages for this conversation
      const messages = await db.collection('dmmessages').find({ 
        conversationId: conv._id.toString() 
      }).sort({ createdAt: -1 }).limit(3).toArray();
      
      console.log(`Recent Messages (${messages.length}):`);
      for (const msg of messages) {
        console.log(`  - ${msg.sender}: "${msg.content}" (${msg.sentiment || 'unknown'})`);
      }
      
      // Get context for this conversation
      const context = await db.collection('conversationcontext').find({ 
        conversationId: conv._id.toString() 
      }).toArray();
      
      if (context.length > 0) {
        console.log(`Context Items (${context.length}):`);
        for (const ctx of context) {
          console.log(`  - ${ctx.contextType}: ${ctx.contextValue} (${ctx.confidence}% confidence)`);
        }
      }
      
      console.log('---\n');
    }
    
    // Clear sample data from the API endpoint
    console.log('=== CLEARING SAMPLE DATA ===\n');
    
    // Delete sample conversations that might be interfering
    const deleteResult = await db.collection('dmconversations').deleteMany({
      'participant.id': { $in: ['demo_user_001', 'demo_user_002', 'demo_user_003'] }
    });
    
    console.log(`Deleted ${deleteResult.deletedCount} sample conversations`);
    
    // Delete sample messages
    const deleteMessages = await db.collection('dmmessages').deleteMany({
      messageId: { $regex: /^msg_\d{3}_\d{3}$/ }
    });
    
    console.log(`Deleted ${deleteMessages.deletedCount} sample messages`);
    
    await client.close();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

showRealConversations();