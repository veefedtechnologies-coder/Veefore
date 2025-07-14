import { Express, Request, Response, NextFunction } from "express";
import { IStorage } from "./storage";
import { instagramAPI } from "./instagram-api";
import { videoGeneratorAI } from "./video-generator";
import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenerativeAI } from "@google/generative-ai";

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export async function registerRoutes(app: Express, storage: IStorage, upload?: any): Promise<Server> {
  // Middleware for authentication
  const requireAuth = async (req: any, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      console.log(`[AUTH DEBUG] ${req.method} ${req.path} - Headers: {
        authorization: '${authHeader ? 'Present' : 'Missing'}',
        userAgent: '${req.headers['user-agent']}',
        referer: '${req.headers.referer}'
      }`);

      if (!authHeader) {
        console.log(`[AUTH ERROR] Missing or invalid authorization header for ${req.path}`);
        console.log('Available headers:', Object.keys(req.headers));
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        console.log(`[AUTH ERROR] No token found in authorization header for ${req.path}`);
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Extract Firebase UID from JWT token payload
      let firebaseUid;
      try {
        // Decode JWT token (base64 decode the payload part)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        firebaseUid = payload.user_id || payload.sub;
        console.log(`[AUTH DEBUG] Extracted Firebase UID: ${firebaseUid} from JWT token`);
      } catch (error) {
        console.log(`[AUTH ERROR] Failed to decode JWT token:`, error);
        return res.status(401).json({ error: 'Invalid token format' });
      }
      
      let user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        console.log(`[AUTH DEBUG] Creating new user for Firebase UID: ${firebaseUid}`);
        // Create new user from JWT payload
        try {
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          const userData = {
            firebaseUid,
            email: payload.email || `user_${firebaseUid}@example.com`,
            username: payload.email?.split('@')[0] || `user_${firebaseUid.slice(0, 8)}`,
            displayName: payload.name || null,
            avatar: payload.picture || null,
            referredBy: null
          };
          
          user = await storage.createUser(userData);
          console.log(`[AUTH DEBUG] Created new user: ${user.id}`);
        } catch (error) {
          console.log(`[AUTH ERROR] Failed to create user:`, error);
          return res.status(500).json({ error: 'Failed to create user account' });
        }
      }

      console.log(`[AUTH DEBUG] User found: ${user.id} (${user.email})`);
      req.user = user;
      next();
    } catch (error) {
      console.error(`[AUTH ERROR] Authentication failed:`, error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  // Content creation and publishing
  app.post('/api/content', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const { workspaceId, title, description, type, platform, scheduledAt, publishNow, contentData } = req.body;

      console.log('[CONTENT API] Request body validation:', {
        workspaceId,
        workspaceIdType: typeof workspaceId,
        title,
        titleType: typeof title,
        hasWorkspaceId: !!workspaceId,
        hasTitle: !!title
      });

      if (!workspaceId || !title) {
        console.log('[CONTENT API] Validation failed - missing required fields');
        return res.status(400).json({ error: 'Workspace ID and title are required' });
      }

      console.log('[CONTENT API] Creating content:', { workspaceId, title, type, platform, scheduledAt, publishNow });

      // Create content in database
      const content = await storage.createContent({
        workspaceId: parseInt(workspaceId),
        title,
        description: description || null,
        type,
        platform: platform || 'instagram',
        contentData: contentData || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        creditsUsed: 1
      });

      // If publishNow is true, publish to Instagram immediately
      if (publishNow && platform === 'instagram' && contentData?.mediaUrl) {
        try {
          console.log('[CONTENT API] Publishing to Instagram immediately');
          
          const workspace = await storage.getDefaultWorkspace(user.id);
          if (workspace) {
            const instagramAccount = await storage.getSocialAccountByPlatform(workspace.id, 'instagram');
            
            if (instagramAccount && instagramAccount.accessToken) {
              try {
                console.log('[INSTAGRAM API] Attempting to publish with media URL:', contentData.mediaUrl);
                
                if (contentData.mediaUrl.startsWith('blob:')) {
                  throw new Error('Blob URLs cannot be published to Instagram. Please upload an image file.');
                }
                
                // Create Instagram media container
                const createMediaResponse = await fetch(`https://graph.instagram.com/v18.0/${instagramAccount.accountId}/media`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    image_url: contentData.mediaUrl,
                    caption: `${title}\n\n${description || ''}`,
                    access_token: instagramAccount.accessToken
                  })
                });

                console.log('[INSTAGRAM API] Create media response status:', createMediaResponse.status);
                
                if (!createMediaResponse.ok) {
                  const errorData = await createMediaResponse.json();
                  throw new Error(`Instagram API error: ${errorData.error?.message || 'Failed to create media container'}`);
                }

                const mediaData = await createMediaResponse.json();
                console.log('[INSTAGRAM API] Media container created:', mediaData.id);
                
                // Publish the media container
                const publishResponse = await fetch(`https://graph.instagram.com/v18.0/${instagramAccount.accountId}/media_publish`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    creation_id: mediaData.id,
                    access_token: instagramAccount.accessToken
                  })
                });

                console.log('[INSTAGRAM API] Publish response status:', publishResponse.status);

                if (!publishResponse.ok) {
                  const errorData = await publishResponse.json();
                  throw new Error(`Instagram publish error: ${errorData.error?.message || 'Failed to publish'}`);
                }

                const publishData = await publishResponse.json();
                console.log('[CONTENT API] Published to Instagram successfully:', publishData.id);
                
                // Update content status
                await storage.updateContent(content.id, {
                  publishedAt: new Date()
                });

                return res.json({
                  success: true,
                  content,
                  published: true,
                  instagramPostId: publishData.id,
                  message: 'Content published to Instagram successfully'
                });
              } catch (instagramError: any) {
                console.log('[CONTENT API] Instagram API error:', instagramError.message);
                return res.json({
                  success: true,
                  content,
                  published: false,
                  message: 'Content saved but Instagram publishing failed',
                  publishingError: instagramError.message
                });
              }
            }
          }
        } catch (error) {
          console.log('[CONTENT API] Publishing failed:', error);
        }
      }

      res.json({
        success: true,
        content,
        published: false,
        message: publishNow ? 'Content saved' : 'Content scheduled successfully'
      });

    } catch (error: any) {
      console.error('[CONTENT API] Error creating content:', error);
      res.status(500).json({ 
        error: 'Failed to create content',
        details: error.message 
      });
    }
  });

  // File upload endpoint
  app.post('/api/upload', requireAuth, upload?.single('file'), (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      res.json({
        success: true,
        fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed', details: error.message });
    }
  });

  // Get content list
  app.get('/api/content', requireAuth, async (req: any, res: Response) => {
    try {
      const { workspaceId, status } = req.query;
      
      if (!workspaceId) {
        return res.status(400).json({ error: 'Workspace ID is required' });
      }

      let content;
      if (status === 'scheduled') {
        content = await storage.getScheduledContent(parseInt(workspaceId));
      } else {
        content = await storage.getContentByWorkspace(parseInt(workspaceId));
      }
      
      res.json(content);
    } catch (error: any) {
      console.error('[CONTENT API] Error fetching content:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return require('http').createServer(app);
}