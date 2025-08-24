import { Request, Response } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { IStorage } from './storage';

// DM Template interface matching the MongoDB schema
interface DmTemplate {
  userId: string;
  workspaceId: string;
  messageText: string;
  buttonText: string;
  buttonUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Instagram webhook payload types
interface InstagramCommentWebhookPayload {
  object: 'instagram';
  entry: Array<{
    id: string; // Page ID
    time: number;
    changes: Array<{
      field: 'comments';
      value: {
        from: {
          id: string; // Instagram User ID
          username: string;
        };
        parent_id: string; // Post ID
        created_time: number;
        text: string;
        id: string; // Comment ID
      };
    }>;
  }>;
}

export class InstagramCommentWebhookHandler {
  private storage: IStorage;
  private DmTemplateModel: mongoose.Model<DmTemplate>;

  constructor(storage: IStorage) {
    this.storage = storage;
    this.DmTemplateModel = mongoose.model('DmTemplate');
  }

  /**
   * Handle GET webhook verification from Meta
   */
  async handleVerification(req: Request, res: Response): Promise<void> {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('[INSTAGRAM WEBHOOK] Verification request:', { mode, token });

    const verifyToken = process.env.VERIFY_TOKEN || process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
    
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('[INSTAGRAM WEBHOOK] Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.log('[INSTAGRAM WEBHOOK] Webhook verification failed - invalid token');
      res.sendStatus(403);
    }
  }

  /**
   * Handle POST webhook events from Instagram
   */
  async handleWebhookEvent(req: Request, res: Response): Promise<void> {
    try {
      const payload: InstagramCommentWebhookPayload = req.body;
      
      console.log('[INSTAGRAM WEBHOOK] Received webhook payload:', JSON.stringify(payload, null, 2));

      // Verify webhook signature for security
      const signature = req.headers['x-hub-signature-256'] as string;
      if (!this.verifyWebhookSignature(JSON.stringify(payload), signature)) {
        console.log('[INSTAGRAM WEBHOOK] Invalid signature - rejecting webhook');
        return res.sendStatus(403);
      }

      // Process Instagram comment events
      if (payload.object === 'instagram') {
        for (const entry of payload.entry) {
          await this.processInstagramEntry(entry);
        }
      }

      res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('[INSTAGRAM WEBHOOK] Error processing webhook:', error);
      res.status(500).send('Internal server error');
    }
  }

  /**
   * Process individual Instagram webhook entry
   */
  private async processInstagramEntry(entry: any): Promise<void> {
    console.log('[INSTAGRAM WEBHOOK] Processing entry:', entry.id);

    for (const change of entry.changes) {
      if (change.field === 'comments') {
        await this.processCommentEvent(entry.id, change.value);
      }
    }
  }

  /**
   * Process Instagram comment event and send dynamic DM
   */
  private async processCommentEvent(instagramAccountId: string, commentData: any): Promise<void> {
    try {
      console.log('[INSTAGRAM WEBHOOK] Processing comment from user:', commentData.from.id);

      // Find the workspace associated with this Instagram account ID
      let socialAccount = await this.storage.getSocialAccountByPageId(instagramAccountId);
      
      // If not found by pageId, try by accountId (Instagram Account ID)
      if (!socialAccount) {
        socialAccount = await this.storage.getSocialAccountByAccountId(instagramAccountId);
      }
      
      if (!socialAccount) {
        console.log('[INSTAGRAM WEBHOOK] No social account found for Instagram account ID:', instagramAccountId);
        return;
      }

      console.log('[INSTAGRAM WEBHOOK] Found workspace:', socialAccount.workspaceId);

      // Get DM template for this user/workspace
      const dmTemplate = await this.getDmTemplate(socialAccount.workspaceId);
      if (!dmTemplate) {
        console.log('[INSTAGRAM WEBHOOK] No DM template found for workspace:', socialAccount.workspaceId);
        return;
      }

      console.log('[INSTAGRAM WEBHOOK] Using DM template:', {
        messageText: dmTemplate.messageText,
        buttonText: dmTemplate.buttonText,
        buttonUrl: dmTemplate.buttonUrl
      });

      // Convert Instagram User ID to PSID (use pageId from account or fallback to accountId)
      const pageIdToUse = socialAccount.pageId || socialAccount.accountId || instagramAccountId;
      const psid = await this.convertToPSID(commentData.from.id, pageIdToUse, socialAccount);
      if (!psid) {
        console.log('[INSTAGRAM WEBHOOK] Failed to convert Instagram User ID to PSID');
        return;
      }

      console.log('[INSTAGRAM WEBHOOK] Converted to PSID:', psid);

      // Send dynamic button-style DM
      await this.sendDynamicMessage(
        psid,
        dmTemplate.messageText,
        dmTemplate.buttonText,
        dmTemplate.buttonUrl,
        socialAccount
      );

      console.log('[INSTAGRAM WEBHOOK] Dynamic DM sent successfully');

    } catch (error) {
      console.error('[INSTAGRAM WEBHOOK] Error processing comment event:', error);
    }
  }

