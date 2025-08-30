/**
 * CLEAN AUTOMATION SYSTEM 
 * Built to work with existing frontend design
 * Handles comment-to-DM and comment automation
 */

import { IStorage } from './storage';

export interface AutomationRule {
  id?: string;
  name: string;
  workspaceId: string;
  type: 'comment_dm' | 'comment_only' | 'dm_only';
  isActive: boolean;
  
  // Keywords to trigger automation
  keywords: string[];
  
  // Responses (new format)
  responses?: {
    responses?: string[];     // Comment responses
    dmResponses?: string[];   // DM responses
  };
  
  // Legacy fields (for compatibility)
  commentReplies?: string[];  // For comment automation
  dmMessage?: string;         // For DM automation
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationLog {
  id?: string;
  ruleId: string;
  workspaceId: string;
  type: 'comment' | 'dm';
  triggerText: string;
  responseText: string;
  targetUserId: string;
  targetUsername: string;
  status: 'sent' | 'failed';
  error?: string;
  createdAt: Date;
}

export class AutomationSystem {
  constructor(private storage: IStorage) {}

  /**
   * Create new automation rule
   */
  async createRule(rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<AutomationRule> {
    const newRule: AutomationRule = {
      ...rule,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('[AUTOMATION] Creating rule:', newRule.name);
    const savedRule = await this.storage.createAutomationRule(newRule);
    console.log('[AUTOMATION] Rule created with ID:', savedRule.id);
    
    return savedRule;
  }

  /**
   * Get automation rules for workspace
   */
  async getRules(workspaceId: string): Promise<AutomationRule[]> {
    console.log('[AUTOMATION] Getting rules for workspace:', workspaceId);
    const rules = await this.storage.getAutomationRules(workspaceId);
    console.log('[AUTOMATION] Found', rules.length, 'rules');
    return rules;
  }

  /**
   * Toggle automation rule active status
   */
  async toggleRule(ruleId: string): Promise<AutomationRule> {
    console.log('[AUTOMATION] Toggling rule:', ruleId);
    const rule = await this.storage.getAutomationRule(ruleId);
    if (!rule) throw new Error('Rule not found');
    
    rule.isActive = !rule.isActive;
    rule.updatedAt = new Date();
    
    return await this.storage.updateAutomationRule(ruleId, rule);
  }

  /**
   * Delete automation rule
   */
  async deleteRule(ruleId: string): Promise<void> {
    console.log('[AUTOMATION] Deleting rule:', ruleId);
    await this.storage.deleteAutomationRule(ruleId);
  }

  /**
   * Process Instagram comment for automation
   */
  async processComment(
    workspaceId: string,
    commentText: string,
    commentId: string,
    userId: string,
    username: string,
    accessToken: string
  ): Promise<{ triggered: boolean; actions: string[] }> {
    console.log('[AUTOMATION] Processing comment:', commentText);
    
    const rules = await this.getRules(workspaceId);
    const activeRules = rules.filter(rule => rule.isActive);
    
    const triggeredActions: string[] = [];
    let anyRuleTriggered = false;
    
    for (const rule of activeRules) {
      console.log('[AUTOMATION DEBUG] Processing rule:', rule.name);
      console.log('[AUTOMATION DEBUG] Rule keywords:', rule.keywords);
      console.log('[AUTOMATION DEBUG] Rule type:', typeof rule.keywords);
      
      const keywords = Array.isArray(rule.keywords) ? rule.keywords : [];
      const isTriggered = keywords.some(keyword => 
        commentText.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (!isTriggered) continue;
      
      anyRuleTriggered = true;
      console.log('[AUTOMATION] Rule triggered:', rule.name);
      console.log('[AUTOMATION DEBUG] Full rule object:', JSON.stringify(rule, null, 2));
      
      // Handle comment replies
      if ((rule.type === 'comment_dm' || rule.type === 'comment_only')) {
        const responses = (rule as any).responses;
        
        // Handle both nested object format and flat array format
        let commentResponses = [];
        if (typeof responses === 'object' && responses !== null) {
          commentResponses = responses.responses || [];
        } else if (Array.isArray(responses)) {
          commentResponses = responses;
        }
        
        
        if (Array.isArray(commentResponses) && commentResponses.length > 0) {
          const replyText = commentResponses[Math.floor(Math.random() * commentResponses.length)];
          const success = await this.sendCommentReply(commentId, replyText, accessToken);
          
          if (success) {
            triggeredActions.push(`Replied to comment: "${replyText}"`);
            await this.logAction(rule.id!, workspaceId, 'comment', commentText, replyText, userId, username, 'sent');
          } else {
            await this.logAction(rule.id!, workspaceId, 'comment', commentText, replyText, userId, username, 'failed');
          }
        }
      }
      
      // Handle DM automation
      if ((rule.type === 'comment_dm' || rule.type === 'dm_only')) {
        const dmResponses = (rule as any).dmResponses || [];
        
        if (Array.isArray(dmResponses) && dmResponses.length > 0) {
          const dmMessage = dmResponses[Math.floor(Math.random() * dmResponses.length)];
          const success = await this.sendDM(userId, dmMessage, accessToken);
          
          if (success) {
            triggeredActions.push(`Sent DM: "${dmMessage}"`);
            await this.logAction(rule.id!, workspaceId, 'dm', commentText, dmMessage, userId, username, 'sent');
          } else {
            await this.logAction(rule.id!, workspaceId, 'dm', commentText, dmMessage, userId, username, 'failed');
          }
        }
      }
    }
    
    return {
      triggered: anyRuleTriggered,
      actions: triggeredActions
    };
  }

  /**
   * Send comment reply via Instagram API
   */
  private async sendCommentReply(commentId: string, replyText: string, accessToken: string): Promise<boolean> {
    try {
      console.log('[AUTOMATION] Sending comment reply:', replyText);
      
      const response = await fetch(`https://graph.instagram.com/v23.0/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyText,
          access_token: accessToken
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('[AUTOMATION] Comment reply sent successfully:', data.id);
        return true;
      } else {
        const error = await response.text();
        console.error('[AUTOMATION] Comment reply failed:', error);
        return false;
      }
    } catch (error) {
      console.error('[AUTOMATION] Comment reply error:', error);
      return false;
    }
  }

  /**
   * Send DM via Instagram API  
   */
  private async sendDM(userId: string, message: string, accessToken: string): Promise<boolean> {
    try {
      console.log('[AUTOMATION] Sending DM to user:', userId);
      console.log('[AUTOMATION] DM message:', message);
      
      // Use Instagram Graph API for DM sending
      const response = await fetch(`https://graph.instagram.com/v19.0/me/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          recipient: { id: userId },
          message: { text: message }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('[AUTOMATION] ✅ DM sent successfully:', data.message_id);
        return true;
      } else {
        const error = await response.text();
        console.error('[AUTOMATION] ❌ DM failed:', error);
        
        // Fallback: Try alternate API endpoint
        const fallbackResponse = await fetch(`https://graph.instagram.com/v21.0/${userId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message,
            access_token: accessToken
          })
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log('[AUTOMATION] ✅ DM sent via fallback:', fallbackData.id);
          return true;
        } else {
          console.error('[AUTOMATION] ❌ Fallback DM also failed');
          return false;
        }
      }
    } catch (error) {
      console.error('[AUTOMATION] DM error:', error);
      return false;
    }
  }

  /**
   * Log automation action
   */
  private async logAction(
    ruleId: string,
    workspaceId: string,
    type: 'comment' | 'dm',
    triggerText: string,
    responseText: string,
    targetUserId: string,
    targetUsername: string,
    status: 'sent' | 'failed',
    error?: string
  ): Promise<void> {
    const log: AutomationLog = {
      ruleId,
      workspaceId,
      type,
      triggerText,
      responseText,
      targetUserId,
      targetUsername,
      status,
      error,
      createdAt: new Date()
    };
    
    await this.storage.createAutomationLog(log);
    console.log('[AUTOMATION] Action logged:', type, status);
  }

  /**
   * Get automation logs for workspace
   */
  async getLogs(workspaceId: string): Promise<AutomationLog[]> {
    return await this.storage.getAutomationLogs(workspaceId);
  }
}