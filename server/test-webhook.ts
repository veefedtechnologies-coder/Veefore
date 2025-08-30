/**
 * Test webhook automation system
 */

import { AutomationSystem } from './automation-system';
import { IStorage } from './storage';

export class WebhookTester {
  private automationSystem: AutomationSystem;

  constructor(private storage: IStorage) {
    this.automationSystem = new AutomationSystem(storage);
  }

  /**
   * Test comment-to-DM automation with a simulated comment
   */
  async testCommentAutomation(workspaceId: string, testComment: string, targetMediaId: string): Promise<any> {
    try {
      console.log('[WEBHOOK TEST] Testing automation with comment:', testComment);
      
      // Find Instagram account for this workspace
      const accounts = await this.storage.getSocialAccountsByWorkspace(workspaceId);
      const instagramAccount = accounts.find(acc => acc.platform === 'instagram' && acc.accessToken);
      
      if (!instagramAccount) {
        return { error: 'No Instagram account found' };
      }
      
      // Simulate a comment event
      const mockCommentId = 'test_comment_' + Date.now();
      const mockUserId = 'test_user_123';
      const mockUsername = 'test_user';
      
      console.log('[WEBHOOK TEST] Simulating comment from user:', mockUsername);
      
      // Process the comment through automation
      const result = await this.automationSystem.processComment(
        workspaceId,
        testComment,
        mockCommentId,
        mockUserId,
        mockUsername,
        instagramAccount.accessToken
      );
      
      return {
        success: true,
        result,
        testData: {
          comment: testComment,
          username: mockUsername,
          triggered: result.triggered,
          actions: result.actions
        }
      };
      
    } catch (error: any) {
      console.error('[WEBHOOK TEST] Error:', error);
      return { error: error.message };
    }
  }
}