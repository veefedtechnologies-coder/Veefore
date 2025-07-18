/**
 * NEW WEBHOOK PROCESSOR - REBUILT FOR FRONTEND COMPATIBILITY
 * Processes Instagram webhooks with the new automation system
 * Handles Comment → DM automation with pre-defined responses only
 */

import { NewAutomationSystem, DatabaseAutomationRule } from './new-automation-system';
import { IStorage } from './storage';

interface WebhookPayload {
  object: string;
  entry: WebhookEntry[];
}

interface WebhookEntry {
  id: string;
  time: number;
  changes?: WebhookChange[];
  messaging?: any[];
}

interface WebhookChange {
  field: string;
  value: {
    from: {
      id: string;
      username: string;
    };
    media?: {
      id: string;
      media_product_type: string;
    };
    id: string;
    text: string;
    created_time: number;
  };
}

export class NewWebhookProcessor {
  private automationSystem: NewAutomationSystem;

  constructor(private storage: IStorage) {
    this.automationSystem = new NewAutomationSystem(storage);
  }

  /**
   * Process incoming webhook events
   */
  async processWebhookEvent(webhookData: WebhookPayload): Promise<void> {
    console.log('[NEW WEBHOOK] Processing webhook event:', JSON.stringify(webhookData, null, 2));

    for (const entry of webhookData.entry) {
      await this.processWebhookEntry(entry);
    }
  }

  /**
   * Process individual webhook entry
   */
  private async processWebhookEntry(entry: WebhookEntry): Promise<void> {
    const pageId = entry.id;
    console.log(`[NEW WEBHOOK] Processing entry for page ${pageId}`);

    // Find social account for this Instagram page
    const socialAccount = await this.findSocialAccountByPageId(pageId);
    if (!socialAccount) {
      console.log(`[NEW WEBHOOK] No social account found for page ${pageId}`);
      return;
    }

    console.log(`[NEW WEBHOOK] Found social account: ${socialAccount.username} for workspace ${socialAccount.workspaceId}`);

    // Process comment events
    if (entry.changes) {
      for (const change of entry.changes) {
        await this.processCommentChange(change, socialAccount);
      }
    }

    // Process direct message events
    if (entry.messaging) {
      for (const message of entry.messaging) {
        await this.processDirectMessage(message, socialAccount);
      }
    }
  }

  /**
   * Process comment changes (new comments)
   */
  private async processCommentChange(change: WebhookChange, socialAccount: any): Promise<void> {
    if (change.field !== 'comments') {
      console.log(`[NEW WEBHOOK] Ignoring non-comment change: ${change.field}`);
      return;
    }

    const comment = change.value;
    const commentText = comment.text.toLowerCase();
    const mediaId = comment.media?.id;
    const commentId = comment.id;
    const userId = comment.from.id;
    const username = comment.from.username;

    console.log(`[NEW WEBHOOK] Processing comment from @${username}: "${comment.text}"`);
    console.log(`[NEW WEBHOOK] Comment details:`, {
      commentId,
      mediaId,
      userId,
      username,
      commentText
    });

    // Get automation rules for this workspace
    const rules = await this.automationSystem.getRulesForWebhook(socialAccount.workspaceId);
    
    console.log(`[NEW WEBHOOK] Found ${rules.length} automation rules for workspace ${socialAccount.workspaceId}`);

    // Process each rule
    for (const rule of rules) {
      await this.processRule(rule, {
        commentId,
        commentText,
        mediaId,
        userId,
        username,
        socialAccount
      });
    }
  }

  /**
   * Process automation rule against comment
   */
  private async processRule(rule: DatabaseAutomationRule, context: any): Promise<void> {
    console.log(`[NEW WEBHOOK] Processing rule: ${rule.name} (${rule.type})`);
    
    // Check if rule is active
    if (!rule.isActive) {
      console.log(`[NEW WEBHOOK] Rule ${rule.name} is not active, skipping`);
      return;
    }

    // Check post-specific targeting
    if (rule.targetMediaIds && rule.targetMediaIds.length > 0) {
      if (!rule.targetMediaIds.includes(context.mediaId)) {
        console.log(`[NEW WEBHOOK] Rule ${rule.name} does not target post ${context.mediaId}, skipping`);
        return;
      }
    }

    // Check keyword matching
    const matchedKeywords = rule.keywords.filter(keyword => 
      context.commentText.includes(keyword.toLowerCase())
    );

    if (matchedKeywords.length === 0) {
      console.log(`[NEW WEBHOOK] No keywords matched for rule ${rule.name}, skipping`);
      return;
    }

    console.log(`[NEW WEBHOOK] Keywords matched: ${matchedKeywords.join(', ')}`);

    // Execute automation based on rule type
    switch (rule.type) {
      case 'comment_dm':
        await this.executeCommentDMAutomation(rule, context);
        break;
      case 'comment_only':
        await this.executeCommentOnlyAutomation(rule, context);
        break;
      case 'dm_only':
        await this.executeDMOnlyAutomation(rule, context);
        break;
      default:
        console.log(`[NEW WEBHOOK] Unknown rule type: ${rule.type}`);
    }
  }

