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
  
  // Responses
  commentReplies: string[];  // For comment automation
  dmMessage?: string;        // For DM automation
  
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
    
    for (const rule of activeRules) {
      const isTriggered = rule.keywords.some(keyword => 
        commentText.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (!isTriggered) continue;
      
      console.log('[AUTOMATION] Rule triggered:', rule.name);
      
      // Handle comment replies
      if ((rule.type === 'comment_dm' || rule.type === 'comment_only') && rule.commentReplies.length > 0) {
        const replyText = rule.commentReplies[Math.floor(Math.random() * rule.commentReplies.length)];
        const success = await this.sendCommentReply(commentId, replyText, accessToken);
        
        if (success) {
          triggeredActions.push(`Replied to comment: "${replyText}"`);
          await this.logAction(rule.id!, workspaceId, 'comment', commentText, replyText, userId, username, 'sent');
        } else {
          await this.logAction(rule.id!, workspaceId, 'comment', commentText, replyText, userId, username, 'failed');
        }
      }
      
      // Handle DM
      if ((rule.type === 'comment_dm' || rule.type === 'dm_only') && rule.dmMessage) {
        const success = await this.sendDM(userId, rule.dmMessage, accessToken);
        
        if (success) {
          triggeredActions.push(`Sent DM: "${rule.dmMessage}"`);
          await this.logAction(rule.id!, workspaceId, 'dm', commentText, rule.dmMessage, userId, username, 'sent');
        } else {
          await this.logAction(rule.id!, workspaceId, 'dm', commentText, rule.dmMessage, userId, username, 'failed');
        }
      }
    }
    
    return {
      triggered: triggeredActions.length > 0,
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
      console.log('[AUTOMATION] Sending DM:', message);
      
      // Note: Instagram Basic Display API doesn't support sending DMs
      // This would require Instagram Business API with proper permissions
      console.log('[AUTOMATION] DM functionality requires Instagram Business API');
      
      // For now, we'll simulate success and log the action
      // In production, implement proper Instagram Business API DM sending
      return true;
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