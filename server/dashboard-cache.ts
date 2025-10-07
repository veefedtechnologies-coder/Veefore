import { IStorage } from './storage';
import { RealtimeService } from './services/realtime';

interface CachedDashboardData {
  totalPosts: number;
  totalReach: number;
  engagementRate: number;
  topPlatform: string;
  followers: number;
  impressions: number;
  accountUsername: string;
  totalLikes: number;
  totalComments: number;
  mediaCount: number;
  lastUpdated: Date;
}

interface DataChangeEvent {
  workspaceId: string;
  changeType: 'reach' | 'engagement' | 'followers' | 'posts' | 'all';
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
}

export class DashboardCache {
  private cache = new Map<string, CachedDashboardData>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private changeThreshold = 0.01; // 1% change threshold to trigger cache invalidation

  constructor(private storage: IStorage) {}

  // Get cached data immediately - NEVER wait for database
  getCachedDataSync(workspaceId: string, period: 'day'|'week'|'month' = 'day'): CachedDashboardData | null {
    const key = `${workspaceId}:${period}`;
    const cached = this.cache.get(key);
    
    if (cached) {
      console.log('[CACHE SYNC] Returning cached data instantly');
      return cached;
    }

    console.log('[CACHE SYNC] No cache found');
    return null;
  }

  // Async method only for initial population - not used in API routes
  async getCachedData(workspaceId: string, period: 'day'|'week'|'month' = 'day'): Promise<CachedDashboardData | null> {
    // First check sync cache
    const syncCache = this.getCachedDataSync(workspaceId, period);
    if (syncCache) return syncCache;

    // Only use database for initial population
    try {
      console.log('[CACHE] Initial database population for workspace:', workspaceId);
      const accounts = await this.storage.getSocialAccountsByWorkspace(workspaceId);
      const instagramAccount = accounts.find(acc => acc.platform === 'instagram' && acc.accessToken);
      
      if (instagramAccount) {
        const account = instagramAccount as any;
        const dashboardData: CachedDashboardData = {
          totalPosts: account.mediaCount || 0,
          totalReach: account.totalReach || 0,
          engagementRate: account.avgEngagement || 0,
          topPlatform: 'instagram',
          followers: account.followersCount || account.followers || 0,
          impressions: account.totalReach || 0,
          accountUsername: account.username || '',
          totalLikes: account.totalLikes || 0,
          totalComments: account.totalComments || 0,
          mediaCount: account.mediaCount || 0,
          lastUpdated: new Date()
        };

        const key = `${workspaceId}:${period}`;
        this.cache.set(key, dashboardData);
        console.log('[CACHE] Initial cache populated from database');
        return dashboardData;
      }
    } catch (error) {
      console.log('[CACHE] Initial database population failed');
    }

    return null;
  }

  // Update cache with fresh data and detect changes for real-time invalidation
  updateCache(workspaceId: string, data: Partial<CachedDashboardData>, period: 'day'|'week'|'month' = 'day'): void {
    const key = `${workspaceId}:${period}`;
    const existing = this.cache.get(key) || {
      totalPosts: 0,
      totalReach: 0,
      engagementRate: 0,
      topPlatform: 'instagram',
      followers: 0,
      impressions: 0,
      accountUsername: '',
      totalLikes: 0,
      totalComments: 0,
      mediaCount: 0,
      lastUpdated: new Date()
    };

    const updated = {
      ...existing,
      ...data,
      lastUpdated: new Date()
    };

    // Detect significant changes and emit WebSocket events
    const changes = this.detectSignificantChanges(existing, updated);
    
    if (changes.length > 0) {
      console.log(`[CACHE] 🔄 Detected ${changes.length} significant changes for workspace ${workspaceId}:`, changes);
      
      // Emit real-time cache invalidation events
      this.emitCacheInvalidationEvents(workspaceId, changes);
    }

    this.cache.set(key, updated);
    console.log('[CACHE] Updated dashboard cache for workspace:', workspaceId);
  }

  // Clear all cache to force fresh data
  clearCache(): void {
    this.cache.clear();
    console.log('[CACHE] All dashboard cache cleared');
  }

  // Clear cache for specific workspace
  clearWorkspaceCache(workspaceId: string): void {
    Array.from(this.cache.keys()).forEach(k => { if (k.startsWith(`${workspaceId}:`)) this.cache.delete(k); });
    console.log('[CACHE] Cleared cache for workspace:', workspaceId);
  }

