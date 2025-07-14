/**
 * Automatic Instagram Data Synchronization Service
 * Runs in background to keep Instagram data fresh without user intervention
 */

import { IStorage } from './storage';
import { DashboardCache } from './dashboard-cache';

class AutoSyncService {
  private storage: IStorage;
  private dashboardCache: DashboardCache;
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL_MS = 60 * 1000; // Sync every 1 minute

  constructor(storage: IStorage) {
    this.storage = storage;
    this.dashboardCache = new DashboardCache(storage);
  }

  start() {
    console.log('[AUTO SYNC] Starting automatic Instagram data synchronization service');
    
    // Initial sync
    this.performAutoSync();
    
    // Set up periodic sync
    this.syncInterval = setInterval(() => {
      this.performAutoSync();
    }, this.SYNC_INTERVAL_MS);
  }

  stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('[AUTO SYNC] Stopped automatic synchronization service');
    }
  }

  private async performAutoSync() {
    try {
      console.log('[AUTO SYNC] Performing automatic Instagram data sync...');
      
      // Get all active Instagram accounts
      const allSocialAccounts = await this.storage.getAllSocialAccounts();
      const instagramAccounts = allSocialAccounts.filter(
        (acc: any) => acc.platform === 'instagram' && acc.isActive && acc.accessToken
      );

      console.log(`[AUTO SYNC] Found ${instagramAccounts.length} active Instagram accounts to sync`);

      for (const account of instagramAccounts) {
        await this.syncInstagramAccount(account);
      }

      console.log('[AUTO SYNC] Completed automatic sync cycle');
    } catch (error: any) {
      console.error('[AUTO SYNC] Error during automatic sync:', error.message);
    }
  }

  private async syncInstagramAccount(account: any) {
    try {
      console.log(`[AUTO SYNC] Syncing Instagram account: @${account.username}`);

      // Fetch fresh data from Instagram API including profile picture
      const apiUrl = `https://graph.instagram.com/me?fields=account_type,followers_count,media_count,profile_picture_url&access_token=${account.accessToken}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok && data.followers_count !== undefined) {
        console.log(`[AUTO SYNC] Live data for @${account.username}:`, {
          followers: data.followers_count,
          mediaCount: data.media_count,
          profilePictureUrl: data.profile_picture_url
        });

        // Update database with fresh data including profile picture
        await this.storage.updateSocialAccount(account.id, {
          followersCount: data.followers_count,
          mediaCount: data.media_count,
          profilePictureUrl: data.profile_picture_url,
          lastSyncAt: new Date(),
          updatedAt: new Date()
        });

        // Clear cache to force refresh on next request
        this.dashboardCache.clearCache();

        console.log(`[AUTO SYNC] Successfully updated @${account.username} with followers: ${data.followers_count}`);
      } else {
        console.error(`[AUTO SYNC] Instagram API error for @${account.username}:`, data.error?.message || 'Unknown error');
      }
    } catch (error: any) {
      console.error(`[AUTO SYNC] Failed to sync @${account.username}:`, error.message);
    }
  }

  // Manual trigger for immediate sync
  async triggerSync(workspaceId?: string) {
    try {
      console.log('[AUTO SYNC] Manual sync triggered');
      
      if (workspaceId) {
        // Sync specific workspace
        const accounts = await this.storage.getSocialAccountsByWorkspace(workspaceId);
        const instagramAccount = accounts.find((acc: any) => acc.platform === 'instagram' && acc.isActive);
        
        if (instagramAccount) {
          await this.syncInstagramAccount(instagramAccount);
        }
      } else {
        // Sync all accounts
        await this.performAutoSync();
      }
    } catch (error: any) {
      console.error('[AUTO SYNC] Manual sync failed:', error.message);
      throw error;
    }
  }
}

export { AutoSyncService };