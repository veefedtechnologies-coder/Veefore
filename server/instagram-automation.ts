import { IStorage } from './storage';
import { AIResponseGenerator, MessageContext, AIResponseConfig } from './ai-response-generator';
import { InstagramStealthResponder } from './instagram-stealth-responder';

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
  private stealthResponder: InstagramStealthResponder;
  private processedComments = new Set<string>();

  constructor(private storage: IStorage) {
    this.aiGenerator = new AIResponseGenerator();
    this.stealthResponder = new InstagramStealthResponder();
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
      return { success: false, error: error.message };
    }
  }

  /**
   * Send automated DM to a user
   */
  async sendAutomatedDM(
    accessToken: string,
    recipientId: string,
    message: string,
    workspaceId: string,
    ruleId: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.log(`[AUTOMATION] Sending DM to user ${recipientId}: "${message}"`);
      
      const response = await fetch(
        `https://graph.instagram.com/v22.0/me/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipient: { id: recipientId },
            message: { text: message },
            access_token: accessToken
          })
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
      console.log(`[AUTOMATION] Error processing mentions:`, error);
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
          await this.storage.updateSocialAccount(instagramAccount.id, {
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
      console.log(`[AUTOMATION] Error processing new followers:`, error);
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

          // Generate stealth response with maximum human behavior simulation
          const stealthResponse = await this.stealthResponder.generateStealthResponse(
            caption,
            mention.username || 'unknown',
            { postId: mention.id, platform: 'instagram' }
          );
          
          if (stealthResponse.shouldRespond) {
            console.log(`[STEALTH] Generated ultra-natural response: "${stealthResponse.response}" (delay: ${stealthResponse.delay}ms)`);
            
            // Apply stealth delay before responding
            setTimeout(async () => {
              await this.sendAutomatedComment(accessToken, mention.id, stealthResponse.response, workspaceId, rule.id);
            }, stealthResponse.delay);
          } else {
            console.log(`[STEALTH] Skipping response to maintain human-like behavior patterns`);
          }
        }
      }
    } catch (error) {
      console.log(`[AUTOMATION] Error processing individual mention:`, error);
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
      console.log(`[AI AUTOMATION] Processing message for rule type: ${rule.trigger?.type || rule.action?.type}`);
      
      // Extract user configuration from rule
      const action = rule.action || {};
      const aiConfig = action.aiConfig || {};
      const personality = aiConfig.personality || action.aiPersonality || 'friendly';
      const responseLength = aiConfig.responseLength || action.responseLength || 'medium';
      const language = aiConfig.language || 'auto';
      const contextualMode = aiConfig.contextualMode !== false; // default to true
      
      console.log(`[AI AUTOMATION] Using configuration: personality=${personality}, length=${responseLength}, language=${language}, contextual=${contextualMode}`);
      
      // Check if this is a DM rule - use DM-specific response with 100% rate
      const isDMRule = (rule.trigger?.type === 'dm') || (rule.action?.type === 'dm');
      
      if (isDMRule) {
        console.log(`[AI AUTOMATION] Using DM response generator with 100% response rate`);
        const dmResult = await this.stealthResponder.generateDMResponse(
          message,
          userProfile?.username || 'unknown',
          { 
            platform: 'instagram', 
            ruleId: rule.id,
            aiPersonality: personality,
            responseLength: responseLength,
            language: language,
            contextualMode: contextualMode
          }
        );
        
        if (dmResult.shouldRespond && dmResult.response) {
          console.log(`[AI AUTOMATION] DM response generated: "${dmResult.response}"`);
          return dmResult.response;
        } else {
          console.log(`[AI AUTOMATION] DM daily limit reached`);
          throw new Error('DM daily limit reached');
        }
      } else {
        console.log(`[AI AUTOMATION] Using comment stealth responder for: "${message}"`);
        
        // Use regular stealth responder for comments
        const stealthResult = await this.stealthResponder.generateStealthResponse(
          message,
          userProfile?.username || 'unknown',
          { 
            platform: 'instagram', 
            ruleId: rule.id,
            aiPersonality: personality,
            responseLength: responseLength,
            language: language,
            contextualMode: contextualMode
          }
        );
        
        if (stealthResult.shouldRespond && stealthResult.response) {
          console.log(`[AI AUTOMATION] Stealth response generated: "${stealthResult.response}"`);
          return stealthResult.response;
        } else {
          console.log(`[AI AUTOMATION] Stealth responder declined to respond for natural behavior`);
          throw new Error('Stealth responder declined to respond');
        }
      }
      
    } catch (error) {
      console.error('[AI AUTOMATION] Response generation failed:', error);
      throw new Error('No response generated to maintain natural behavior patterns');
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
    console.log('[AUTOMATION] Starting Instagram automation service');
    
    // Run automation checks every 5 minutes
    setInterval(async () => {
      try {
        // Get all workspaces with active automation rules
        const workspaces = await this.storage.getAllWorkspaces?.();
        
        if (workspaces) {
          for (const workspace of workspaces) {
            await this.processMentions(workspace.id.toString());
            await this.processNewFollowers(workspace.id.toString());
          }
        }
      } catch (error) {
        console.log('[AUTOMATION] Service error:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
}