  // Check if cache is still valid
  private isCacheValid(lastUpdated: Date): boolean {
    const now = new Date().getTime();
    const cacheTime = lastUpdated.getTime();
    return (now - cacheTime) < this.CACHE_DURATION;
  }

  // Get minimal placeholder data for immediate response
  getPlaceholderData(): CachedDashboardData {
    return {
      totalPosts: 0,
      totalReach: 0,
      engagementRate: 0,
      topPlatform: 'none',
      followers: 0,
      impressions: 0,
      accountUsername: '',
      totalLikes: 0,
      totalComments: 0,
      mediaCount: 0,
      lastUpdated: new Date()
    };
  }

  // Detect significant changes between old and new data
  private detectSignificantChanges(oldData: CachedDashboardData, newData: CachedDashboardData): DataChangeEvent[] {
    const changes: DataChangeEvent[] = [];
    const timestamp = new Date();

    // Check reach changes
    if (this.isSignificantChange(oldData.totalReach, newData.totalReach)) {
      changes.push({
        workspaceId: '', // Will be set by caller
        changeType: 'reach',
        oldValue: oldData.totalReach,
        newValue: newData.totalReach,
        timestamp
      });
    }

    // Check engagement changes
    if (this.isSignificantChange(oldData.engagementRate, newData.engagementRate)) {
      changes.push({
        workspaceId: '',
        changeType: 'engagement',
        oldValue: oldData.engagementRate,
        newValue: newData.engagementRate,
        timestamp
      });
    }

    // Check followers changes
    if (this.isSignificantChange(oldData.followers, newData.followers)) {
      changes.push({
        workspaceId: '',
        changeType: 'followers',
        oldValue: oldData.followers,
        newValue: newData.followers,
        timestamp
      });
    }

    // Check posts changes
    if (this.isSignificantChange(oldData.totalPosts, newData.totalPosts)) {
      changes.push({
        workspaceId: '',
        changeType: 'posts',
        oldValue: oldData.totalPosts,
        newValue: newData.totalPosts,
        timestamp
      });
    }

    return changes;
  }

  // Check if a change is significant enough to trigger cache invalidation
  private isSignificantChange(oldValue: number, newValue: number): boolean {
    if (oldValue === 0 && newValue > 0) return true; // New data
    if (oldValue > 0 && newValue === 0) return true; // Data removed
    if (oldValue === newValue) return false; // No change

    // Calculate percentage change
    const changePercent = Math.abs((newValue - oldValue) / oldValue);
    return changePercent >= this.changeThreshold;
  }

  // Emit WebSocket events for cache invalidation
  private emitCacheInvalidationEvents(workspaceId: string, changes: DataChangeEvent[]): void {
    try {
      // Set workspace ID for all changes
      changes.forEach(change => change.workspaceId = workspaceId);

      // Emit individual change events
      changes.forEach(change => {
        RealtimeService.broadcastToWorkspace(workspaceId, 'cache-invalidation', {
          event: 'data-change',
          changeType: change.changeType,
          oldValue: change.oldValue,
          newValue: change.newValue,
          workspaceId: workspaceId,
          timestamp: change.timestamp.toISOString()
        });
      });

      // Emit general cache refresh event
      RealtimeService.broadcastToWorkspace(workspaceId, 'cache-invalidation', {
        event: 'refresh-required',
        workspaceId: workspaceId,
        changes: changes.length,
        timestamp: new Date().toISOString()
      });

      console.log(`[CACHE] 📡 Emitted ${changes.length} cache invalidation events for workspace ${workspaceId}`);
    } catch (error) {
      console.error('[CACHE] Error emitting cache invalidation events:', error);
    }
  }

  // Force cache invalidation for a workspace (useful for manual triggers)
  forceCacheInvalidation(workspaceId: string, reason: string = 'manual'): void {
    try {
      RealtimeService.broadcastToWorkspace(workspaceId, 'cache-invalidation', {
        event: 'force-refresh',
        workspaceId: workspaceId,
        reason: reason,
        timestamp: new Date().toISOString()
      });

      console.log(`[CACHE] 🔄 Force cache invalidation triggered for workspace ${workspaceId}: ${reason}`);
    } catch (error) {
      console.error('[CACHE] Error emitting force cache invalidation:', error);
    }
  }
}