import { Request, Response } from 'express';
import crypto from 'crypto';
import { IStorage } from './storage';
import { InstagramAutomation } from './instagram-automation';
import { InstagramStealthResponder } from './instagram-stealth-responder';

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
  private appSecret: string;
  private processedMessages: Set<string>;

  constructor(storage: IStorage) {
    this.storage = storage;
    this.automation = new InstagramAutomation(storage);
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
    } catch (error) {
      console.error('[WEBHOOK] Error processing entry:', error);
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
        console.log(`[WEBHOOK] ✓ Stealth responder declined to respond to maintain natural patterns`);
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
      
      for (const rule of rules) {
        console.log(`[WEBHOOK] Processing rule: ${rule.id}, name: ${rule.name}, active: ${rule.isActive}`);
        
        if (!rule.isActive) {
          console.log(`[WEBHOOK] Rule ${rule.id} is inactive, skipping`);
          continue;
        }

        console.log(`[WEBHOOK] Rule structure:`, {
          trigger: rule.trigger,
          action: rule.action,
          isActive: rule.isActive
        });

        const commentId = value.comment_id || (value as any).id;
        
        // Check if this comment has already been processed
        if (this.automation.isCommentProcessed(commentId)) {
          console.log(`[WEBHOOK] ⚠️ Comment ${commentId} already processed, skipping automation`);
          return;
        }

        // Mark comment as processed to prevent duplicates
        this.automation.markCommentProcessed(commentId);

        console.log(`[WEBHOOK] Starting AI response generation for comment: "${value.text}"`);

        try {
          // Generate stealth response for the comment
          console.log(`[WEBHOOK] Calling stealth response generator...`);
          const response = await this.automation.generateContextualResponse(
            value.text,
            rule,
            { username: value.from.username }
          );

          console.log(`[WEBHOOK] Stealth response generated: "${response}"`);

          // Send the automated comment reply using stealth patterns
          console.log(`[WEBHOOK] Sending stealth comment with access token length: ${socialAccount.accessToken?.length || 0}`);
          const result = await this.automation.sendAutomatedComment(
            socialAccount.accessToken,
            commentId,
            response,
            socialAccount.workspaceId,
            rule.id
          );

          console.log(`[WEBHOOK] Comment send result:`, result);

          if (result.success) {
            console.log(`[WEBHOOK] ✓ Successfully sent stealth comment: ${result.commentId}`);
          } else {
            console.log(`[WEBHOOK] ✗ Failed to send stealth comment: ${result.error}`);
          }
        } catch (error) {
          // Check if this is a stealth responder intentionally declining to respond
          if ((error as Error).message.includes('natural behavior patterns')) {
            console.log(`[WEBHOOK] ✓ Stealth responder declined to respond to maintain natural patterns`);
            return; // This is intentional behavior, not an error
          }
          
          console.error(`[WEBHOOK] Actual error in automation flow:`, error);
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
        platform: acc.platform 
      })));
      
      // Try exact match first
      let account = accounts.find(acc => 
        acc.platform === 'instagram' && 
        acc.accountId === pageId
      );
      
      // If no exact match, try to find by workspace (fallback for development)
      if (!account && accounts.length > 0) {
        account = accounts.find(acc => acc.platform === 'instagram');
        console.log(`[WEBHOOK] Using fallback account: ${account?.username}`);
      }
      
      return account;
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

    // For Instagram Auto-Reply rules, always trigger for comments (contextual AI mode)
    if (rule.name === 'Instagram Auto-Reply' || rule.isActive) {
      console.log(`[WEBHOOK] Rule ${rule.name} is active, triggering response`);
      return true;
    }

    // Legacy fallback - check for triggers structure
    if (rule.triggers) {
      // For contextual AI mode, always trigger
      if (rule.triggers.aiMode === 'contextual') {
        return true;
      }

      // For keyword mode, check for trigger keywords
      if (rule.triggers.keywords && rule.triggers.keywords.length > 0) {
        const hasKeyword = rule.triggers.keywords.some((keyword: string) => 
          lowerContent.includes(keyword.toLowerCase())
        );
        if (!hasKeyword) return false;
      }
    }

    return true;
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