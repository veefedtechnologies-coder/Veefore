import axios, { AxiosResponse, AxiosError } from 'axios';

// Instagram Graph API configuration
const INSTAGRAM_GRAPH_API_BASE = 'https://graph.instagram.com';
const INSTAGRAM_GRAPH_API_VERSION = 'v18.0';
const FACEBOOK_GRAPH_API_BASE = 'https://graph.facebook.com';

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 2000; // 2 seconds base delay

// Interface definitions for API responses
export interface InstagramAccountInfo {
  id: string;
  username: string;
  name?: string;
  biography?: string;
  website?: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  profile_picture_url?: string;
  account_type?: 'PERSONAL' | 'BUSINESS' | 'CREATOR';
}

export interface InstagramMediaItem {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'STORY';
  media_url?: string;
  permalink?: string;
  thumbnail_url?: string;
  timestamp: string;
  caption?: string;
  like_count?: number;
  comments_count?: number;
  is_shared_to_feed?: boolean;
}

export interface InstagramInsights {
  impressions?: number;
  reach?: number;
  profile_views?: number;
  website_clicks?: number;
  follower_count?: number;
  email_contacts?: number;
  phone_call_clicks?: number;
  text_message_clicks?: number;
  get_directions_clicks?: number;
}

export interface InstagramMediaInsights {
  impressions?: number;
  reach?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  video_views?: number;
  engagement?: number;
}

// Error interface
export interface InstagramApiError {
  code: number;
  message: string;
  type: string;
  fbtrace_id?: string;
  is_rate_limit?: boolean;
  retry_after?: number;
}

export class InstagramApiService {
  private static lastRequestTime: Map<string, number> = new Map();

