import { MongoStorage } from './server/mongodb-storage.js';

async function createSampleConversations() {
  try {
    const storage = new MongoStorage();
    await storage.connect();
    
    console.log('[SAMPLE CONVERSATIONS] Creating demo conversation data...');
    
    const workspaceId = '684402c2fd2cd4eb6521b386'; // Your current workspace
    
    // Create sample conversations
    const conversations = [
      {
        workspaceId: workspaceId,
        participantId: 'demo_user_001',
        participantUsername: 'tech_enthusiast_99',
        platform: 'instagram',
        messageCount: 5,
        lastMessageAt: new Date(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date()
      },
      {
        workspaceId: workspaceId,
        participantId: 'demo_user_002',
        participantUsername: 'creative_mind_2024',
        platform: 'instagram',
        messageCount: 8,
        lastMessageAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        workspaceId: workspaceId,
        participantId: 'demo_user_003',
        participantUsername: 'startup_founder',
        platform: 'instagram',
        messageCount: 12,
        lastMessageAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ];
    
    // Create conversations using storage method
    const createdConversations = [];
    for (const conv of conversations) {
      const created = await storage.createDmConversation(conv);
      createdConversations.push(created);
      console.log(`[SAMPLE CONVERSATIONS] Created conversation with @${conv.participantUsername}`);
    }
    
    // Create sample messages for each conversation
    const sampleMessages = [
      // Conversation 1 - Tech Enthusiast
      {
        conversationId: createdConversations[0].id,
        messageId: 'msg_001_001',
        sender: 'user',
        content: 'Hey! I saw your latest post about AI automation. Really interesting!',
        messageType: 'text',
        sentiment: 'positive',
        topics: ['AI', 'automation', 'technology'],
        aiResponse: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        conversationId: createdConversations[0].id,
        messageId: 'msg_001_002',
        sender: 'ai',
        content: 'Thank you! I\'m glad you found it interesting. AI automation is definitely transforming how businesses operate. Are you implementing any automation in your work?',
        messageType: 'text',
        sentiment: 'positive',
        topics: ['AI', 'automation', 'business'],
        aiResponse: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 300000)
      },
      
      // Conversation 2 - Creative Mind
      {
        conversationId: createdConversations[1].id,
        messageId: 'msg_002_001',
        sender: 'user',
        content: 'Love your content strategy! How do you come up with such creative ideas?',
        messageType: 'text',
        sentiment: 'positive',
        topics: ['content', 'strategy', 'creativity'],
        aiResponse: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        conversationId: createdConversations[1].id,
        messageId: 'msg_002_002',
        sender: 'ai',
        content: 'Thanks for the kind words! I draw inspiration from trending topics, user feedback, and industry insights. The key is staying authentic while adapting to what resonates with the audience.',
        messageType: 'text',
        sentiment: 'positive',
        topics: ['content', 'inspiration', 'audience'],
        aiResponse: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 600000)
      },
      
      // Conversation 3 - Startup Founder
      {
        conversationId: createdConversations[2].id,
        messageId: 'msg_003_001',
        sender: 'user',
        content: 'I\'m building a startup and could use some advice on social media growth',
        messageType: 'text',
        sentiment: 'neutral',
        topics: ['startup', 'advice', 'growth', 'social media'],
        aiResponse: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        conversationId: createdConversations[2].id,
        messageId: 'msg_003_002',
        sender: 'ai',
        content: 'That\'s exciting! For startup social media growth, focus on: 1) Consistent posting schedule 2) Engaging with your community 3) Sharing behind-the-scenes content 4) Collaborating with other startups. What industry is your startup in?',
        messageType: 'text',
        sentiment: 'positive',
        topics: ['startup', 'growth', 'strategy', 'community'],
        aiResponse: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 900000)
      }
    ];
    
    // Create messages
    for (const message of sampleMessages) {
      await storage.createDmMessage(message);
    }
    
    // Create sample conversation context
    const contextData = [
      {
        conversationId: createdConversations[0].id,
        contextType: 'interest',
        contextValue: 'AI and automation technology',
        confidence: 95,
        extractedAt: new Date(),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      },
      {
        conversationId: createdConversations[1].id,
        contextType: 'interest',
        contextValue: 'Content creation and strategy',
        confidence: 90,
        extractedAt: new Date(),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        conversationId: createdConversations[2].id,
        contextType: 'goal',
        contextValue: 'Startup social media growth',
        confidence: 100,
        extractedAt: new Date(),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    ];
    
    for (const context of contextData) {
      await storage.createConversationContext(context);
    }
    
    console.log('[SAMPLE CONVERSATIONS] ✅ Created 3 conversations with messages and context');
    console.log('[SAMPLE CONVERSATIONS] ✅ Conversation data is now available in the dashboard');
    
  } catch (error) {
    console.error('[SAMPLE CONVERSATIONS] Error:', error);
  }
}

// Run the script
if (require.main === module) {
  createSampleConversations().then(() => {
    console.log('[SAMPLE CONVERSATIONS] Script completed');
    process.exit(0);
  });
}

export { createSampleConversations };