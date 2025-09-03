import express from 'express';
// Temporarily disabled for MVP
// import Metrics, { IMetrics } from '../models/Metrics';
// import TokenManager from '../services/tokenManager';
// import { MetricsQueueManager } from '../queues/metricsQueue';

const router = express.Router();

/**
 * GET /api/workspaces/:workspaceId/metrics
 * Returns cached metrics instantly and schedules background refresh
 */
router.get('/workspaces/:workspaceId/metrics', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { refresh = 'false', period = 'day', days = '7' } = req.query;

    console.log(`📊 Fetching metrics for workspace: ${workspaceId}`);

    // Validate workspace exists and user has access
    const workspace = await Workspace.findOne({ workspaceId });
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // TODO: Add user authorization check here
    // if (!workspace.members.includes(req.user.id)) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }

    // Get all Instagram accounts in this workspace
    const instagramUsers = await User.find({
      workspaceId,
      instagramToken: { $exists: true, $ne: null },
      tokenStatus: 'active'
    });

    if (instagramUsers.length === 0) {
      return res.status(200).json({
        metrics: [],
        summary: {
          totalAccounts: 0,
          totalFollowers: 0,
          totalLikes: 0,
          totalComments: 0,
          totalReach: 0,
          totalImpressions: 0,
          averageEngagementRate: 0,
        },
        lastUpdated: new Date(),
        message: 'No Instagram accounts connected to this workspace'
      });
    }

    // Get cached metrics for all accounts
    const accountIds = instagramUsers.map(user => user.instagramAccountId).filter(Boolean);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days as string));

    const metricsData = await Metrics.find({
      workspaceId,
      instagramAccountId: { $in: accountIds },
      period: period as string,
      startDate: { $gte: startDate }
    }).sort({ fetchedAt: -1 });

    // Group metrics by account and get latest for each
    const latestMetricsByAccount = new Map<string, IMetrics>();
    
    for (const metric of metricsData) {
      const accountId = metric.instagramAccountId;
      if (!latestMetricsByAccount.has(accountId) || 
          metric.fetchedAt > latestMetricsByAccount.get(accountId)!.fetchedAt) {
        latestMetricsByAccount.set(accountId, metric);
      }
    }

    const latestMetrics = Array.from(latestMetricsByAccount.values());

    // Calculate workspace summary metrics
    const summary = latestMetrics.reduce(
      (acc, metrics) => {
        acc.totalFollowers += metrics.followers || 0;
        acc.totalLikes += metrics.likes || 0;
        acc.totalComments += metrics.comments || 0;
        acc.totalReach += metrics.reach || 0;
        acc.totalImpressions += metrics.impressions || 0;
        
        if (metrics.engagementRate) {
          acc.engagementRateSum += metrics.engagementRate;
          acc.engagementRateCount++;
        }
        
        return acc;
      },
      {
        totalAccounts: latestMetrics.length,
        totalFollowers: 0,
        totalLikes: 0,
        totalComments: 0,
        totalReach: 0,
        totalImpressions: 0,
        engagementRateSum: 0,
        engagementRateCount: 0,
        averageEngagementRate: 0,
      }
    );

    // Calculate average engagement rate
    if (summary.engagementRateCount > 0) {
      summary.averageEngagementRate = summary.engagementRateSum / summary.engagementRateCount;
    }

    // Remove internal calculation fields
    const finalSummary = {
      totalAccounts: summary.totalAccounts,
      totalFollowers: summary.totalFollowers,
      totalLikes: summary.totalLikes,
      totalComments: summary.totalComments,
      totalReach: summary.totalReach,
      totalImpressions: summary.totalImpressions,
      averageEngagementRate: summary.averageEngagementRate,
    };

    // Calculate change percentages for summary
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);
    
    const yesterdayEnd = new Date(yesterdayStart);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const yesterdayMetrics = await Metrics.find({
      workspaceId,
      instagramAccountId: { $in: accountIds },
      period: 'day',
      startDate: { $gte: yesterdayStart, $lte: yesterdayEnd }
    });

    const yesterdaySummary = yesterdayMetrics.reduce(
      (acc, metrics) => {
        acc.totalFollowers += metrics.followers || 0;
        acc.totalLikes += metrics.likes || 0;
        acc.totalComments += metrics.comments || 0;
        acc.totalReach += metrics.reach || 0;
        acc.totalImpressions += metrics.impressions || 0;
        return acc;
      },
      { totalFollowers: 0, totalLikes: 0, totalComments: 0, totalReach: 0, totalImpressions: 0 }
    );

    // Calculate percentage changes
    const changes = {
      followers: calculatePercentageChange(summary.totalFollowers, yesterdaySummary.totalFollowers),
      likes: calculatePercentageChange(summary.totalLikes, yesterdaySummary.totalLikes),
      comments: calculatePercentageChange(summary.totalComments, yesterdaySummary.totalComments),
      reach: calculatePercentageChange(summary.totalReach, yesterdaySummary.totalReach),
      impressions: calculatePercentageChange(summary.totalImpressions, yesterdaySummary.totalImpressions),
    };

    // Schedule background refresh if requested or if data is stale
    const shouldScheduleRefresh = refresh === 'true' || hasStaleData(latestMetrics);
    
    if (shouldScheduleRefresh) {
      console.log(`🔄 Scheduling background metrics refresh for workspace ${workspaceId}`);
      
      for (const user of instagramUsers) {
        if (user.instagramAccountId && user.instagramToken) {
          await MetricsQueueManager.scheduleMetricsFetch(
            workspaceId,
            user.userId,
            user.instagramAccountId,
            user.instagramToken,
            'all',
            { priority: refresh === 'true' ? 5 : 15 } // Higher priority for manual refresh
          );
        }
      }
    }

    // Get last update time
    const lastUpdated = latestMetrics.length > 0 
      ? new Date(Math.max(...latestMetrics.map(m => m.lastUpdated.getTime())))
      : new Date();

    res.json({
      metrics: latestMetrics,
      summary: finalSummary,
      changes,
      lastUpdated,
      accounts: latestMetrics.map(m => ({
        instagramAccountId: m.instagramAccountId,
        instagramUsername: m.instagramUsername,
        followers: m.followers,
        engagementRate: m.engagementRate,
        lastUpdated: m.lastUpdated,
        dataStatus: m.dataStatus
      })),
      refreshScheduled: shouldScheduleRefresh,
      message: shouldScheduleRefresh ? 'Background refresh scheduled' : 'Serving cached data'
    });

  } catch (error) {
    console.error('🚨 Error fetching workspace metrics:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch metrics'
    });
  }
});

