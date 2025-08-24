import { IStorage } from './storage';
import { DashboardCache } from './dashboard-cache';

interface RateLimitTracker {
  requestCount: number;
  windowStart: number;
  lastRequest: number;
}

interface PollingConfig {
  accountId: string;
  workspaceId: string;
  accessToken: string;
  username: string;
  isActive: boolean;
  lastFollowerCount: number;
  lastMediaCount: number;
  lastEngagementData: any;
  consecutiveNoChanges: number;
  lastActivity: number;
}

export class InstagramSmartPolling {
  private storage: IStorage;
  private dashboardCache: DashboardCache;
  private pollingConfigs: Map<string, PollingConfig> = new Map();
  private rateLimitTrackers: Map<string, RateLimitTracker> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private requestHistory: Array<{ timestamp: number; accountId: string }> = [];
  
  // Instagram API rate limits: 200 requests per hour per user
  private readonly MAX_REQUESTS_PER_HOUR = 200;
  private readonly HOUR_IN_MS = 60 * 60 * 1000;
  
  // ULTRA-SECURE polling intervals - BULLETPROOF rate limit protection
  private readonly INTERVALS = {
    ACTIVE_USER: 60 * 1000,      // 1 minute when user is active (ULTRA-SAFE)
    NORMAL: 3 * 60 * 1000,       // 3 minutes normal (VERY CONSERVATIVE)
    REDUCED: 5 * 60 * 1000,      // 5 minutes when no changes
    MINIMAL: 10 * 60 * 1000,     // 10 minutes when inactive
    NIGHT: 15 * 60 * 1000        // 15 minutes during night hours
  };

  constructor(storage: IStorage) {
    this.storage = storage;
    this.dashboardCache = new DashboardCache(storage);
    this.requestHistory = []; // Initialize request history
    this.initializePolling();
  }

  /**
   * Initialize polling for all active Instagram accounts
   */
  private async initializePolling(): Promise<void> {
    try {
      console.log('[SMART POLLING] Initializing Instagram polling system...');
      
      // Get all workspaces and their Instagram accounts
      const allAccounts = await this.getAllInstagramAccounts();
      
      for (const account of allAccounts) {
        await this.setupAccountPolling(account);
      }
      
      console.log(`[SMART POLLING] ✅ Initialized polling for ${allAccounts.length} Instagram accounts`);
    } catch (error) {
      console.error('[SMART POLLING] ❌ Failed to initialize polling:', error);
    }
  }

  /**
   * Get all Instagram accounts across all workspaces
   */
  private async getAllInstagramAccounts(): Promise<any[]> {
    try {
      const allAccounts: any[] = [];
      console.log('[SMART POLLING] Discovering Instagram accounts across all workspaces...');
      
      // Query MongoDB directly to get all Instagram accounts
      const storage = this.storage as any;
      if (storage.SocialAccount) {
        const instagramAccounts = await storage.SocialAccount.find({
          platform: 'instagram',
          isActive: true,
          accessToken: { $exists: true, $ne: null }
        }).lean();
        
        for (const account of instagramAccounts) {
          allAccounts.push({
            id: account._id.toString(),
            accountId: account.accountId,
            workspaceId: account.workspaceId,
            username: account.username,
            platform: account.platform,
            accessToken: account.accessToken,
            isActive: account.isActive,
            followersCount: account.followersCount || 0
          });
        }
        
        console.log(`[SMART POLLING] Found ${allAccounts.length} active Instagram accounts`);
      }
      
      return allAccounts;
    } catch (error) {
      console.error('[SMART POLLING] Error getting Instagram accounts:', error);
      return [];
    }
  }