  /**
   * Enforce rate limiting per token
   */
  private static async enforceRateLimit(token: string): Promise<void> {
    const lastRequest = this.lastRequestTime.get(token) || 0;
    const timeSinceLastRequest = Date.now() - lastRequest;
    
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      const delayNeeded = RATE_LIMIT_DELAY - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delayNeeded));
    }
    
    this.lastRequestTime.set(token, Date.now());
  }

  /**
   * Make a request to Instagram Graph API with retry logic
   */
  private static async makeApiRequest<T>(
    url: string,
    token: string,
    retryCount: number = 0
  ): Promise<T> {
    try {
      // Enforce rate limiting
      await this.enforceRateLimit(token);

      const response: AxiosResponse<T> = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'VeeFore/1.0',
        },
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      // Handle rate limiting (429 errors)
      if (axiosError.response?.status === 429) {
        const retryAfter = parseInt(axiosError.response.headers['retry-after'] || '60');
        
        if (retryCount < MAX_RETRIES) {
          console.log(`🚦 Rate limited. Retrying after ${retryAfter} seconds. Attempt ${retryCount + 1}/${MAX_RETRIES}`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          return this.makeApiRequest(url, token, retryCount + 1);
        }
        
        throw {
          code: 429,
          message: 'Rate limit exceeded',
          type: 'OAuthException',
          is_rate_limit: true,
          retry_after: retryAfter,
        } as InstagramApiError;
      }

      // Handle other errors with exponential backoff
      if (axiosError.response?.status && axiosError.response.status >= 500 && retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY_BASE * Math.pow(2, retryCount);
        console.log(`🔄 Server error. Retrying in ${delay}ms. Attempt ${retryCount + 1}/${MAX_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeApiRequest(url, token, retryCount + 1);
      }

      // Handle Instagram API errors
      if (axiosError.response?.data) {
        const apiError = axiosError.response.data as any;
        throw {
          code: apiError.error?.code || axiosError.response.status,
          message: apiError.error?.message || 'Instagram API error',
          type: apiError.error?.type || 'APIError',
          fbtrace_id: apiError.error?.fbtrace_id,
          is_rate_limit: false,
        } as InstagramApiError;
      }

      throw {
        code: axiosError.response?.status || 500,
        message: axiosError.message || 'Network error',
        type: 'NetworkError',
        is_rate_limit: false,
      } as InstagramApiError;
    }
  }

  /**
   * Get Instagram account information
   */
  static async getAccountInfo(token: string): Promise<InstagramAccountInfo> {
    const fields = [
      'id',
      'username', 
      'name',
      'biography',
      'website',
      'followers_count',
      'follows_count', 
      'media_count',
      'profile_picture_url',
      'account_type'
    ].join(',');

    const url = `${INSTAGRAM_GRAPH_API_BASE}/me?fields=${fields}&access_token=${token}`;
    return this.makeApiRequest<InstagramAccountInfo>(url, token);
  }

  /**
   * Get account insights (requires Business or Creator account)
   */
  static async getAccountInsights(
    accountId: string,
    token: string,
    period: 'day' | 'week' | 'days_28' = 'day',
    since?: Date,
    until?: Date
  ): Promise<InstagramInsights> {
    const metrics = [
      'impressions',
      'reach', 
      'profile_views',
      'website_clicks',
      'follower_count'
    ];

    let url = `${FACEBOOK_GRAPH_API_BASE}/${INSTAGRAM_GRAPH_API_VERSION}/${accountId}/insights?metric=${metrics.join(',')}&period=${period}&access_token=${token}`;
    
    if (since) {
      url += `&since=${Math.floor(since.getTime() / 1000)}`;
    }
    if (until) {
      url += `&until=${Math.floor(until.getTime() / 1000)}`;
    }

    const response = await this.makeApiRequest<any>(url, token);
    
    // Transform insights data
    const insights: InstagramInsights = {};
    if (response.data) {
      response.data.forEach((insight: any) => {
        if (insight.values && insight.values.length > 0) {
          const latestValue = insight.values[insight.values.length - 1];
          insights[insight.name as keyof InstagramInsights] = latestValue.value;
        }
      });
    }

    return insights;
  }

  /**
   * Get user's media (posts)
   */
  static async getUserMedia(
    token: string,
    limit: number = 25,
    after?: string
  ): Promise<{ data: InstagramMediaItem[]; paging?: any }> {
    const fields = [
      'id',
      'media_type',
      'media_url',
      'permalink',
      'thumbnail_url',
      'timestamp',
      'caption',
      'like_count',
      'comments_count',
      'is_shared_to_feed'
    ].join(',');

    let url = `${INSTAGRAM_GRAPH_API_BASE}/me/media?fields=${fields}&limit=${limit}&access_token=${token}`;
    
    if (after) {
      url += `&after=${after}`;
    }

    return this.makeApiRequest<{ data: InstagramMediaItem[]; paging?: any }>(url, token);
  }

  /**
   * Get insights for specific media
   */
  static async getMediaInsights(
    mediaId: string,
    token: string,
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'STORY' = 'IMAGE'
  ): Promise<InstagramMediaInsights> {
    let metrics: string[];

    if (mediaType === 'VIDEO') {
      metrics = ['impressions', 'reach', 'likes', 'comments', 'shares', 'saves', 'video_views'];
    } else if (mediaType === 'STORY') {
      metrics = ['impressions', 'reach', 'replies', 'taps_forward', 'taps_back', 'exits'];
    } else {
      metrics = ['impressions', 'reach', 'likes', 'comments', 'shares', 'saves'];
    }

    const url = `${FACEBOOK_GRAPH_API_BASE}/${INSTAGRAM_GRAPH_API_VERSION}/${mediaId}/insights?metric=${metrics.join(',')}&access_token=${token}`;
    
    const response = await this.makeApiRequest<any>(url, token);
    
    // Transform insights data
    const insights: InstagramMediaInsights = {};
    if (response.data) {
      response.data.forEach((insight: any) => {
        if (insight.values && insight.values.length > 0) {
          insights[insight.name as keyof InstagramMediaInsights] = insight.values[0].value;
        }
      });
    }

    return insights;
  }

  /**
   * Get recent media with insights (last 7 days)
   */
  static async getRecentMediaWithInsights(
    token: string,
    days: number = 7
  ): Promise<Array<InstagramMediaItem & { insights?: InstagramMediaInsights }>> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    // Get recent media
    const mediaResponse = await this.getUserMedia(token, 50);
    
    // Filter media from last X days
    const recentMedia = mediaResponse.data.filter(media => {
      const mediaDate = new Date(media.timestamp);
      return mediaDate >= sinceDate;
    });

    // Get insights for each media item
    const mediaWithInsights = await Promise.allSettled(
      recentMedia.map(async (media) => {
        try {
          const insights = await this.getMediaInsights(media.id, token, media.media_type);
          return { ...media, insights };
        } catch (error) {
          console.warn(`⚠️ Could not fetch insights for media ${media.id}:`, error);
          return media;
        }
      })
    );

    return mediaWithInsights
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value);
  }

  /**
   * Refresh Instagram access token
   */
  static async refreshAccessToken(token: string): Promise<{ access_token: string; token_type: string }> {
    const url = `${FACEBOOK_GRAPH_API_BASE}/${INSTAGRAM_GRAPH_API_VERSION}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;
    
    return this.makeApiRequest<{ access_token: string; token_type: string }>(url, token);
  }

  /**
   * Validate Instagram access token
   */
  static async validateToken(token: string): Promise<{ is_valid: boolean; scopes?: string[]; expires_at?: number }> {
    try {
      const url = `${FACEBOOK_GRAPH_API_BASE}/debug_token?input_token=${token}&access_token=${token}`;
      const response = await this.makeApiRequest<any>(url, token);
      
      return {
        is_valid: response.data?.is_valid || false,
        scopes: response.data?.scopes,
        expires_at: response.data?.expires_at,
      };
    } catch (error) {
      return { is_valid: false };
    }
  }

  /**
   * Get comprehensive metrics for dashboard
   */
  static async getComprehensiveMetrics(
    token: string,
    accountId?: string,
    days: number = 7
  ): Promise<{
    account: InstagramAccountInfo;
    insights: InstagramInsights;
    recentMedia: Array<InstagramMediaItem & { insights?: InstagramMediaInsights }>;
    aggregated: {
      totalLikes: number;
      totalComments: number;
      totalShares: number;
      totalSaves: number;
      totalReach: number;
      totalImpressions: number;
      averageEngagementRate: number;
    };
  }> {
    try {
      // Get account info
      const account = await this.getAccountInfo(token);
      
      // Get account insights (if Business/Creator account)
      let insights: InstagramInsights = {};
      if (accountId && (account.account_type === 'BUSINESS' || account.account_type === 'CREATOR')) {
        try {
          insights = await this.getAccountInsights(accountId, token, 'day');
        } catch (error) {
          console.warn('⚠️ Could not fetch account insights:', error);
        }
      }

      // Get recent media with insights
      const recentMedia = await this.getRecentMediaWithInsights(token, days);

      // Calculate aggregated metrics
      const aggregated = recentMedia.reduce(
        (acc, media) => {
          acc.totalLikes += media.like_count || 0;
          acc.totalComments += media.comments_count || 0;
          acc.totalShares += media.insights?.shares || 0;
          acc.totalSaves += media.insights?.saves || 0;
          acc.totalReach += media.insights?.reach || 0;
          acc.totalImpressions += media.insights?.impressions || 0;
          return acc;
        },
        {
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
          totalSaves: 0,
          totalReach: 0,
          totalImpressions: 0,
          averageEngagementRate: 0,
        }
      );

      // Calculate average engagement rate
      if (recentMedia.length > 0 && account.followers_count > 0) {
        const totalEngagements = aggregated.totalLikes + aggregated.totalComments + aggregated.totalShares + aggregated.totalSaves;
        aggregated.averageEngagementRate = (totalEngagements / (account.followers_count * recentMedia.length)) * 100;
      }

      return {
        account,
        insights,
        recentMedia,
        aggregated,
      };
    } catch (error) {
      console.error('🚨 Error fetching comprehensive metrics:', error);
      throw error;
    }
  }

  /**
   * Check if token has required permissions
   */
  static async checkTokenPermissions(token: string): Promise<string[]> {
    try {
      const validation = await this.validateToken(token);
      return validation.scopes || [];
    } catch (error) {
      console.error('🚨 Error checking token permissions:', error);
      return [];
    }
  }
}

export default InstagramApiService;