  /**
   * Get DM template for workspace
   */
  private async getDmTemplate(workspaceId: string): Promise<DmTemplate | null> {
    try {
      console.log('[DM TEMPLATE DEBUG] Looking for template in workspace:', workspaceId);
      
      // Try the DmTemplateModel first
      let template = await this.DmTemplateModel.findOne({
        workspaceId: workspaceId,
        isActive: true
      }).sort({ createdAt: -1 }); // Get latest active template
      
      // If not found, try direct MongoDB connection with collection name
      if (!template) {
        console.log('[DM TEMPLATE DEBUG] Not found via DmTemplateModel, trying direct collection access...');
        const db = this.DmTemplateModel.db;
        const collection = db.collection('dmtemplates');
        template = await collection.findOne({
          workspaceId: workspaceId,
          isActive: true
        });
        console.log('[DM TEMPLATE DEBUG] Direct collection result:', template ? 'Found' : 'Not found');
      }

      if (template) {
        console.log('[DM TEMPLATE DEBUG] Found template:', {
          messageText: template.messageText?.substring(0, 50) + '...',
          buttonText: template.buttonText,
          buttonUrl: template.buttonUrl,
          isActive: template.isActive
        });
      } else {
        console.log('[DM TEMPLATE DEBUG] No active template found for workspace:', workspaceId);
      }

      return template;
    } catch (error) {
      console.error('[INSTAGRAM WEBHOOK] Error fetching DM template:', error);
      return null;
    }
  }

  /**
   * Convert Instagram User ID to PSID using Graph API
   */
  private async convertToPSID(instagramUserId: string, pageId: string, socialAccount?: any): Promise<string | null> {
    try {
      // Use the access token from the social account instead of environment variable
      let pageAccessToken = process.env.PAGE_ACCESS_TOKEN || process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
      
      // If no environment token, use the Instagram account's access token
      if (!pageAccessToken && socialAccount?.accessToken) {
        pageAccessToken = socialAccount.accessToken;
        console.log('[INSTAGRAM WEBHOOK] Using Instagram account access token for API calls');
      }
      
      if (!pageAccessToken) {
        throw new Error('No access token available - neither PAGE_ACCESS_TOKEN nor Instagram account token found');
      }

      const response = await fetch(
        `https://graph.facebook.com/v20.0/${pageId}?fields=connected_instagram_account&access_token=${pageAccessToken}`
      );

      if (!response.ok) {
        throw new Error(`Graph API error: ${response.status}`);
      }

      const data = await response.json();
      const instagramAccountId = data.connected_instagram_account?.id;

      if (!instagramAccountId) {
        throw new Error('No connected Instagram account found');
      }

      // Get PSID mapping
      const psidResponse = await fetch(
        `https://graph.facebook.com/v20.0/${instagramAccountId}?fields=instagram_accounts{instagram_business_account{id}}&access_token=${pageAccessToken}`
      );

      if (!psidResponse.ok) {
        throw new Error(`PSID conversion error: ${psidResponse.status}`);
      }

      const psidData = await psidResponse.json();
      
      // For Instagram comments, the PSID is typically the same as Instagram User ID
      // but this depends on your specific Meta app setup
      return instagramUserId;

    } catch (error) {
      console.error('[INSTAGRAM WEBHOOK] Error converting to PSID:', error);
      return null;
    }
  }

  /**
   * Send dynamic button-style message using Messenger Send API
   */
  private async sendDynamicMessage(
    psid: string,
    messageText: string,
    buttonText: string,
    buttonUrl: string,
    socialAccount?: any
  ): Promise<void> {
    try {
      // Use the access token from the social account instead of environment variable
      let pageAccessToken = process.env.PAGE_ACCESS_TOKEN || process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
      
      // If no environment token, use the Instagram account's access token
      if (!pageAccessToken && socialAccount?.accessToken) {
        pageAccessToken = socialAccount.accessToken;
        console.log('[INSTAGRAM WEBHOOK] Using Instagram account access token for sending DM');
      }
      
      if (!pageAccessToken) {
        throw new Error('No access token available for sending DM - neither PAGE_ACCESS_TOKEN nor Instagram account token found');
      }

      const messagePayload = {
        recipient: {
          id: psid
        },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: messageText,
              buttons: [
                {
                  type: 'web_url',
                  title: buttonText,
                  url: buttonUrl,
                  webview_height_ratio: 'compact'
                }
              ]
            }
          }
        }
      };

      console.log('[INSTAGRAM WEBHOOK] Sending message payload:', JSON.stringify(messagePayload, null, 2));

