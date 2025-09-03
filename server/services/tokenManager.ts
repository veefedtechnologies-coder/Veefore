// Removed User and Workspace imports - using simplified approach
import InstagramApiService, { InstagramApiError } from './instagramApi';
// import { MetricsQueueManager } from '../queues/metricsQueue';

// Token status tracking
export interface TokenInfo {
  userId: string;
  token: string;
  refreshToken?: string;
  expiryDate?: Date;
  status: 'active' | 'expired' | 'rate_limited' | 'invalid';
  lastUsed: Date;
  rateLimitResetAt?: Date;
  apiCallCount: number;
  instagramAccountId: string;
  instagramUsername: string;
}

export interface WorkspaceTokenPool {
  workspaceId: string;
  tokens: TokenInfo[];
  lastTokenIndex: number;
  totalApiCalls: number;
  rateLimitedUntil?: Date;
}

export class TokenManager {
  private static tokenPools: Map<string, WorkspaceTokenPool> = new Map();
  private static readonly MAX_CALLS_PER_HOUR = 200;
  private static readonly RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

  /**
   * Initialize token pool for a workspace
   */
  static async initializeWorkspaceTokens(workspaceId: string): Promise<void> {
    try {
      console.log(`🔧 Initializing token pool for workspace: ${workspaceId}`);
      
      // Get all users in the workspace with Instagram tokens
      const users = await User.find({
        workspaceId,
        instagramToken: { $exists: true, $ne: null },
        tokenStatus: { $in: ['active', 'rate_limited'] }
      });

      const tokens: TokenInfo[] = [];

      for (const user of users) {
        if (user.instagramToken && user.instagramAccountId) {
          tokens.push({
            userId: user.userId,
            token: user.instagramToken,
            refreshToken: user.instagramRefreshToken,
            expiryDate: user.instagramTokenExpiry,
            status: user.tokenStatus as TokenInfo['status'],
            lastUsed: user.lastApiCallTimestamp || new Date(0),
            rateLimitResetAt: user.rateLimitResetAt,
            apiCallCount: user.apiCallCount || 0,
            instagramAccountId: user.instagramAccountId,
            instagramUsername: user.instagramUsername || 'unknown',
          });
        }
      }

      this.tokenPools.set(workspaceId, {
        workspaceId,
        tokens,
        lastTokenIndex: 0,
        totalApiCalls: tokens.reduce((sum, token) => sum + token.apiCallCount, 0),
      });

      console.log(`✅ Initialized ${tokens.length} tokens for workspace ${workspaceId}`);
    } catch (error) {
      console.error(`🚨 Error initializing workspace tokens for ${workspaceId}:`, error);
      throw error;
    }
  }

  /**
   * Get the best available token for a workspace
   */
  static async getWorkspaceToken(workspaceId: string): Promise<TokenInfo | null> {
    let pool = this.tokenPools.get(workspaceId);

    // Initialize pool if it doesn't exist
    if (!pool) {
      await this.initializeWorkspaceTokens(workspaceId);
      pool = this.tokenPools.get(workspaceId);
      if (!pool) return null;
    }

    // Filter active tokens
    const activeTokens = pool.tokens.filter(token => 
      token.status === 'active' && 
      (!token.rateLimitResetAt || token.rateLimitResetAt < new Date())
    );

    if (activeTokens.length === 0) {
      console.warn(`⚠️ No active tokens available for workspace ${workspaceId}`);
      return null;
    }

    // Find token with least recent usage for load balancing
    const bestToken = activeTokens.reduce((prev, current) => 
      prev.lastUsed < current.lastUsed ? prev : current
    );

    // Update last used timestamp
    bestToken.lastUsed = new Date();
    bestToken.apiCallCount++;

    // Update in database
    await this.updateTokenUsage(bestToken);

    console.log(`🎯 Selected token for workspace ${workspaceId}: @${bestToken.instagramUsername} (${bestToken.apiCallCount} calls)`);
    return bestToken;
  }