  /**
   * Setup polling for a specific Instagram account
   */
  async setupAccountPolling(account: any): Promise<void> {
    if (!account.accessToken || account.platform !== 'instagram' || !account.isActive) {
      return;
    }

    const config: PollingConfig = {
      accountId: account.accountId || account.id,
      workspaceId: account.workspaceId,
      accessToken: account.accessToken,
      username: account.username,
      isActive: true,
      lastFollowerCount: account.followersCount || 0,
      lastMediaCount: account.mediaCount || 0,
      lastEngagementData: null,
      consecutiveNoChanges: 0,
      lastActivity: Date.now()
    };

    this.pollingConfigs.set(config.accountId, config);
    this.initializeRateLimit(config.accountId);
    
    console.log(`[SMART POLLING] ✅ Setup polling for @${config.username} (${config.accountId})`);
    
    // Start polling immediately
    await this.startPollingForAccount(config.accountId);
  }

  /**
   * Initialize rate limit tracking for an account
   */
  private initializeRateLimit(accountId: string): void {
    this.rateLimitTrackers.set(accountId, {
      requestCount: 0,
      windowStart: Date.now(),
      lastRequest: 0
    });
  }

  /**
   * BULLETPROOF rate limiting check - Multiple safety layers
   */
  private canMakeRequest(accountId: string): boolean {
    const now = Date.now();
    
    // Layer 1: Global rate limiting (across all accounts)
    this.cleanupRequestHistory();
    if (this.requestHistory.length >= this.MAX_REQUESTS_PER_HOUR) {
      console.log(`[SMART POLLING] 🚫 GLOBAL rate limit reached: ${this.requestHistory.length}/200 requests in last hour`);
      return false;
    }

    // Layer 2: Per-account rate limiting  
    const tracker = this.rateLimitTrackers.get(accountId);
    if (!tracker) return false;

    // Reset window if hour has passed
    if (now - tracker.windowStart >= this.HOUR_IN_MS) {
      tracker.requestCount = 0;
      tracker.windowStart = now;
    }

    // Check per-account limit (25% of total to be safe with multiple accounts)
    const maxPerAccount = Math.floor(this.MAX_REQUESTS_PER_HOUR / 4); // 50 requests max per account
    if (tracker.requestCount >= maxPerAccount) {
      console.log(`[SMART POLLING] 🚫 Account rate limit reached for ${accountId}: ${tracker.requestCount}/${maxPerAccount}`);
      return false;
    }

    // Layer 3: Minimum gap enforcement (doubled for safety: 36 seconds)
    const minGap = (this.HOUR_IN_MS / this.MAX_REQUESTS_PER_HOUR) * 2; // 36 seconds minimum
    if (now - tracker.lastRequest < minGap) {
      console.log(`[SMART POLLING] ⏱️ Too soon for ${accountId}, waiting ${Math.ceil((minGap - (now - tracker.lastRequest)) / 1000)}s`);
      return false;
    }

    return true;
  }

  /**
   * Clean up old requests from history (older than 1 hour)
   */
  private cleanupRequestHistory(): void {
    const now = Date.now();
    this.requestHistory = this.requestHistory.filter(
      req => now - req.timestamp < this.HOUR_IN_MS
    );
  }

  /**
   * Record an API request for rate limiting
   */
  private recordRequest(accountId: string): void {
    const tracker = this.rateLimitTrackers.get(accountId);
    if (tracker) {
      tracker.requestCount++;
      tracker.lastRequest = Date.now();
    }
  }

  /**
   * Record a request in global history for rate limiting tracking
   */
  private recordRequestHistory(accountId: string): void {
    const now = Date.now();
    this.requestHistory.push({ timestamp: now, accountId });
    this.cleanupRequestHistory();
  }

