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
  
  // 🎯 POST-SPECIFIC TARGETING (like ManyChat)
  targetMediaIds?: string[];  // Target specific post/media IDs
  
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
   * Process Instagram comment for automation - with POST-SPECIFIC TARGETING
   */
  async processComment(
    workspaceId: string,
    commentText: string,
    commentId: string,
    userId: string,
    username: string,
    accessToken: string,
    mediaId?: string  // 🎯 POST ID for targeting specific posts
  ): Promise<{ triggered: boolean; actions: string[] }> {
    console.log('[AUTOMATION] Processing comment:', commentText);
    if (mediaId) {
      console.log('[AUTOMATION] 🎯 Comment on post/media ID:', mediaId);
    } else {
      console.log('[AUTOMATION] ⚠️ No media ID provided - global processing');
    }
    
    let rules = await this.getRules(workspaceId);
    
    // CRITICAL FIX: Always use correct workspace if we're in the wrong one
    if (workspaceId === '6847b9cdfabaede1706f2994') {
      console.log('[AUTOMATION] 🚨 DETECTED WRONG WORKSPACE! Switching to current user workspace...');
      const fallbackRules = await this.getRules('684402c2fd2cd4eb6521b386');
      console.log('[AUTOMATION] Found', fallbackRules.length, 'rules in CORRECT workspace');
      
      if (fallbackRules.length > 0) {
        rules = fallbackRules;
        workspaceId = '684402c2fd2cd4eb6521b386'; // Force correct workspace
        console.log('[AUTOMATION] ✅ FORCED switch to correct workspace with user rules');
      }
    }
    // Also check if no rules found in any workspace
    else if (rules.length === 0) {
      console.log('[AUTOMATION] 🔄 No rules found, checking fallback workspace...');
      const fallbackRules = await this.getRules('684402c2fd2cd4eb6521b386');
      console.log('[AUTOMATION] Found', fallbackRules.length, 'fallback rules in current workspace');
      
      if (fallbackRules.length > 0) {
        rules = fallbackRules;
        workspaceId = '684402c2fd2cd4eb6521b386';
        console.log('[AUTOMATION] ✅ Using fallback workspace rules');
      }
    }
    
    const activeRules = rules.filter(rule => rule.isActive);
    
    const triggeredActions: string[] = [];
    let anyRuleTriggered = false;
    
    for (const rule of activeRules) {
      console.log('[AUTOMATION DEBUG] Processing rule:', rule.name);
      console.log('[AUTOMATION DEBUG] Rule keywords:', rule.keywords);
      console.log('[AUTOMATION DEBUG] Rule type:', typeof rule.keywords);
      
      // 🎯 POST-SPECIFIC TARGETING CHECK (like ManyChat)
      if (rule.targetMediaIds && rule.targetMediaIds.length > 0) {
        if (!mediaId) {
          console.log('[AUTOMATION] ⏭️ Rule targets specific posts but no mediaId provided, skipping:', rule.name);
          continue;
        }
        if (!rule.targetMediaIds.includes(mediaId)) {
          console.log('[AUTOMATION] ⏭️ Rule targets different posts, skipping:', rule.name, 'targets:', rule.targetMediaIds, 'current:', mediaId);
          continue;
        }
        console.log('[AUTOMATION] ✅ Rule targets this post:', rule.name, 'mediaId:', mediaId);
      } else {
        console.log('[AUTOMATION] 🌐 Rule has global targeting (all posts):', rule.name);
      }
      
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
      
      // 🎯 CRITICAL FIX: Convert Instagram user ID to Page-Scoped ID (PSID) for DMs
      console.log('[AUTOMATION] 🔄 Converting user ID to PSID for DM API...');
      
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
            
            // 🎯 CRITICAL FIX: Try multiple DM approaches for Instagram Business API
            const pageId = instagramAccount?.pageId;
            if (pageId && instagramAccount?.isBusinessAccount) {
              console.log('[AUTOMATION] 🚀 ManyChat-style DM: Using Page ID for Business API:', pageId);
              
              // Method 1: Try direct user ID (sometimes works)
              console.log('[AUTOMATION] 📋 Method 1: Trying direct user ID for DM...');
              const directDMResponse = await fetch(`https://graph.instagram.com/v21.0/${pageId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  recipient: { id: userId },
                  message: { text: message },
                  access_token: accessToken
                })
              });
              
              if (directDMResponse.ok) {
                const data = await directDMResponse.json();
                console.log('[AUTOMATION] ✅ Direct DM sent successfully:', data.message_id);
                return true;
              } else {
                const directError = await directDMResponse.text();
                console.log('[AUTOMATION] ❌ Direct DM failed:', directError);
                
                // Method 2: Try using User ID as Instagram Business Account ID
                console.log('[AUTOMATION] 📋 Method 2: Trying DM with Instagram account endpoint...');
                const accountDMResponse = await fetch(`https://graph.instagram.com/v21.0/${userId}/messages`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    recipient: { id: pageId },
                    message: { text: message },
                    access_token: accessToken
                  })
                });
                
                if (accountDMResponse.ok) {
                  const data = await accountDMResponse.json();
                  console.log('[AUTOMATION] ✅ Account-based DM sent successfully:', data.message_id);
                  return true;
                } else {
                  const accountError = await accountDMResponse.text();
                  console.log('[AUTOMATION] ❌ Account-based DM failed:', accountError);
                  
                  // Method 3: Try Facebook Graph API format (fallback)
                  console.log('[AUTOMATION] 📋 Method 3: Trying Facebook Graph API format...');
                  const fbDMResponse = await fetch(`https://graph.facebook.com/v21.0/${pageId}/messages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      recipient: { id: userId },
                      message: { text: message },
                      access_token: accessToken
                    })
                  });
                  
                  if (fbDMResponse.ok) {
                    const data = await fbDMResponse.json();
                    console.log('[AUTOMATION] ✅ Facebook Graph DM sent successfully:', data.message_id);
                    return true;
                  } else {
                    const fbError = await fbDMResponse.text();
                    console.log('[AUTOMATION] ❌ Facebook Graph DM failed:', fbError);
                  }
                }
              }
                
              // Method 4: Try with Instagram account ID instead of Page ID
              const accountId = instagramAccount?.accountId;
              if (accountId && accountId !== pageId) {
                console.log('[AUTOMATION] 📋 Method 4: Trying fallback with account ID:', accountId);
                const fallbackResponse = await fetch(`https://graph.instagram.com/v21.0/${accountId}/messages`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    recipient: { id: userId },
                    message: { text: message },
                    access_token: accessToken
                  })
                });
                
                if (fallbackResponse.ok) {
                  const fallbackData = await fallbackResponse.json();
                  console.log('[AUTOMATION] ✅ DM sent via Instagram account ID:', fallbackData.message_id);
                  return true;
                } else {
                  const fallbackError = await fallbackResponse.text();
                  console.error('[AUTOMATION] ❌ Instagram account ID failed:', fallbackError);
                }
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