/**
 * GET /api/workspaces/:workspaceId/metrics/account/:accountId
 * Get detailed metrics for a specific Instagram account
 */
router.get('/workspaces/:workspaceId/metrics/account/:accountId', async (req, res) => {
  try {
    const { workspaceId, accountId } = req.params;
    const { period = 'day', limit = '30' } = req.query;

    console.log(`📊 Fetching account metrics: ${accountId} in workspace ${workspaceId}`);

    // Validate workspace and account access
    // Note: Using MongoDB storage directly since User model is in mongodb-storage.ts
    const { storage } = await import('../mongodb-storage');
    const users = await storage.getUsers();
    const user = users.find(u => u.workspaceId === workspaceId && u.instagramToken);

    if (!user) {
      return res.status(404).json({ error: 'Account not found in this workspace' });
    }

    // Get historical metrics for the account
    const metrics = await Metrics.find({
      workspaceId,
      instagramAccountId: accountId,
      period: period as string
    })
    .sort({ startDate: -1 })
    .limit(parseInt(limit as string));

    if (metrics.length === 0) {
      // Schedule a metrics fetch if no data exists
      if (user.instagramToken) {
        await MetricsQueueManager.scheduleMetricsFetch(
          workspaceId,
          user.userId,
          accountId,
          user.instagramToken,
          'all',
          { priority: 5, forceRefresh: true }
        );
      }

      return res.json({
        metrics: [],
        message: 'No metrics data available. Refresh scheduled.',
        refreshScheduled: true
      });
    }

    // Calculate trends
    const latest = metrics[0];
    const previous = metrics[1];
    
    const trends = previous ? {
      followers: latest.followers - previous.followers,
      likes: latest.likes - previous.likes,
      comments: latest.comments - previous.comments,
      reach: latest.reach - previous.reach,
      impressions: latest.impressions - previous.impressions,
      engagementRate: latest.engagementRate - previous.engagementRate,
    } : null;

    res.json({
      account: {
        instagramAccountId: accountId,
        instagramUsername: latest.instagramUsername,
      },
      latest,
      historical: metrics,
      trends,
      lastUpdated: latest.lastUpdated
    });

  } catch (error) {
    console.error('🚨 Error fetching account metrics:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch account metrics'
    });
  }
});

