import express from 'express';
import crypto from 'crypto';
// Temporarily disabled for MVP
// import { MetricsQueueManager } from '../queues/metricsQueue';

const router = express.Router();

// Middleware to verify Instagram webhook signature
const verifyWebhookSignature = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const signature = req.headers['x-hub-signature-256'] as string;
    const payload = JSON.stringify(req.body);
    
    // Get webhook secret from environment or database
    const webhookSecret = process.env.INSTAGRAM_WEBHOOK_SECRET || 'default-webhook-secret';
    
    if (!signature) {
      console.warn('⚠️ Webhook received without signature');
      return res.status(401).json({ error: 'Missing signature' });
    }

    // Verify signature with proper buffer length handling
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');
    
    const receivedSignature = signature.replace('sha256=', '');

    // Ensure both signatures are the same length before comparison
    if (expectedSignature.length !== receivedSignature.length) {
      console.error('🚨 Webhook signature length mismatch');
      return res.status(401).json({ error: 'Invalid signature length' });
    }

    if (!crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(receivedSignature))) {
      console.error('🚨 Webhook signature verification failed');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('✅ Webhook signature verified');
    next();
  } catch (error) {
    console.error('🚨 Webhook signature verification error:', error);
    res.status(500).json({ error: 'Signature verification failed' });
  }
};

/**
 * GET /api/webhooks/instagram
 * Webhook verification endpoint for Instagram
 */
router.get('/instagram', (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'veefore-webhook-token';

    console.log('🔔 Instagram webhook verification request received');
    console.log('Mode:', mode);
    console.log('Token received:', token);
    console.log('Expected token:', verifyToken);
    console.log('Challenge:', challenge);

    // Verify the webhook - be more flexible with token comparison
    if (mode === 'subscribe' && token && token.toString() === verifyToken) {
      console.log('✅ Instagram webhook verified successfully');
      res.status(200).send(challenge?.toString() || 'OK');
    } else {
      console.error('❌ Instagram webhook verification failed');
      console.error(`Expected: mode='subscribe' && token='${verifyToken}'`);
      console.error(`Received: mode='${mode}' && token='${token}'`);
      res.status(403).json({ error: 'Webhook verification failed' });
    }
  } catch (error) {
    console.error('🚨 Webhook verification error:', error);
    res.status(500).json({ error: 'Verification error' });
  }
});

/**
 * POST /api/webhooks/instagram
 * Handle Instagram webhook events
 */
router.post('/instagram', verifyWebhookSignature, async (req, res) => {
  try {
    const { object, entry } = req.body;

    console.log('🔔 Instagram webhook event received');
    console.log('Object:', object);
    console.log('Entry count:', entry?.length || 0);

    // Acknowledge receipt immediately
    res.status(200).json({ status: 'received' });

    // Process webhook events asynchronously
    if (object === 'instagram' && entry && Array.isArray(entry)) {
      for (const entryItem of entry) {
        await processWebhookEntry(entryItem);
      }
    } else {
      console.warn('⚠️ Unknown webhook object type:', object);
    }

  } catch (error) {
    console.error('🚨 Error processing webhook:', error);
    // Still return 200 to avoid Instagram retrying
    res.status(200).json({ status: 'error', message: 'Processing failed' });
  }
});

/**
 * Process individual webhook entry
 */
async function processWebhookEntry(entry: any): Promise<void> {
  try {
    const { id: instagramAccountId, changes } = entry;

    if (!instagramAccountId || !changes || !Array.isArray(changes)) {
      console.warn('⚠️ Invalid webhook entry format');
      return;
    }

    console.log(`📱 Processing webhook for Instagram account: ${instagramAccountId}`);

    // Find the user for this Instagram account using storage
    const { storage } = await import('../mongodb-storage');
    const users = await storage.getUsers();
    const user = users.find(u => u.instagramAccountId === instagramAccountId);
    if (!user) {
      console.warn(`⚠️ No user found for Instagram account: ${instagramAccountId}`);
      return;
    }

    const workspaceId = user.workspaceId;
    if (!workspaceId) {
      console.warn(`⚠️ No workspace found for user: ${user.userId}`);
      return;
    }

    // Process each change in the entry
    for (const change of changes) {
      await processWebhookChange(user.workspaceId, instagramAccountId, change);
    }

  } catch (error) {
    console.error('🚨 Error processing webhook entry:', error);
  }
}

/**
 * Process individual webhook change
 */
async function processWebhookChange(
  workspaceId: string, 
  instagramAccountId: string, 
  change: any
): Promise<void> {
  try {
    const { field, value } = change;

    console.log(`🔄 Processing webhook change - Field: ${field}, Account: ${instagramAccountId}`);

    switch (field) {
      case 'comments':
        await handleCommentWebhook(workspaceId, instagramAccountId, value);
        break;

      case 'mentions':
        await handleMentionWebhook(workspaceId, instagramAccountId, value);
        break;

      case 'story_insights':
        await handleStoryInsightsWebhook(workspaceId, instagramAccountId, value);
        break;

      case 'messages':
        await handleMessageWebhook(workspaceId, instagramAccountId, value);
        break;

      case 'media':
        await handleMediaUpdateWebhook(workspaceId, instagramAccountId, value);
        break;

      case 'account_review_status':
        await handleAccountReviewWebhook(workspaceId, instagramAccountId, value);
        break;

      case 'live_comments':
        await handleLiveCommentWebhook(workspaceId, instagramAccountId, value);
        break;

      default:
        console.log(`ℹ️ Unhandled webhook field: ${field}`);
        // Still queue a general metrics update
        await MetricsQueueManager.processWebhookEvent(
          workspaceId,
          instagramAccountId,
          { field, value },
          'generic'
        );
    }

  } catch (error) {
    console.error('🚨 Error processing webhook change:', error);
  }
}