  /**
   * Execute Comment → DM automation
   */
  private async executeCommentDMAutomation(rule: DatabaseAutomationRule, context: any): Promise<void> {
    console.log(`[NEW WEBHOOK] Executing Comment → DM automation for rule: ${rule.name}`);

    // Step 1: Send comment reply
    const commentResponses = rule.action.responses || [];
    if (commentResponses.length > 0) {
      const randomResponse = commentResponses[Math.floor(Math.random() * commentResponses.length)];
      await this.sendCommentReply(context.commentId, randomResponse, context.socialAccount);
    }

    // Step 2: Send DM
    const dmResponses = rule.action.dmResponses || [];
    if (dmResponses.length > 0) {
      const randomDMResponse = dmResponses[Math.floor(Math.random() * dmResponses.length)];
      await this.sendDirectMessage(context.userId, randomDMResponse, context.socialAccount);
    }
  }

  /**
   * Execute Comment Only automation
   */
  private async executeCommentOnlyAutomation(rule: DatabaseAutomationRule, context: any): Promise<void> {
    console.log(`[NEW WEBHOOK] Executing Comment Only automation for rule: ${rule.name}`);

    const commentResponses = rule.action.responses || [];
    if (commentResponses.length > 0) {
      const randomResponse = commentResponses[Math.floor(Math.random() * commentResponses.length)];
      await this.sendCommentReply(context.commentId, randomResponse, context.socialAccount);
    }
  }

  /**
   * Execute DM Only automation
   */
  private async executeDMOnlyAutomation(rule: DatabaseAutomationRule, context: any): Promise<void> {
    console.log(`[NEW WEBHOOK] Executing DM Only automation for rule: ${rule.name}`);

    const dmResponses = rule.action.dmResponses || [];
    if (dmResponses.length > 0) {
      const randomDMResponse = dmResponses[Math.floor(Math.random() * dmResponses.length)];
      await this.sendDirectMessage(context.userId, randomDMResponse, context.socialAccount);
    }
  }

  /**
   * Send comment reply
   */
  private async sendCommentReply(commentId: string, message: string, socialAccount: any): Promise<void> {
    try {
      console.log(`[NEW WEBHOOK] Sending comment reply: "${message}"`);

      const response = await fetch(
        `https://graph.instagram.com/v22.0/${commentId}/replies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            access_token: socialAccount.accessToken
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`[NEW WEBHOOK] ✅ Comment reply sent successfully: ${data.id}`);
      } else {
        const error = await response.json();
        console.error(`[NEW WEBHOOK] ❌ Comment reply failed:`, error);
      }
    } catch (error) {
      console.error(`[NEW WEBHOOK] ❌ Error sending comment reply:`, error);
    }
  }

  /**
   * Send direct message
   */
  private async sendDirectMessage(userId: string, message: string, socialAccount: any): Promise<void> {
    try {
      console.log(`[NEW WEBHOOK] Sending DM to user ${userId}: "${message}"`);

      const response = await fetch(
        `https://graph.instagram.com/v22.0/me/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipient: { id: userId },
            message: { text: message },
            access_token: socialAccount.accessToken
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`[NEW WEBHOOK] ✅ DM sent successfully: ${data.message_id}`);
      } else {
        const error = await response.json();
        console.error(`[NEW WEBHOOK] ❌ DM failed:`, error);
      }
    } catch (error) {
      console.error(`[NEW WEBHOOK] ❌ Error sending DM:`, error);
    }
  }

  /**
   * Process direct message events
   */
  private async processDirectMessage(message: any, socialAccount: any): Promise<void> {
    console.log(`[NEW WEBHOOK] Processing direct message event`);

    // Skip echo messages (messages sent by the account itself)
    if (message.message?.is_echo) {
      console.log(`[NEW WEBHOOK] Skipping echo message`);
      return;
    }

    // This could be enhanced to handle DM-only automation rules
    console.log(`[NEW WEBHOOK] DM processing completed`);
  }

  /**
   * Find social account by Instagram page ID
   */
  private async findSocialAccountByPageId(pageId: string): Promise<any> {
    try {
      const allAccounts = await this.storage.getAllSocialAccounts();
      console.log(`[NEW WEBHOOK] Looking for page ID: ${pageId}`);
      console.log(`[NEW WEBHOOK] Available accounts:`, allAccounts.map(acc => ({ 
        id: acc.id,
        username: acc.username, 
        platform: acc.platform,
        workspaceId: acc.workspaceId,
        accountId: acc.accountId,
        pageId: acc.pageId,
        instagramId: acc.instagramId
      })));
      
      // Look for account with matching pageId or instagramId
      const matchingAccount = allAccounts.find(account => 
        account.platform === 'instagram' && 
        account.isActive &&
        (account.pageId === pageId || account.instagramId === pageId)
      );
      
      if (matchingAccount) {
        console.log(`[NEW WEBHOOK] Found matching account: ${matchingAccount.username} (workspace: ${matchingAccount.workspaceId})`);
        return matchingAccount;
      }
      
      console.log(`[NEW WEBHOOK] No matching account found for page ID: ${pageId}`);
      return null;
    } catch (error) {
      console.error(`[NEW WEBHOOK] Error finding social account:`, error);
      return null;
    }
  }
}