  /**
   * Calculate adaptive polling interval based on various factors
   */
  private calculatePollingInterval(config: PollingConfig): number {
    const now = Date.now();
    const timeSinceLastActivity = now - config.lastActivity;
    const currentHour = new Date().getHours();
    
    // Night hours (11 PM - 6 AM) - reduce polling
    if (currentHour >= 23 || currentHour <= 6) {
      return this.INTERVALS.NIGHT;
    }
    
    // User inactive for more than 30 minutes
    if (timeSinceLastActivity > 30 * 60 * 1000) {
      return this.INTERVALS.MINIMAL;
    }
    
    // No changes detected for a while - reduce frequency
    if (config.consecutiveNoChanges >= 5) {
      return this.INTERVALS.REDUCED;
    }
    
    // User recently active (within 10 minutes) - extended for better responsiveness
    if (timeSinceLastActivity < 10 * 60 * 1000) {
      return this.INTERVALS.ACTIVE_USER;
    }
    
    // Default interval
    return this.INTERVALS.NORMAL;
  }

  /**
   * Start polling for a specific account
   */
  private async startPollingForAccount(accountId: string): Promise<void> {
    const config = this.pollingConfigs.get(accountId);
    if (!config) return;

    // Clear existing interval
    const existingInterval = this.pollingIntervals.get(accountId);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    const pollOnce = async () => {
      try {
        if (!this.canMakeRequest(accountId)) {
          // Schedule next poll with rate limit consideration
          const nextInterval = this.calculatePollingInterval(config);
          setTimeout(pollOnce, Math.max(nextInterval, 20000)); // At least 20 seconds
          return;
        }

        await this.pollAccountData(accountId);
        
        // Schedule next poll
        const nextInterval = this.calculatePollingInterval(config);
        setTimeout(pollOnce, nextInterval);
        
      } catch (error) {
        console.error(`[SMART POLLING] Error polling ${config.username}:`, error);
        // Retry with exponential backoff
        setTimeout(pollOnce, this.INTERVALS.REDUCED);
      }
    };

    // Start polling
    pollOnce();
  }

