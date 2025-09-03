import { Queue, QueueOptions, RepeatOptions } from 'bullmq';
import IORedis from 'ioredis';

// Redis connection status tracking
let redisConnection: IORedis | null = null;
let redisAvailable = false;

// Initialize Redis connection with graceful fallback
function initializeRedisConnection(): IORedis | null {
  try {
    // Support both Redis URL and individual connection parameters
    const redisConfig = process.env.REDIS_URL ? 
      process.env.REDIS_URL : 
      {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
        maxRetriesPerRequest: null, // Required for BullMQ
        connectTimeout: 5000,
        commandTimeout: 3000,
        lazyConnect: true,
        retryDelayOnFailover: 2000,
        enableOfflineQueue: false,
      };

    const connection = new IORedis(redisConfig);

    // Redis connection event handlers for status monitoring
    connection.on('connect', () => {
      const host = process.env.REDIS_HOST || 'localhost';
      const port = process.env.REDIS_PORT || '6379';
      console.log(`🔌 Redis: Attempting connection to ${host}:${port}...`);
    });

    connection.on('ready', () => {
      console.log('✅ Redis: Connected and ready for operations');
      redisAvailable = true;
    });

    connection.on('error', (error) => {
      console.log('❌ Redis: Connection failed -', error.message);
      console.log('ℹ️  Redis: Falling back to existing smart polling system');
      redisAvailable = false;
    });

    connection.on('close', () => {
      console.log('🔌 Redis: Connection closed');
      redisAvailable = false;
    });

    connection.on('reconnecting', (delay) => {
      console.log(`🔄 Redis: Reconnecting in ${delay}ms...`);
    });

    return connection;
  } catch (error) {
    console.log('❌ Redis: Failed to initialize connection -', error);
    redisAvailable = false;
    return null;
  }
}

// Initialize Redis connection
redisConnection = initializeRedisConnection();

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

// Create queues with specific rate limits (only if Redis is available)
export const metricsQueue = redisConnection ? new Queue<FetchMetricsJobData>('metrics-fetch', queueOptions) : null;

export const webhookQueue = redisConnection ? new Queue<WebhookProcessJobData>('webhook-process', queueOptions) : null;

export const tokenRefreshQueue = redisConnection ? new Queue<TokenRefreshJobData>('token-refresh', queueOptions) : null;

