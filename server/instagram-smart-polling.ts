import { IStorage } from './storage';
import { DashboardCache } from './dashboard-cache';
import { RealtimeService } from './services/realtime';
import { calculateERF, calculateERR, calculateSmartEngagement, EngagementData } from './utils/engagement-calculator';

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
  lastPollTime: number | null;
  nextScheduledPollTime: number | null; // Timestamp of when next poll is scheduled
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
  
  // BALANCED polling intervals - Real-time updates with rate limit protection
  private readonly INTERVALS = {
    ACTIVE_USER: 5 * 60 * 1000,    // 5 minutes when user is active
    NORMAL: 10 * 60 * 1000,       // 10 minutes normal
    REDUCED: 30 * 60 * 1000,      // 30 minutes when no changes
    MINIMAL: 60 * 60 * 1000,      // 1 hour when inactive  
    HIBERNATION: null             // No polling when hibernated (1+ hour inactive)
  };
  
  // Hibernation threshold: pause polling after 1 hour of inactivity
  private readonly HIBERNATION_THRESHOLD = 60 * 60 * 1000; // 1 hour

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
      
      if (allAccounts.length === 0) {
        console.log('[SMART POLLING] ⚠️ No Instagram accounts found for polling');
        console.log('[SMART POLLING] This is normal if no Instagram accounts are connected yet');
        return;
      }
      
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
      
      // Get ALL workspaces by discovering from social accounts (better approach)
      let allWorkspaces: any[] = [];
      
      try {
        // First try to get all social accounts to discover workspaces
        const allSocialAccounts = await this.storage.getAllSocialAccounts();
        console.log(`[SMART POLLING] Found ${allSocialAccounts.length} total social accounts`);
        
        // Extract unique workspace IDs from social accounts
        const workspaceIds = Array.from(new Set(allSocialAccounts.map(acc => acc.workspaceId)));
        console.log(`[SMART POLLING] Found ${workspaceIds.length} unique workspace IDs from social accounts`);
        
        // Get workspace details for each workspace ID
        for (const workspaceId of workspaceIds) {
          try {
            const workspace = await this.storage.getWorkspace(workspaceId);
            if (workspace) {
              allWorkspaces.push(workspace);
              console.log(`[SMART POLLING] Found workspace: ${workspace.name || workspaceId}`);
            }
          } catch (error) {
            console.log(`[SMART POLLING] Could not get workspace ${workspaceId}:`, error.message);
          }
        }
      } catch (error) {
        console.log('[SMART POLLING] Fallback: trying common user IDs...');
        // Fallback: Get ALL workspaces by trying multiple user IDs (workaround since getAllWorkspaces doesn't exist)
        const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Try more user IDs
        
        for (const userId of userIds) {
          try {
            const userWorkspaces = await this.storage.getWorkspacesByUserId(userId);
            if (userWorkspaces.length > 0) {
              allWorkspaces = allWorkspaces.concat(userWorkspaces);
              console.log(`[SMART POLLING] Found ${userWorkspaces.length} workspaces for user ${userId}`);
            }
          } catch (error) {
            // Continue with other user IDs
          }
        }
      }
      
      // Remove duplicates based on workspace ID
      const uniqueWorkspaces = allWorkspaces.filter((workspace, index, self) => 
        index === self.findIndex(w => w.id === workspace.id)
      );
      
      allWorkspaces = uniqueWorkspaces;
      console.log(`[SMART POLLING] Found ${allWorkspaces.length} total unique workspaces to scan`);
      
      // Scan each workspace for Instagram accounts
      for (const workspace of allWorkspaces) {
        try {
          console.log(`[SMART POLLING] Scanning workspace: ${workspace.id} (${workspace.name || 'Unnamed'})`);
          
          // Use internal method that returns decrypted tokens
          const accounts = await (this.storage as any).getSocialAccountsWithTokensInternal(workspace.id.toString());
          const instagramAccounts = accounts.filter(acc => 
            acc.platform === 'instagram' && 
            acc.accessToken && 
            acc.username // Has basic data
          );
          
          if (instagramAccounts.length > 0) {
            console.log(`[SMART POLLING] Found ${instagramAccounts.length} Instagram accounts in workspace ${workspace.id}`);
            
            for (const account of instagramAccounts) {
              allAccounts.push({
                id: account.id,
                accountId: account.accountId || account.id,
                workspaceId: workspace.id.toString(),
                username: account.username,
                platform: account.platform,
                accessToken: account.accessToken,
                isActive: true, // Force active for polling
                followersCount: account.followersCount || 0,
                mediaCount: account.mediaCount || 0
              });
              console.log(`[SMART POLLING] Added account: @${account.username} from workspace ${workspace.id} for polling`);
            }
          }
        } catch (workspaceError) {
          console.error(`[SMART POLLING] Error scanning workspace ${workspace.id}:`, workspaceError);
          // Continue with other workspaces
        }
      }
      
      console.log(`[SMART POLLING] Total Instagram accounts found across all workspaces: ${allAccounts.length}`);
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
      lastActivity: Date.now(),
      lastPollTime: null, // Initialize as null, will be set on first poll
      nextScheduledPollTime: null // Initialize as null, will be set when poll is scheduled
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

    // Check per-account limit (10% of total to reserve quota for automation)
    const maxPerAccount = Math.floor(this.MAX_REQUESTS_PER_HOUR / 10); // 20 requests max per account for analytics
    if (tracker.requestCount >= maxPerAccount) {
      console.log(`[SMART POLLING] 🚫 Account rate limit reached for ${accountId}: ${tracker.requestCount}/${maxPerAccount}`);
      return false;
    }

    // Layer 3: Minimum gap enforcement (10x safety: 3 minutes minimum)
    const minGap = (this.HOUR_IN_MS / this.MAX_REQUESTS_PER_HOUR) * 10; // 3 minutes minimum between requests
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
  private calculatePollingInterval(config: PollingConfig): number | null {
    const now = Date.now();
    const timeSinceLastActivity = now - config.lastActivity;
    
    // 🚨 HIBERNATION MODE: User inactive for more than 1 hour - PAUSE polling
    if (timeSinceLastActivity > this.HIBERNATION_THRESHOLD) {
      console.log(`[SMART POLLING] 💤 Account ${config.username} entering HIBERNATION - 1+ hour inactive`);
      return this.INTERVALS.HIBERNATION; // null = no polling
    }
    
    // No changes detected for a while - reduce frequency
    if (config.consecutiveNoChanges >= 5) {
      return this.INTERVALS.REDUCED;
    }
    
    // User recently active (within 10 minutes) - real-time responsiveness
    if (timeSinceLastActivity < 10 * 60 * 1000) {
      return this.INTERVALS.ACTIVE_USER;
    }
    
    // User moderately inactive (10-30 minutes) - normal polling
    if (timeSinceLastActivity < 30 * 60 * 1000) {
      return this.INTERVALS.NORMAL;
    }
    
    // User inactive (30-60 minutes) - minimal polling before hibernation
    if (timeSinceLastActivity < this.HIBERNATION_THRESHOLD) {
      return this.INTERVALS.MINIMAL;
    }
    
    // Default interval (should never reach here due to hibernation check above)
    return this.INTERVALS.NORMAL;
  }

  /**
   * Start polling for a specific account
   */
  private async startPollingForAccount(accountId: string): Promise<void> {
    const config = this.pollingConfigs.get(accountId);
    if (!config) return;

    // Clear existing timeout
    const existingTimeout = this.pollingIntervals.get(accountId);
    if (existingTimeout) {
      clearTimeout(existingTimeout); // ⭐ FIX: Use clearTimeout instead of clearInterval
      this.pollingIntervals.delete(accountId);
    }

    const pollOnce = async () => {
      try {
        // 🚨 CHECK HIBERNATION FIRST - Skip API calls if hibernated
        const nextInterval = this.calculatePollingInterval(config);
        if (nextInterval === null) {
          console.log(`[SMART POLLING] 💤 Account ${config.username} is HIBERNATED - no API calls until user becomes active`);
          this.pollingIntervals.delete(accountId);
          return;
        }

        if (!this.canMakeRequest(accountId)) {
          // Schedule next poll with rate limit consideration
          const timeoutId = setTimeout(pollOnce, Math.max(nextInterval, 20000)); // At least 20 seconds
          this.pollingIntervals.set(accountId, timeoutId); // ⭐ FIX: Store timeout reference
          return;
        }

        await this.pollAccountData(accountId);
        
        // Schedule next poll based on activity status
        const nextPollInterval = this.calculatePollingInterval(config);
        if (nextPollInterval !== null) {
          const nextScheduledTime = Date.now() + nextPollInterval;
          config.nextScheduledPollTime = nextScheduledTime; // Store when next poll is scheduled
          const timeoutId = setTimeout(pollOnce, nextPollInterval);
          this.pollingIntervals.set(accountId, timeoutId); // ⭐ FIX: Store timeout reference
          console.log(`[SMART POLLING] ⏰ Scheduled next poll for @${config.username} in ${Math.round(nextPollInterval / 1000)}s`);
        } else {
          // Account entered hibernation during polling
          console.log(`[SMART POLLING] 💤 Account ${config.username} entered HIBERNATION during poll`);
          config.nextScheduledPollTime = null;
          this.pollingIntervals.delete(accountId);
        }
        
      } catch (error) {
        console.error(`[SMART POLLING] Error polling ${config.username}:`, error);
        // Retry with exponential backoff
        const timeoutId = setTimeout(pollOnce, this.INTERVALS.REDUCED);
        this.pollingIntervals.set(accountId, timeoutId); // ⭐ FIX: Store timeout reference
      }
    };

    // Start polling
    pollOnce();
  }

  /**
   * 🚀 INSTANT ACTIVATION: Trigger immediate sync when user returns from hibernation
   */
  public async activateUser(accountId: string): Promise<void> {
    const config = this.pollingConfigs.get(accountId);
    if (!config) return;

    console.log(`[SMART POLLING] 🚀 User ACTIVATING account ${config.username} - triggering instant sync`);
    
    // Update activity timestamp to "now" to bring back from hibernation
    config.lastActivity = Date.now();
    
    // Reset consecutive no-changes counter as user returning is "activity"
    config.consecutiveNoChanges = 0;
    
    try {
      // 🔥 INSTANT DATA SYNC: Like Instagram direct sync but for active users
      await this.pollAccountData(accountId);
      console.log(`[SMART POLLING] ✅ Instant sync completed for ${config.username}`);
      
      // Restart polling with new activity status
      await this.startPollingForAccount(accountId);
    } catch (error) {
      console.error(`[SMART POLLING] ❌ Failed instant sync for ${config.username}:`, error);
    }
  }

  /**
   * Update user activity (called when user visits dashboard)
   */
  public updateUserActivity(accountId: string): void {
    const config = this.pollingConfigs.get(accountId);
    if (!config) return;

    const wasHibernated = (Date.now() - config.lastActivity) > this.HIBERNATION_THRESHOLD;
    config.lastActivity = Date.now();
    
    console.log(`[SMART POLLING] 📱 User activity updated for ${config.username}${wasHibernated ? ' - AWAKENING from hibernation!' : ''}`);
    
    // If user was hibernated, activate instantly
    if (wasHibernated) {
      this.activateUser(accountId).catch(error => {
        console.error(`[SMART POLLING] Failed to activate hibernated user ${config.username}:`, error);
      });
    } else {
      // Just restart polling to update intervals
      this.startPollingForAccount(accountId).catch(error => {
        console.error(`[SMART POLLING] Failed to restart polling for ${config.username}:`, error);
      });
    }
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
      const realAccountType = data.account_type; // Get real account type from Instagram API
      
      // Check if this is a business account to determine if we can fetch reach data
      const accounts = await this.storage.getSocialAccountsByWorkspace(config.workspaceId);
      // Prefer strict match by accountId when available
      let account = accounts.find((acc: any) => 
        acc.platform === 'instagram' && 
        (acc.accountId === config.accountId || acc.id === config.accountId)
      );
      // Fallback 1: match by platform + username when accountId changed after reconnect
      if (!account && config.username) {
        account = accounts.find((acc: any) => acc.platform === 'instagram' && acc.username === config.username);
      }
      // Fallback 2: match first instagram account in the workspace (single-IG setup)
      if (!account) {
        account = accounts.find((acc: any) => acc.platform === 'instagram');
      }
      // Debug current account type values
      console.log(`[SMART POLLING] Account @${config.username} debug:`, {
        isBusinessAccount: account?.isBusinessAccount,
        accountType: account?.accountType,
        hasAccessToken: account?.hasAccessToken
      });
      
      // Use REAL account type from Instagram API, not outdated database value
      const isBusinessAccount = realAccountType === 'BUSINESS' || 
                               realAccountType === 'CREATOR' ||
                               account?.isBusinessAccount || 
                               account?.accountType === 'BUSINESS' || 
                               account?.accountType === 'CREATOR';
      
      console.log(`[SMART POLLING] Account @${config.username} - Business account: ${isBusinessAccount}`);
      
      // 🚀 ENHANCED: Fetch comprehensive engagement metrics including real reach data
      let engagementMetrics;
      
      if (isBusinessAccount) {
        console.log(`[SMART POLLING] 🔥 Using Instagram Direct Sync for real reach data (same as manual sync)...`);
        
        try {
          // Import and use Instagram Direct Sync for comprehensive data
          const { InstagramDirectSync } = await import('./instagram-direct-sync');
          const directSync = new InstagramDirectSync(this.storage);
          
          // Get comprehensive data including real reach - WITH DEBUG LOGGING
          console.log(`[SMART POLLING] 🔍 Calling fetchComprehensiveData with accessToken: ${config.accessToken ? 'EXISTS' : 'MISSING'}, accountId: ${config.accountId || 'MISSING'}`);
          const comprehensiveData = await directSync.fetchComprehensiveData(config.accessToken, config.accountId);
          console.log(`[SMART POLLING] 🔍 fetchComprehensiveData result:`, comprehensiveData ? 'SUCCESS' : 'FAILED/NULL');
          
          if (comprehensiveData) {
            engagementMetrics = {
              avgLikes: comprehensiveData.avgLikes || 0,
              avgComments: comprehensiveData.avgComments || 0,
              avgReach: comprehensiveData.avgReach || 0,
              engagementRate: comprehensiveData.engagementRate || 0,
              totalLikes: comprehensiveData.totalLikes || 0,
              totalComments: comprehensiveData.totalComments || 0,
              totalReach: comprehensiveData.totalReach || 0, // 🎯 Real Instagram Business API reach data
              avgEngagement: comprehensiveData.avgEngagement || 0,
              reachByPeriod: comprehensiveData.reachByPeriod || {} // 🚀 ENHANCED: Include periodized reach data
            };
            console.log(`[SMART POLLING] ✅ Got real reach data: ${engagementMetrics.totalReach} (same as manual sync)`);
            console.log(`[SMART POLLING] 📊 Periodized reach data:`, JSON.stringify(engagementMetrics.reachByPeriod, null, 2)); // 🔧 SHOW FULL DATA
          } else {
            console.log(`[SMART POLLING] ⚠️ Direct sync failed, falling back to basic engagement metrics`);
            engagementMetrics = await this.fetchEngagementMetrics(config.accessToken, isBusinessAccount, config.accountId);
          }
        } catch (directSyncError) {
          console.log(`[SMART POLLING] Direct sync error, using fallback:`, directSyncError.message);
          engagementMetrics = await this.fetchEngagementMetrics(config.accessToken, isBusinessAccount, config.accountId);
        }
      } else {
        // For non-business accounts, use basic engagement metrics
        engagementMetrics = await this.fetchEngagementMetrics(config.accessToken, isBusinessAccount, config.accountId);
      }

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
        
        // Update database with ALL available metrics INCLUDING real account type
        // 🚀 NEW: Use advanced engagement calculator for smart calculations
        const totalEngagement = (engagementMetrics.totalLikes || 0) + (engagementMetrics.totalComments || 0) + (engagementMetrics.totalShares || 0) + (engagementMetrics.totalSaves || 0);
        
        // Create engagement data for smart calculation
        const engagementData: EngagementData = {
          likes: engagementMetrics.totalLikes,
          comments: engagementMetrics.totalComments,
          shares: engagementMetrics.totalShares || 0,
          saves: engagementMetrics.totalSaves || 0,
          followers: newFollowerCount,
          reach: engagementMetrics.totalReach || 0
        };
        
        // Use smart engagement calculation (automatically chooses ERF or ERR based on account size)
        const smartEngagement = calculateSmartEngagement(engagementData);
        const engagementRate = smartEngagement.rate;
        
        console.log(`[SMART POLLING] 🧠 Smart engagement calculation for @${config.username}:`, {
          method: smartEngagement.method,
          rate: smartEngagement.rate.toFixed(2) + '%',
          description: smartEngagement.description
        });

        await this.updateAccountData(config, {
          followersCount: newFollowerCount,
          mediaCount: mediaCount,
          accountType: realAccountType, // ⭐ FIX: Save real account type from Instagram API
          isBusinessAccount: isBusinessAccount, // ⭐ FIX: Update business account flag
          avgLikes: engagementMetrics.avgLikes,
          avgComments: engagementMetrics.avgComments,
          avgReach: engagementMetrics.avgReach,
          engagementRate: parseFloat(engagementRate.toFixed(2)), // Total engagement rate
          totalLikes: engagementMetrics.totalLikes,
          totalComments: engagementMetrics.totalComments,
          // ✅ Persist shares/saves from engagement metrics (previously omitted -> always 0 in DB/UI)
          totalShares: engagementMetrics.totalShares || 0,
          totalSaves: engagementMetrics.totalSaves || 0,
          postsAnalyzed: engagementMetrics.postsAnalyzed || 0,
          totalReach: engagementMetrics.totalReach,
          avgEngagement: engagementMetrics.avgEngagement, // Average engagement per post
          // 🚀 ENHANCED: Include periodized reach data for automatic updates
          accountLevelReach: engagementMetrics.accountLevelReach || 0,
          postLevelReach: engagementMetrics.postLevelReach || 0,
          reachSource: engagementMetrics.reachSource || 'unavailable',
          reachByPeriod: engagementMetrics.reachByPeriod || {},
          lastSyncAt: new Date()
        });

        // Clear dashboard cache to force refresh
        this.dashboardCache.clearWorkspaceCache(config.workspaceId);
        
        // Broadcast WebSocket event to notify frontend of data update
        RealtimeService.broadcastToWorkspace(config.workspaceId, 'instagram_data_update', {
          accountId: config.accountId,
          username: config.username,
          followersCount: newFollowerCount,
          mediaCount: mediaCount,
          accountType: realAccountType,
          avgLikes: engagementMetrics.avgLikes,
          avgComments: engagementMetrics.avgComments,
          engagementRate: engagementMetrics.engagementRate,
          totalLikes: engagementMetrics.totalLikes,
          totalComments: engagementMetrics.totalComments,
          lastSyncAt: new Date(),
          changes: changes
        });
        
        console.log(`[SMART POLLING] 📡 Broadcasted instagram_data_update event to workspace ${config.workspaceId}`);
        
        // Reset consecutive no-changes counter and update tracked values
        config.consecutiveNoChanges = 0;
        config.lastFollowerCount = newFollowerCount;
        config.lastMediaCount = mediaCount;
        config.lastEngagementData = engagementMetrics;
        config.lastPollTime = Date.now(); // Update last poll time for accurate nextPollIn calculation
        
        console.log(`[SMART POLLING] ✅ Updated @${config.username} - ALL metrics synchronized`);
      } else {
        config.consecutiveNoChanges++;
        console.log(`[SMART POLLING] 📊 No changes for @${config.username} (${config.consecutiveNoChanges} consecutive)`);
        
        // CRITICAL FIX: Even if no changes, update lastSyncAt and broadcast completion
        // This ensures frontend knows the data is current
        await this.storage.updateSocialAccount(account.id, {
          lastSyncAt: new Date()
        });
        
        // Clear dashboard cache to ensure fresh data on next request
        this.dashboardCache.clearWorkspaceCache(config.workspaceId);
        
        // Broadcast poll completion event (even with no changes) so frontend can refresh
        RealtimeService.broadcastToWorkspace(config.workspaceId, 'instagram_poll_completed', {
          accountId: config.accountId,
          username: config.username,
          hasChanges: false,
          lastSyncAt: new Date()
        });
        
        console.log(`[SMART POLLING] 📡 Broadcasted poll completion to workspace ${config.workspaceId}`);
      }
      
      // Update last poll time regardless of changes
      config.lastPollTime = Date.now();

    } catch (error) {
      console.error(`[SMART POLLING] ❌ Failed to poll @${config.username}:`, error);
      
      // Handle specific errors
      if (error.message?.includes('rate limit')) {
        console.log(`[SMART POLLING] Rate limited for @${config.username}, backing off...`);
      }
    }
  }

  /**
   * Fetch comprehensive engagement metrics from Instagram using Business API when available
   */
  private async fetchEngagementMetrics(accessToken: string, isBusinessAccount: boolean = false, accountId?: string): Promise<any> {
    try {
      // 🚀 SIMPLE: Use simple engagement analysis (last 6 posts only)
      console.log('[SMART POLLING] Using simple engagement analysis (last 6 posts)...');
      
      // Import the InstagramApiService to use the new simple method
      const { InstagramApiService } = await import('./services/instagramApi');
      
      try {
        // Get simple engagement data (last 6 posts only)
        const simpleData = await InstagramApiService.getSimpleEngagementData(accessToken);
        
        console.log('[SMART POLLING] ✅ Simple engagement data received:', {
          totalLikes: simpleData.totalLikes,
          totalComments: simpleData.totalComments,
          totalShares: simpleData.totalShares,
          totalSaves: simpleData.totalSaves,
          postsAnalyzed: simpleData.postsAnalyzed,
          strategy: simpleData.samplingStrategy
        });
        
        // Use simple data for accurate totals
        const totalLikes = simpleData.totalLikes;
        const totalComments = simpleData.totalComments;
        const totalShares = simpleData.totalShares;
        const totalSaves = simpleData.totalSaves;
        const avgLikes = simpleData.avgLikesPerPost;
        const avgComments = simpleData.avgCommentsPerPost;
        const avgShares = simpleData.avgSharesPerPost;
        const avgSaves = simpleData.avgSavesPerPost;
        const totalEngagement = totalLikes + totalComments + totalShares + totalSaves;
        const avgEngagementPerPost = simpleData.postsAnalyzed > 0 ? Math.round(totalEngagement / simpleData.postsAnalyzed) : 0;
        
        console.log(`[SMART POLLING] ✅ Simple engagement calculated: ${totalLikes} likes, ${totalComments} comments, ${totalShares} shares, ${totalSaves} saves across ${simpleData.postsAnalyzed} posts (${simpleData.samplingStrategy})`);
        
        // Continue with reach data fetching...
        let totalReach = 0;
        let reachCount = 0;
        
        // 🚀 ENHANCED: Initialize periodized reach data variables outside the business account block
        let accountLevelReach = 0;
        const reachByPeriod: any = {};
        
        if (isBusinessAccount && accountId) {
          console.log('[SMART POLLING] 🔥 Business account detected - fetching COMPREHENSIVE reach data from Instagram Business API');
          
          // 🚀 ENHANCED: Fetch periodized reach data (day, week, month) for comprehensive updates
          
          console.log('[SMART POLLING] 🔧 Initializing periodized reach fetching...');
          
          const periods = [
            { key: 'day', apiPeriod: 'day', label: 'Today' },
            { key: 'week', apiPeriod: 'week', label: 'This Week' },
            { key: 'days_28', apiPeriod: 'days_28', label: 'This Month' }
          ];
          
          // Fetch reach data for each period
          for (const period of periods) {
            try {
              const reachUrl = `https://graph.facebook.com/v23.0/${accountId}/insights?metric=reach&period=${period.apiPeriod}&access_token=${accessToken}`;
              const reachResponse = await fetch(reachUrl);
              
              if (reachResponse.ok) {
                const reachData = await reachResponse.json();
                const reachValue = reachData.data?.[0]?.values?.[0]?.value || 0;
                
                if (reachValue > 0) {
                  reachByPeriod[period.key] = {
                    value: reachValue,
                    source: 'account-level',
                    updatedAt: new Date().toISOString()
                  };
                  
                  console.log(`[SMART POLLING] ✅ ${period.label} reach: ${reachValue} (account-level)`);
                  
                  // Add to total reach calculation
                  totalReach += reachValue;
                  reachCount++;
                } else {
                  console.log(`[SMART POLLING] ⚠️ No ${period.label} reach data available`);
                }
              } else {
                console.log(`[SMART POLLING] ⚠️ Could not fetch ${period.label} reach data: ${reachResponse.status}`);
              }
              
              // Rate limiting delay between requests
              await new Promise(resolve => setTimeout(resolve, 200));
              
            } catch (periodError) {
              console.log(`[SMART POLLING] ⚠️ Error fetching ${period.label} reach:`, periodError);
            }
          }
          
          // Calculate account-level reach as average of available periods
          if (reachCount > 0) {
            accountLevelReach = Math.round(totalReach / reachCount);
            console.log(`[SMART POLLING] ✅ Account-level reach calculated: ${accountLevelReach} (from ${reachCount} periods)`);
          }
          
        } else {
          console.log('[SMART POLLING] ⚠️ Not a business account or missing account ID - skipping reach data');
        }
        
        // Calculate engagement rate
        const engagementRate = simpleData.postsAnalyzed > 0 ? (totalEngagement / simpleData.postsAnalyzed) : 0;
        
        return {
          avgLikes,
          avgComments,
          avgShares,
          avgSaves,
          avgReach: accountLevelReach,
          engagementRate,
          totalLikes,
          totalComments,
          totalShares,
          totalSaves,
          totalReach: accountLevelReach,
          avgEngagement: avgEngagementPerPost,
          // 🚀 NEW: Include simple data for better insights
          postsAnalyzed: simpleData.postsAnalyzed,
          samplingStrategy: simpleData.samplingStrategy,
          reachByPeriod
        };
        
      } catch (simpleError) {
        console.log('[SMART POLLING] ⚠️ Simple analysis failed, falling back to basic method:', simpleError);
        
        // Fallback to original method if simple analysis fails
        const mediaResponse = await fetch(`https://graph.instagram.com/me/media?fields=id,like_count,comments_count&limit=6&access_token=${accessToken}`);
        if (!mediaResponse.ok) {
          console.log('[SMART POLLING] Media data not available, using defaults');
          return { avgLikes: 0, avgComments: 0, avgShares: 0, avgSaves: 0, avgReach: 0, engagementRate: 0, totalLikes: 0, totalComments: 0, totalShares: 0, totalSaves: 0, totalReach: 0, avgEngagement: 0 };
        }
        
        const mediaData = await mediaResponse.json();
        const mediaList = mediaData.data || [];
        
        if (!mediaList.length) {
          return { avgLikes: 0, avgComments: 0, avgShares: 0, avgSaves: 0, avgReach: 0, engagementRate: 0, totalLikes: 0, totalComments: 0, totalShares: 0, totalSaves: 0, totalReach: 0, avgEngagement: 0 };
        }
        
        // Calculate basic engagement metrics
        const totalLikes = mediaList.reduce((sum: number, media: any) => sum + (media.like_count || 0), 0);
        const totalComments = mediaList.reduce((sum: number, media: any) => sum + (media.comments_count || 0), 0);
        const totalShares = mediaList.reduce((sum: number, media: any) => sum + (media.shares_count || 0), 0);
        const totalSaves = mediaList.reduce((sum: number, media: any) => sum + (media.saves_count || 0), 0);
        
        const avgLikes = Math.round(totalLikes / mediaList.length);
        const avgComments = Math.round(totalComments / mediaList.length);
        const avgShares = Math.round(totalShares / mediaList.length);
        const avgSaves = Math.round(totalSaves / mediaList.length);
        const totalEngagement = totalLikes + totalComments + totalShares + totalSaves;
        const avgEngagementPerPost = Math.round(totalEngagement / mediaList.length);
        
        // Return fallback data with basic reach calculation
        return {
          avgLikes,
          avgComments,
          avgShares,
          avgSaves,
          avgReach: 0, // No reach data in fallback
          engagementRate: mediaList.length > 0 ? (totalEngagement / mediaList.length) : 0,
          totalLikes,
          totalComments,
          totalShares,
          totalSaves,
          totalReach: 0,
          avgEngagement: avgEngagementPerPost,
          postsAnalyzed: mediaList.length,
          samplingStrategy: 'fallback-recent'
        };
      }
      
    } catch (error) {
      console.error('[SMART POLLING] Error in engagement metrics fetch:', error);
      return { avgLikes: 0, avgComments: 0, avgShares: 0, avgSaves: 0, avgReach: 0, engagementRate: 0, totalLikes: 0, totalComments: 0, totalShares: 0, totalSaves: 0, totalReach: 0, avgEngagement: 0 };
    }
  }

  /**
   * Check if engagement data has changed significantly
   */
  private hasEngagementChanges(config: PollingConfig, newMetrics: any): boolean {
    if (!config.lastEngagementData) return true;
    
    const old = config.lastEngagementData;
    // BUGFIX: we weren't checking shares/saves, so updates never persisted when only these changed
    return old.avgLikes !== newMetrics.avgLikes ||
           old.avgComments !== newMetrics.avgComments ||
           old.totalLikes !== newMetrics.totalLikes ||
           old.totalComments !== newMetrics.totalComments ||
           old.totalShares !== newMetrics.totalShares ||
           old.totalSaves !== newMetrics.totalSaves ||
           old.postsAnalyzed !== newMetrics.postsAnalyzed;
  }

  /**
   * Update account data in storage and save daily analytics snapshot
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
        // 🚨 DATA CONSISTENCY FIX: Only prevent overwriting real data with 0, but allow updates with new real data
        // If we have new real Instagram Business API data (> 0), always use it
        // Only prevent overwriting real data with 0 or negative values
        if (updates.totalReach !== undefined && updates.totalReach > 0) {
          console.log(`[SMART POLLING] ✅ Updating with new real Instagram Business API reach data: ${updates.totalReach}`);
          // Allow the update - this is new real data
        } else if (updates.totalReach !== undefined && updates.totalReach === 0 && account.totalReach > 0) {
          console.log(`[SMART POLLING] 🛡️ Preserving existing real reach data (${account.totalReach}) - not overwriting with 0`);
          delete updates.totalReach; // Don't update totalReach if it would overwrite real data with 0
        }
        
        // Only filter out updates that would overwrite real data with 0
        const filteredUpdates = Object.fromEntries(
          Object.entries(updates).filter(([key, value]) => {
            if (key === 'totalReach' && value === 0 && account.totalReach > 0) {
              return false; // Don't overwrite real data with 0
            }
            return true;
          })
        );
        
        console.log(`[SMART POLLING] Updating account with filtered data for @${account.username}:`, filteredUpdates);
        console.log(`[SMART POLLING] 🔧 DEBUG: reachByPeriod in updates:`, JSON.stringify(filteredUpdates.reachByPeriod, null, 2));
        await this.storage.updateSocialAccount(account.id, filteredUpdates);
        
        // 📊 SAVE DAILY ANALYTICS SNAPSHOT - Building Real Historical Data!
        await this.recordDailyAnalytics(config, updates);
        
        // 🔄 TRIGGER REAL-TIME CACHE INVALIDATION - Notify frontend of data changes
        try {
          const workspaceId = account.workspaceId || account.workspace;
          if (workspaceId) {
            // Update dashboard cache with new data to trigger change detection
            this.dashboardCache.updateCache(workspaceId.toString(), {
              totalReach: updates.totalReach || account.totalReach,
              engagementRate: updates.avgEngagement || account.avgEngagement,
              followers: updates.followersCount || account.followersCount,
              totalPosts: updates.mediaCount || account.mediaCount,
              totalLikes: updates.totalLikes || account.totalLikes,
              totalComments: updates.totalComments || account.totalComments,
              accountUsername: account.username
            });
            console.log(`[SMART POLLING] 🔄 Cache invalidation triggered for workspace ${workspaceId}`);
          }
        } catch (cacheError) {
          console.error('[SMART POLLING] Cache invalidation error:', cacheError);
        }
      }
    } catch (error) {
      console.error('[SMART POLLING] Failed to update account data:', error);
    }
  }

  /**
   * Record comprehensive daily analytics snapshot for historical data tracking
   */
  private async recordDailyAnalytics(config: PollingConfig, metrics: any): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of day
      
      // Check if we already have an analytics record for today
      const existingAnalytics = await this.storage.getAnalyticsByWorkspace(config.workspaceId);
      
      const todayRecord = existingAnalytics.find((record: any) => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === today.getTime();
      });
      
      if (!todayRecord) {
        // Calculate comprehensive content score
        const contentScore = this.calculateContentScore(metrics);
        
        // Calculate post frequency (posts per week estimate)
        const postFrequency = this.calculatePostFrequency(metrics);
        
        // Calculate engagement patterns
        const engagementPatterns = this.calculateEngagementPatterns(metrics);
        
        // Calculate reach efficiency
        const reachEfficiency = this.calculateReachEfficiency(metrics);
        
        // Create comprehensive daily analytics record with ALL metrics
        await this.storage.createAnalytics({
          workspaceId: config.workspaceId,
          platform: 'instagram',
          date: today,
          followers: metrics.followersCount || 0,
          engagement: metrics.engagementRate || 0,
          reach: metrics.totalReach || 0,
          likes: metrics.totalLikes || 0,
          comments: metrics.totalComments || 0,
          shares: 0, // Not available in Instagram Basic API
          views: 0, // Not available in Instagram Basic API
          metrics: {
            // Basic metrics
            posts: metrics.mediaCount || 0,
            avgLikes: metrics.avgLikes || 0,
            avgComments: metrics.avgComments || 0,
            avgReach: metrics.avgReach || 0,
            avgEngagement: metrics.avgEngagement || 0,
            
            // Advanced analytics metrics
            contentScore: contentScore,
            postFrequency: postFrequency,
            engagementRate: metrics.engagementRate || 0,
            reachEfficiency: reachEfficiency,
            
            // Engagement patterns
            likesPerPost: engagementPatterns.likesPerPost,
            commentsPerPost: engagementPatterns.commentsPerPost,
            engagementDistribution: engagementPatterns.distribution,
            
            // Performance indicators
            followerGrowthRate: 0, // Will calculate from historical data
            engagementTrend: 'stable', // Will calculate from historical data
            contentPerformance: contentScore.rating,
            
            // Account metadata
            username: config.username,
            accountId: config.accountId,
            accountType: 'PERSONAL', // From account info
            isVerified: false,
            
            // Timing and activity
            lastSyncAt: new Date(),
            activeHours: this.getCurrentHour(),
            dayOfWeek: today.getDay(),
            
            // Content analysis
            totalInteractions: (metrics.totalLikes || 0) + (metrics.totalComments || 0),
            interactionRate: ((metrics.totalLikes || 0) + (metrics.totalComments || 0)) / Math.max(metrics.totalReach || 1, 1),
            
            // Growth metrics (will be calculated from historical data)
            followerChangeToday: 0,
            engagementChangeToday: 0,
            reachChangeToday: 0,
            postsAddedToday: 0
          }
        });
        
        console.log(`[COMPREHENSIVE ANALYTICS] 📊 Saved complete daily snapshot for @${config.username}:`);
        console.log(`[COMPREHENSIVE ANALYTICS] - Followers: ${metrics.followersCount}, Posts: ${metrics.mediaCount}`);
        console.log(`[COMPREHENSIVE ANALYTICS] - Content Score: ${contentScore.score}/10 (${contentScore.rating})`);
        console.log(`[COMPREHENSIVE ANALYTICS] - Post Frequency: ${postFrequency.postsPerWeek}/week`);
        console.log(`[COMPREHENSIVE ANALYTICS] - Reach Efficiency: ${reachEfficiency.percentage}%`);
      } else {
        console.log(`[COMPREHENSIVE ANALYTICS] 📅 Today's complete record already exists for @${config.username}`);
      }
    } catch (error) {
      console.error('[COMPREHENSIVE ANALYTICS] Failed to record daily analytics:', error);
    }
  }

  /**
   * Calculate comprehensive content score based on multiple factors
   */
  private calculateContentScore(metrics: any): { score: number, rating: string } {
    let score = 0;
    
    // Engagement Rate Score (40% weight)
    const engagementScore = Math.min(metrics.engagementRate / 10, 10);
    score += engagementScore * 0.4;
    
    // Post Activity Score (30% weight) 
    const activityScore = Math.min((metrics.mediaCount || 0) / 10, 10);
    score += activityScore * 0.3;
    
    // Reach Efficiency Score (20% weight)
    const followers = metrics.followersCount || 1;
    const reachEfficiency = Math.min((metrics.totalReach || 0) / followers / 5, 10);
    score += reachEfficiency * 0.2;
    
    // Interaction Quality Score (10% weight)
    const avgInteractionScore = Math.min((metrics.avgLikes + metrics.avgComments) / 5, 10);
    score += avgInteractionScore * 0.1;
    
    const finalScore = Math.min(score, 10);
    
    let rating = 'Poor';
    if (finalScore >= 9) rating = 'Exceptional';
    else if (finalScore >= 7.5) rating = 'Excellent';
    else if (finalScore >= 6) rating = 'Very Good';
    else if (finalScore >= 4.5) rating = 'Good';
    else if (finalScore >= 3) rating = 'Fair';
    
    return { score: finalScore, rating };
  }

  /**
   * Calculate post frequency patterns
   */
  private calculatePostFrequency(metrics: any): { postsPerWeek: number, frequency: string } {
    const totalPosts = metrics.mediaCount || 0;
    // Estimate based on account age (assuming account is active for at least 30 days)
    const estimatedWeeks = 4; // Default estimation
    const postsPerWeek = Math.round((totalPosts / estimatedWeeks) * 10) / 10;
    
    let frequency = 'Low';
    if (postsPerWeek >= 7) frequency = 'Very High';
    else if (postsPerWeek >= 5) frequency = 'High';
    else if (postsPerWeek >= 3) frequency = 'Moderate';
    else if (postsPerWeek >= 1) frequency = 'Regular';
    
    return { postsPerWeek, frequency };
  }

  /**
   * Calculate engagement patterns and distribution
   */
  private calculateEngagementPatterns(metrics: any): any {
    const totalPosts = Math.max(metrics.mediaCount || 1, 1);
    const likesPerPost = (metrics.totalLikes || 0) / totalPosts;
    const commentsPerPost = (metrics.totalComments || 0) / totalPosts;
    
    const distribution = {
      likes: Math.round((metrics.totalLikes || 0) / ((metrics.totalLikes || 0) + (metrics.totalComments || 0)) * 100) || 0,
      comments: Math.round((metrics.totalComments || 0) / ((metrics.totalLikes || 0) + (metrics.totalComments || 0)) * 100) || 0
    };
    
    return {
      likesPerPost: Math.round(likesPerPost * 10) / 10,
      commentsPerPost: Math.round(commentsPerPost * 10) / 10,
      distribution
    };
  }

  /**
   * Calculate reach efficiency metrics
   */
  private calculateReachEfficiency(metrics: any): { percentage: number, rating: string } {
    const followers = Math.max(metrics.followersCount || 1, 1);
    const reach = metrics.totalReach || 0;
    const percentage = Math.round((reach / followers) * 100);
    
    let rating = 'Poor';
    if (percentage >= 80) rating = 'Exceptional';
    else if (percentage >= 60) rating = 'Excellent';
    else if (percentage >= 40) rating = 'Good';
    else if (percentage >= 20) rating = 'Fair';
    
    return { percentage, rating };
  }

  /**
   * Get current hour for activity tracking
   */
  private getCurrentHour(): number {
    return new Date().getHours();
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
    const timeout = this.pollingIntervals.get(accountId);
    if (timeout) {
      clearTimeout(timeout); // ⭐ FIX: Use clearTimeout instead of clearInterval
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
    this.pollingIntervals.forEach((timeout) => {
      clearTimeout(timeout); // ⭐ FIX: Use clearTimeout instead of clearInterval
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
    console.log('[SMART POLLING] 📊 getPollingStatus called - polling configs:', this.pollingConfigs.size);
    
    const status: any = {
      totalAccounts: this.pollingConfigs.size,
      accounts: []
    };

    if (this.pollingConfigs.size === 0) {
      console.log('[SMART POLLING] ⚠️ No polling configurations found - no Instagram accounts are being polled');
      return status;
    }

    this.pollingConfigs.forEach((config, accountId) => {
      const rateLimitInfo = this.rateLimitTrackers.get(accountId);
      const interval = this.calculatePollingInterval(config);
      const timeSinceActivity = Date.now() - config.lastActivity;
      const isHibernated = timeSinceActivity > this.HIBERNATION_THRESHOLD;
      
      // Calculate nextPollIn correctly using nextScheduledPollTime
      let nextPollIn = 0;
      const now = Date.now();
      
      console.log(`[SMART POLLING DEBUG] Account @${config.username} - nextPollIn calculation:
        - interval: ${interval}
        - now: ${now}
        - nextScheduledPollTime: ${config.nextScheduledPollTime}
        - lastPollTime: ${config.lastPollTime}`);
      
      if (interval === null) {
        // Hibernated - no polling
        nextPollIn = 0;
      } else if (config.nextScheduledPollTime) {
        // Use the actual scheduled poll time
        nextPollIn = Math.max(0, config.nextScheduledPollTime - now);
        console.log(`[SMART POLLING DEBUG] Account @${config.username} - Using nextScheduledPollTime:
          - nextScheduledPollTime: ${config.nextScheduledPollTime}
          - nextPollIn: ${nextPollIn} (${Math.round(nextPollIn / 1000)}s)`);
      } else if (config.lastPollTime) {
        // Fallback: calculate from lastPollTime if nextScheduledPollTime is not set
        const timeSinceLastPoll = now - config.lastPollTime;
        nextPollIn = Math.max(0, interval - timeSinceLastPoll);
        console.log(`[SMART POLLING DEBUG] Account @${config.username} - Fallback using lastPollTime:
          - timeSinceLastPoll: ${timeSinceLastPoll}
          - nextPollIn: ${nextPollIn}`);
      } else {
        // No previous poll, use full interval
        nextPollIn = interval;
        console.log(`[SMART POLLING DEBUG] Account @${config.username} - No lastPollTime, using full interval: ${nextPollIn}`);
      }
      
      console.log(`[SMART POLLING] 📊 Account @${config.username}: interval=${interval}, nextPollIn=${nextPollIn}, isHibernated=${isHibernated}`);
      
      status.accounts.push({
        username: config.username,
        accountId: accountId,
        lastFollowerCount: config.lastFollowerCount,
        consecutiveNoChanges: config.consecutiveNoChanges,
        timeSinceActivity: timeSinceActivity,
        nextPollIn: nextPollIn,
        status: isHibernated ? 'HIBERNated' : 'ACTIVE',
        hibernationThreshold: this.HIBERNATION_THRESHOLD,
        rateLimitStatus: rateLimitInfo ? {
          requestsUsed: rateLimitInfo.requestCount,
          requestsRemaining: this.MAX_REQUESTS_PER_HOUR - rateLimitInfo.requestCount,
          windowResetIn: Math.max(0, (rateLimitInfo.windowStart + this.HOUR_IN_MS) - Date.now())
        } : null
      });
    });

    console.log('[SMART POLLING] 📊 Returning polling status:', JSON.stringify(status, null, 2));
    return status;
  }
}
