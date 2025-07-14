import type { Express } from "express";
import { createServer, type Server } from "http";
import { getAuthenticHashtags } from "./authentic-hashtags";

export async function registerRoutes(app: Express, storage: any): Promise<Server> {
  const requireAuth = async (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    next();
  };

  // Clean hashtags endpoint that only returns authentic Instagram data
  app.get("/api/hashtags/trending", requireAuth, async (req: any, res: any) => {
    try {
      const { category = 'all' } = req.query;
      const userId = req.user.id;
      
      // Get user's workspace
      const workspaces = await storage.getWorkspacesByUserId(userId);
      const defaultWorkspace = workspaces.find((w: any) => w.isDefault) || workspaces[0];
      
      if (!defaultWorkspace) {
        return res.json([]);
      }

      // Get connected Instagram accounts only
      const instagramAccounts = await storage.getSocialAccountsByWorkspace(defaultWorkspace.id);
      const connectedInstagramAccounts = instagramAccounts.filter((acc: any) => 
        acc.platform === 'instagram' && acc.accessToken
      );

      if (connectedInstagramAccounts.length === 0) {
        console.log('[HASHTAGS] No connected Instagram accounts found');
        return res.json([]);
      }

      // Get authentic hashtags from connected Instagram accounts
      const authenticHashtags = await getAuthenticHashtags(defaultWorkspace.id, category);
      
      console.log('[HASHTAGS] Returning', authenticHashtags.length, 'authentic hashtags');
      res.json(authenticHashtags);

    } catch (error) {
      console.error('[HASHTAGS] Error fetching authentic hashtags:', error);
      res.status(500).json({ error: 'Failed to fetch authentic hashtags' });
    }
  });

  // Chat performance endpoint
  app.get("/api/chat-performance", requireAuth, async (req: any, res: any) => {
    try {
      const userId = req.user.id;
      const { workspaceId } = req.query;

      // Return empty performance data for now
      res.json([]);

    } catch (error) {
      console.error('[CHAT PERFORMANCE] Error analyzing chat performance:', error);
      res.status(500).json({ error: 'Failed to analyze chat performance' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}