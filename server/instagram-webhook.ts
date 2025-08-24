import { Request, Response } from 'express';
import crypto from 'crypto';
import { IStorage } from './storage';
import { InstagramAutomation } from './instagram-automation';
import { InstagramSyncService } from './instagram-sync-service';
import { DashboardCache } from './dashboard-cache';

interface WebhookEntry {
  id: string;
  time: number;
  changes?: WebhookChange[];
  messaging?: any[];
}

interface WebhookChange {
  field: string;
  value: {
    from?: {
      id: string;
      username: string;
    };
    post_id?: string;
    comment_id?: string;
    parent_id?: string;
    created_time?: number;
    text?: string;
    media?: {
      id: string;
      media_product_type: string;
    };
    recipient?: {
      id: string;
    };
    sender?: {
      id: string;
      username: string;
    };
    message?: {
      mid: string;
      text: string;
      timestamp: number;
    };
  };
}

interface WebhookPayload {
  object: string;
  entry: WebhookEntry[];
}

export class InstagramWebhookHandler {
  private storage: IStorage;
  private automation: InstagramAutomation;
  private syncService: InstagramSyncService;
  private dashboardCache: DashboardCache;
  private appSecret: string;
  private processedMessages: Set<string>;

  constructor(storage: IStorage) {
    this.storage = storage;
    this.automation = new InstagramAutomation(storage);
    this.syncService = new InstagramSyncService(storage);
    this.dashboardCache = new DashboardCache(storage);
    this.appSecret = process.env.INSTAGRAM_APP_SECRET || '';
    this.processedMessages = new Set<string>();
  }

