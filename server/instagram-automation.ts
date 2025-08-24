import { IStorage } from './storage';
import { AIResponseGenerator, MessageContext, AIResponseConfig } from './ai-response-generator';

export interface AutomationRule {
  id: string;
  workspaceId: string;
  type: 'comment' | 'dm';
  isActive: boolean;
  triggers: {
    aiMode?: 'contextual' | 'keyword';
    keywords?: string[];
    hashtags?: string[];
    mentions?: boolean;
    newFollowers?: boolean;
    postInteraction?: boolean;
  };
  responses: string[];
  aiPersonality?: string;
  responseLength?: string;
  conditions: {
    timeDelay?: number; // minutes
    maxPerDay?: number;
    excludeKeywords?: string[];
    minFollowers?: number;
  };
  schedule?: {
    timezone: string;
    activeHours: {
      start: string; // "09:00"
      end: string;   // "18:00"
    };
    activeDays: number[]; // 0-6 (Sunday-Saturday)
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationLog {
  id: string;
  ruleId: string;
  workspaceId: string;
  type: 'comment' | 'dm';
  targetUserId: string;
  targetUsername: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  errorMessage?: string;
  sentAt: Date;
}

export class InstagramAutomation {
  private aiGenerator: AIResponseGenerator;
  private processedComments = new Set<string>();

  constructor(private storage: IStorage) {
    this.aiGenerator = new AIResponseGenerator();
  }

  /**
   * Check if comment has already been processed
   */
  isCommentProcessed(commentId: string): boolean {
    return this.processedComments.has(commentId);
  }

  /**
   * Mark comment as processed
   */
  markCommentProcessed(commentId: string): void {
    this.processedComments.add(commentId);
  }

  /**
   * Send automated comment to a post
   */
  async sendAutomatedComment(
    accessToken: string,
    commentId: string,
    message: string,
    workspaceId: string,
    ruleId: string
  ): Promise<{ success: boolean; commentId?: string; error?: string }> {
    try {
      console.log(`[AUTOMATION] Sending reply to comment ${commentId}: "${message}"`);
      
      const response = await fetch(
        `https://graph.instagram.com/v22.0/${commentId}/replies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            access_token: accessToken
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`[AUTOMATION] Comment sent successfully: ${data.id}`);
        
        // Log the automation action
        await this.logAutomationAction({
          ruleId,
          workspaceId,
          type: 'comment',
          targetUserId: commentId,
          targetUsername: 'unknown',
          message,
          status: 'sent',
          sentAt: new Date()
        });

        return { success: true, commentId: data.id };
      } else {
        const error = await response.text();
        console.log(`[AUTOMATION] Comment failed: ${error}`);
        
        await this.logAutomationAction({
          ruleId,
          workspaceId,
          type: 'comment',
          targetUserId: commentId,
          targetUsername: 'unknown',
          message,
          status: 'failed',
          errorMessage: error,
          sentAt: new Date()
        });

        return { success: false, error };
      }
    } catch (error) {
      console.log(`[AUTOMATION] Comment exception:`, error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Send automated DM to a user with professional template formatting
   */
  async sendAutomatedDM(
    accessToken: string,
    recipientId: string,
    message: string,
    workspaceId: string,
    ruleId: string,
    template?: { messageText: string; buttonText: string; buttonUrl: string }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.log(`[AUTOMATION] Sending professional DM to user ${recipientId}`);
      
      // Create professional DM with template if provided
      let dmPayload: any;
      
      if (template && template.buttonText && template.buttonUrl) {
        // Professional template with timestamp, message, and button (like big companies)
        const timestamp = this.formatProfessionalTimestamp();
        const professionalMessage = `${timestamp}\n\n${template.messageText}`;
        
        console.log(`[AUTOMATION] Using professional template with button: "${template.buttonText}"`);
        
        // Instagram supports Generic Template for rich messages with buttons
        dmPayload = {
          recipient: { id: recipientId },
          message: {
            attachment: {
              type: "template",
              payload: {
                template_type: "generic",
                elements: [
                  {
                    title: professionalMessage,
                    buttons: [
                      {
                        type: "web_url",
                        url: template.buttonUrl,
                        title: template.buttonText
                      }
                    ]
                  }
                ]
              }
            }
          },
          access_token: accessToken
        };
      } else {
        // Fallback to simple text message
        dmPayload = {
          recipient: { id: recipientId },
          message: { text: message },
          access_token: accessToken
        };
      }
      
      const response = await fetch(
        `https://graph.instagram.com/v22.0/me/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dmPayload)
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`[AUTOMATION] DM sent successfully: ${data.message_id}`);
        
        await this.logAutomationAction({
          ruleId,
          workspaceId,
          type: 'dm',
          targetUserId: recipientId,
          targetUsername: 'unknown',
          message,
          status: 'sent',
          sentAt: new Date()
        });

        return { success: true, messageId: data.message_id };
      } else {
        const error = await response.text();
        console.log(`[AUTOMATION] DM failed: ${error}`);
        
        await this.logAutomationAction({
          ruleId,
          workspaceId,
          type: 'dm',
          targetUserId: recipientId,
          targetUsername: 'unknown',
          message,
          status: 'failed',
          errorMessage: error,
          sentAt: new Date()
        });

        return { success: false, error };
      }
    } catch (error) {
      console.log(`[AUTOMATION] DM exception:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Format timestamp like professional companies (e.g., "JUL 15, 08:31 PM")
   */
  private formatProfessionalTimestamp(): string {
    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                   'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    const month = months[now.getMonth()];
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${month} ${day}, ${displayHours}:${minutes} ${ampm}`;
  }

  /**
   * Send comment-to-DM automation (reply to comment + send professional DM)
   */
  async sendCommentToDMAutomation(
    accessToken: string,
    commentId: string,
    commentReply: string,
    commenterUserId: string,
    workspaceId: string,
    ruleId: string,
    dmTemplate?: { messageText: string; buttonText: string; buttonUrl: string }
  ): Promise<{ commentSuccess: boolean; dmSuccess: boolean; errors?: string[] }> {
    try {
      console.log(`[AUTOMATION] Starting comment-to-DM automation for comment ${commentId}`);
      
      const results = { commentSuccess: false, dmSuccess: false, errors: [] };
      
      // Step 1: Reply to the comment (like "Check your DMs!")
      const commentResult = await this.sendAutomatedComment(
        accessToken, commentId, commentReply, workspaceId, ruleId
      );
      
      results.commentSuccess = commentResult.success;
      if (!commentResult.success) {
        results.errors.push(`Comment reply failed: ${commentResult.error}`);
      }
      
      // Step 2: Send professional DM with template
      const dmResult = await this.sendAutomatedDM(
        accessToken, commenterUserId, '', workspaceId, ruleId, dmTemplate
      );
      
      results.dmSuccess = dmResult.success;
      if (!dmResult.success) {
        results.errors.push(`DM failed: ${dmResult.error}`);
      }
      
      console.log(`[AUTOMATION] Comment-to-DM automation completed - Comment: ${results.commentSuccess}, DM: ${results.dmSuccess}`);
      
      return results;
    } catch (error) {
      console.error(`[AUTOMATION] Comment-to-DM automation failed:`, error);
      return {
        commentSuccess: false,
        dmSuccess: false,
        errors: [`Automation failed: ${error.message}`]
      };
    }
  }

  /**
   * Process new mentions and trigger automation
   */
  async processMentions(workspaceId: string): Promise<void> {
    try {
      const socialAccounts = await this.storage.getSocialAccountsByWorkspace(workspaceId);
      const instagramAccount = socialAccounts.find(acc => acc.platform === 'instagram');
      
      if (!instagramAccount?.accessToken) {
        console.log(`[AUTOMATION] No Instagram account found for workspace ${workspaceId}`);
        return;
      }

      // Get automation rules for mentions
      const rules = await this.getAutomationRules(workspaceId, 'mentions');
      if (rules.length === 0) {
        console.log(`[AUTOMATION] No mention automation rules found for workspace ${workspaceId}`);
        return;
      }

      // Fetch recent mentions
      const mentionsResponse = await fetch(
        `https://graph.instagram.com/v22.0/${instagramAccount.accountId}/tagged?fields=id,caption,comments_count,like_count,media_type,timestamp&access_token=${instagramAccount.accessToken}`
      );

      if (mentionsResponse.ok) {
        const mentionsData = await mentionsResponse.json();
        const mentions = mentionsData.data || [];
        
        console.log(`[AUTOMATION] Found ${mentions.length} recent mentions`);

        for (const mention of mentions.slice(0, 5)) { // Process latest 5 mentions
          await this.processIndividualMention(mention, rules, instagramAccount.accessToken, workspaceId);
        }
      }
    } catch (error) {
      console.log(`[AUTOMATION] Error processing mentions:`, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Process new followers and send welcome DMs
   */
  async processNewFollowers(workspaceId: string): Promise<void> {
    try {
      const socialAccounts = await this.storage.getSocialAccountsByWorkspace(workspaceId);
      const instagramAccount = socialAccounts.find(acc => acc.platform === 'instagram');
      
      if (!instagramAccount?.accessToken) {
        return;
      }

      const rules = await this.getAutomationRules(workspaceId, 'new_followers');
      if (rules.length === 0) {
        return;
      }

      // Get recent followers (Instagram API limitation - this would need webhooks for real-time)
      const followersResponse = await fetch(
        `https://graph.instagram.com/v22.0/${instagramAccount.accountId}?fields=followers_count&access_token=${instagramAccount.accessToken}`
      );

      if (followersResponse.ok) {
        const data = await followersResponse.json();
        const currentFollowers = data.followers_count;
        
        // Check if followers increased since last check
        if (currentFollowers > (instagramAccount.followersCount || 0)) {
          const newFollowersCount = currentFollowers - (instagramAccount.followersCount || 0);
          console.log(`[AUTOMATION] Detected ${newFollowersCount} new followers`);
          
          // Update stored follower count
          await this.storage.updateSocialAccount(instagramAccount.id as any, {
            followersCount: currentFollowers
          });

          // Process new follower automation rules
          for (const rule of rules) {
            if (rule.isActive && this.isWithinSchedule(rule.schedule)) {
              console.log(`[AUTOMATION] New follower rule triggered: ${rule.id}`);
              // Note: Instagram API doesn't provide individual follower data
              // This would require webhook integration for real follower tracking
            }
          }
        }
      }
    } catch (error) {
      console.log(`[AUTOMATION] Error processing new followers:`, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Process individual mention for automation
   */
  private async processIndividualMention(
    mention: any,
    rules: AutomationRule[],
    accessToken: string,
    workspaceId: string
  ): Promise<void> {
    try {
      const caption = mention.caption?.toLowerCase() || '';
      
      for (const rule of rules) {
        if (!rule.isActive || !this.isWithinSchedule(rule.schedule)) {
          continue;
        }

        // Check if rule conditions are met
        const shouldTrigger = this.shouldTriggerRule(rule, caption);
        
        if (shouldTrigger) {
          const dailyCount = await this.getDailyAutomationCount(rule.id);
          
          if (rule.conditions.maxPerDay && dailyCount >= rule.conditions.maxPerDay) {
            console.log(`[AUTOMATION] Daily limit reached for rule ${rule.id}`);
            continue;
          }

          // Generate response using configured responses or AI
          const response = await this.generateContextualResponse(caption, rule, { username: mention.username || 'unknown' });
          
          if (response) {
            console.log(`[AUTOMATION] Generated response: "${response}"`);
            
            // Send automated comment
            await this.sendAutomatedComment(accessToken, mention.id, response, workspaceId, rule.id);
          } else {
            console.log(`[AUTOMATION] No response generated`);
          }
        }
      }
    } catch (error) {
      console.log(`[AUTOMATION] Error processing individual mention:`, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Generate contextual AI response for a message
   */
  async generateContextualResponse(
    message: string,
    rule: any,
    userProfile?: { username: string }
  ): Promise<string> {
    try {
      console.log(`[AUTOMATION] === RESPONSE GENERATION DEBUG START ===`);
      console.log(`[AUTOMATION] Rule received in generateContextualResponse:`, JSON.stringify({
        id: rule.id,
        type: rule.type,
        name: rule.name,
        actionExists: !!rule.action,
        actionResponses: rule.action?.responses,
        actionDmResponses: rule.action?.dmResponses,
        directResponses: rule.responses,
        directDmResponses: rule.dmResponses,
        entireRuleAction: rule.action
      }));
      
      console.log(`[AI AUTOMATION] Processing message for rule type: ${rule.trigger?.type || rule.action?.type}`);
      
      // Extract user configuration from rule
      const action = rule.action || {};
      const aiConfig = action.aiConfig || {};
      const personality = aiConfig.personality || action.aiPersonality || 'friendly';
      const responseLength = aiConfig.responseLength || action.responseLength || 'medium';
      const language = aiConfig.language || 'auto';
      const contextualMode = aiConfig.contextualMode !== false; // default to true
      
      console.log(`[AI AUTOMATION] Using configuration: personality=${personality}, length=${responseLength}, language=${language}, contextual=${contextualMode}`);
      
      // Determine automation type and response strategy
      const isCommentToDMRule = rule.type === 'dm' && rule.triggers?.postInteraction === true;
      const isPureDMRule = rule.type === 'dm' && rule.triggers?.postInteraction !== true;
      const isCommentOnlyRule = rule.type === 'comment';
      
      console.log(`[AI AUTOMATION] Rule analysis: type=${rule.type}, postInteraction=${rule.triggers?.postInteraction}, isCommentToDM=${isCommentToDMRule}, isPureDM=${isPureDMRule}, isCommentOnly=${isCommentOnlyRule}`);
      
      // Generate response using configured responses or AI
      console.log(`[AI AUTOMATION] Generating response for rule type: ${rule.type}`);
      
      // First try to use pre-configured responses
      // For comment-to-DM rules, check responses for comment replies
      // For DM rules, check dmResponses first, then responses
      // For comment_dm rules, check responses for comment replies
      let responses = [];
      
      console.log(`[AUTOMATION] RESPONSE SELECTION DEBUG:`);
      console.log(`[AUTOMATION] - rule.type: ${rule.type}`);
      console.log(`[AUTOMATION] - rule.action: ${JSON.stringify(rule.action)}`);
      console.log(`[AUTOMATION] - rule.action?.responses: ${JSON.stringify(rule.action?.responses)}`);
      console.log(`[AUTOMATION] - rule.action?.dmResponses: ${JSON.stringify(rule.action?.dmResponses)}`);
      
      if (rule.type === 'comment_dm' && rule.action?.responses && rule.action.responses.length > 0) {
        responses = rule.action.responses;
        console.log(`[AUTOMATION] ✅ Using comment_dm responses: ${JSON.stringify(responses)}`);
      } else if (rule.type === 'dm' && rule.action?.dmResponses && rule.action.dmResponses.length > 0) {
        responses = rule.action.dmResponses;
        console.log(`[AUTOMATION] ✅ Using DM responses: ${JSON.stringify(responses)}`);
      } else if (rule.action?.responses && rule.action.responses.length > 0) {
        responses = rule.action.responses;
        console.log(`[AUTOMATION] ✅ Using action responses: ${JSON.stringify(responses)}`);
      } else if (rule.action?.dmResponses && rule.action.dmResponses.length > 0) {
        responses = rule.action.dmResponses;
        console.log(`[AUTOMATION] ✅ Using fallback DM responses: ${JSON.stringify(responses)}`);
      } else {
        console.log(`[AUTOMATION] ❌ NO RESPONSES FOUND - checking conditions:`);
        console.log(`[AUTOMATION] - rule.type === 'comment_dm': ${rule.type === 'comment_dm'}`);
        console.log(`[AUTOMATION] - rule.action?.responses exists: ${!!rule.action?.responses}`);
        console.log(`[AUTOMATION] - rule.action?.responses.length > 0: ${rule.action?.responses && rule.action.responses.length > 0}`);
        console.log(`[AUTOMATION] - rule.action?.dmResponses exists: ${!!rule.action?.dmResponses}`);
        console.log(`[AUTOMATION] - rule.action?.dmResponses.length > 0: ${rule.action?.dmResponses && rule.action.dmResponses.length > 0}`);
      }
      
      // Check if we have valid non-empty responses
      const validResponses = responses.filter((r: any) => r && r.trim() !== '');
      if (validResponses.length > 0) {
        // Use pre-configured response
        const response = validResponses[Math.floor(Math.random() * validResponses.length)];
        console.log(`[AUTOMATION] Using pre-configured response: "${response}"`);
        return response;
      }
      
      // If no pre-configured response, return error - NO AI AUTOMATION
      console.log(`[AUTOMATION] No pre-configured response found, responses: ${JSON.stringify(responses)}`);
      console.log(`[AUTOMATION] ERROR: No valid pre-configured response available for this rule. AI automation is disabled.`);
      return null as any;
      
    } catch (error) {
      console.error('[AI AUTOMATION] Response generation failed:', error);
      throw new Error('Response generation failed');
    }
  }

  /**
   * Generate AI response using OpenAI
   */
  private async generateAIResponse(
    message: string,
    personality: string = 'friendly',
    responseLength: string = 'medium',
    language: string = 'auto'
  ): Promise<string> {
    try {
      // Simple AI response using OpenAI if available
      if (process.env.OPENAI_API_KEY) {
        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const personalityPrompt = {
          friendly: 'Reply in a friendly, warm tone',
          professional: 'Reply in a professional, business-like tone',
          casual: 'Reply in a casual, relaxed tone',
          helpful: 'Reply in a helpful, informative tone'
        }[personality] || 'Reply in a friendly tone';

        const lengthPrompt = {
          short: 'Keep it very brief (1-2 sentences)',
          medium: 'Keep it concise (2-3 sentences)',
          long: 'Provide a detailed response (3-5 sentences)'
        }[responseLength] || 'Keep it concise';

        const response = await openai.chat.completions.create({
          model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: 'system',
              content: `You are a social media automation assistant. ${personalityPrompt}. ${lengthPrompt}. Generate a contextual response to the user's comment.`
            },
            {
              role: 'user',
              content: `User commented: "${message}". Generate an appropriate response.`
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        });

        return response.choices[0].message.content.trim();
      }

      // Fallback to simple responses if OpenAI not available
      const fallbackResponses = [
        'Thanks for your comment!',
        'Thank you for reaching out!',
        'I appreciate your message!',
        'Thanks for your interest!',
        'Thank you for connecting!'
      ];

      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    } catch (error) {
      console.error('[AI AUTOMATION] AI response generation failed:', error);
      // Return a simple fallback response
      return 'Thank you for your comment!';
    }
  }

  /**
   * Check if automation should trigger based on rule conditions
   */
  private shouldTriggerRule(rule: AutomationRule, content: string): boolean {
    // For contextual AI mode, always trigger (AI will decide if response is needed)
    if (rule.triggers.aiMode === 'contextual') {
      return true;
    }

    // For keyword mode, check for trigger keywords
    if (rule.triggers.keywords && rule.triggers.keywords.length > 0) {
      const hasKeyword = rule.triggers.keywords.some(keyword => 
        content.includes(keyword.toLowerCase())
      );
      if (!hasKeyword) return false;
    }

    // Check for trigger hashtags
    if (rule.triggers.hashtags && rule.triggers.hashtags.length > 0) {
      const hasHashtag = rule.triggers.hashtags.some(hashtag => 
        content.includes('#' + hashtag.toLowerCase())
      );
      if (!hasHashtag) return false;
    }

    // Check for exclude keywords
    if (rule.conditions.excludeKeywords && rule.conditions.excludeKeywords.length > 0) {
      const hasExcludeKeyword = rule.conditions.excludeKeywords.some(keyword => 
        content.includes(keyword.toLowerCase())
      );
      if (hasExcludeKeyword) return false;
    }

    return true;
  }

  /**
   * Check if current time is within rule schedule
   */
  private isWithinSchedule(schedule?: AutomationRule['schedule']): boolean {
    if (!schedule) return true;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

    // Check if current day is active
    if (!schedule.activeDays.includes(currentDay)) {
      return false;
    }

    // Check if current time is within active hours
    if (currentTime < schedule.activeHours.start || currentTime > schedule.activeHours.end) {
      return false;
    }

    return true;
  }

  /**
   * Get automation rules for workspace
   */
  private async getAutomationRules(workspaceId: string, type?: string): Promise<AutomationRule[]> {
    // This would be implemented based on your storage system
    // For now, return empty array - you'll need to implement storage for automation rules
    return [];
  }

  /**
   * Get daily automation count for a rule
   */
  private async getDailyAutomationCount(ruleId: string): Promise<number> {
    // This would count automation actions for today
    // Implementation depends on your storage system
    return 0;
  }

  /**
   * Log automation action
   */
  private async logAutomationAction(log: Partial<AutomationLog>): Promise<void> {
    try {
      console.log(`[AUTOMATION] Logging action:`, log);
      // This would be stored in your database
      // Implementation depends on your storage system
    } catch (error) {
      console.log(`[AUTOMATION] Error logging action:`, error);
    }
  }

  /**
   * Start automation monitoring service
   */
  async startAutomationService(): Promise<void> {
    console.log('[AUTOMATION] Instagram automation service configured for webhook-triggered execution');
    
    // Automation checks disabled - webhooks trigger automation when needed
    console.log('[AUTOMATION] ❌ Polling disabled - automation runs via webhook events');
    // setInterval(async () => {
    //   try {
    //     // Get all workspaces with active automation rules
    //     const workspaces = await this.storage.getAllWorkspaces?.();
    //     
    //     if (workspaces) {
    //       for (const workspace of workspaces) {
    //         await this.processMentions(workspace.id.toString());
    //         await this.processNewFollowers(workspace.id.toString());
    //       }
    //     }
    //   } catch (error) {
    //     console.log('[AUTOMATION] Service error:', error);
    //   }
    // }, 5 * 60 * 1000); // 5 minutes
  }
}