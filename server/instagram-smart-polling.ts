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
  consecutiveNoChanges: number;
  lastActivity: number;
}

export class InstagramSmartPolling {
  private storage: IStorage;
  private dashboardCache: DashboardCache;
  private pollingConfigs: Map<string, PollingConfig> = new Map();
  private rateLimitTrackers: Map<string, RateLimitTracker> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  
  // Instagram API rate limits: 200 requests per hour per user
  private readonly MAX_REQUESTS_PER_HOUR = 200;
  private readonly HOUR_IN_MS = 60 * 60 * 1000;
  
  // Adaptive polling intervals (in milliseconds)
  private readonly INTERVALS = {
    ACTIVE_USER: 30 * 1000,      // 30 seconds when user is active
    NORMAL: 2 * 60 * 1000,       // 2 minutes normal
    REDUCED: 5 * 60 * 1000,      // 5 minutes when no changes
    MINIMAL: 15 * 60 * 1000,     // 15 minutes when inactive
    NIGHT: 30 * 60 * 1000        // 30 minutes during night hours
  };

  constructor(storage: IStorage) {
    this.storage = storage;
    this.dashboardCache = new DashboardCache(storage);
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
      // This is a simplified approach - in a real scenario, you'd query all workspaces
      // For now, we'll work with the accounts we can find
      const allAccounts: any[] = [];
      
      // Get accounts from storage (this might need to be adapted based on your storage interface)
      // Since we don't have a "get all accounts" method, we'll use a workaround
      console.log('[SMART POLLING] Discovering Instagram accounts...');
      
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
   * Check if we can make an API request without hitting rate limits
   */
  private canMakeRequest(accountId: string): boolean {
    const tracker = this.rateLimitTrackers.get(accountId);
    if (!tracker) return false;

    const now = Date.now();
    
    // Reset window if hour has passed
    if (now - tracker.windowStart >= this.HOUR_IN_MS) {
      tracker.requestCount = 0;
      tracker.windowStart = now;
    }

    // Check if we have requests left
    if (tracker.requestCount >= this.MAX_REQUESTS_PER_HOUR) {
      const resetTime = tracker.windowStart + this.HOUR_IN_MS;
      const minutesUntilReset = Math.ceil((resetTime - now) / (60 * 1000));
      console.log(`[SMART POLLING] ⚠️ Rate limit reached for ${accountId}. Reset in ${minutesUntilReset} minutes`);
      return false;
    }

    // Ensure minimum gap between requests (18 seconds to be safe)
    const minGap = Math.ceil(this.HOUR_IN_MS / this.MAX_REQUESTS_PER_HOUR);
    if (now - tracker.lastRequest < minGap) {
      return false;
    }

    return true;
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
    
    // User recently active (within 5 minutes)
    if (timeSinceLastActivity < 5 * 60 * 1000) {
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

      // Make Instagram API call
      const apiUrl = `https://graph.instagram.com/me?fields=followers_count,media_count,account_type&access_token=${config.accessToken}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Instagram API error');
      }

      const newFollowerCount = data.followers_count;
      const mediaCount = data.media_count;

      // Check if data changed
      if (newFollowerCount !== config.lastFollowerCount) {
        console.log(`[SMART POLLING] 📊 Follower change detected for @${config.username}: ${config.lastFollowerCount} → ${newFollowerCount}`);
        
        // Update database
        await this.updateAccountData(config, {
          followersCount: newFollowerCount,
          mediaCount: mediaCount,
          lastSyncAt: new Date()
        });

        // Clear dashboard cache to force refresh
        await this.dashboardCache.clearCache(config.workspaceId);
        
        // Reset consecutive no-changes counter
        config.consecutiveNoChanges = 0;
        config.lastFollowerCount = newFollowerCount;
        
        console.log(`[SMART POLLING] ✅ Updated @${config.username} follower count to ${newFollowerCount}`);
      } else {
        config.consecutiveNoChanges++;
        console.log(`[SMART POLLING] 📊 No change for @${config.username} (${config.consecutiveNoChanges} consecutive)`);
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
}