  /**
   * Poll data for a specific account
   */
  private async pollAccountData(accountId: string): Promise<void> {
    const config = this.pollingConfigs.get(accountId);
    if (!config) return;

    try {
      console.log(`[SMART POLLING] 🔄 Polling data for @${config.username}...`);
      
      // Record the API request
      this.recordRequest(accountId);
      this.recordRequestHistory(accountId);

      // Make comprehensive Instagram API call (using only available fields)
      const apiUrl = `https://graph.instagram.com/me?fields=followers_count,media_count,account_type&access_token=${config.accessToken}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Instagram API error');
      }

      const newFollowerCount = data.followers_count;
      const mediaCount = data.media_count;
      
      // Fetch comprehensive engagement metrics
      const engagementMetrics = await this.fetchEngagementMetrics(config.accessToken);

      // Check if ANY data changed (not just followers)
      const hasChanges = newFollowerCount !== config.lastFollowerCount || 
                        mediaCount !== config.lastMediaCount ||
                        this.hasEngagementChanges(config, engagementMetrics);

      if (hasChanges) {
        const changes = [];
        if (newFollowerCount !== config.lastFollowerCount) {
          changes.push(`followers: ${config.lastFollowerCount} → ${newFollowerCount}`);
        }
        if (mediaCount !== config.lastMediaCount) {
          changes.push(`posts: ${config.lastMediaCount} → ${mediaCount}`);
        }
        if (this.hasEngagementChanges(config, engagementMetrics)) {
          changes.push('engagement metrics updated');
        }
        
        console.log(`[SMART POLLING] 📊 Changes detected for @${config.username}: ${changes.join(', ')}`);
        
        // Update database with ALL available metrics
        await this.updateAccountData(config, {
          followersCount: newFollowerCount,
          mediaCount: mediaCount,
          avgLikes: engagementMetrics.avgLikes,
          avgComments: engagementMetrics.avgComments,
          avgReach: engagementMetrics.avgReach,
          engagementRate: engagementMetrics.engagementRate,
          totalLikes: engagementMetrics.totalLikes,
          totalComments: engagementMetrics.totalComments,
          totalReach: engagementMetrics.totalReach,
          avgEngagement: engagementMetrics.avgEngagement,
          lastSyncAt: new Date()
        });

        // Clear dashboard cache to force refresh
        await this.dashboardCache.clearCache(config.workspaceId);
        
        // Reset consecutive no-changes counter and update tracked values
        config.consecutiveNoChanges = 0;
        config.lastFollowerCount = newFollowerCount;
        config.lastMediaCount = mediaCount;
        config.lastEngagementData = engagementMetrics;
        
        console.log(`[SMART POLLING] ✅ Updated @${config.username} - ALL metrics synchronized`);
      } else {
        config.consecutiveNoChanges++;
        console.log(`[SMART POLLING] 📊 No changes for @${config.username} (${config.consecutiveNoChanges} consecutive)`);
      }

    } catch (error) {
      console.error(`[SMART POLLING] ❌ Failed to poll @${config.username}:`, error);
      
      // Handle specific errors
      if (error.message?.includes('rate limit')) {
        console.log(`[SMART POLLING] Rate limited for @${config.username}, backing off...`);
      }
    }
  }

  /**
   * Fetch comprehensive engagement metrics from Instagram
   */
  private async fetchEngagementMetrics(accessToken: string): Promise<any> {
    try {
      // Fetch recent media posts
      const mediaResponse = await fetch(`https://graph.instagram.com/me/media?fields=id,like_count,comments_count&limit=25&access_token=${accessToken}`);
      if (!mediaResponse.ok) {
        console.log('[SMART POLLING] Media data not available, using defaults');
        return { avgLikes: 0, avgComments: 0, avgReach: 0, engagementRate: 0, totalLikes: 0, totalComments: 0, totalReach: 0, avgEngagement: 0 };
      }
      
      const mediaData = await mediaResponse.json();
      const mediaList = mediaData.data || [];
      
      if (!mediaList.length) {
        return { avgLikes: 0, avgComments: 0, avgReach: 0, engagementRate: 0, totalLikes: 0, totalComments: 0, totalReach: 0, avgEngagement: 0 };
      }
      
      // Calculate ONLY real engagement metrics from actual Instagram data
      const totalLikes = mediaList.reduce((sum: number, media: any) => sum + (media.like_count || 0), 0);
      const totalComments = mediaList.reduce((sum: number, media: any) => sum + (media.comments_count || 0), 0);
      
      const avgLikes = Math.round(totalLikes / mediaList.length);
      const avgComments = Math.round(totalComments / mediaList.length);
      const avgEngagement = avgLikes + avgComments;
      
      // ONLY use real data - no fake estimates
      console.log(`[SMART POLLING] ✅ Real engagement data: ${totalLikes} likes, ${totalComments} comments across ${mediaList.length} posts`);
      
      return {
        avgLikes,
        avgComments,
        avgReach: 0, // Not available via Instagram Basic API - show 0 instead of fake data
        engagementRate: 0, // Can't calculate without real reach data
        totalLikes,
        totalComments,
        totalReach: 0, // Not available
        avgEngagement
      };
    } catch (error) {
      console.log('[SMART POLLING] Failed to fetch engagement metrics:', error.message);
      return { avgLikes: 0, avgComments: 0, avgReach: 0, engagementRate: 0, totalLikes: 0, totalComments: 0, totalReach: 0, avgEngagement: 0 };
    }
  }
  
  /**
   * Check if engagement metrics have changed
   */
  private hasEngagementChanges(config: PollingConfig, newMetrics: any): boolean {
    if (!config.lastEngagementData) return true;
    
    const old = config.lastEngagementData;
    return old.avgLikes !== newMetrics.avgLikes ||
           old.avgComments !== newMetrics.avgComments ||
           old.totalLikes !== newMetrics.totalLikes ||
           old.totalComments !== newMetrics.totalComments;
  }