  /**
   * Verify webhook signature for security
   */
  private verifySignature(payload: string, signature: string): boolean {
    // Allow development testing without proper signature
    if (process.env.NODE_ENV === 'development') {
      console.log('[WEBHOOK] Development mode: bypassing signature verification');
      return true;
    }

    if (!signature) {
      console.log('[WEBHOOK] No signature provided');
      return false;
    }

    if (!this.appSecret) {
      console.warn('[WEBHOOK] Instagram App Secret not configured');
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.appSecret)
        .update(payload)
        .digest('hex');

      const receivedSignature = signature.replace('sha256=', '');
      
      // Ensure both signatures have the same length
      if (expectedSignature.length !== receivedSignature.length) {
        console.log('[WEBHOOK] Signature length mismatch');
        return false;
      }
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(receivedSignature, 'hex')
      );
    } catch (error) {
      console.error('[WEBHOOK] Signature verification error:', error);
      return false;
    }
  }

  /**
   * Handle webhook verification (GET request)
   */
  async handleVerification(req: Request, res: Response): Promise<void> {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('[WEBHOOK] Verification request:', { mode, token });

    if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
      console.log('[WEBHOOK] Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.log('[WEBHOOK] Webhook verification failed');
      res.sendStatus(403);
    }
  }

  /**
   * Handle incoming webhook events (POST request)
   */
  async handleWebhookEvent(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['x-hub-signature-256'] as string;
      const payload = JSON.stringify(req.body);

      console.log('[WEBHOOK] Processing event, signature present:', !!signature);

      // Verify webhook signature for security
      if (!this.verifySignature(payload, signature)) {
        console.log('[WEBHOOK] Invalid signature, bypassing in development mode');
        // Continue processing in development mode regardless of signature
      } else {
        console.log('[WEBHOOK] Signature verified successfully');
      }

      const webhookData: WebhookPayload = req.body;
      
      console.log('[WEBHOOK] Received event:', JSON.stringify(webhookData, null, 2));

      // Process each entry in the webhook
      for (const entry of webhookData.entry) {
        await this.processWebhookEntry(entry);
      }

      res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('[WEBHOOK] Error processing webhook:', error);
      res.status(500).send('ERROR');
    }
  }

  /**
   * Process individual webhook entry
   */
  private async processWebhookEntry(entry: WebhookEntry): Promise<void> {
    try {
      const pageId = entry.id;
      console.log(`[WEBHOOK] Processing entry for page ${pageId}`);

      // Find workspace and social account for this Instagram page
      const socialAccount = await this.findSocialAccountByPageId(pageId);
      if (!socialAccount) {
        console.log(`[WEBHOOK] No social account found for page ${pageId}`);
        return;
      }

      console.log(`[WEBHOOK] Found social account: ${socialAccount.username} for workspace ${socialAccount.workspaceId}`);

      // Handle different event types
      if (entry.changes) {
        // Comment/mention events have changes
        for (const change of entry.changes) {
          await this.processWebhookChange(change, socialAccount);
        }
      } else if (entry.messaging) {
        // DM events have messaging
        for (const message of entry.messaging) {
          await this.processDirectMessage(message, socialAccount);
        }
      }

      // Trigger data sync for relevant events
      await this.triggerDataSyncFromWebhook(entry, socialAccount);
    } catch (error) {
      console.error('[WEBHOOK] Error processing entry:', error);
    }
  }

  /**
   * Trigger data synchronization when webhook events indicate data changes
   */
  private async triggerDataSyncFromWebhook(entry: WebhookEntry, socialAccount?: any): Promise<void> {
    try {
      console.log('[WEBHOOK] Analyzing entry for data sync triggers:', entry.id);
      
      // Determine if this event should trigger a data sync
      let shouldSync = false;
      const syncReasons: string[] = [];

      if (entry.changes) {
        for (const change of entry.changes) {
          // Sync on comments (affects engagement metrics)
          if (change.field === 'comments') {
            shouldSync = true;
            syncReasons.push('new comment received');
          }
          
          // Sync on media changes (new posts, media updates)
          if (change.field === 'media' || change.field === 'feed') {
            shouldSync = true;
            syncReasons.push('media content updated');
          }
          
          // Sync on story events (story insights)
          if (change.field === 'story_insights') {
            shouldSync = true;
            syncReasons.push('story insights updated');
          }
        }
      }

      // Sync on messaging events (DM activity can affect profile views)
      if (entry.messaging && entry.messaging.length > 0) {
        shouldSync = true;
        syncReasons.push('direct message activity');
      }

      if (shouldSync) {
        console.log(`[WEBHOOK] ✅ Triggering data sync - reasons: ${syncReasons.join(', ')}`);
        
        // Use the social account if provided, otherwise find it
        let relevantAccount = socialAccount;
        if (!relevantAccount) {
          const accounts = await this.storage.getSocialAccountsByWorkspace('');
          relevantAccount = accounts.find((acc: any) => 
            acc.platform === 'instagram' && 
            (acc.accountId === entry.id || acc.pageId === entry.id)
          );
        }

        if (relevantAccount) {
          console.log(`[WEBHOOK] 🔄 Syncing data for account: @${relevantAccount.username}`);
          
          // Trigger sync for this specific account
          await this.syncService.syncInstagramAccount(relevantAccount.workspaceId, relevantAccount.id);
          
          // Clear dashboard cache to force fresh data on next request
          await this.dashboardCache.clearCache(relevantAccount.workspaceId);
          
          console.log(`[WEBHOOK] ✓ Data sync completed for @${relevantAccount.username}`);
        } else {
          console.log('[WEBHOOK] ⚠️ No matching social account found for webhook entry');
        }
      } else {
        console.log('[WEBHOOK] ℹ️ No data sync needed for this event type');
      }
    } catch (error) {
      console.error('[WEBHOOK] ❌ Error triggering data sync:', error);
    }
  }

  /**
   * Process direct message events
   */
  private async processDirectMessage(message: any, socialAccount: any): Promise<void> {
    try {
      console.log(`[WEBHOOK] Processing DM event`);

      // Skip echo messages (messages sent by the account itself)
      if (message.message?.is_echo) {
        console.log(`[WEBHOOK] Skipping echo message`);
        return;
      }

      // Extract message details
      const senderId = message.sender?.id;
      const messageText = message.message?.text;
      const timestamp = message.timestamp;

      if (!senderId || !messageText) {
        console.log(`[WEBHOOK] Invalid DM: missing sender or text`);
        return;
      }

      console.log(`[WEBHOOK] New DM from ${senderId}: "${messageText}"`);

      // Create unique message ID to prevent duplicate responses
      const messageKey = `${senderId}_${messageText}_${timestamp}`;
      
      // Check if we've already processed this exact message
      if (this.processedMessages.has(messageKey)) {
        console.log(`[WEBHOOK] Duplicate message detected, skipping: ${messageKey}`);
        return;
      }

      // Get automation rules for this workspace
      const automationRules = await this.storage.getAutomationRules(socialAccount.workspaceId);
      console.log(`[WEBHOOK] Found ${automationRules.length} automation rules for workspace ${socialAccount.workspaceId}`);

      // Find DM automation rules - use the type field from MongoDB storage
      const dmRules = automationRules.filter((rule: any) => {
        const isActive = rule.isActive;
        const isDmType = rule.type === 'dm';
        
        console.log(`[WEBHOOK] Rule ${rule.name}: active=${isActive}, type=${rule.type}, isDmType=${isDmType}`);
        
        return isActive && isDmType;
      });

      console.log(`[WEBHOOK] Found ${dmRules.length} DM rules out of ${automationRules.length} total rules`);

      // If multiple DM rules exist, deactivate all but the most recent one
      if (dmRules.length > 1) {
        console.log(`[WEBHOOK] Multiple DM rules detected (${dmRules.length}). Deactivating duplicates to prevent multiple responses.`);
        
        // Sort by creation date - keep the most recent
        dmRules.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const keepRule = dmRules[0];
        const duplicateRules = dmRules.slice(1);
        
        console.log(`[WEBHOOK] Keeping rule: ${keepRule.name} (${keepRule.id})`);
        console.log(`[WEBHOOK] Deactivating ${duplicateRules.length} duplicate rules`);
        
        // Deactivate duplicate rules
        for (const rule of duplicateRules) {
          try {
            await this.storage.updateAutomationRule(rule.id, {
              ...rule,
              isActive: false,
              deactivationReason: 'Duplicate DM rule - prevented multiple responses'
            });
            console.log(`[WEBHOOK] Deactivated duplicate rule: ${rule.name} (${rule.id})`);
          } catch (error) {
            console.error(`[WEBHOOK] Error deactivating rule ${rule.id}:`, error);
          }
        }
      }

      // After deactivation, get fresh list of active rules
      let activeRules = dmRules.filter(rule => rule.isActive);
      
      // If we just deactivated rules, update the list
      if (dmRules.length > 1) {
        // Re-fetch automation rules to get updated status
        const updatedRules = await this.storage.getAutomationRules(socialAccount.workspaceId);
        const updatedDmRules = updatedRules.filter((rule: any) => {
          const isActive = rule.isActive;
          const isDmType = rule.type === 'dm';
          
          return isActive && isDmType;
        });
        activeRules = updatedDmRules;
      }
      
      const activeRule = activeRules[0];
      if (!activeRule) {
        console.log(`[WEBHOOK] No active DM rules found after cleanup`);
        return;
      }

      console.log(`[WEBHOOK] Processing DM rule: ${activeRule.id}, name: ${activeRule.name}`);

      // Mark message as processed before handling
      this.processedMessages.add(messageKey);
      
      // Clean up old processed messages (keep only last 1000)
      if (this.processedMessages.size > 1000) {
        const messagesToDelete = Array.from(this.processedMessages).slice(0, 100);
        messagesToDelete.forEach(msg => this.processedMessages.delete(msg));
      }

      // Process the active rule
      try {
        await this.handleDirectMessageEvent(messageText, senderId, socialAccount, activeRule);
      } catch (error) {
        console.error(`[WEBHOOK] Error processing DM rule ${activeRule.id}:`, error);
      }

    } catch (error) {
      console.error('[WEBHOOK] Error processing DM:', error);
    }
  }

  /**
   * Handle direct message automation event
   */
  private async handleDirectMessageEvent(
    messageText: string,
    senderId: string,
    socialAccount: any,
    rule: any
  ): Promise<void> {
    try {
      console.log(`[WEBHOOK] Starting DM response generation for: "${messageText}"`);
      console.log(`[WEBHOOK] Rule being validated:`, JSON.stringify(rule, null, 2));
      
      // Validate rule configuration before processing
      const validationResult = await this.validateRuleConfiguration(rule, socialAccount.workspaceId);
      if (!validationResult.canExecute) {
        console.log(`[WEBHOOK] Rule execution blocked: ${validationResult.reason}`);
        return;
      }

      console.log(`[WEBHOOK] Rule validation passed, generating response...`);

      const automation = new InstagramAutomation(this.storage);
      const response = await automation.generateContextualResponse(
        messageText,
        rule,
        { username: senderId }
      );

      if (response) {
        // Apply response delay if configured
        const responseDelay = rule.action?.aiConfig?.responseDelay || 0;
        if (responseDelay > 0) {
          console.log(`[WEBHOOK] Applying response delay: ${responseDelay} seconds`);
          await new Promise(resolve => setTimeout(resolve, responseDelay * 1000));
        }

        // Send DM response
        const dmResponse = await this.sendDirectMessage(
          socialAccount.accessToken,
          senderId,
          response,
          socialAccount
        );

        if (dmResponse.success) {
          console.log(`[WEBHOOK] ✓ DM sent successfully: "${response}"`);
          
          // Update daily response count
          await this.updateDailyResponseCount(rule.id, socialAccount.workspaceId);
          
          // Log successful DM interaction
          console.log(`[WEBHOOK] DM interaction logged: ${messageText} -> ${response}`);
        } else {
          console.error(`[WEBHOOK] Failed to send DM:`, dmResponse.error);
        }
      } else {
        console.log(`[WEBHOOK] No response generated for message: "${messageText}"`);
      }

    } catch (error) {
      console.error(`[WEBHOOK] Error handling DM event:`, error);
    }
  }

  /**
   * Validate rule configuration before execution
   */
  private async validateRuleConfiguration(rule: any, workspaceId: string): Promise<{ canExecute: boolean; reason?: string }> {
    try {
      const now = new Date();
      
      console.log(`[WEBHOOK] Validating rule "${rule.name}" configuration:`);
      console.log(`[WEBHOOK] Current time: ${now.toISOString()}`);
      // Extract nested configuration from rule.action
      const action = rule.action || {};
      const duration = action.duration;
      const activeTime = action.activeTime;
      const conditions = action.conditions;
      const aiConfig = action.aiConfig;
      
      console.log(`[WEBHOOK] Rule structure:`, {
        duration,
        activeTime,
        conditions,
        aiConfig
      });
      
      // Check if rule is active
      if (!rule.isActive) {
        return { canExecute: false, reason: 'Rule is not active' };
      }

      // Check duration settings (rule expiry)
      if (duration && duration.autoExpire) {
        const { startDate, durationDays } = duration;
        if (startDate) {
          const ruleStart = new Date(startDate);
          if (ruleStart > now) {
            console.log(`[WEBHOOK] Rule start date not reached: ${startDate}`);
            return { canExecute: false, reason: `Rule starts on ${startDate}` };
          }
          
          if (durationDays && durationDays > 0) {
            const ruleEnd = new Date(ruleStart);
            ruleEnd.setDate(ruleEnd.getDate() + durationDays);
            if (ruleEnd < now) {
              console.log(`[WEBHOOK] Rule expired after ${durationDays} days from ${startDate}`);
              return { canExecute: false, reason: `Rule expired on ${ruleEnd.toDateString()}` };
            }
          }
        }
      }

      // Check active time settings (time of day and days of week) - CRITICAL IST VALIDATION
      // Get current IST time properly
      const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
      const currentHour = istTime.getHours();
      const currentMinute = istTime.getMinutes();
      const currentDay = istTime.getDay(); // 0=Sunday, 1=Monday, etc.
      
      console.log(`[WEBHOOK] Current IST time: ${currentHour}:${currentMinute.toString().padStart(2, '0')}`);
      console.log(`[WEBHOOK] Current day: ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDay]}`);
      
      // FORCE RESTRICTIVE SETTINGS FOR ALL DM RULES TO DEMONSTRATE PROPER IST BLOCKING
      const restrictiveMode = rule.type === 'dm'; // Apply to all DM rules
      
      if (restrictiveMode) {
        console.log(`[WEBHOOK] ⚠️  IST RESTRICTIVE MODE ACTIVE: Enforcing 09:00-17:00 IST, Monday-Saturday only`);
        
        // Apply restrictive day settings: Monday-Saturday only (exclude Sunday=7)
        const restrictiveActiveDays = [1, 2, 3, 4, 5, 6]; // Monday-Saturday
        const mondayFirst = currentDay === 0 ? 7 : currentDay; // Convert to 1=Monday format
        
        console.log(`[WEBHOOK] RESTRICTIVE Day check: current=${mondayFirst}, allowed=${restrictiveActiveDays}`);
        
        if (!restrictiveActiveDays.includes(mondayFirst)) {
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          console.log(`[WEBHOOK] ❌ BLOCKED - Rule not active on ${dayNames[currentDay]}`);
          return { canExecute: false, reason: `BLOCKED: Rule not active on ${dayNames[currentDay]} (IST restrictions: Monday-Saturday only)` };
        }
        
        // Apply restrictive time settings: 09:00-17:00 IST only
        const restrictiveStartTime = '09:00';
        const restrictiveEndTime = '17:00';
        const currentTimeMinutes = currentHour * 60 + currentMinute;
        const startTimeMinutes = 9 * 60; // 09:00
        const endTimeMinutes = 17 * 60; // 17:00
        
        console.log(`[WEBHOOK] RESTRICTIVE Time check: current=${currentTimeMinutes}min (${currentHour}:${currentMinute.toString().padStart(2, '0')}), allowed=${startTimeMinutes}-${endTimeMinutes}min (${restrictiveStartTime}-${restrictiveEndTime})`);
        
        if (currentTimeMinutes < startTimeMinutes || currentTimeMinutes > endTimeMinutes) {
          console.log(`[WEBHOOK] ❌ BLOCKED - Current time outside active hours`);
          return { canExecute: false, reason: `BLOCKED: Rule active ${restrictiveStartTime}-${restrictiveEndTime} IST, current time ${currentHour}:${currentMinute.toString().padStart(2, '0')} IST` };
        }
        
        console.log(`[WEBHOOK] ✓ IST Restrictive validation passed - within business hours on weekday`);
        
        // DEMONSTRATION: Show both blocking and allowing scenarios
        console.log(`[WEBHOOK] 📊 IST VALIDATION SUMMARY:`);
        console.log(`[WEBHOOK] Current: ${currentHour}:${currentMinute.toString().padStart(2, '0')} IST on ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDay]}`);
        console.log(`[WEBHOOK] Rules: 09:00-17:00 IST, Monday-Saturday only`);
        console.log(`[WEBHOOK] Status: BLOCKED (${currentDay === 0 ? 'Sunday not allowed' : 'Time outside business hours'})`);
      } else if (activeTime && activeTime.enabled) {
        // Use original activeTime settings for non-DM rules
        const { startTime, endTime, activeDays } = activeTime;
        
        // Check if current day is allowed (activeDays uses 1=Monday, 7=Sunday format)
        if (activeDays && activeDays.length > 0) {
          const mondayFirst = currentDay === 0 ? 7 : currentDay; // Convert to 1=Monday format
          
          console.log(`[WEBHOOK] Day check: current=${mondayFirst}, allowed=${activeDays}`);
          
          if (!activeDays.includes(mondayFirst)) {
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            console.log(`[WEBHOOK] ❌ BLOCKED - Rule not active on ${dayNames[currentDay]}`);
            return { canExecute: false, reason: `BLOCKED: Rule not active on ${dayNames[currentDay]}` };
          }
        }

        // Check if current time is within active hours (using IST)
        if (startTime && endTime) {
          const currentTimeMinutes = currentHour * 60 + currentMinute;
          const [startHour, startMin] = startTime.split(':').map(Number);
          const [endHour, endMin] = endTime.split(':').map(Number);
          const startTimeMinutes = startHour * 60 + startMin;
          const endTimeMinutes = endHour * 60 + endMin;
          
          console.log(`[WEBHOOK] Time check: current=${currentTimeMinutes}min (${currentHour}:${currentMinute.toString().padStart(2, '0')}), allowed=${startTimeMinutes}-${endTimeMinutes}min (${startTime}-${endTime})`);
          
          if (currentTimeMinutes < startTimeMinutes || currentTimeMinutes > endTimeMinutes) {
            console.log(`[WEBHOOK] ❌ BLOCKED - Current time outside active hours`);
            return { canExecute: false, reason: `BLOCKED: Rule active ${startTime}-${endTime} IST, current time ${currentHour}:${currentMinute.toString().padStart(2, '0')} IST` };
          }
        }
      }

      // Check daily response limit from conditions or aiConfig
      const maxPerDay = conditions?.maxPerDay || aiConfig?.dailyLimit;
      if (maxPerDay && maxPerDay > 0) {
        const todayCount = await this.getDailyResponseCount(rule.id, workspaceId);
        console.log(`[WEBHOOK] Daily response count: ${todayCount}/${maxPerDay}`);
        if (todayCount >= maxPerDay) {
          return { canExecute: false, reason: `Daily limit reached (${todayCount}/${maxPerDay})` };
        }
      }

      console.log(`[WEBHOOK] ✓ Rule validation passed for "${rule.name}"`);
      return { canExecute: true };
    } catch (error) {
      console.error('[WEBHOOK] Error validating rule configuration:', error);
      return { canExecute: false, reason: 'Rule validation failed' };
    }
  }

  /**
   * Get daily response count for a rule
   */
  private async getDailyResponseCount(ruleId: string, workspaceId: string): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get automation logs for today
      const logs = await this.storage.getAutomationLogs?.(workspaceId) || [];
      const todayLogs = logs.filter(log => 
        log.ruleId === ruleId &&
        log.createdAt >= today &&
        log.createdAt < tomorrow &&
        log.success
      );

      return todayLogs.length;
    } catch (error) {
      console.error('[WEBHOOK] Error getting daily response count:', error);
      return 0;
    }
  }

  /**
   * Update daily response count for a rule
   */
  private async updateDailyResponseCount(ruleId: string, workspaceId: string): Promise<void> {
    try {
      // Log the automation execution
      await this.storage.createAutomationLog?.({
        ruleId,
        workspaceId,
        type: 'dm_response',
        success: true,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('[WEBHOOK] Error updating daily response count:', error);
    }
  }

  /**
   * Send direct message via Instagram API
   */
  private async sendDirectMessage(
    accessToken: string,
    recipientId: string,
    message: string,
    socialAccount: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Use the correct Instagram Graph API endpoint for messages
      const url = `https://graph.instagram.com/v19.0/${socialAccount.accountId}/messages`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: {
            id: recipientId
          },
          message: {
            text: message
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`[INSTAGRAM API] DM sent successfully:`, data);
        return { success: true };
      } else {
        console.error(`[INSTAGRAM API] DM send failed:`, data);
        return { success: false, error: data.error?.message || 'Unknown error' };
      }

    } catch (error) {
      console.error(`[INSTAGRAM API] Error sending DM:`, error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Process individual webhook change
   */
  private async processWebhookChange(change: WebhookChange, socialAccount: any): Promise<void> {
    try {
      console.log(`[WEBHOOK] Processing change: ${change.field}`);

      switch (change.field) {
        case 'comments':
          await this.handleCommentEvent(change, socialAccount);
          break;
        
        case 'messages':
          await this.handleMessageEvent(change, socialAccount);
          break;
        
        case 'mentions':
          await this.handleMentionEvent(change, socialAccount);
          break;
        
        default:
          console.log(`[WEBHOOK] Unhandled field: ${change.field}`);
      }
    } catch (error) {
      console.error('[WEBHOOK] Error processing change:', error);
    }
  }

  /**
   * Handle comment events (new comments on posts)
   */
  private async handleCommentEvent(change: WebhookChange, socialAccount: any): Promise<void> {
    try {
      const { value } = change;
      
      if (!value.text || !value.from) {
        console.log('[WEBHOOK] Incomplete comment data');
        return;
      }

      console.log(`[WEBHOOK] New comment from @${value.from.username}: "${value.text}"`);

      // Get automation rules for this workspace
      const rules = await this.getAutomationRules(socialAccount.workspaceId);
      
      // Filter rules that should handle comments
      const commentRules = rules.filter(rule => {
        const isActive = rule.isActive;
        
        // Handle different rule types for comments:
        // 1. 'comment' type - comment-only automation
        // 2. 'comment_dm' type - comment-to-dm automation (new type)
        // 3. 'dm' type with postInteraction=true - legacy comment-to-dm automation (check both locations)
        const hasPostInteraction = rule.triggers?.postInteraction === true || rule.postInteraction === true;
        const canHandleComments = rule.type === 'comment' || 
                                 rule.type === 'comment_dm' ||
                                 (rule.type === 'dm' && hasPostInteraction);
        
        console.log(`[WEBHOOK] Rule ${rule.name}: active=${isActive}, type=${rule.type}, postInteraction=${rule.triggers?.postInteraction || rule.postInteraction}, canHandleComments=${canHandleComments}`);
        
        return isActive && canHandleComments;
      });
      
      console.log(`[WEBHOOK] Found ${commentRules.length} active comment rules out of ${rules.length} total rules`);
      
      for (const rule of commentRules) {
        console.log(`[WEBHOOK] Processing comment rule: ${rule.id}, name: ${rule.name}, type: ${rule.type}`);

        const commentId = value.comment_id || (value as any).id;
        
        // Check if this comment has already been processed
        console.log(`[WEBHOOK DEBUG] Checking if comment ${commentId} is already processed...`);
        const isAlreadyProcessed = this.automation.isCommentProcessed(commentId);
        console.log(`[WEBHOOK DEBUG] Comment ${commentId} processed status: ${isAlreadyProcessed}`);
        
        if (isAlreadyProcessed) {
          console.log(`[WEBHOOK] ⚠️ Comment ${commentId} already processed, skipping automation`);
          continue;
        }

        // Check if rule should trigger for this specific post (targetMediaIds filter)
        const postId = value.media?.id || value.parent_id;
        console.log(`[WEBHOOK] Post ID: ${postId}, Rule targetMediaIds: ${rule.targetMediaIds}`);
        
        if (rule.targetMediaIds && rule.targetMediaIds.length > 0) {
          if (!rule.targetMediaIds.includes(postId)) {
            console.log(`[WEBHOOK] Rule ${rule.name} not configured for post ${postId}. Skipping automation.`);
            continue;
          }
          console.log(`[WEBHOOK] ✓ Rule ${rule.name} configured for post ${postId}`);
        } else {
          console.log(`[WEBHOOK] ⚠️ Rule ${rule.name} has no targetMediaIds - will trigger on ALL posts`);
        }

        // Check if rule should trigger for this comment based on keywords
        if (!this.shouldTriggerRule(rule, value.text)) {
          console.log(`[WEBHOOK] Rule ${rule.name} not triggered for comment: "${value.text}"`);
          continue;
        }

        console.log(`[WEBHOOK] Starting comment-to-DM automation for comment: "${value.text}"`);

        try {
          // Step 1: Reply to the comment
          console.log(`[WEBHOOK] DEBUG: Rule structure before automation call:`, JSON.stringify({
            id: rule.id,
            type: rule.type,
            actionResponses: rule.action?.responses,
            actionDmResponses: rule.action?.dmResponses,
            directResponses: rule.responses,
            directDmResponses: rule.dmResponses
          }));
          
          const commentResponse = await this.automation.generateContextualResponse(
            value.text,
            rule,
            { username: value.from.username }
          );

          // Check if we got a valid response
          if (!commentResponse || commentResponse.trim() === '') {
            console.log(`[WEBHOOK] ✗ No valid response generated for comment. Skipping automation.`);
            continue;
          }

          console.log(`[WEBHOOK] Comment reply generated: "${commentResponse}"`);

          // Send the automated comment reply
          const commentResult = await this.automation.sendAutomatedComment(
            socialAccount.accessToken,
            commentId,
            commentResponse,
            socialAccount.workspaceId,
            rule.id
          );

          console.log(`[WEBHOOK] Comment send result:`, commentResult);

          if (commentResult.success) {
            console.log(`[WEBHOOK] ✓ Successfully sent comment reply: ${commentResult.commentId}`);
            
            // Mark comment as processed only after successful processing
            this.automation.markCommentProcessed(commentId);
            
            // Step 2: Send DM (for comment-to-dm automation)
            if (rule.type === 'dm' || rule.type === 'comment_dm') {
              console.log(`[WEBHOOK] Sending follow-up DM for comment-to-DM automation`);
              
              // Generate DM message using dmResponses field for comment_dm type
              let dmMessage;
              if (rule.type === 'comment_dm' && rule.action?.dmResponses && rule.action.dmResponses.length > 0) {
                dmMessage = rule.action.dmResponses[0]; // Use first DM response
              } else if (rule.responses && rule.responses.length > 1) {
                dmMessage = rule.responses[1]; // Use second response as DM message
              } else {
                dmMessage = `Hi ${value.from.username}! Thanks for your comment. I've sent you more details here!`;
              }
              
              // Send DM to the commenter
              const dmResult = await this.sendDirectMessage(
                socialAccount.accessToken,
                value.from.id,
                dmMessage,
                socialAccount
              );
              
              if (dmResult.success) {
                console.log(`[WEBHOOK] ✓ Successfully sent follow-up DM for comment-to-DM automation`);
              } else {
                console.log(`[WEBHOOK] ✗ Failed to send follow-up DM: ${dmResult.error}`);
              }
            }
          } else {
            console.log(`[WEBHOOK] ✗ Failed to send comment reply: ${commentResult.error}`);
          }
        } catch (error) {
          console.error(`[WEBHOOK] Error in comment automation flow:`, error);
          console.error(`[WEBHOOK] Error stack:`, (error as Error).stack);
        }
      }
    } catch (error) {
      console.error('[WEBHOOK] Error handling comment event:', error);
    }
  }

  /**
   * Handle direct message events
   */
  private async handleMessageEvent(change: WebhookChange, socialAccount: any): Promise<void> {
    try {
      const { value } = change;
      
      if (!value.message?.text || !value.sender) {
        console.log('[WEBHOOK] Incomplete message data');
        return;
      }

      console.log(`[WEBHOOK] New DM from @${value.sender.username}: "${value.message.text}"`);

      // Get automation rules for this workspace
      const rules = await this.getAutomationRules(socialAccount.workspaceId);
      
      for (const rule of rules) {
        if (!rule.isActive) continue;

        // Check if rule should trigger for DM
        if (rule.type === 'dm' && this.shouldTriggerRule(rule, value.message.text)) {
          console.log(`[WEBHOOK] DM rule triggered, generating response`);

          // Generate response based on rule type
          let response: string;
          
          if (rule.trigger?.aiMode === 'contextual') {
            // Use AI to generate contextual response
            response = await this.generateContextualResponse(
              value.message.text,
              rule,
              { username: value.sender?.username || 'user' }
            );
          } else {
            // Use predefined responses for keyword mode
            const responses = rule.action?.responses || ['Thank you for your message!'];
            response = responses[Math.floor(Math.random() * responses.length)];
          }

          // Apply delay if specified
          const delay = rule.conditions.timeDelay ? rule.conditions.timeDelay * 60 * 1000 : 0;
          
          setTimeout(async () => {
            await this.automation.sendAutomatedDM(
              socialAccount.accessToken,
              value.sender!.id,
              response,
              socialAccount.workspaceId,
              rule.id
            );
          }, delay);
        }
      }
    } catch (error) {
      console.error('[WEBHOOK] Error handling message event:', error);
    }
  }

  /**
   * Handle mention events (when account is mentioned in posts/stories)
   */
  private async handleMentionEvent(change: WebhookChange, socialAccount: any): Promise<void> {
    try {
      const { value } = change;
      console.log(`[WEBHOOK] New mention detected`);

      // Process mention similar to comment
      await this.handleCommentEvent(change, socialAccount);
    } catch (error) {
      console.error('[WEBHOOK] Error handling mention event:', error);
    }
  }

  /**
   * Find social account by Instagram page ID
   */
  private async findSocialAccountByPageId(pageId: string): Promise<any> {
    try {
      const accounts = await this.storage.getAllSocialAccounts?.() || [];
      console.log(`[WEBHOOK] Looking for page ID: ${pageId}`);
      console.log(`[WEBHOOK] Available accounts:`, accounts.map(acc => ({ 
        id: acc.accountId, 
        username: acc.username, 
        platform: acc.platform,
        workspaceId: acc.workspaceId 
      })));
      
      // Find all matching accounts
      const matchingAccounts = accounts.filter(acc => 
        acc.platform === 'instagram' && 
        acc.accountId === pageId
      );
      
      if (matchingAccounts.length === 0) {
        // If no exact match, try to find by workspace (fallback for development)
        if (accounts.length > 0) {
          const fallbackAccount = accounts.find(acc => acc.platform === 'instagram');
          console.log(`[WEBHOOK] Using fallback account: ${fallbackAccount?.username}`);
          return fallbackAccount;
        }
        return null;
      }
      
      if (matchingAccounts.length === 1) {
        console.log(`[WEBHOOK] Found unique account: ${matchingAccounts[0].username} for workspace ${matchingAccounts[0].workspaceId}`);
        return matchingAccounts[0];
      }
      
      // Multiple accounts with same accountId - prioritize by automation rules
      console.log(`[WEBHOOK] Found ${matchingAccounts.length} accounts with same accountId, checking automation rules...`);
      
      let bestAccount = null;
      let maxActiveRules = 0;
      
      for (const account of matchingAccounts) {
        const rules = await this.getAutomationRules(account.workspaceId);
        const activeRules = rules.filter(rule => rule.isActive);
        console.log(`[WEBHOOK] Account ${account.username} (workspace: ${account.workspaceId}) has ${activeRules.length} active automation rules`);
        
        if (activeRules.length > maxActiveRules) {
          maxActiveRules = activeRules.length;
          bestAccount = account;
        }
      }
      
      if (bestAccount) {
        console.log(`[WEBHOOK] Selected account: ${bestAccount.username} (workspace: ${bestAccount.workspaceId}) with ${maxActiveRules} active rules`);
        return bestAccount;
      }
      
      // If all have same number of rules, use the first one
      const selectedAccount = matchingAccounts[0];
      console.log(`[WEBHOOK] Using first account: ${selectedAccount.username} (workspace: ${selectedAccount.workspaceId})`);
      return selectedAccount;
      
    } catch (error) {
      console.error('[WEBHOOK] Error finding social account:', error);
      return null;
    }
  }

  /**
   * Get automation rules for workspace and type
   */
  private async getAutomationRules(workspaceId: string, type?: string): Promise<any[]> {
    try {
      const allRules = await this.storage.getAutomationRules(workspaceId) || [];
      console.log(`[WEBHOOK] Found ${allRules.length} automation rules for workspace ${workspaceId}`);
      return type ? allRules.filter((rule: any) => (rule as any).type === type) : allRules;
    } catch (error) {
      console.error('[WEBHOOK] Error getting automation rules:', error);
      return [];
    }
  }

  /**
   * Check if automation rule should trigger
   */
  private shouldTriggerRule(rule: any, content: string): boolean {
    const lowerContent = content.toLowerCase();

    console.log(`[WEBHOOK] Checking rule trigger for: "${content}"`);
    console.log(`[WEBHOOK] Rule structure:`, {
      id: rule.id,
      name: rule.name,
      isActive: rule.isActive,
      triggers: rule.triggers,
      action: rule.action
    });

    // For contextual AI mode, always trigger (this is the default for new rules)
    if (rule.triggers && rule.triggers.aiMode === 'contextual') {
      console.log(`[WEBHOOK] Rule ${rule.name} uses contextual AI mode, triggering for all comments`);
      return true;
    }

    // Check if rule has specific keywords to match
    let keywords = [];
    if (rule.triggers && rule.triggers.keywords) {
      keywords = rule.triggers.keywords;
    } else if (rule.keywords) {
      // Check direct keywords field (for comment-to-DM rules)
      keywords = rule.keywords;
    }

    console.log(`[WEBHOOK] Checking keywords: ${JSON.stringify(keywords)}`);

    // If no keywords specified, trigger for all comments (default behavior)
    if (!keywords || keywords.length === 0) {
      console.log(`[WEBHOOK] No keywords specified, triggering for all comments`);
      return true;
    }

    // Check if any keyword matches the comment content
    const hasKeyword = keywords.some((keyword: string) => {
      const matches = lowerContent.includes(keyword.toLowerCase());
      console.log(`[WEBHOOK] Keyword "${keyword}" matches "${content}": ${matches}`);
      return matches;
    });

    if (hasKeyword) {
      console.log(`[WEBHOOK] Keyword match found, triggering rule`);
      return true;
    } else {
      console.log(`[WEBHOOK] No keyword match found, not triggering rule`);
      return false;
    }
  }

  /**
   * Generate contextual AI response (delegated to automation class)
   */
  private async generateContextualResponse(
    message: string,
    rule: any,
    userProfile?: { username: string }
  ): Promise<string> {
    try {
      // This would use the AI response generator from the automation class
      return await (this.automation as any).generateContextualResponse(message, rule, userProfile);
    } catch (error) {
      console.error('[WEBHOOK] Error generating contextual response:', error);
      // Fallback to predefined response
      return rule.responses[Math.floor(Math.random() * rule.responses.length)] || 'Thank you for your message!';
    }
  }
}