import mongoose from 'mongoose';

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function debugAuthenticMessages() {
  try {
    console.log('\n=== DEBUGGING AUTHENTIC INSTAGRAM MESSAGES ===');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\nAvailable collections:');
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });
    
    // Search for authentic messages in all collections
    console.log('\n=== SEARCHING FOR AUTHENTIC MESSAGES ===');
    
    const searchTerms = ['Kaisa hai bhai tu', 'Hi bhai', 'how are you', 'hlo'];
    
    for (const collection of collections) {
      const collectionName = collection.name;
      
      try {
        // Search for documents containing our authentic messages
        const docs = await db.collection(collectionName).find({
          $or: [
            { content: { $in: searchTerms } },
            { message: { $in: searchTerms } },
            { text: { $in: searchTerms } },
            { body: { $in: searchTerms } }
          ]
        }).toArray();
        
        if (docs.length > 0) {
          console.log(`\n[${collectionName}] Found ${docs.length} authentic messages:`);
          docs.forEach(doc => {
            const content = doc.content || doc.message || doc.text || doc.body;
            const conversationId = doc.conversationId || doc.conversation || doc.chatId;
            console.log(`  Message: "${content}" | ConversationID: ${conversationId} | ID: ${doc._id}`);
          });
        }
      } catch (error) {
        // Skip collections that can't be queried
      }
    }
    
    // Also search for any documents containing Hindi/multilingual text
    console.log('\n=== SEARCHING FOR MULTILINGUAL CONTENT ===');
    
    for (const collection of collections) {
      const collectionName = collection.name;
      
      try {
        const docs = await db.collection(collectionName).find({
          $or: [
            { content: /bhai|hai|kaisa/i },
            { message: /bhai|hai|kaisa/i },
            { text: /bhai|hai|kaisa/i },
            { body: /bhai|hai|kaisa/i }
          ]
        }).limit(10).toArray();
        
        if (docs.length > 0) {
          console.log(`\n[${collectionName}] Found ${docs.length} multilingual messages:`);
          docs.forEach(doc => {
            const content = doc.content || doc.message || doc.text || doc.body;
            const conversationId = doc.conversationId || doc.conversation || doc.chatId;
            const participant = doc.participantId || doc.from || doc.sender;
            console.log(`  "${content}" | Conversation: ${conversationId} | From: ${participant}`);
          });
        }
      } catch (error) {
        // Skip collections that can't be queried
      }
    }
    
    // Check conversation-message relationships
    console.log('\n=== CHECKING CONVERSATION-MESSAGE RELATIONSHIPS ===');
    
    const conversationCollections = collections.filter(col => 
      col.name.toLowerCase().includes('conversation')
    );
    
    for (const col of conversationCollections) {
      try {
        const conversations = await db.collection(col.name).find({}).limit(10).toArray();
        console.log(`\n[${col.name}] Found ${conversations.length} conversations:`);
        
        for (const conv of conversations) {
          console.log(`  Conversation ID: ${conv._id} | Participant: ${conv.participantId || conv.participant} | Workspace: ${conv.workspaceId}`);
          
          // Look for messages linked to this conversation
          const messageCollections = collections.filter(c => 
            c.name.toLowerCase().includes('message') || c.name.toLowerCase().includes('dm')
          );
          
          for (const msgCol of messageCollections) {
            try {
              const messages = await db.collection(msgCol.name).find({
                $or: [
                  { conversationId: conv._id.toString() },
                  { conversationId: conv._id },
                  { conversation: conv._id.toString() },
                  { conversation: conv._id }
                ]
              }).toArray();
              
              if (messages.length > 0) {
                console.log(`    → Found ${messages.length} messages in ${msgCol.name}`);
                messages.forEach(msg => {
                  const content = msg.content || msg.message || msg.text || msg.body;
                  console.log(`      "${content}" (${msg.sender || msg.from || 'unknown'})`);
                });
              }
            } catch (error) {
              // Skip
            }
          }
        }
      } catch (error) {
        console.log(`Error accessing ${col.name}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error debugging messages:', error);
  } finally {
    await mongoose.connection.close();
  }
}

debugAuthenticMessages();