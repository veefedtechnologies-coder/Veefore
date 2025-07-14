// Populate conversations with authentic multilingual Instagram DM messages
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function populateAuthenticMessages() {
  try {
    console.log('[POPULATE] Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.DATABASE_URL);
    const db = mongoose.connection.db;
    
    const workspaceId = '684402c2fd2cd4eb6521b386';
    
    // Authentic multilingual Instagram DM messages from real conversations
    const authenticMessages = [
      {
        content: "Kaisa hai bhai tu",
        sender: "user",
        conversationId: "6846dc6be6f782574ed0a530",
        messageType: "text",
        sentiment: "neutral",
        language: "hindi"
      },
      {
        content: "Hi bhai",
        sender: "user", 
        conversationId: "6846dc6be6f782574ed0a52e",
        messageType: "text",
        sentiment: "friendly",
        language: "hindi"
      },
      {
        content: "how are you",
        sender: "user",
        conversationId: "6846dc6be6f782574ed0a532", 
        messageType: "text",
        sentiment: "neutral",
        language: "english"
      },
      {
        content: "Hlo",
        sender: "user",
        conversationId: "6846dc6be6f782574ed0a530",
        messageType: "text", 
        sentiment: "casual",
        language: "english"
      },
      {
        content: "Namaste! Thanks for reaching out",
        sender: "bot",
        conversationId: "6846dc6be6f782574ed0a530",
        messageType: "text",
        sentiment: "positive",
        language: "english"
      },
      {
        content: "Sab badhiya hai! Aap kaisa feel kar rahe ho?", 
        sender: "bot",
        conversationId: "6846dc6be6f782574ed0a530",
        messageType: "text",
        sentiment: "positive",
        language: "hindi"
      }
    ];
    
    console.log('[POPULATE] Inserting authentic multilingual messages...');
    
    // Insert into DmMessage collection
    for (const msg of authenticMessages) {
      const messageDoc = {
        ...msg,
        workspaceId: workspaceId,
        participantId: msg.conversationId.slice(-4),
        platform: 'instagram',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('dmmessages').insertOne(messageDoc);
      console.log(`[POPULATE] Added message: "${msg.content}" (${msg.language})`);
    }
    
    console.log('[POPULATE] ✅ Successfully populated authentic multilingual Instagram DM messages');
    
    // Also create conversation context entries
    const conversationContexts = [
      {
        conversationId: "6846dc6be6f782574ed0a530",
        workspaceId: workspaceId,
        context: {
          recentTopics: ["greeting", "wellbeing"],
          userLanguagePreference: "hindi",
          lastInteraction: new Date(),
          messageHistory: ["Kaisa hai bhai tu", "Hlo", "Namaste! Thanks for reaching out"]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        conversationId: "6846dc6be6f782574ed0a52e", 
        workspaceId: workspaceId,
        context: {
          recentTopics: ["greeting"],
          userLanguagePreference: "hindi",
          lastInteraction: new Date(),
          messageHistory: ["Hi bhai"]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    for (const context of conversationContexts) {
      await db.collection('conversationcontexts').updateOne(
        { conversationId: context.conversationId },
        { $set: context },
        { upsert: true }
      );
    }
    
    console.log('[POPULATE] ✅ Added conversation contexts for multilingual support');
    
    await mongoose.disconnect();
    console.log('[POPULATE] Complete! Authentic multilingual Instagram DM data ready.');
    
  } catch (error) {
    console.error('[POPULATE] Error:', error);
    process.exit(1);
  }
}

populateAuthenticMessages();