      const response = await fetch(
        `https://graph.facebook.com/v20.0/me/messages?access_token=${pageAccessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messagePayload)
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Messenger API error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('[INSTAGRAM WEBHOOK] Message sent successfully:', result);

    } catch (error) {
      console.error('[INSTAGRAM WEBHOOK] Error sending dynamic message:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature for security
   */
  private verifyWebhookSignature(payload: string, signature: string): boolean {
    // Skip signature verification in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[INSTAGRAM WEBHOOK] Development mode: bypassing signature verification');
      return true;
    }

    const appSecret = process.env.INSTAGRAM_APP_SECRET || process.env.FACEBOOK_APP_SECRET;
    if (!appSecret) {
      console.warn('[INSTAGRAM WEBHOOK] App secret not configured - cannot verify signature');
      return false;
    }

    if (!signature) {
      console.log('[INSTAGRAM WEBHOOK] No signature provided');
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', appSecret)
        .update(payload)
        .digest('hex');

      const receivedSignature = signature.replace('sha256=', '');
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(receivedSignature, 'hex')
      );
    } catch (error) {
      console.error('[INSTAGRAM WEBHOOK] Signature verification error:', error);
      return false;
    }
  }

  /**
   * Create or update DM template for a workspace
   */
  async createDmTemplate(
    userId: string,
    workspaceId: string,
    messageText: string,
    buttonText: string,
    buttonUrl: string
  ): Promise<DmTemplate> {
    try {
      // Deactivate existing templates for this workspace
      await this.DmTemplateModel.updateMany(
        { workspaceId: workspaceId },
        { isActive: false, updatedAt: new Date() }
      );

      // Create new active template
      const template = new this.DmTemplateModel({
        userId,
        workspaceId,
        messageText,
        buttonText,
        buttonUrl,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await template.save();
      console.log('[INSTAGRAM WEBHOOK] Created DM template for workspace:', workspaceId);
      
      return template;
    } catch (error) {
      console.error('[INSTAGRAM WEBHOOK] Error creating DM template:', error);
      throw error;
    }
  }

  /**
   * Get active DM template for workspace
   */
  async getActiveDmTemplate(workspaceId: string): Promise<DmTemplate | null> {
    try {
      const template = await this.DmTemplateModel.findOne({
        workspaceId: workspaceId,
        isActive: true
      }).sort({ createdAt: -1 });

      return template;
    } catch (error) {
      console.error('[INSTAGRAM WEBHOOK] Error fetching active DM template:', error);
      return null;
    }
  }

  /**
   * Update existing DM template
   */
  async updateDmTemplate(
    workspaceId: string,
    messageText: string,
    buttonText: string,
    buttonUrl: string
  ): Promise<DmTemplate | null> {
    try {
      const template = await this.DmTemplateModel.findOneAndUpdate(
        { workspaceId: workspaceId, isActive: true },
        { 
          messageText,
          buttonText,
          buttonUrl,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (template) {
        console.log('[INSTAGRAM WEBHOOK] Updated DM template for workspace:', workspaceId);
      }

      return template;
    } catch (error) {
      console.error('[INSTAGRAM WEBHOOK] Error updating DM template:', error);
      throw error;
    }
  }

  /**
   * Test the webhook system configuration
   */
  async testWebhookSystem(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req as any;
      
      console.log('[WEBHOOK TEST] Testing Instagram comment webhook system...');
      
      // Get user's workspace
      const workspaces = await this.storage.getWorkspacesByUserId(user.id);
      const defaultWorkspace = workspaces.find(w => w.isDefault) || workspaces[0];
      
      if (!defaultWorkspace) {
        return res.status(400).json({ error: 'No workspace found' });
      }
      
      // Check for Instagram accounts with pageId
      const socialAccounts = await this.storage.getSocialAccountsByWorkspace(defaultWorkspace.id);
      const instagramAccounts = socialAccounts.filter(acc => acc.platform === 'instagram' && acc.pageId);
      
      console.log('[WEBHOOK TEST] Found Instagram accounts:', instagramAccounts.map(acc => ({ username: acc.username, pageId: acc.pageId })));
      
      // Check environment variables
      const verifyToken = process.env.VERIFY_TOKEN || process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
      const pageAccessToken = process.env.PAGE_ACCESS_TOKEN || process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
      
      // Create test response
      const testResult = {
        success: true,
        message: 'Instagram comment webhook system status check complete',
        webhook: {
          verificationUrl: `${req.protocol}://${req.get('host')}/webhook/instagram-comments`,
          verifyToken: verifyToken ? 'Configured ✓' : 'Missing ✗',
          pageAccessToken: pageAccessToken ? 'Configured ✓' : 'Missing ✗'
        },
        workspace: {
          id: defaultWorkspace.id,
          name: defaultWorkspace.name
        },
        instagramAccounts: instagramAccounts.map(acc => ({
          username: acc.username,
          pageId: acc.pageId,
          hasAccessToken: !!acc.accessToken
        })),
        ready: !!(verifyToken && instagramAccounts.length > 0),
        setupSteps: [
          '1. Go to Meta for Developers (developers.facebook.com)',
          '2. Add webhook URL: ' + `${req.protocol}://${req.get('host')}/webhook/instagram-comments`,
          '3. Set verify token to your configured value',
          '4. Subscribe to "comments" field',
          '5. Test with a real Instagram comment'
        ]
      };
      
      console.log('[WEBHOOK TEST] Test completed successfully');
      res.json(testResult);
      
    } catch (error: any) {
      console.error('[WEBHOOK TEST] Error testing webhook system:', error);
      res.status(500).json({ error: error.message });
    }
  }
}