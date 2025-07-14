import { Express, Request, Response, NextFunction } from "express";
import { IStorage } from "./storage";
import { instagramAPI } from "./instagram-api";
import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export async function registerRoutes(app: Express, storage: IStorage): Promise<Server> {
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

      const firebaseUid = token.split('_')[0];
      console.log(`[AUTH DEBUG] Looking up user with Firebase UID: ${firebaseUid}`);
      
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        console.log(`[AUTH ERROR] User not found for Firebase UID: ${firebaseUid}`);
        return res.status(401).json({ error: 'User not found' });
      }

      console.log(`[AUTH DEBUG] User found: ${user._id} (${user.email})`);
      req.user = user;
      next();
    } catch (error) {
      console.error(`[AUTH ERROR] Authentication failed:`, error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  // Dashboard analytics with real-time Instagram data
  app.get("/api/dashboard/analytics", requireAuth, async (req: any, res) => {
    try {
      const user = req.user;
      const userId = typeof user.id === 'string' ? user.id : Number(user.id);
      const workspaces = await storage.getWorkspacesByUserId(userId);
      
      let defaultWorkspace;
      if (workspaces.length === 0) {
        defaultWorkspace = await storage.createWorkspace({
          userId: userId,
          name: "My VeeFore Workspace",
          description: "Default workspace for content creation"
        });
      } else {
        defaultWorkspace = workspaces[0];
      }

      // Always fetch fresh Instagram data for real-time updates
      if (INSTAGRAM_ACCESS_TOKEN) {
        console.log(`[LIVE UPDATE] Fetching current Instagram metrics`);
        
        try {
          const userProfile = await instagramAPI.getUserProfile(INSTAGRAM_ACCESS_TOKEN);
          const userMedia = await instagramAPI.getUserMedia(INSTAGRAM_ACCESS_TOKEN, 25);
          
          const totalEngagement = userMedia.reduce((sum, media) => {
            const likes = media.like_count || 0;
            const comments = media.comments_count || 0;
            return sum + likes + comments;
          }, 0);
          
          const liveData = {
            totalViews: 0,
            engagement: totalEngagement,
            totalFollowers: userProfile.followers_count,
            newFollowers: userProfile.followers_count,
            contentScore: 85,
            platforms: [{
              platform: 'instagram',
              views: 0,
              engagement: totalEngagement,
              followers: userProfile.followers_count,
              posts: userMedia.length
            }]
          };
          
          console.log(`[LIVE UPDATE] Current Instagram: ${userProfile.followers_count} followers, ${totalEngagement} engagement`);
          
          await storage.createAnalytics({
            workspaceId: defaultWorkspace.id,
            platform: 'instagram',
            date: new Date(),
            metrics: {
              followers: userProfile.followers_count,
              follower_count: userProfile.followers_count,
              engagement: totalEngagement,
              likes: totalEngagement,
              views: 0,
              impressions: 0,
              comments: 0,
              shares: 0,
              reach: 0
            }
          });
          
          res.setHeader('Cache-Control', 'no-cache');
          return res.json(liveData);
          
        } catch (error) {
          console.log(`[LIVE UPDATE] Instagram API error:`, error);
        }
      }
      
      // Fallback to latest database data
      const analytics = await storage.getAnalytics(defaultWorkspace.id, undefined, 1);
      if (analytics.length > 0) {
        const latestRecord = analytics[0];
        const latestMetrics = latestRecord?.metrics as any;
        
        const fallbackData = {
          totalViews: latestMetrics?.views || 0,
          engagement: latestMetrics?.engagement || latestMetrics?.likes || 0,
          totalFollowers: latestMetrics?.followers || latestMetrics?.follower_count || 0,
          newFollowers: latestMetrics?.followers || latestMetrics?.follower_count || 0,
          contentScore: 85,
          platforms: [{
            platform: latestRecord.platform,
            views: latestMetrics?.views || 0,
            engagement: latestMetrics?.engagement || latestMetrics?.likes || 0,
            followers: latestMetrics?.followers || latestMetrics?.follower_count || 0,
            posts: 1
          }]
        };
        
        return res.json(fallbackData);
      }
      
      res.json({
        totalViews: 0,
        engagement: 0,
        totalFollowers: 0,
        newFollowers: 0,
        contentScore: 85,
        platforms: []
      });
      
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create HTTP server and WebSocket server
  const httpServer = app.listen(5000, "0.0.0.0", () => {
    console.log("Server running on port 5000");
  });

  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message: Buffer) => {
      console.log('Received message:', message.toString());
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}