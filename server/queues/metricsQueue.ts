import { Queue, QueueOptions, RepeatOptions } from 'bullmq';
import IORedis from 'ioredis';

// Redis connection configuration with status monitoring
const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null, // Required for BullMQ
  connectTimeout: 5000,
  commandTimeout: 3000,
  lazyConnect: true,
  retryDelayOnFailover: 2000,
  enableOfflineQueue: false,
});

// Redis connection event handlers for status monitoring
redisConnection.on('connect', () => {
  console.log('🔌 Redis: Attempting connection to localhost:6379...');
});

redisConnection.on('ready', () => {
  console.log('✅ Redis: Connected and ready for operations');
});

redisConnection.on('error', (error) => {
  console.log('❌ Redis: Connection failed -', error.message);
  console.log('ℹ️  Redis: Falling back to existing smart polling system');
});

redisConnection.on('close', () => {
  console.log('🔌 Redis: Connection closed');
});

redisConnection.on('reconnecting', (delay) => {
  console.log(`🔄 Redis: Reconnecting in ${delay}ms...`);
});

// Queue configuration with rate limiting
const queueOptions: QueueOptions = {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 50, // Keep last 50 failed jobs
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
};

// Job data interfaces
export interface FetchMetricsJobData {
  workspaceId: string;
  userId: string;
  instagramAccountId: string;
  token: string;
  metricsType: 'followers' | 'likes' | 'comments' | 'reach' | 'impressions' | 'all';
  priority?: number;
  forceRefresh?: boolean;
}

export interface WebhookProcessJobData {
  workspaceId: string;
  instagramAccountId: string;
  webhookData: any;
  eventType: string;
  receivedAt: Date;
}

export interface TokenRefreshJobData {
  workspaceId: string;
  userId: string;
  refreshToken: string;
  instagramAccountId: string;
}

// Create queues with specific rate limits
export const metricsQueue = new Queue<FetchMetricsJobData>('metrics-fetch', queueOptions);

export const webhookQueue = new Queue<WebhookProcessJobData>('webhook-process', queueOptions);

export const tokenRefreshQueue = new Queue<TokenRefreshJobData>('token-refresh', queueOptions);

// Job priority levels
export const JOB_PRIORITIES = {
  WEBHOOK: 1, // Highest priority - real-time
  MANUAL_REFRESH: 5, // High priority - user requested
  SMART_POLLING_DYNAMIC: 10, // Medium priority - likes, comments
  SMART_POLLING_STABLE: 15, // Lower priority - followers, impressions
  BACKGROUND_SYNC: 20, // Lowest priority - scheduled maintenance
} as const;

// Smart polling intervals (in minutes)
export const POLLING_INTERVALS = {
  followers: 60, // 1 hour - stable metric
  likes: 15, // 15 minutes - dynamic metric
  comments: 10, // 10 minutes - dynamic metric  
  reach: 30, // 30 minutes
  impressions: 45, // 45 minutes
  stories: 20, // 20 minutes
  profile_views: 120, // 2 hours
} as const;

// Queue management functions
export class MetricsQueueManager {
  
  /**
   * Schedule metrics fetch job for a workspace
   */
  static async scheduleMetricsFetch(
    workspaceId: string,
    userId: string,
    instagramAccountId: string,
    token: string,
    metricsType: FetchMetricsJobData['metricsType'] = 'all',
    options: {
      priority?: number;
      delay?: number;
      forceRefresh?: boolean;
    } = {}
  ): Promise<void> {
    const jobData: FetchMetricsJobData = {
      workspaceId,
      userId,
      instagramAccountId,
      token,
      metricsType,
      priority: options.priority || JOB_PRIORITIES.SMART_POLLING_STABLE,
      forceRefresh: options.forceRefresh || false,
    };

    const jobOptions = {
      priority: options.priority || JOB_PRIORITIES.SMART_POLLING_STABLE,
      delay: options.delay || 0,
      // Rate limiting per workspace
      jobId: `${workspaceId}-${instagramAccountId}-${metricsType}-${Date.now()}`,
    };

    await metricsQueue.add('fetch-metrics' as any, jobData, jobOptions);
    console.log(`📊 Scheduled metrics fetch for workspace ${workspaceId}, account ${instagramAccountId}, type: ${metricsType}`);
  }

