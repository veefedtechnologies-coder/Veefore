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
      
      // 🎯 PROPER COMMENT→REPLY→DM FLOW (like ManyChat)
      // Step 1: First reply to comment (establishes conversation context)
      let commentReplySent = false;
      if ((rule.type === 'comment_dm' || rule.type === 'comment_only')) {
        // Handle multiple data structures for responses
        let commentResponses = [];
        
        // Check if responses are in 'action' object (newer format)
        if ((rule as any).action && (rule as any).action.responses) {
          commentResponses = (rule as any).action.responses;
        }
        // Check if responses are at top level (older format)  
        else if ((rule as any).responses) {
          const responses = (rule as any).responses;
          if (Array.isArray(responses)) {
            commentResponses = responses;
          } else if (typeof responses === 'object' && responses !== null) {
            commentResponses = responses.responses || [];
          }
        }
        
        if (Array.isArray(commentResponses) && commentResponses.length > 0) {
          const replyText = commentResponses[Math.floor(Math.random() * commentResponses.length)];
          console.log('[AUTOMATION] 📝 Step 1: Replying to comment first...');
          const success = await this.sendCommentReply(commentId, replyText, accessToken);
          
          if (success) {
            commentReplySent = true;
            triggeredActions.push(`Replied to comment: "${replyText}"`);
            await this.logAction(rule.id!, workspaceId, 'comment', commentText, replyText, userId, username, 'sent');
            console.log('[AUTOMATION] ✅ Comment reply sent - conversation context established');
          } else {
            await this.logAction(rule.id!, workspaceId, 'comment', commentText, replyText, userId, username, 'failed');
            console.log('[AUTOMATION] ❌ Comment reply failed - DM may not work');
          }
        }
      }
      
      // Step 2: Send DM (now allowed because we replied to comment first)
      if ((rule.type === 'comment_dm' || rule.type === 'dm_only')) {
        // Handle multiple data structures for DM responses
        let dmResponses = [];
        
        // Check if dmResponses are in 'action' object (newer format)
        if ((rule as any).action && (rule as any).action.dmResponses) {
          dmResponses = (rule as any).action.dmResponses;
        }
        // Check if dmResponses are at top level (older format)
        else if ((rule as any).dmResponses) {
          dmResponses = (rule as any).dmResponses;
        }
        
        if (Array.isArray(dmResponses) && dmResponses.length > 0) {
          // Wait 2 seconds after comment reply for Instagram to process
          if (commentReplySent && rule.type === 'comment_dm') {
            console.log('[AUTOMATION] ⏱️ Waiting 2s for Instagram to process comment reply...');
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
          const dmMessage = dmResponses[Math.floor(Math.random() * dmResponses.length)];
          console.log('[AUTOMATION] 💬 Step 2: Sending DM (conversation context established)...');
          const success = await this.sendDM(userId, dmMessage, accessToken);
          
          if (success) {
            triggeredActions.push(`Sent DM: "${dmMessage}"`);
            await this.logAction(rule.id!, workspaceId, 'dm', commentText, dmMessage, userId, username, 'sent');
            console.log('[AUTOMATION] ✅ Comment→Reply→DM flow completed successfully!');
          } else {
            await this.logAction(rule.id!, workspaceId, 'dm', commentText, dmMessage, userId, username, 'failed');
            console.log('[AUTOMATION] ❌ DM failed even after comment reply');
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
      
      // Get page ID from storage for proper Instagram Business API calls
      const storage = (global as any).storage;
      if (storage) {
        // Try MongoDB connection first
        try {
          const mongoose = require('mongoose');
          if (mongoose.connection.readyState === 1) {
            const accounts = await mongoose.connection.db.collection('socialaccounts').find({ 
              platform: 'instagram',
              accessToken: accessToken
            }).toArray();
            
            const instagramAccount = accounts.find(acc => acc.accessToken === accessToken);
            console.log('[AUTOMATION] Found Instagram account:', {
              username: instagramAccount?.username,
              pageId: instagramAccount?.pageId,
              accountId: instagramAccount?.accountId,
              isBusinessAccount: instagramAccount?.isBusinessAccount
            });
            
            // Use pageId if available, otherwise try accountId for Business API
            const businessId = instagramAccount?.pageId || instagramAccount?.accountId;
            if (businessId && instagramAccount?.isBusinessAccount) {
              console.log('[AUTOMATION] Using Instagram Business API with ID:', businessId);
              const response = await fetch(`https://graph.instagram.com/v21.0/${businessId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  recipient: { id: userId },
                  message: { text: message },
                  access_token: accessToken
                })
              });
              
              if (response.ok) {
                const data = await response.json();
                console.log('[AUTOMATION] ✅ DM sent successfully via Business API:', data.message_id);
                return true;
              } else {
                const error = await response.text();
                console.error('[AUTOMATION] ❌ Business API DM failed:', error);
              }
            }
          }
        } catch (dbError) {
          console.error('[AUTOMATION] Database lookup error:', dbError);
        }
      }
      
      // Fallback to standard Instagram API
      const response = await fetch(`https://graph.instagram.com/v21.0/me/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient: { id: userId },
          message: { text: message },
          access_token: accessToken
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('[AUTOMATION] ✅ DM sent successfully:', data.message_id);
        return true;
      } else {
        const error = await response.text();
        console.error('[AUTOMATION] ❌ DM failed:', error);
        
        // Try user-specific endpoint as final fallback
        const fallbackResponse = await fetch(`https://graph.instagram.com/v21.0/${userId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: { text: message },
            access_token: accessToken
          })
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log('[AUTOMATION] ✅ DM sent via fallback:', fallbackData.id || fallbackData.message_id);
          return true;
        } else {
          const fallbackError = await fallbackResponse.text();
          console.error('[AUTOMATION] ❌ All DM endpoints failed. Final error:', fallbackError);
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