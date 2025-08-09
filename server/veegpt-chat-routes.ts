import { Router } from 'express';
import { z } from 'zod';
import { db } from './db';
import { chatConversations, chatMessages, users, workspaces } from '../shared/schema';
import { eq, desc, and } from 'drizzle-orm';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// AI Processing Function
async function processMessage(message: string, language: string = 'en', userId: any = null, context: any = null): Promise<{ message: string }> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return { 
        message: "I'm here to help you with your social media needs! However, I need OpenAI API access to provide intelligent responses. Please configure your OpenAI API key." 
      };
    }

    const systemPrompt = `You are VeeFore AI Copilot, an intelligent assistant for social media management. You help users create content, schedule posts, analyze performance, set up automation, and manage their social media strategy across Instagram, YouTube, Twitter, and other platforms.

Key capabilities:
- Content creation (captions, hashtags, thumbnails, videos)
- Social media scheduling and publishing
- Analytics and performance insights
- Automation setup (DM responses, comment replies)
- Platform-specific optimization
- Team collaboration features

Always be helpful, professional, and focused on social media management tasks. Provide actionable suggestions and offer to execute tasks when possible. Use space/cosmic themes occasionally.`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    // Add conversation context if provided
    if (context?.conversationHistory) {
      const contextLines = context.conversationHistory.split('\n').slice(-6); // Last 6 messages
      const contextMessage = `Previous conversation context:\n${contextLines.join('\n')}\n\nCurrent message: ${message}`;
      messages[1].content = contextMessage;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return {
      message: response.choices[0]?.message?.content || "I'm here to help with your social media management needs! How can I assist you today?"
    };
  } catch (error) {
    console.error('[VEEGPT AI] Error processing message:', error);
    return {
      message: "I'm experiencing some technical difficulties right now, but I'm still here to help! Could you try rephrasing your question or let me know what specific social media task you'd like assistance with?"
    };
  }
}

// Validation schemas
const createConversationSchema = z.object({
  title: z.string().min(1).max(255),
  message: z.string().min(1)
});

const sendMessageSchema = z.object({
  conversationId: z.number().int().positive(),
  message: z.string().min(1)
});

// Get all conversations for user
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user's default workspace
    const userWorkspaces = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.userId, parseInt(userId)))
      .orderBy(desc(workspaces.isDefault));

    const workspaceId = userWorkspaces[0]?.id;
    if (!workspaceId) {
      return res.status(400).json({ error: 'No workspace found' });
    }

    const conversations = await db
      .select()
      .from(chatConversations)
      .where(and(
        eq(chatConversations.userId, parseInt(userId)),
        eq(chatConversations.workspaceId, workspaceId)
      ))
      .orderBy(desc(chatConversations.updatedAt));

    res.json(conversations);
  } catch (error) {
    console.error('[VEEGPT CHAT] Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a conversation
router.get('/messages/:conversationId', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const conversationId = parseInt(req.params.conversationId);
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    // Verify user owns this conversation
    const conversation = await db
      .select()
      .from(chatConversations)
      .where(and(
        eq(chatConversations.id, conversationId),
        eq(chatConversations.userId, parseInt(userId))
      ))
      .limit(1);

    if (conversation.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.createdAt);

    res.json(messages);
  } catch (error) {
    console.error('[VEEGPT CHAT] Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create new conversation
router.post('/conversations', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, message } = createConversationSchema.parse(req.body);

    // Get user's default workspace
    const userWorkspaces = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.userId, parseInt(userId)))
      .orderBy(desc(workspaces.isDefault));

    const workspaceId = userWorkspaces[0]?.id;
    if (!workspaceId) {
      return res.status(400).json({ error: 'No workspace found' });
    }

    // Create conversation
    const [newConversation] = await db
      .insert(chatConversations)
      .values({
        userId: parseInt(userId),
        workspaceId: workspaceId,
        title: title,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    // Add user message
    await db
      .insert(chatMessages)
      .values({
        conversationId: newConversation.id,
        role: 'user',
        content: message,
        createdAt: new Date()
      });

    // Generate AI response
    try {
      const aiResponse = await processMessage(message, 'en', null, null);
      
      // Add AI response
      await db
        .insert(chatMessages)
        .values({
          conversationId: newConversation.id,
          role: 'assistant',
          content: aiResponse.message,
          createdAt: new Date()
        });
    } catch (aiError) {
      console.error('[VEEGPT CHAT] AI response error:', aiError);
      // Add fallback response
      await db
        .insert(chatMessages)
        .values({
          conversationId: newConversation.id,
          role: 'assistant',
          content: "I'm here to help you with your social media needs! How can I assist you today?",
          createdAt: new Date()
        });
    }

    res.json(newConversation);
  } catch (error) {
    console.error('[VEEGPT CHAT] Error creating conversation:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Send message to existing conversation
router.post('/send', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { conversationId, message } = sendMessageSchema.parse(req.body);

    // Verify user owns this conversation
    const conversation = await db
      .select()
      .from(chatConversations)
      .where(and(
        eq(chatConversations.id, conversationId),
        eq(chatConversations.userId, parseInt(userId))
      ))
      .limit(1);

    if (conversation.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Add user message
    const [userMessage] = await db
      .insert(chatMessages)
      .values({
        conversationId: conversationId,
        role: 'user',
        content: message,
        createdAt: new Date()
      })
      .returning();

    // Get recent conversation context (last 10 messages)
    const recentMessages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(10);

    // Build context for AI
    const contextMessages = recentMessages.reverse().map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    // Generate AI response with context
    try {
      const aiResponse = await processMessage(
        message, 
        'en', 
        null, 
        { conversationHistory: contextMessages }
      );
      
      // Add AI response
      const [assistantMessage] = await db
        .insert(chatMessages)
        .values({
          conversationId: conversationId,
          role: 'assistant',
          content: aiResponse.message,
          createdAt: new Date()
        })
        .returning();

      // Update conversation timestamp
      await db
        .update(chatConversations)
        .set({ updatedAt: new Date() })
        .where(eq(chatConversations.id, conversationId));

      res.json({ userMessage, assistantMessage });
    } catch (aiError) {
      console.error('[VEEGPT CHAT] AI response error:', aiError);
      // Add fallback response
      const [assistantMessage] = await db
        .insert(chatMessages)
        .values({
          conversationId: conversationId,
          role: 'assistant',
          content: "I apologize, but I'm having trouble processing your request right now. Could you please try again?",
          createdAt: new Date()
        })
        .returning();

      res.json({ userMessage, assistantMessage });
    }
  } catch (error) {
    console.error('[VEEGPT CHAT] Error sending message:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Delete conversation
router.delete('/conversations/:conversationId', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const conversationId = parseInt(req.params.conversationId);
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    // Verify user owns this conversation
    const conversation = await db
      .select()
      .from(chatConversations)
      .where(and(
        eq(chatConversations.id, conversationId),
        eq(chatConversations.userId, parseInt(userId))
      ))
      .limit(1);

    if (conversation.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Delete messages first (foreign key constraint)
    await db
      .delete(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId));

    // Delete conversation
    await db
      .delete(chatConversations)
      .where(eq(chatConversations.id, conversationId));

    res.json({ success: true });
  } catch (error) {
    console.error('[VEEGPT CHAT] Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

export default router;