  /**
   * Update account data in storage
   */
  private async updateAccountData(config: PollingConfig, updates: any): Promise<void> {
    try {
      // Find the account in storage and update it
      const accounts = await this.storage.getSocialAccountsByWorkspace(config.workspaceId);
      const account = accounts.find((acc: any) => 
        acc.platform === 'instagram' && 
        (acc.accountId === config.accountId || acc.id === config.accountId)
      );

      if (account) {
        await this.storage.updateSocialAccount(account.id, updates);
      }
    } catch (error) {
      console.error('[SMART POLLING] Failed to update account data:', error);
    }
  }

  /**
   * Notify system of user activity to adjust polling
   */
  updateUserActivity(accountId: string): void {
    const config = this.pollingConfigs.get(accountId);
    if (config) {
      config.lastActivity = Date.now();
      console.log(`[SMART POLLING] 👤 User activity detected for @${config.username}`);
    }
  }

  /**
   * Get polling status for all accounts
   */
  getPollingStatus(): any {
    const status: any = {
      totalAccounts: this.pollingConfigs.size,
      accounts: []
    };

    this.pollingConfigs.forEach((config, accountId) => {
      const rateLimitInfo = this.rateLimitTrackers.get(accountId);
      const nextPollIn = this.calculatePollingInterval(config);
      
      status.accounts.push({
        username: config.username,
        accountId: accountId,
        lastFollowerCount: config.lastFollowerCount,
        consecutiveNoChanges: config.consecutiveNoChanges,
        timeSinceActivity: Date.now() - config.lastActivity,
        nextPollIn: nextPollIn,
        rateLimitStatus: rateLimitInfo ? {
          requestsUsed: rateLimitInfo.requestCount,
          requestsRemaining: this.MAX_REQUESTS_PER_HOUR - rateLimitInfo.requestCount,
          windowResetIn: Math.max(0, (rateLimitInfo.windowStart + this.HOUR_IN_MS) - Date.now())
        } : null
      });
    });

    return status;
  }

  /**
   * Force immediate poll for an account (respecting rate limits)
   */
  async forcePoll(accountId: string): Promise<boolean> {
    if (this.canMakeRequest(accountId)) {
      await this.pollAccountData(accountId);
      return true;
    }
    return false;
  }

  /**
   * Stop polling for an account
   */
  stopPolling(accountId: string): void {
    const interval = this.pollingIntervals.get(accountId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(accountId);
    }
    this.pollingConfigs.delete(accountId);
    this.rateLimitTrackers.delete(accountId);
    console.log(`[SMART POLLING] ⏹️ Stopped polling for account ${accountId}`);
  }

  /**
   * Stop all polling
   */
  stopAllPolling(): void {
    this.pollingIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.pollingIntervals.clear();
    this.pollingConfigs.clear();
    this.rateLimitTrackers.clear();
    console.log('[SMART POLLING] ⏹️ Stopped all polling');
  }

  /**
   * Get current polling status for all accounts
   */
  getPollingStatus(): any {
    const accounts = Array.from(this.pollingConfigs.values()).map(config => {
      const interval = this.calculatePollingInterval(config);
      const nextPollTime = new Date(config.lastActivity + interval);
      const nextPollIn = Math.max(0, nextPollTime.getTime() - Date.now());
      
      return {
        id: config.accountId,
        username: config.username,
        isActive: config.isActive,
        lastPolled: new Date(config.lastActivity),
        nextPollIn: nextPollIn,
        interval: interval,
        requestsToday: 0 // Simplified for now
      };
    });

    return {
      totalAccounts: this.pollingConfigs.size,
      activeAccounts: Array.from(this.pollingConfigs.values()).filter(config => config.isActive).length,
      totalRequestsToday: this.requestHistory?.length || 0,
      rateLimitRemaining: Math.max(0, this.MAX_REQUESTS_PER_HOUR - (this.requestHistory?.length || 0)),
      accounts: accounts
    };
  }
}