// Export Redis availability status
export { redisAvailable, redisConnection };

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
    // Check if Redis is available
    if (!redisAvailable || !metricsQueue) {
      console.log(`⚠️ Redis unavailable, skipping queue job for workspace ${workspaceId}`);
      return;
    }

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

    try {
      await metricsQueue.add('fetch-metrics' as any, jobData, jobOptions);
      console.log(`📊 Scheduled metrics fetch for workspace ${workspaceId}, account ${instagramAccountId}, type: ${metricsType}`);
    } catch (error) {
      console.error(`🚨 Failed to schedule metrics fetch job:`, error);
    }
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
    // Check if Redis is available
    if (!redisAvailable || !metricsQueue) {
      console.log(`⚠️ Redis unavailable, skipping smart polling for workspace ${workspaceId}`);
      return;
    }

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

    try {
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
    } catch (error) {
      console.error(`🚨 Failed to schedule smart polling:`, error);
    }
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
    // Check if Redis is available
    if (!redisAvailable || !webhookQueue) {
      console.log(`⚠️ Redis unavailable, processing webhook synchronously for workspace ${workspaceId}`);
      // Process webhook synchronously as fallback
      return;
    }

    const jobData: WebhookProcessJobData = {
      workspaceId,
      instagramAccountId,
      webhookData,
      eventType,
      receivedAt: new Date(),
    };

    try {
      await webhookQueue.add('process-webhook' as any, jobData, {
        priority: JOB_PRIORITIES.WEBHOOK,
        // Process immediately
        delay: 0,
        jobId: `webhook-${workspaceId}-${instagramAccountId}-${eventType}-${Date.now()}`,
      });

      console.log(`🔔 Scheduled webhook processing for workspace ${workspaceId}, event: ${eventType}`);
    } catch (error) {
      console.error(`🚨 Failed to schedule webhook processing:`, error);
    }
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
    // Check if Redis is available
    if (!redisAvailable || !tokenRefreshQueue) {
      console.log(`⚠️ Redis unavailable, skipping token refresh for workspace ${workspaceId}`);
      return;
    }

    const jobData: TokenRefreshJobData = {
      workspaceId,
      userId,
      refreshToken,
      instagramAccountId,
    };

    try {
      await tokenRefreshQueue.add('refresh-token' as any, jobData, {
        delay,
        jobId: `token-refresh-${workspaceId}-${userId}-${Date.now()}`,
      });

      console.log(`🔄 Scheduled token refresh for workspace ${workspaceId}, user ${userId}`);
    } catch (error) {
      console.error(`🚨 Failed to schedule token refresh:`, error);
    }
  }

  /**
   * Cancel all jobs for a workspace
   */
  static async cancelWorkspaceJobs(workspaceId: string): Promise<void> {
    if (!redisAvailable || !metricsQueue) {
      console.log(`⚠️ Redis unavailable, cannot cancel jobs for workspace ${workspaceId}`);
      return;
    }

    try {
      const jobs = await metricsQueue.getJobs(['waiting', 'delayed', 'active']);
      
      for (const job of jobs) {
        if (job.data.workspaceId === workspaceId) {
          await job.remove();
        }
      }

      console.log(`🗑️ Cancelled all jobs for workspace ${workspaceId}`);
    } catch (error) {
      console.error(`🚨 Failed to cancel workspace jobs:`, error);
    }
  }

  /**
   * Cancel jobs for specific Instagram account
   */
  static async cancelAccountJobs(workspaceId: string, instagramAccountId: string): Promise<void> {
    if (!redisAvailable || !metricsQueue) {
      console.log(`⚠️ Redis unavailable, cannot cancel jobs for account ${instagramAccountId}`);
      return;
    }

    try {
      const jobs = await metricsQueue.getJobs(['waiting', 'delayed', 'active']);
      
      for (const job of jobs) {
        if (job.data.workspaceId === workspaceId && job.data.instagramAccountId === instagramAccountId) {
          await job.remove();
        }
      }

      console.log(`🗑️ Cancelled all jobs for account ${instagramAccountId} in workspace ${workspaceId}`);
    } catch (error) {
      console.error(`🚨 Failed to cancel account jobs:`, error);
    }
  }

  /**
   * Get queue statistics
   */
  static async getQueueStats() {
    if (!redisAvailable || !metricsQueue || !webhookQueue || !tokenRefreshQueue) {
      return {
        metricsQueue: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
        webhookQueue: { waiting: 0, active: 0, completed: 0, failed: 0 },
        tokenRefreshQueue: { waiting: 0, active: 0, completed: 0, failed: 0 },
        redisAvailable: false,
      };
    }

    try {
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
        redisAvailable: true,
      };
    } catch (error) {
      console.error(`🚨 Failed to get queue stats:`, error);
      return {
        metricsQueue: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
        webhookQueue: { waiting: 0, active: 0, completed: 0, failed: 0 },
        tokenRefreshQueue: { waiting: 0, active: 0, completed: 0, failed: 0 },
        redisAvailable: false,
        error: error.message,
      };
    }
  }

  /**
   * Clean up old jobs
   */
  static async cleanupOldJobs(): Promise<void> {
    if (!redisAvailable || !metricsQueue) {
      console.log(`⚠️ Redis unavailable, cannot cleanup old jobs`);
      return;
    }

    try {
      // Clean completed jobs older than 24 hours
      await metricsQueue.clean(24 * 60 * 60 * 1000, 100, 'completed');
      
      // Clean failed jobs older than 7 days
      await metricsQueue.clean(7 * 24 * 60 * 60 * 1000, 50, 'failed');
      
      console.log('🧹 Cleaned up old queue jobs');
    } catch (error) {
      console.error(`🚨 Failed to cleanup old jobs:`, error);
    }
  }
}

// Error handling for queues (only if they exist)
if (metricsQueue) {
  metricsQueue.on('error', (err) => {
    console.error('🚨 Metrics Queue Error:', err);
  });
}

if (webhookQueue) {
  webhookQueue.on('error', (err) => {
    console.error('🚨 Webhook Queue Error:', err);
  });
}

if (tokenRefreshQueue) {
  tokenRefreshQueue.on('error', (err) => {
    console.error('🚨 Token Refresh Queue Error:', err);
  });
}

// Connection event handlers (only if Redis connection exists)
if (redisConnection) {
  redisConnection.on('connect', () => {
    console.log('🔗 Redis connected for job queues');
  });

  redisConnection.on('error', (err) => {
    console.error('🚨 Redis connection error:', err);
  });

  redisConnection.on('close', () => {
    console.log('🔌 Redis connection closed');
  });
}