import { MongoStorage } from './mongodb-storage';
import { ConversationMemoryService } from './conversation-memory-service';
import { InstagramTokenManager } from './instagram-token-manager';
import axios from 'axios';

export class EnhancedAutoDMService {
  private storage: MongoStorage;
  private memoryService: ConversationMemoryService;
  private tokenManager: InstagramTokenManager;
  private processedMessages: Set<string> = new Set(); // Track processed message IDs

  constructor(storage: MongoStorage) {
    this.storage = storage;
    this.memoryService = new ConversationMemoryService(storage);
    this.tokenManager = new InstagramTokenManager(storage);
  }

  // Enhanced webhook handler for Instagram DMs with memory integration
  async handleInstagramDMWebhook(webhookData: any): Promise<void> {
    console.log('[ENHANCED DM] Processing Instagram DM webhook with memory');
    
    try {
      const { entry } = webhookData;
      
      for (const entryItem of entry) {
        const { messaging } = entryItem;
        
        if (messaging) {
          for (const message of messaging) {
            await this.processIncomingMessage(message);
          }
        }
      }
    } catch (error) {
      console.error('[ENHANCED DM ERROR] Failed to process webhook:', error);
      throw error;
    }
  }

  // Process incoming Instagram DM with conversation memory
  private async processIncomingMessage(messageData: any): Promise<void> {
    console.log('[ENHANCED DM] Processing incoming message with context');
    
    try {
      const { sender, recipient, message } = messageData;
      
      // Better error handling for message structure
      if (!sender?.id || !recipient?.id || !message?.text || !message?.mid) {
        console.log('[ENHANCED DM] Skipping message - missing required fields');
        return;
      }
      
      const senderId = sender.id;
      const recipientId = recipient.id;
      const messageText = message.text;
      const messageId = message.mid;

      // Check if we've already processed this message to prevent duplicates
      const messageKey = `${messageId}_${senderId}_${recipientId}`;
      if (this.processedMessages.has(messageKey)) {
        console.log(`[ENHANCED DM] Skipping duplicate message: ${messageKey}`);
        return;
      }
      
      // Mark message as processed
      this.processedMessages.add(messageKey);
      
      // Clean up old processed messages (keep only last 1000)
      if (this.processedMessages.size > 1000) {
        const keysArray = Array.from(this.processedMessages);
        keysArray.slice(0, 500).forEach(key => this.processedMessages.delete(key));
      }

      // Find workspace and automation rules for DM type
      console.log('[ENHANCED DM] Looking for active DM automation rules');
      const automationRules = await this.storage.getAutomationRulesByType('dm');
      console.log(`[ENHANCED DM] Found ${automationRules.length} DM rules`);
      
      // Process only the first active rule to prevent duplicate responses
      let responseGenerated = false;
      
      for (const rule of automationRules) {
        if (!rule.isActive || responseGenerated) {
          console.log(`[ENHANCED DM] Skipping rule: ${rule.name} (${responseGenerated ? 'response already generated' : 'inactive'})`);
          continue;
        }

        console.log(`[ENHANCED DM] Processing rule: ${rule.name} for workspace: ${rule.workspaceId}`);
        const socialAccounts = await this.storage.getSocialAccountsByWorkspace(rule.workspaceId.toString());
        console.log(`[ENHANCED DM] Found ${socialAccounts.length} social accounts for workspace`);
        
        const instagramAccount = socialAccounts.find(acc => 
          acc.platform === 'instagram'
        );
        console.log(`[ENHANCED DM] Instagram account found:`, instagramAccount ? 'YES' : 'NO');

        if (!instagramAccount) continue;

        console.log(`[ENHANCED DM] Processing DM for workspace ${rule.workspaceId}`);
        
        // Get or create conversation with memory
        const conversation = await this.memoryService.getOrCreateConversation(
          rule.workspaceId.toString(),
          'instagram',
          senderId,
          sender.username || senderId
        );

        // Store incoming user message
        await this.memoryService.storeMessage(
          conversation.id,
          messageId,
          'user',
          messageText,
          rule.id
        );

        // Generate contextual AI response using conversation memory
        // Handle workspace ID format issue safely
        let workspace = null;
        try {
          workspace = await this.storage.getWorkspace(rule.workspaceId.toString());
        } catch (error) {
          console.log(`[ENHANCED DM] Could not get workspace ${rule.workspaceId}, using default personality`);
        }
        
        const aiResponse = await this.memoryService.generateContextualResponse(
          conversation.id,
          messageText,
          workspace?.aiPersonality || 'professional'
        );

        // Get valid Instagram page access token using token manager
        const pageTokenInfo = await this.tokenManager.getPageAccessToken(instagramAccount.workspaceId.toString());
        
        let success = false;
        if (pageTokenInfo) {
          success = await this.sendInstagramDM(
            pageTokenInfo.accessToken,
            pageTokenInfo.pageId,
            senderId,
            aiResponse
          );
        } else {
          // Fallback to stored token with enhanced error handling
          success = await this.sendInstagramDM(
            instagramAccount.accessToken!,
            recipientId,
            senderId,
            aiResponse
          );
        }

        if (success) {
          // Store AI response in conversation memory
          await this.memoryService.storeMessage(
            conversation.id,
            null, // Instagram doesn't provide message ID for sent messages immediately
            'ai',
            aiResponse,
            rule.id
          );

          console.log(`[ENHANCED DM] Sent contextual response: ${aiResponse.substring(0, 50)}...`);
          responseGenerated = true; // Prevent other rules from generating duplicate responses
        } else {
          console.error('[ENHANCED DM] Failed to send Instagram DM response');
        }
      }
    } catch (error) {
      console.error('[ENHANCED DM ERROR] Failed to process incoming message:', error);
    }
  }

