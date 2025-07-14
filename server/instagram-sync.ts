import { IStorage } from './storage';

export class InstagramSyncService {
  constructor(private storage: IStorage) {}

  async syncInstagramData(workspaceId: string, accessToken: string): Promise<void> {
    try {
      console.log('[INSTAGRAM SYNC] Starting data synchronization for workspace:', workspaceId);
      
      // Get user profile data
      const profileResponse = await this.fetchInstagramProfile(accessToken);
      const mediaResponse = await this.fetchInstagramMedia(accessToken);
      
      if (!profileResponse || !mediaResponse) {
        throw new Error('Failed to fetch Instagram data');
      }
      
      // Calculate engagement metrics from real data
      const metrics = this.calculateEngagementMetrics(mediaResponse);
      
      // Update social account with fresh data
      await this.updateSocialAccountMetrics(workspaceId, {
        ...profileResponse,
        ...metrics,
        lastSyncAt: new Date(),
        accessToken
      });
      
      console.log('[INSTAGRAM SYNC] Successfully updated Instagram data');
    } catch (error) {
      console.error('[INSTAGRAM SYNC] Error syncing Instagram data:', error);
      throw error;
    }
  }

  private async fetchInstagramProfile(accessToken: string): Promise<any> {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me?fields=id,username,followers_count,follows_count,media_count,profile_picture_url&access_token=${accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        username: data.username,
        followers: data.followers_count,
        following: data.follows_count,
        mediaCount: data.media_count,
        accountId: data.id,
        profilePictureUrl: data.profile_picture_url
      };
    } catch (error) {
      console.error('[INSTAGRAM SYNC] Error fetching profile:', error);
      return null;
    }
  }

  private async fetchInstagramMedia(accessToken: string): Promise<any> {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,insights.metric(impressions,reach,engagement)&access_token=${accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Instagram Media API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('[INSTAGRAM SYNC] Error fetching media:', error);
      return [];
    }
  }

  private calculateEngagementMetrics(mediaData: any[]): any {
    if (!mediaData || mediaData.length === 0) {
      return {
        totalLikes: 0,
        totalComments: 0,
        avgEngagement: 0,
        totalReach: 0,
        impressions: 0
      };
    }

    const totalLikes = mediaData.reduce((sum, post) => sum + (post.like_count || 0), 0);
    const totalComments = mediaData.reduce((sum, post) => sum + (post.comments_count || 0), 0);
    const totalEngagements = totalLikes + totalComments;
    
    // Calculate reach from insights if available
    let totalReach = 0;
    let totalImpressions = 0;
    
    mediaData.forEach(post => {
      if (post.insights && post.insights.data) {
        const reachMetric = post.insights.data.find((metric: any) => metric.name === 'reach');
        const impressionsMetric = post.insights.data.find((metric: any) => metric.name === 'impressions');
        
        if (reachMetric) totalReach += reachMetric.values[0]?.value || 0;
        if (impressionsMetric) totalImpressions += impressionsMetric.values[0]?.value || 0;
      }
    });

    // FIXED: Calculate engagement rate as proper percentage (0-100%)
    // Formula: (Total Engagements / Total Reach) * 100
    let avgEngagement = 0;
    if (totalReach > 0) {
      avgEngagement = (totalEngagements / totalReach) * 100;
      // Cap at reasonable maximum of 50% to prevent unrealistic values
      avgEngagement = Math.min(avgEngagement, 50);
    }

    console.log('[ENGAGEMENT CALCULATION] Debug:', {
      totalEngagements,
      totalReach,
      calculatedRate: avgEngagement,
      totalLikes,
      totalComments,
      postsCount: mediaData.length
    });

    return {
      totalLikes,
      totalComments,
      avgEngagement: Math.round(avgEngagement * 10) / 10, // Round to 1 decimal place
      totalReach,
      impressions: totalImpressions || totalReach,
      avgLikes: Math.round(totalLikes / mediaData.length),
      avgComments: Math.round(totalComments / mediaData.length)
    };
  }

  private async updateSocialAccountMetrics(workspaceId: string, metrics: any): Promise<void> {
    try {
      // Find Instagram account for this workspace
      const accounts = await this.storage.getSocialAccountsByWorkspace(workspaceId);
      const instagramAccount = accounts.find(acc => acc.platform === 'instagram');
      
      if (instagramAccount) {
        // Update with real Instagram metrics
        const updateData = {
          followers: metrics.followers || instagramAccount.followers,
          followingCount: metrics.following || instagramAccount.followingCount,
          mediaCount: metrics.mediaCount || instagramAccount.mediaCount,
          totalLikes: metrics.totalLikes || 0,
          totalComments: metrics.totalComments || 0,
          avgLikes: metrics.avgLikes || 0,
          avgComments: metrics.avgComments || 0,
          avgEngagement: metrics.avgEngagement || 0,
          totalReach: metrics.totalReach || 0,
          impressions: metrics.impressions || metrics.totalReach || 0,
          lastSyncAt: new Date(),
          updatedAt: new Date()
        };
        
        await this.storage.updateSocialAccount(instagramAccount.id, updateData);
        console.log('[INSTAGRAM SYNC] Updated account with metrics:', updateData);
      } else {
        console.log('[INSTAGRAM SYNC] No Instagram account found for workspace:', workspaceId);
      }
    } catch (error) {
      console.error('[INSTAGRAM SYNC] Error updating account metrics:', error);
      throw error;
    }
  }

  async schedulePeriodicSync(workspaceId: string, accessToken: string): Promise<void> {
    // Sync data every 15 minutes for real-time updates
    setInterval(async () => {
      try {
        await this.syncInstagramData(workspaceId, accessToken);
        console.log('[INSTAGRAM SYNC] Periodic sync completed for workspace:', workspaceId);
      } catch (error) {
        console.error('[INSTAGRAM SYNC] Periodic sync failed:', error);
      }
    }, 15 * 60 * 1000); // 15 minutes
  }
}