  /**
   * Handle rate limit error and rotate tokens
   */
  static async handleRateLimit(
    workspaceId: string,
    rateLimitedToken: string,
    retryAfter: number = 3600
  ): Promise<void> {
    console.log(`🚦 Handling rate limit for workspace ${workspaceId}, retry after: ${retryAfter}s`);

    const pool = this.tokenPools.get(workspaceId);
    if (!pool) return;

    // Find and mark the rate-limited token
    const tokenInfo = pool.tokens.find(t => t.token === rateLimitedToken);
    if (tokenInfo) {
      tokenInfo.status = 'rate_limited';
      tokenInfo.rateLimitResetAt = new Date(Date.now() + (retryAfter * 1000));

      // Update in database
      await User.findOneAndUpdate(
        { userId: tokenInfo.userId },
        { 
          tokenStatus: 'rate_limited',
          rateLimitResetAt: tokenInfo.rateLimitResetAt
        }
      );

      console.log(`🔄 Token for @${tokenInfo.instagramUsername} rate-limited until ${tokenInfo.rateLimitResetAt}`);
    }

    // Check if all tokens are rate-limited
    const activeTokens = pool.tokens.filter(t => 
      t.status === 'active' && (!t.rateLimitResetAt || t.rateLimitResetAt < new Date())
    );

    if (activeTokens.length === 0) {
      console.warn(`🚨 All tokens rate-limited for workspace ${workspaceId}. Scheduling retry.`);
      pool.rateLimitedUntil = new Date(Date.now() + (retryAfter * 1000));
    }
  }

  /**
   * Refresh an expired token
   */
  static async refreshToken(userId: string, workspaceId: string): Promise<boolean> {
    try {
      console.log(`🔄 Refreshing token for user ${userId} in workspace ${workspaceId}`);

      const user = await User.findOne({ userId, workspaceId });
      if (!user || !user.instagramRefreshToken) {
        console.error(`❌ No refresh token found for user ${userId}`);
        return false;
      }

      // Refresh the token using Instagram API
      const refreshResult = await InstagramApiService.refreshAccessToken(user.instagramRefreshToken);

      // Update user with new token
      await User.findOneAndUpdate(
        { userId },
        {
          instagramToken: refreshResult.access_token,
          tokenStatus: 'active',
          instagramTokenExpiry: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)), // 60 days
          rateLimitResetAt: null,
        }
      );

      // Update token pool
      const pool = this.tokenPools.get(workspaceId);
      if (pool) {
        const tokenInfo = pool.tokens.find(t => t.userId === userId);
        if (tokenInfo) {
          tokenInfo.token = refreshResult.access_token;
          tokenInfo.status = 'active';
          tokenInfo.rateLimitResetAt = undefined;
          tokenInfo.expiryDate = new Date(Date.now() + (60 * 24 * 60 * 60 * 1000));
        }
      }