/**
 * POST /api/workspaces/:workspaceId/metrics/refresh
 * Force refresh metrics for all accounts in workspace
 */
router.post('/workspaces/:workspaceId/metrics/refresh', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { accounts } = req.body; // Optional: specific account IDs to refresh

    console.log(`🔄 Force refreshing metrics for workspace: ${workspaceId}`);

    // Validate workspace
    const workspace = await Workspace.findOne({ workspaceId });
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Get Instagram accounts to refresh
    let query: any = { workspaceId, instagramToken: { $exists: true, $ne: null } };
    if (accounts && Array.isArray(accounts)) {
      query.instagramAccountId = { $in: accounts };
    }

    const instagramUsers = await User.find(query);

    if (instagramUsers.length === 0) {
      return res.status(400).json({ error: 'No Instagram accounts found to refresh' });
    }

    // Schedule high-priority refresh jobs
    const scheduledJobs: Array<{ accountId: string; username: string }> = [];
    for (const user of instagramUsers) {
      if (user.instagramAccountId && user.instagramToken) {
        await MetricsQueueManager.scheduleMetricsFetch(
          workspaceId,
          user.userId,
          user.instagramAccountId,
          user.instagramToken,
          'all',
          { priority: 1, forceRefresh: true } // Highest priority
        );
        
        scheduledJobs.push({
          accountId: user.instagramAccountId!,
          username: user.instagramUsername || 'unknown'
        });
      }
    }

    res.json({
      message: `Scheduled refresh for ${scheduledJobs.length} accounts`,
      accounts: scheduledJobs,
      estimatedCompletionTime: new Date(Date.now() + (scheduledJobs.length * 30 * 1000)), // 30 seconds per account
    });

  } catch (error) {
    console.error('🚨 Error scheduling metrics refresh:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to schedule refresh'
    });
  }
});

/**
 * GET /api/workspaces/:workspaceId/metrics/status
 * Get refresh status and token statistics
 */
router.get('/workspaces/:workspaceId/metrics/status', async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Get token statistics
    const tokenStats = TokenManager.getWorkspaceTokenStats(workspaceId);

    // Get queue statistics
    const queueStats = await MetricsQueueManager.getQueueStats();

    // Check if workspace has available quota
    const hasQuota = await TokenManager.hasAvailableQuota(workspaceId);

    res.json({
      workspaceId,
      tokens: tokenStats,
      queues: queueStats,
      hasAvailableQuota: hasQuota,
      lastCheck: new Date()
    });

  } catch (error) {
    console.error('🚨 Error fetching metrics status:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch status'
    });
  }
});

/**
 * Helper function to calculate percentage change
 */
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 100) / 100; // Round to 2 decimal places
}

/**
 * Helper function to check if data is stale
 */
function hasStaleData(metrics: IMetrics[]): boolean {
  if (metrics.length === 0) return true;
  
  const now = new Date();
  const staleTreshold = 30 * 60 * 1000; // 30 minutes
  
  return metrics.some(metric => {
    const ageInMs = now.getTime() - metric.lastUpdated.getTime();
    return ageInMs > staleTreshold;
  });
}

export default router;