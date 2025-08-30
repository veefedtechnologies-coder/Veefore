/**
 * CLEAN WEBHOOK HANDLER
 * Processes Instagram webhooks for automation
 */

import { Request, Response } from 'express';
import crypto from 'crypto';
import { AutomationSystem } from './automation-system';
import { IStorage } from './storage';

interface InstagramWebhookEntry {
  id: string;
  time: number;
  changes: Array<{
    field: string;
    value: {
      from: {
        id: string;
        username: string;
      };
      parent_id: string;
      created_time: number;
      text: string;
      id: string;
    };
  }>;
}

interface InstagramWebhookPayload {
  object: 'instagram';
  entry: InstagramWebhookEntry[];
}

export class WebhookHandler {
  private automationSystem: AutomationSystem;

  constructor(private storage: IStorage) {
    this.automationSystem = new AutomationSystem(storage);
  }

  /**
   * Handle webhook verification (GET request)
   */
  async handleVerification(req: Request, res: Response): Promise<void> {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('[WEBHOOK] Verification request:', { mode, token });

    const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'your_verify_token';
    
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('[WEBHOOK] ✅ Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.log('[WEBHOOK] ❌ Webhook verification failed');
      res.sendStatus(403);
    }
  }

  /**
   * Handle webhook event (POST request)
   */
  async handleWebhookEvent(req: Request, res: Response): Promise<void> {
    try {
      const payload: InstagramWebhookPayload = req.body;
      console.log('[WEBHOOK] Received event:', JSON.stringify(payload, null, 2));

      // Verify webhook signature (allow bypass for development/testing)
      const signature = req.headers['x-hub-signature-256'] as string;
      if (signature && !this.verifySignature(JSON.stringify(payload), signature)) {
        console.log('[WEBHOOK] ❌ Invalid signature');
        res.sendStatus(403);
        return;
      } else if (!signature) {
        console.log('[WEBHOOK] ⚠️ No signature provided - proceeding for development/testing');
      } else {
        console.log('[WEBHOOK] ✅ Signature verified');
      }

      // Process each entry
      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.field === 'comments') {
            await this.processCommentEvent(change.value);
          }
        }
      }

      res.sendStatus(200);
    } catch (error) {
      console.error('[WEBHOOK] Error processing event:', error);
      res.sendStatus(500);
    }
  }

  /**
   * Process comment event for automation
   */
  private async processCommentEvent(commentData: any): Promise<void> {
    try {
      console.log('[WEBHOOK] Processing real Instagram comment:', commentData);
      
      const { from, text, id: commentId, parent_id: postId } = commentData;
      
      // For real Instagram comments, try to find any active Instagram account
      // since the exact post ID matching might not work reliably
      const socialAccount = await this.findActiveInstagramAccount();
      if (!socialAccount) {
        console.log('[WEBHOOK] No active Instagram account found');
        return;
      }

      console.log('[WEBHOOK] Using account for automation:', socialAccount.workspaceId);

      // Process comment through automation system
      const result = await this.automationSystem.processComment(
        socialAccount.workspaceId,
        text,
        commentId,
        from.id,
        from.username,
        socialAccount.accessToken
      );

      if (result.triggered) {
        console.log('[WEBHOOK] ✅ Real automation triggered:', result.actions);
      } else {
        console.log('[WEBHOOK] No automation rules triggered for comment:', text);
      }
    } catch (error) {
      console.error('[WEBHOOK] Error processing comment:', error);
    }
  }

  /**
   * Find active Instagram account with automation rules
   */
  private async findActiveInstagramAccount(): Promise<{ workspaceId: string; accessToken: string } | null> {
    try {
      const allAccounts = await this.storage.getAllSocialAccounts();
      
      // Priority 1: Find Instagram account for workspace 684402c2fd2cd4eb6521b386 (main user workspace)
      for (const account of allAccounts) {
        if (account.platform === 'instagram' && account.accessToken && 
            account.workspaceId === '684402c2fd2cd4eb6521b386') {
          console.log('[WEBHOOK] 🎯 Found main workspace account:', account.workspaceId);
          const rules = await this.storage.getAutomationRules(account.workspaceId);
          console.log('[WEBHOOK] 🎯 Main workspace rules count:', rules.length);
          if (rules.length > 0) {
            console.log('[WEBHOOK] ✅ Using main workspace:', account.workspaceId);
            return {
              workspaceId: account.workspaceId,
              accessToken: account.accessToken
            };
          }
        }
      }
      
      // Priority 2: Find any Instagram account that has active automation rules
      for (const account of allAccounts) {
        if (account.platform === 'instagram' && account.accessToken) {
          const rules = await this.storage.getAutomationRules(account.workspaceId);
          
          // If this workspace has any active automation rules, use it
          if (rules.length > 0) {
            const activeRules = rules.filter((rule: any) => rule.isActive !== false);
            if (activeRules.length > 0) {
              console.log('[WEBHOOK] ✅ Using workspace:', account.workspaceId);
              return {
                workspaceId: account.workspaceId,
                accessToken: account.accessToken
              };
            }
          }
        }
      }
      return null;
    } catch (error) {
      console.error('[WEBHOOK] Error finding Instagram account:', error);
      return null;
    }
  }

  /**
   * Verify webhook signature for security
   */
  private verifySignature(payload: string, signature: string): boolean {
    try {
      const appSecret = process.env.INSTAGRAM_APP_SECRET;
      if (!appSecret) {
        console.log('[WEBHOOK] No app secret configured, skipping signature verification');
        return true; // Allow for development
      }

      const expectedSignature = crypto
        .createHmac('sha256', appSecret)
        .update(payload)
        .digest('hex');

      const receivedSignature = signature.replace('sha256=', '');
      
      // Ensure both buffers are the same length before comparison
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
}