      console.log(`✅ Successfully refreshed token for user ${userId}`);
      return true;
    } catch (error) {
      console.error(`🚨 Error refreshing token for user ${userId}:`, error);

      // Mark token as invalid
      await User.findOneAndUpdate(
        { userId },
        { tokenStatus: 'invalid' }
      );

      // Update token pool
      const pool = this.tokenPools.get(workspaceId);
      if (pool) {
        const tokenInfo = pool.tokens.find(t => t.userId === userId);
        if (tokenInfo) {
          tokenInfo.status = 'invalid';
        }
      }

      return false;
    }
  }

  /**
   * Add a new token to the workspace pool
   */
  static async addTokenToWorkspace(
    workspaceId: string,
    userId: string,
    token: string,
    refreshToken: string,
    instagramAccountId: string,
    instagramUsername: string
  ): Promise<void> {
    try {
      console.log(`➕ Adding new token to workspace ${workspaceId} for @${instagramUsername}`);

      // Validate token first
      const validation = await InstagramApiService.validateToken(token);
      if (!validation.is_valid) {
        throw new Error('Invalid Instagram token');
      }

      // Update user in database
      await User.findOneAndUpdate(
        { userId },
        {
          instagramToken: token,
          instagramRefreshToken: refreshToken,
          tokenStatus: 'active',
          instagramAccountId,
          instagramUsername,
          instagramTokenExpiry: validation.expires_at ? new Date(validation.expires_at * 1000) : undefined,
          lastApiCallTimestamp: new Date(),
        },
        { upsert: true }
      );

      // Add to token pool
      let pool = this.tokenPools.get(workspaceId);
      if (!pool) {
        await this.initializeWorkspaceTokens(workspaceId);
        pool = this.tokenPools.get(workspaceId);
      }

      if (pool) {
        // Remove existing token for this user if any
        pool.tokens = pool.tokens.filter(t => t.userId !== userId);

        // Add new token
        pool.tokens.push({
          userId,
          token,
          refreshToken,
          expiryDate: validation.expires_at ? new Date(validation.expires_at * 1000) : undefined,
          status: 'active',
          lastUsed: new Date(),
          apiCallCount: 0,
          instagramAccountId,
          instagramUsername,
        });
      }

      console.log(`✅ Successfully added token for @${instagramUsername} to workspace ${workspaceId}`);
    } catch (error) {
      console.error(`🚨 Error adding token to workspace ${workspaceId}:`, error);
      throw error;
    }
  }

  /**
   * Remove token from workspace pool
   */
  static async removeTokenFromWorkspace(workspaceId: string, userId: string): Promise<void> {
    console.log(`➖ Removing token from workspace ${workspaceId} for user ${userId}`);

    // Update database
    await User.findOneAndUpdate(
      { userId },
      {
        instagramToken: null,
        instagramRefreshToken: null,
        tokenStatus: 'invalid',
        instagramAccountId: null,
        instagramUsername: null,
      }
    );

    // Remove from token pool
    const pool = this.tokenPools.get(workspaceId);
    if (pool) {
      pool.tokens = pool.tokens.filter(t => t.userId !== userId);
    }

    console.log(`✅ Removed token for user ${userId} from workspace ${workspaceId}`);
  }

  /**
   * Update token usage statistics
   */
  private static async updateTokenUsage(tokenInfo: TokenInfo): Promise<void> {
    await User.findOneAndUpdate(
      { userId: tokenInfo.userId },
      {
        lastApiCallTimestamp: tokenInfo.lastUsed,
        apiCallCount: tokenInfo.apiCallCount,
      }
    );
  }

  /**
   * Check if workspace has available API quota
   */
  static async hasAvailableQuota(workspaceId: string): Promise<boolean> {
    const pool = this.tokenPools.get(workspaceId);
    if (!pool) return false;

    // Check if any token is available and not rate-limited
    const availableTokens = pool.tokens.filter(token => 
      token.status === 'active' && 
      (!token.rateLimitResetAt || token.rateLimitResetAt < new Date())
    );

    return availableTokens.length > 0;
  }

  /**
   * Get token statistics for a workspace
   */
  static getWorkspaceTokenStats(workspaceId: string): {
    totalTokens: number;
    activeTokens: number;
    rateLimitedTokens: number;
    expiredTokens: number;
    invalidTokens: number;
    totalApiCalls: number;
  } {
    const pool = this.tokenPools.get(workspaceId);
    if (!pool) {
      return {
        totalTokens: 0,
        activeTokens: 0,
        rateLimitedTokens: 0,
        expiredTokens: 0,
        invalidTokens: 0,
        totalApiCalls: 0,
      };
    }

    const now = new Date();
    return {
      totalTokens: pool.tokens.length,
      activeTokens: pool.tokens.filter(t => t.status === 'active' && (!t.rateLimitResetAt || t.rateLimitResetAt < now)).length,
      rateLimitedTokens: pool.tokens.filter(t => t.status === 'rate_limited' || (t.rateLimitResetAt && t.rateLimitResetAt > now)).length,
      expiredTokens: pool.tokens.filter(t => t.status === 'expired').length,
      invalidTokens: pool.tokens.filter(t => t.status === 'invalid').length,
      totalApiCalls: pool.totalApiCalls,
    };
  }

  /**
   * Cleanup expired rate limits
   */
  static cleanupExpiredRateLimits(): void {
    const now = new Date();
    for (const [workspaceId, pool] of this.tokenPools) {
      let updated = false;
      
      for (const token of pool.tokens) {
        if (token.status === 'rate_limited' && token.rateLimitResetAt && token.rateLimitResetAt <= now) {
          token.status = 'active';
          token.rateLimitResetAt = undefined;
          updated = true;
          
          console.log(`🔓 Rate limit expired for @${token.instagramUsername} in workspace ${workspaceId}`);
        }
      }

      if (updated && pool.rateLimitedUntil && pool.rateLimitedUntil <= now) {
        pool.rateLimitedUntil = undefined;
        console.log(`🔓 Workspace ${workspaceId} is no longer rate-limited`);
      }
    }
  }

  /**
   * Schedule automatic token refresh for expiring tokens
   */
  static async scheduleTokenRefresh(): Promise<void> {
    const now = new Date();
    const refreshThreshold = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days

    for (const [workspaceId, pool] of this.tokenPools) {
      for (const token of pool.tokens) {
        if (
          token.status === 'active' &&
          token.expiryDate &&
          token.expiryDate <= refreshThreshold &&
          token.refreshToken
        ) {
          console.log(`⏰ Scheduling token refresh for @${token.instagramUsername} in workspace ${workspaceId}`);
          
          await MetricsQueueManager.scheduleTokenRefresh(
            workspaceId,
            token.userId,
            token.refreshToken,
            token.instagramAccountId,
            0 // Refresh immediately
          );
        }
      }
    }
  }
}

// Cleanup expired rate limits every 5 minutes
setInterval(() => {
  TokenManager.cleanupExpiredRateLimits();
}, 5 * 60 * 1000);

// Schedule token refresh checks every hour
setInterval(() => {
  TokenManager.scheduleTokenRefresh();
}, 60 * 60 * 1000);

export default TokenManager;