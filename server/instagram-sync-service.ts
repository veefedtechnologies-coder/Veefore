import type { IStorage } from './storage';

interface InstagramProfileData {
  id: string;
  username: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
  biography?: string;
  website?: string;
  profile_picture_url?: string;
  account_type?: 'PERSONAL' | 'BUSINESS' | 'CREATOR';
  is_business_account?: boolean;
  is_verified?: boolean;
}

interface InstagramMediaInsights {
  impressions?: number;
  reach?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
}

export class InstagramSyncService {
  constructor(private storage: IStorage) {}

  async syncInstagramAccountData(accountId: string, accessToken: string) {
    try {
      console.log(`[INSTAGRAM SYNC] Starting sync for account: ${accountId}`);
      
      // Fetch profile data
      const profileData = await this.fetchInstagramProfile(accountId, accessToken);
      console.log(`[INSTAGRAM SYNC] Profile data:`, {
        username: profileData.username,
        followers: profileData.followers_count,
        media: profileData.media_count
      });

      // Fetch recent media insights for engagement calculations
      const recentMedia = await this.fetchRecentMedia(accountId, accessToken);
      const engagementMetrics = await this.calculateEngagementMetrics(recentMedia, accessToken);
      
      console.log(`[INSTAGRAM SYNC] Engagement metrics:`, engagementMetrics);

      // Update social account with enhanced data
      await this.updateSocialAccountData(accountId, profileData, engagementMetrics);
      
      console.log(`[INSTAGRAM SYNC] Successfully synced account: ${profileData.username}`);
      return true;
    } catch (error) {
      console.error(`[INSTAGRAM SYNC] Error syncing account ${accountId}:`, error);
      return false;
    }
  }

  private async fetchInstagramProfile(accountId: string, accessToken: string): Promise<InstagramProfileData> {
    const fields = 'id,username,followers_count,follows_count,media_count,biography,website,profile_picture_url,account_type';
    const url = `https://graph.instagram.com/${accountId}?fields=${fields}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Instagram API error: ${data.error.message}`);
    }
    
    return data;
  }

  private async fetchRecentMedia(accountId: string, accessToken: string, limit: number = 25) {
    const fields = 'id,media_type,media_url,permalink,timestamp,like_count,comments_count';
    const url = `https://graph.instagram.com/${accountId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Instagram Media API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || [];
  }

  private async calculateEngagementMetrics(mediaList: any[], accessToken: string) {
    if (!mediaList.length) {
      return {
        avgLikes: 0,
        avgComments: 0,
        avgReach: 0,
        engagementRate: 0
      };
    }

    // Calculate averages from recent posts
    const totalLikes = mediaList.reduce((sum, media) => sum + (media.like_count || 0), 0);
    const totalComments = mediaList.reduce((sum, media) => sum + (media.comments_count || 0), 0);
    
    const avgLikes = Math.round(totalLikes / mediaList.length);
    const avgComments = Math.round(totalComments / mediaList.length);
    
    // Try to fetch insights for business accounts (reach data)
    let avgReach = 0;
    try {
      // For business accounts, we can get insights
      const reachData = await this.fetchMediaInsights(mediaList[0]?.id, accessToken);
      avgReach = reachData?.reach || 0;
    } catch (error) {
      console.log('[INSTAGRAM SYNC] Insights not available (likely personal account)');
    }

    // Calculate engagement rate (total engagement / followers * 100)
    const avgEngagement = avgLikes + avgComments;
    const engagementRate = avgReach > 0 ? Math.round((avgEngagement / avgReach) * 10000) : 0; // Store as basis points

    return {
      avgLikes,
      avgComments,
      avgReach,
      engagementRate
    };
  }

  private async fetchMediaInsights(mediaId: string, accessToken: string) {
    try {
      const metrics = 'impressions,reach,likes,comments,shares,saves';
      const url = `https://graph.instagram.com/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Insights API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert insights array to object
      const insights: any = {};
      data.data?.forEach((insight: any) => {
        insights[insight.name] = insight.values[0]?.value || 0;
      });
      
      return insights;
    } catch (error) {
      console.log('[INSTAGRAM SYNC] Media insights not available:', error.message);
      return null;
    }
  }

  private async updateSocialAccountData(accountId: string, profileData: InstagramProfileData, engagementMetrics: any) {
    // Find the social account by accountId
    const socialAccounts = await this.storage.getAllSocialAccounts();
    const account = socialAccounts.find(acc => acc.accountId === accountId);
    
    if (!account) {
      throw new Error(`Social account not found for accountId: ${accountId}`);
    }

    // Update with enhanced Instagram data
    const updateData = {
      followersCount: profileData.followers_count || 0,
      followingCount: profileData.follows_count || 0,
      mediaCount: profileData.media_count || 0,
      biography: profileData.biography || null,
      website: profileData.website || null,
      profilePictureUrl: profileData.profile_picture_url || null,
      accountType: profileData.account_type || 'PERSONAL',
      isBusinessAccount: profileData.account_type === 'BUSINESS' || profileData.account_type === 'CREATOR',
      isVerified: profileData.is_verified || false,
      avgLikes: engagementMetrics.avgLikes,
      avgComments: engagementMetrics.avgComments,
      avgReach: engagementMetrics.avgReach,
      engagementRate: engagementMetrics.engagementRate,
      lastSyncAt: new Date(),
      updatedAt: new Date()
    };

    // Update the social account with new data
    await this.storage.updateSocialAccount(account.id, updateData);
    
    console.log(`[INSTAGRAM SYNC] Updated account ${profileData.username} with:`, {
      followers: updateData.followersCount,
      avgLikes: updateData.avgLikes,
      engagementRate: `${(updateData.engagementRate / 100).toFixed(2)}%`
    });
  }

  async syncAllInstagramAccounts() {
    console.log('[INSTAGRAM SYNC] Starting sync for all Instagram accounts');
    
    const socialAccounts = await this.storage.getAllSocialAccounts();
    const instagramAccounts = socialAccounts.filter(acc => 
      acc.platform === 'instagram' && acc.isActive
    );

    console.log(`[INSTAGRAM SYNC] Found ${instagramAccounts.length} Instagram accounts to sync`);

    for (const account of instagramAccounts) {
      try {
        await this.syncInstagramAccountData(account.accountId, account.accessToken);
        // Add delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`[INSTAGRAM SYNC] Failed to sync ${account.username}:`, error);
      }
    }

    console.log('[INSTAGRAM SYNC] Completed sync for all accounts');
  }
}