  // Send Instagram DM using Instagram Graph API
  private async sendInstagramDM(
    accessToken: string,
    pageId: string,
    recipientId: string,
    messageText: string
  ): Promise<boolean> {
    console.log('[ENHANCED DM] Sending Instagram DM via Instagram Graph API');
    
    try {
      // Use Instagram Graph API messaging endpoint as per documentation
      const url = `https://graph.instagram.com/v23.0/${pageId}/messages`;
      
      const payload = {
        recipient: {
          id: recipientId
        },
        message: {
          text: messageText
        }
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 200) {
        console.log('[ENHANCED DM] Successfully sent Instagram Graph API DM');
        return true;
      } else {
        console.error('[ENHANCED DM] Instagram Graph API returned non-200 status:', response.status);
        return false;
      }
    } catch (error: any) {
      console.error('[ENHANCED DM ERROR] Failed to send Instagram Graph API DM:', error.response?.data || error.message);
      return false;
    }
  }

  // Get conversation history for dashboard display
  async getConversationHistory(workspaceId: string, limit: number = 50): Promise<any[]> {
    console.log(`[ENHANCED DM] Getting authentic conversation history for workspace ${workspaceId}`);
    
    try {
      // Use storage interface to get real MongoDB conversations and messages
      if (this.storage instanceof require('./mongodb-storage').MongoStorage) {
        await this.storage.connect();
        
        // Access MongoDB models directly from storage
        const mongoose = require('mongoose');
        
        // Get real conversations from MongoDB
        const DmConversation = mongoose.model('DmConversation');
        const DmMessage = mongoose.model('DmMessage');
        
        const conversations = await DmConversation.find({ workspaceId })
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();
        
        console.log(`[ENHANCED DM] Found ${conversations.length} authentic Instagram conversations`);
        
        const conversationHistory = [];
        
        for (const conversation of conversations) {
          // Get authentic messages for this conversation
          const messages = await DmMessage.find({ conversationId: conversation._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();
          
          console.log(`[ENHANCED DM] Conversation ${conversation._id}: ${messages.length} messages`);
          
          // Extract real participant info
          const participantId = conversation.participant?.id || conversation.participantId || 'unknown';
          const participantUsername = conversation.participant?.username || 
            conversation.participantUsername || 
            `InstagramUser_${participantId.slice(-4)}`;
          
          const lastMessage = messages.length > 0 ? {
            content: messages[0].content,
            sender: messages[0].sender,
            timestamp: messages[0].createdAt,
            sentiment: messages[0].sentiment || 'neutral'
          } : null;
          
          console.log(`[ENHANCED DM] Last message for ${participantUsername}: ${lastMessage?.content}`);
          
          conversationHistory.push({
            id: conversation._id.toString(),
            participant: {
              id: participantId,
              username: participantUsername,
              platform: conversation.platform || 'instagram'
            },
            lastMessage,
            messageCount: conversation.messageCount || messages.length,
            lastActive: conversation.lastMessageAt || conversation.createdAt,
            recentMessages: messages.slice(0, 3).map(msg => ({
              content: msg.content,
              sender: msg.sender,
              timestamp: msg.createdAt,
              sentiment: msg.sentiment || 'neutral'
            })),
            context: [],
            sentiment: this.extractSentimentFromMessages(messages),
            topics: this.extractTopicsFromMessages(messages)
          });
        }
        
        return conversationHistory.sort((a, b) => 
          new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
        );
      }
      
      // Fallback: use storage interface method
      const conversations = await this.storage.getDmConversations(workspaceId, limit);
      console.log(`[ENHANCED DM] Storage fallback: Found ${conversations.length} conversations`);
      
      return conversations.map(conv => ({
        id: conv.id,
        participant: {
          id: conv.participantId,
          username: conv.participantUsername || `User_${conv.participantId?.slice(-4)}`,
          platform: conv.platform
        },
        lastMessage: null,
        messageCount: conv.messageCount,
        lastActive: conv.lastMessageAt,
        recentMessages: [],
        context: [],
        sentiment: 'neutral',
        topics: []
      }));
      
    } catch (error) {
      console.error('[ENHANCED DM ERROR] Failed to get authentic conversation history:', error);
      return [];
    }
  }

  // Helper method to extract sentiment from messages
  private extractSentimentFromMessages(messages: any[]): string {
    if (messages.length === 0) return 'neutral';
    
    const sentiments = messages.map(msg => msg.sentiment || 'neutral');
    const posCount = sentiments.filter(s => s === 'positive').length;
    const negCount = sentiments.filter(s => s === 'negative').length;
    
    if (posCount > negCount) return 'positive';
    if (negCount > posCount) return 'negative';
    return 'neutral';
  }

  // Helper method to extract topics from messages
  private extractTopicsFromMessages(messages: any[]): string[] {
    const topics = new Set<string>();
    
    messages.forEach(msg => {
      if (msg.topics && Array.isArray(msg.topics)) {
        msg.topics.forEach(topic => topics.add(topic));
      }
      
      // Extract basic topics from content
      const content = msg.content?.toLowerCase() || '';
      if (content.includes('automation') || content.includes('ai')) topics.add('AI & Automation');
      if (content.includes('content') || content.includes('post')) topics.add('Content Strategy');
      if (content.includes('business') || content.includes('growth')) topics.add('Business Growth');
      if (content.includes('social') || content.includes('media')) topics.add('Social Media');
    });
    
    return Array.from(topics).slice(0, 3); // Return top 3 topics
  }

  // Get conversation statistics for analytics
  async getConversationAnalytics(workspaceId: string): Promise<any> {
    console.log(`[ENHANCED DM] Getting conversation analytics for workspace ${workspaceId}`);
    
    try {
      const stats = await this.memoryService.getConversationStats(workspaceId);
      
      // Get additional analytics
      const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const recentConversations = await this.getConversationHistory(workspaceId, 100);
      const activeThisWeek = recentConversations.filter(conv => 
        new Date(conv.lastActive) > last7Days
      ).length;
      
      const sentimentDistribution = this.calculateSentimentDistribution(recentConversations);
      const topTopics = this.calculateTopTopics(recentConversations);
      const responseRate = this.calculateResponseRate(recentConversations);
      
      return {
        ...stats,
        activeThisWeek,
        sentimentDistribution,
        topTopics,
        responseRate,
        averageMessagesPerConversation: stats.totalMessages / Math.max(stats.totalConversations, 1),
        memoryRetentionDays: 3
      };
    } catch (error) {
      console.error('[ENHANCED DM ERROR] Failed to get conversation analytics:', error);
      return {
        totalConversations: 0,
        activeConversations: 0,
        totalMessages: 0,
        averageResponseTime: 0,
        activeThisWeek: 0,
        sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
        topTopics: [],
        responseRate: 0,
        averageMessagesPerConversation: 0,
        memoryRetentionDays: 3
      };
    }
  }

  // Cleanup expired conversation memory (run daily)
  async cleanupExpiredMemory(): Promise<void> {
    console.log('[ENHANCED DM] Running memory cleanup for expired conversations');
    
    try {
      await this.memoryService.cleanupExpiredMemory();
      console.log('[ENHANCED DM] Memory cleanup completed successfully');
    } catch (error) {
      console.error('[ENHANCED DM ERROR] Failed to cleanup expired memory:', error);
    }
  }

  // Test contextual response generation
  async testContextualResponse(
    workspaceId: string,
    participantId: string,
    testMessage: string
  ): Promise<string> {
    console.log(`[ENHANCED DM] Testing contextual response for ${participantId}`);
    
    try {
      // Get or create test conversation
      const conversation = await this.memoryService.getOrCreateConversation(
        workspaceId,
        'instagram',
        participantId,
        `test_user_${participantId}`
      );

      // Store test message
      await this.memoryService.storeMessage(
        conversation.id,
        `test_${Date.now()}`,
        'user',
        testMessage
      );

      // Generate contextual response
      const workspace = await this.storage.getWorkspace(parseInt(workspaceId));
      const response = await this.memoryService.generateContextualResponse(
        conversation.id,
        testMessage,
        workspace?.aiPersonality
      );

      // Store AI response
      await this.memoryService.storeMessage(
        conversation.id,
        null,
        'ai',
        response
      );

      return response;
    } catch (error) {
      console.error('[ENHANCED DM ERROR] Failed to test contextual response:', error);
      return 'I apologize, but I encountered an error processing your message. Please try again.';
    }
  }

  // Helper methods for analytics
  private extractOverallSentiment(context: any[]): string {
    const sentiments = context
      .filter(ctx => ctx.contextType === 'sentiment')
      .map(ctx => ctx.contextValue);
    
    if (sentiments.length === 0) return 'neutral';
    
    const sentimentCounts = sentiments.reduce((acc, sentiment) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(sentimentCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';
  }

  private extractTopics(context: any[]): string[] {
    return context
      .filter(ctx => ctx.contextType === 'topic')
      .map(ctx => ctx.contextValue)
      .slice(0, 5);
  }

  private calculateSentimentDistribution(conversations: any[]): any {
    const sentiments = conversations.map(conv => conv.sentiment);
    const total = sentiments.length;
    
    if (total === 0) return { positive: 0, negative: 0, neutral: 0 };
    
    const counts = sentiments.reduce((acc, sentiment) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      positive: Math.round((counts.positive || 0) / total * 100),
      negative: Math.round((counts.negative || 0) / total * 100),
      neutral: Math.round((counts.neutral || 0) / total * 100)
    };
  }

  private calculateTopTopics(conversations: any[]): { topic: string; count: number }[] {
    const allTopics = conversations.flatMap(conv => conv.topics || []);
    const topicCounts = allTopics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));
  }

  private calculateResponseRate(conversations: any[]): number {
    if (conversations.length === 0) return 0;
    
    const conversationsWithAIResponse = conversations.filter(conv => 
      conv.recentMessages?.some((msg: any) => msg.sender === 'ai')
    ).length;
    
    return Math.round(conversationsWithAIResponse / conversations.length * 100);
  }
}