  /**
   * Schedule smart polling jobs with adaptive intervals
   */
  static async scheduleSmartPolling(
    workspaceId: string,
    userId: string,
    instagramAccountId: string,
    token: string,
    accountActivity: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<void> {
    const activityMultiplier = {
      high: 0.5, // Poll more frequently for active accounts
      medium: 1,
      low: 2, // Poll less frequently for inactive accounts
    };

    const multiplier = activityMultiplier[accountActivity];

    // Schedule different metrics with adaptive intervals
    const metricsSchedule = [
      { type: 'followers' as const, interval: POLLING_INTERVALS.followers * multiplier, priority: JOB_PRIORITIES.SMART_POLLING_STABLE },
      { type: 'likes' as const, interval: POLLING_INTERVALS.likes * multiplier, priority: JOB_PRIORITIES.SMART_POLLING_DYNAMIC },
      { type: 'comments' as const, interval: POLLING_INTERVALS.comments * multiplier, priority: JOB_PRIORITIES.SMART_POLLING_DYNAMIC },
      { type: 'reach' as const, interval: POLLING_INTERVALS.reach * multiplier, priority: JOB_PRIORITIES.SMART_POLLING_STABLE },
      { type: 'impressions' as const, interval: POLLING_INTERVALS.impressions * multiplier, priority: JOB_PRIORITIES.SMART_POLLING_STABLE },
    ];

    for (const metric of metricsSchedule) {
      const repeatOptions: RepeatOptions = {
        pattern: `*/${Math.max(1, Math.floor(metric.interval))} * * * *`, // Every X minutes
        key: `smart-poll-${workspaceId}-${instagramAccountId}-${metric.type}`,
      };

      await metricsQueue.add(
        'fetch-metrics' as any,
        {
          workspaceId,
          userId,
          instagramAccountId,
          token,
          metricsType: metric.type,
          priority: metric.priority,
        },
        {
          repeat: repeatOptions,
          priority: metric.priority,
          jobId: `smart-poll-${workspaceId}-${instagramAccountId}-${metric.type}`,
        }
      );
    }

    console.log(`🔄 Scheduled smart polling for workspace ${workspaceId}, account ${instagramAccountId}, activity: ${accountActivity}`);
  }

  /**
   * Process webhook event immediately
   */
  static async processWebhookEvent(
    workspaceId: string,
    instagramAccountId: string,
    webhookData: any,
    eventType: string
  ): Promise<void> {
    const jobData: WebhookProcessJobData = {
      workspaceId,
      instagramAccountId,
      webhookData,
      eventType,
      receivedAt: new Date(),
    };

    await webhookQueue.add('process-webhook' as any, jobData, {
      priority: JOB_PRIORITIES.WEBHOOK,
      // Process immediately
      delay: 0,
      jobId: `webhook-${workspaceId}-${instagramAccountId}-${eventType}-${Date.now()}`,
    });

    console.log(`🔔 Scheduled webhook processing for workspace ${workspaceId}, event: ${eventType}`);
  }

  /**
   * Schedule token refresh
   */
  static async scheduleTokenRefresh(
    workspaceId: string,
    userId: string,
    refreshToken: string,
    instagramAccountId: string,
    delay: number = 0
  ): Promise<void> {
    const jobData: TokenRefreshJobData = {
      workspaceId,
      userId,
      refreshToken,
      instagramAccountId,
    };

    await tokenRefreshQueue.add('refresh-token' as any, jobData, {
      delay,
      jobId: `token-refresh-${workspaceId}-${userId}-${Date.now()}`,
    });

    console.log(`🔄 Scheduled token refresh for workspace ${workspaceId}, user ${userId}`);
  }

  /**
   * Cancel all jobs for a workspace
   */
  static async cancelWorkspaceJobs(workspaceId: string): Promise<void> {
    const jobs = await metricsQueue.getJobs(['waiting', 'delayed', 'active']);
    
    for (const job of jobs) {
      if (job.data.workspaceId === workspaceId) {
        await job.remove();
      }
    }

    console.log(`🗑️ Cancelled all jobs for workspace ${workspaceId}`);
  }

  /**
   * Cancel jobs for specific Instagram account
   */
  static async cancelAccountJobs(workspaceId: string, instagramAccountId: string): Promise<void> {
    const jobs = await metricsQueue.getJobs(['waiting', 'delayed', 'active']);
    
    for (const job of jobs) {
      if (job.data.workspaceId === workspaceId && job.data.instagramAccountId === instagramAccountId) {
        await job.remove();
      }
    }

    console.log(`🗑️ Cancelled all jobs for account ${instagramAccountId} in workspace ${workspaceId}`);
  }

  /**
   * Get queue statistics
   */
  static async getQueueStats() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      metricsQueue.getWaiting(),
      metricsQueue.getActive(),
      metricsQueue.getCompleted(),
      metricsQueue.getFailed(),
      metricsQueue.getDelayed(),
    ]);

    return {
      metricsQueue: {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
      },
      webhookQueue: {
        waiting: (await webhookQueue.getWaiting()).length,
        active: (await webhookQueue.getActive()).length,
        completed: (await webhookQueue.getCompleted()).length,
        failed: (await webhookQueue.getFailed()).length,
      },
      tokenRefreshQueue: {
        waiting: (await tokenRefreshQueue.getWaiting()).length,
        active: (await tokenRefreshQueue.getActive()).length,
        completed: (await tokenRefreshQueue.getCompleted()).length,
        failed: (await tokenRefreshQueue.getFailed()).length,
      },
    };
  }

  /**
   * Clean up old jobs
   */
  static async cleanupOldJobs(): Promise<void> {
    // Clean completed jobs older than 24 hours
    await metricsQueue.clean(24 * 60 * 60 * 1000, 100, 'completed');
    
    // Clean failed jobs older than 7 days
    await metricsQueue.clean(7 * 24 * 60 * 60 * 1000, 50, 'failed');
    
    console.log('🧹 Cleaned up old queue jobs');
  }
}

// Error handling for queues
metricsQueue.on('error', (err) => {
  console.error('🚨 Metrics Queue Error:', err);
});

webhookQueue.on('error', (err) => {
  console.error('🚨 Webhook Queue Error:', err);
});

tokenRefreshQueue.on('error', (err) => {
  console.error('🚨 Token Refresh Queue Error:', err);
});

// Connection event handlers
redisConnection.on('connect', () => {
  console.log('🔗 Redis connected for job queues');
});

redisConnection.on('error', (err) => {
  console.error('🚨 Redis connection error:', err);
});

redisConnection.on('close', () => {
  console.log('🔌 Redis connection closed');
});

export { redisConnection };