/**
 * Handle comment webhook events
 */
async function handleCommentWebhook(
  workspaceId: string,
  instagramAccountId: string,
  value: any
): Promise<void> {
  console.log(`💬 Processing comment webhook for account: ${instagramAccountId}`);

  // Queue webhook processing job
  await MetricsQueueManager.processWebhookEvent(
    workspaceId,
    instagramAccountId,
    {
      type: 'comment',
      media_id: value.media_id,
      comment_id: value.id,
      text: value.text,
      created_time: value.created_time,
      from: value.from
    },
    'comments'
  );

  console.log(`✅ Comment webhook queued for processing`);
}

/**
 * Handle mention webhook events
 */
async function handleMentionWebhook(
  workspaceId: string,
  instagramAccountId: string,
  value: any
): Promise<void> {
  console.log(`@️ Processing mention webhook for account: ${instagramAccountId}`);

  await MetricsQueueManager.processWebhookEvent(
    workspaceId,
    instagramAccountId,
    {
      type: 'mention',
      media_id: value.media_id,
      comment_id: value.comment_id,
      mention_id: value.id
    },
    'mentions'
  );

  console.log(`✅ Mention webhook queued for processing`);
}

/**
 * Handle story insights webhook events
 */
async function handleStoryInsightsWebhook(
  workspaceId: string,
  instagramAccountId: string,
  value: any
): Promise<void> {
  console.log(`📱 Processing story insights webhook for account: ${instagramAccountId}`);

  await MetricsQueueManager.processWebhookEvent(
    workspaceId,
    instagramAccountId,
    {
      type: 'story_insights',
      media_id: value.media_id,
      insights: value.insights
    },
    'story_insights'
  );

  console.log(`✅ Story insights webhook queued for processing`);
}

/**
 * Handle message webhook events (Instagram Direct)
 */
async function handleMessageWebhook(
  workspaceId: string,
  instagramAccountId: string,
  value: any
): Promise<void> {
  console.log(`💌 Processing message webhook for account: ${instagramAccountId}`);

  await MetricsQueueManager.processWebhookEvent(
    workspaceId,
    instagramAccountId,
    {
      type: 'message',
      messaging: value.messaging,
      recipient: value.recipient,
      sender: value.sender,
      timestamp: value.timestamp
    },
    'messages'
  );

  console.log(`✅ Message webhook queued for processing`);
}

/**
 * Handle media update webhook events
 */
async function handleMediaUpdateWebhook(
  workspaceId: string,
  instagramAccountId: string,
  value: any
): Promise<void> {
  console.log(`📸 Processing media update webhook for account: ${instagramAccountId}`);

  await MetricsQueueManager.processWebhookEvent(
    workspaceId,
    instagramAccountId,
    {
      type: 'media_update',
      media_id: value.media_id,
      media_type: value.media_type,
      created_time: value.created_time
    },
    'media_updates'
  );

  console.log(`✅ Media update webhook queued for processing`);
}

/**
 * Handle account review webhook events
 */
async function handleAccountReviewWebhook(
  workspaceId: string,
  instagramAccountId: string,
  value: any
): Promise<void> {
  console.log(`🔍 Processing account review webhook for account: ${instagramAccountId}`);

  await MetricsQueueManager.processWebhookEvent(
    workspaceId,
    instagramAccountId,
    {
      type: 'account_review',
      review_status: value.review_status,
      reviewer_name: value.reviewer_name
    },
    'account_review_update'
  );

  console.log(`✅ Account review webhook queued for processing`);
}

/**
 * Handle live comment webhook events
 */
async function handleLiveCommentWebhook(
  workspaceId: string,
  instagramAccountId: string,
  value: any
): Promise<void> {
  console.log(`🔴 Processing live comment webhook for account: ${instagramAccountId}`);

  await MetricsQueueManager.processWebhookEvent(
    workspaceId,
    instagramAccountId,
    {
      type: 'live_comment',
      live_video_id: value.live_video_id,
      comment_id: value.id,
      text: value.text,
      user: value.user
    },
    'live_comments'
  );

  console.log(`✅ Live comment webhook queued for processing`);
}

/**
 * GET /api/webhooks/status
 * Get webhook status and configuration
 */
router.get('/status', async (req, res) => {
  try {
    const webhookUrl = process.env.WEBHOOK_URL || `${req.protocol}://${req.get('host')}/api/webhooks/instagram`;
    
    res.json({
      status: 'active',
      webhook_url: webhookUrl,
      supported_events: [
        'comments',
        'mentions', 
        'story_insights',
        'messages',
        'media',
        'account_review_status',
        'live_comments'
      ],
      configuration: {
        signature_verification: 'enabled',
        async_processing: 'enabled',
        retry_policy: 'exponential_backoff'
      },
      last_check: new Date()
    });
  } catch (error) {
    console.error('🚨 Error fetching webhook status:', error);
    res.status(500).json({ error: 'Failed to fetch webhook status' });
  }
});

export default router;