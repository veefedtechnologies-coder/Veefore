import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { MongoStorage } from "./mongodb-storage";
import { startSchedulerService } from "./scheduler-service";
import { AutoSyncService } from "./auto-sync-service";
// Re-enabling for comprehensive testing
import MetricsWorker from "./workers/metricsWorker";
import RealtimeService from "./services/realtime";
import Logger from "./utils/logger";
import metricsRoutes from "./routes/metrics";
import webhooksRoutes from "./routes/webhooks";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  initializeRateLimiting, 
  globalRateLimiter, 
  authRateLimiter,
  apiRateLimiter,
  uploadRateLimiter,
  bruteForceMiddleware,
  passwordResetRateLimiter,
  socialMediaRateLimiter
} from "./middleware/rate-limiting-working";
import { xssProtectionMiddleware, enhancedXssHeaders } from "./middleware/xss-protection";
import { cleanupTempFiles } from "./middleware/file-upload-security";
import { 
  corsSecurityMiddleware, 
  strictCorsMiddleware, 
  apiCorsMiddleware, 
  corsMetricsMiddleware,
  corsContentSecurityPolicy,
  emergencyCorsLockdown 
} from "./middleware/cors-security";
import { 
  initializeKeyManagement, 
  secretsValidationMiddleware, 
  keyManagementHeaders 
} from "./middleware/key-management";

// Production-safe log function
let log: (message: string, source?: string) => void;

// Fallback log function for production
const fallbackLog = (message: string, source = "express") => {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit", 
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
};

// Dynamic imports for production-safe Vite setup
let setupVite: any = null;
let serveStatic: any = null;

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

// P1-6 SECURITY: Initialize comprehensive key management system
const keyManagementSystem = initializeKeyManagement();

const app = express();

// P1-3 SECURITY: Trust proxy for correct req.ip behind load balancers
app.set('trust proxy', 1);

// P1-5 SECURITY: Emergency CORS lockdown check (highest priority)
app.use(emergencyCorsLockdown);

// P1-5 SECURITY: CORS metrics and monitoring
app.use(corsMetricsMiddleware);

// P1-5 SECURITY: Main CORS security middleware
app.use(corsSecurityMiddleware({
  allowCredentials: true,
  maxAge: 86400, // 24 hours preflight cache
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset', 'X-Total-Count'],
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-CSRF-Token', 'X-Workspace-ID']
}));

// P1-5 SECURITY: CSP integration with CORS policy
app.use(corsContentSecurityPolicy);

app.use(helmet({
  // P1-2: HTTP Strict Transport Security (HSTS) - Production only
  strictTransportSecurity: isProduction ? {
    maxAge: 63072000, // 2 years (required for HSTS preload list)
    includeSubDomains: true,
    preload: true
  } : false, // Disable for localhost development

  // P1-2: Enhanced Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      
      // P1-4.3: Enhanced script execution policy for XSS protection
      scriptSrc: [
        "'self'",
        // SECURITY: Development only unsafe directives
        ...(isDevelopment ? ["'unsafe-inline'", "'unsafe-eval'"] : []),
        // Trusted Firebase/Google services
        "https://fonts.googleapis.com",
        "https://www.google.com", 
        "https://www.gstatic.com",
        "https://apis.google.com",
        "https://identitytoolkit.googleapis.com",
        "https://securetoken.googleapis.com",
        "https://accounts.google.com",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        // Payment services
        "https://js.stripe.com",
        "https://checkout.stripe.com",
        // Dynamic imports
        "blob:"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "data:"
      ],
      imgSrc: [
        "'self'",
        "https:",
        "data:",
        "blob:",
        "https://scontent-sea1-1.cdninstagram.com",
        "https://scontent-sea1-2.cdninstagram.com",
        "https://scontent-sea1-3.cdninstagram.com",
        "https://scontent-sea1-4.cdninstagram.com",
        "https://scontent-sea1-5.cdninstagram.com",
        "https://scontent-ams2-1.cdninstagram.com",
        "https://scontent-ams2-2.cdninstagram.com",
        "https://scontent-ams2-3.cdninstagram.com",
        "https://scontent-ams2-4.cdninstagram.com",
        "https://scontent-ams2-5.cdninstagram.com",
        "https://scontent-lhr8-1.cdninstagram.com",
        "https://scontent-lhr8-2.cdninstagram.com",
        "https://scontent-lhr8-3.cdninstagram.com",
        "https://scontent-lhr8-4.cdninstagram.com",
        "https://scontent-lhr8-5.cdninstagram.com",
        "https://instagram.fixc1-1.fna.fbcdn.net",
        "https://instagram.fixc1-2.fna.fbcdn.net",
        "https://instagram.fixc1-3.fna.fbcdn.net",
        "https://instagram.fixc1-4.fna.fbcdn.net",
        "https://instagram.fixc1-5.fna.fbcdn.net",
        "https://lh3.googleusercontent.com"
      ],
      mediaSrc: [
        "'self'",
        "https:",
        "blob:",
        "https://*.fbcdn.net",
        "https://*.cdninstagram.com",
        "https://instagram.fixc1-1.fna.fbcdn.net",
        "https://instagram.fixc1-2.fna.fbcdn.net",
        "https://instagram.fixc1-3.fna.fbcdn.net",
        "https://instagram.fixc1-4.fna.fbcdn.net",
        "https://instagram.fixc1-5.fna.fbcdn.net",
        "https://scontent-sea1-1.cdninstagram.com",
        "https://scontent-sea1-2.cdninstagram.com",
        "https://scontent-sea1-3.cdninstagram.com",
        "https://scontent-sea1-4.cdninstagram.com",
        "https://scontent-sea1-5.cdninstagram.com",
        "https://scontent-ams2-1.cdninstagram.com",
        "https://scontent-ams2-2.cdninstagram.com",
        "https://scontent-ams2-3.cdninstagram.com",
        "https://scontent-ams2-4.cdninstagram.com",
        "https://scontent-ams2-5.cdninstagram.com",
        "https://scontent-lhr8-1.cdninstagram.com",
        "https://scontent-lhr8-2.cdninstagram.com",
        "https://scontent-lhr8-3.cdninstagram.com",
        "https://scontent-lhr8-4.cdninstagram.com",
        "https://scontent-lhr8-5.cdninstagram.com"
      ],
      connectSrc: [
        "'self'",
        "https:",
        "wss:",
        "ws:",
        "https://identitytoolkit.googleapis.com",
        "https://securetoken.googleapis.com",
        "https://graph.instagram.com",
        "https://api.instagram.com",
        "https://veefore-b84c8.firebaseapp.com",
        "https://*.firebaseapp.com",
        "https://*.googleapis.com"
      ],
      frameSrc: [
        "'self'",
        "https://www.google.com",
        "https://accounts.google.com",
        "https://veefore-b84c8.firebaseapp.com",
        "https://*.firebaseapp.com",
        "https://*.googleapis.com"
      ],
      
      // P1-2: Enhanced security directives
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"], // Prevent framing (clickjacking protection)
      
      // Worker and manifest support
      workerSrc: ["'self'", "blob:"],
      manifestSrc: ["'self'"],
      
      // Production-only security enhancements
      ...(isProduction ? { upgradeInsecureRequests: [] } : {})
    },
    // P1-2: CSP violation reporting (development only)
    reportOnly: isDevelopment
  },

  // P1-2: Enhanced frame protection
  frameguard: { action: 'deny' }, // More restrictive than default 'sameorigin'
  
  // P1-2: Enhanced cross-origin policies
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginEmbedderPolicy: { policy: "credentialless" }, // Less restrictive than require-corp
  
  // P1-2: Additional security headers
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  
  // P1-2: Permissions Policy (replaces Feature-Policy)
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: ["'self'"],
    payment: [],
    usb: [],
    magnetometer: [],
    gyroscope: [],
    accelerometer: [],
    "picture-in-picture": ["'self'"],
    "fullscreen": ["'self'"]
  },
  
  // P1-2: DNS prefetch control
  dnsPrefetchControl: { allow: false },
  
  // P1-2: Content type options
  noSniff: true,
  
  // P1-2: Download options (IE8+ security)
  ieNoOpen: true,
  
  // P1-2: Disable X-XSS-Protection (deprecated, CSP is better)
  xssFilter: false
}));

// P1 SECURITY: Secure cookie parser for HTTP-only authentication cookies
app.use((req: any, res, next) => {
  req.cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie: string) => {
      const trimmed = cookie.trim();
      const equalIndex = trimmed.indexOf('=');
      if (equalIndex > 0) {
        // SECURITY FIX: Handle values containing '=' correctly
        const name = trimmed.substring(0, equalIndex);
        const value = trimmed.substring(equalIndex + 1);
        req.cookies[name] = decodeURIComponent(value);
      }
    });
  }
  next();
});

// P1-3 SECURITY: Apply global rate limiting to all requests
// P1-3 SECURITY: Apply global rate limiting only to API routes, not static assets
app.use('/api', globalRateLimiter);

// P1-5 SECURITY: API-specific CORS protection with enhanced validation
app.use('/api', apiCorsMiddleware);

// P1-6 SECURITY: Key management and secrets validation
app.use('/api', secretsValidationMiddleware());
app.use('/api/oauth', keyManagementHeaders());
app.use('/api/admin', keyManagementHeaders());

// P1-4.3 SECURITY: XSS Protection middleware
app.use(enhancedXssHeaders());
app.use('/api', xssProtectionMiddleware({ sanitizeBody: true, sanitizeQuery: true, sanitizeParams: true }));

// P1-4.4 SECURITY: File upload cleanup service
setInterval(() => {
  cleanupTempFiles(24 * 60 * 60 * 1000); // Clean files older than 24 hours
}, 60 * 60 * 1000); // Run every hour

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Fix body parsing middleware for content creation
app.use((req, res, next) => {
  if (req.path.startsWith('/api/content') && req.method === 'POST') {
    console.log('[BODY DEBUG] Raw body:', req.body);
    console.log('[BODY DEBUG] Content-Type:', req.headers['content-type']);
    console.log('[BODY DEBUG] Content-Length:', req.headers['content-length']);
    
    // Fix double-stringified body issue
    if (req.body && typeof req.body === 'object' && req.body.body && typeof req.body.body === 'string') {
      try {
        req.body = JSON.parse(req.body.body);
        console.log('[BODY DEBUG] Fixed double-stringified body');
      } catch (parseError) {
        console.error('[BODY DEBUG] Failed to parse nested body:', parseError);
      }
    }
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Load Vite modules conditionally
  try {
    if (!isProduction) {
      console.log('[DEV] Loading Vite modules for development...');
      const viteModule = await import("./vite");
      log = viteModule.log;
      setupVite = viteModule.setupVite;
      serveStatic = viteModule.serveStatic;
      console.log('[DEV] Vite modules loaded successfully');
    } else {
      console.log('[PRODUCTION] Using production mode - Vite modules not loaded');
      log = fallbackLog;
    }
  } catch (error) {
    console.warn('[WARN] Vite modules not available, using fallback log function:', (error as Error).message);
    log = fallbackLog;
  }
  
  const storage = new MongoStorage();
  await storage.connect();
  
  // Database reset endpoint for fresh starts
  app.post('/api/admin/reset-database', async (req, res) => {
    try {
      console.log('🔄 Starting complete database reset...');
      
      // Wait for storage to be connected
      await storage.connect();
      
      let totalDeleted = 0;
      const resetResults: Array<{ collection: string; deleted: number }> = [];
      
      // Clear all data through the storage interface
      try {
        // Clear users
        const userResult = await storage.clearAllUsers();
        if (userResult > 0) {
          console.log(`🗑️  Cleared users: ${userResult} documents`);
          resetResults.push({ collection: 'users', deleted: userResult });
          totalDeleted += userResult;
        }
      } catch (error) {
        console.log(`⚠️  Error clearing users: ${(error as Error).message}`);
      }
      
      try {
        // Clear waitlist users
        const waitlistResult = await storage.clearAllWaitlistUsers();
        if (waitlistResult > 0) {
          console.log(`🗑️  Cleared waitlist_users: ${waitlistResult} documents`);
          resetResults.push({ collection: 'waitlist_users', deleted: waitlistResult });
          totalDeleted += waitlistResult;
        }
      } catch (error) {
        console.log(`⚠️  Error clearing waitlist_users: ${(error as Error).message}`);
      }
      
      try {
        // Clear workspaces
        const workspaceResult = await storage.clearAllWorkspaces();
        if (workspaceResult > 0) {
          console.log(`🗑️  Cleared workspaces: ${workspaceResult} documents`);
          resetResults.push({ collection: 'workspaces', deleted: workspaceResult });
          totalDeleted += workspaceResult;
        }
      } catch (error) {
        console.log(`⚠️  Error clearing workspaces: ${(error as Error).message}`);
      }
      
      try {
        // Clear social accounts
        const socialResult = await storage.clearAllSocialAccounts();
        if (socialResult > 0) {
          console.log(`🗑️  Cleared social_accounts: ${socialResult} documents`);
          resetResults.push({ collection: 'social_accounts', deleted: socialResult });
          totalDeleted += socialResult;
        }
      } catch (error) {
        console.log(`⚠️  Error clearing social_accounts: ${(error as Error).message}`);
      }
      
      try {
        // Clear content
        const contentResult = await storage.clearAllContent();
        if (contentResult > 0) {
          console.log(`🗑️  Cleared content: ${contentResult} documents`);
          resetResults.push({ collection: 'content', deleted: contentResult });
          totalDeleted += contentResult;
        }
      } catch (error) {
        console.log(`⚠️  Error clearing content: ${(error as Error).message}`);
      }
      
      console.log(`✅ DATABASE RESET COMPLETED - Total documents deleted: ${totalDeleted}`);
      
      res.json({
        success: true,
        message: 'Database reset completed successfully',
        totalDeleted,
        resetResults,
        note: 'Fresh database - ready for new accounts'
      });
      
    } catch (error) {
      console.error('❌ Database reset failed:', error);
      res.status(500).json({
        success: false,
        error: 'Database reset failed',
        message: (error as Error).message
      });
    }
  });
  
  // Start the background scheduler service
  startSchedulerService(storage as any);
  
  // Auto-sync disabled - using webhooks for real-time updates
  // console.log('[AUTO SYNC] Starting automatic Instagram sync service...');
  // const autoSyncService = new AutoSyncService(storage);
  // autoSyncService.start();
  
  const server = await registerRoutes(app, storage as any, upload);
  
  // Register metrics and webhook routes
  app.use('/api', metricsRoutes);
  app.use('/api/webhooks', webhooksRoutes);
  
  // Additional webhook route to match Meta Console configuration
  app.use('/webhook', webhooksRoutes);

  // Instagram account management routes
  app.post('/api/instagram/cleanup-duplicates', async (req: any, res: Response) => {
    try {
      const { InstagramAccountManager } = await import('./services/instagram-account-manager');
      const accountManager = new InstagramAccountManager(storage);
      
      console.log('[CLEANUP] Starting Instagram account cleanup...');
      const result = await accountManager.cleanupDuplicateAccounts();
      
      res.json({
        success: true,
        message: `Cleaned up ${result.totalRemoved} duplicate accounts`,
        cleanedAccounts: result.cleanedAccounts,
        totalRemoved: result.totalRemoved
      });
    } catch (error: any) {
      console.error('[CLEANUP] Error during cleanup:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cleanup duplicate accounts',
        error: error.message
      });
    }
  });

  app.post('/api/instagram/ensure-account', async (req: any, res: Response) => {
    try {
      const { instagramAccountId, instagramUsername, workspaceId } = req.body;
      
      if (!instagramAccountId || !instagramUsername || !workspaceId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: instagramAccountId, instagramUsername, workspaceId'
        });
      }

      const { InstagramAccountManager } = await import('./services/instagram-account-manager');
      const accountManager = new InstagramAccountManager(storage);
      
      const result = await accountManager.ensureAccountInWorkspace(
        instagramAccountId, 
        instagramUsername, 
        workspaceId
      );
      
      res.json(result);
    } catch (error: any) {
      console.error('[ENSURE ACCOUNT] Error:', error);
      res.status(500).json({
        success: false,
        action: 'failed',
        message: error.message
      });
    }
  });

  // Set up WebSocket server for real-time chat streaming
  const { createServer } = await import('http');
  const { WebSocketServer } = await import('ws');
  
  const httpServer = createServer(app);
  
  // Initialize logger for metrics system
  Logger.configure({
    logLevel: process.env.NODE_ENV === 'production' ? 1 : 3, // WARN in prod, DEBUG in dev
    enableConsole: true,
    enableFile: true,
    includeWorkspaceInLogs: true,
  });

  // Temporarily disabled for MVP
  // Enable MetricsWorker and RealtimeService for comprehensive testing
  try {
    RealtimeService.initialize(httpServer);
    console.log('✅ RealtimeService initialized for workspace metrics updates');
  } catch (error) {
    console.error('⚠️ RealtimeService failed to initialize:', error);
  }

  // Test Redis connection and start MetricsWorker if available
  console.log('🔍 Testing Redis connection for advanced queue system...');
  try {
    // P1-3 SECURITY: Initialize rate limiting with Redis connection
    const { redisConnection, redisAvailable } = await import('./queues/metricsQueue');
    
    if (redisConnection && redisAvailable) {
      initializeRateLimiting(redisConnection);
      console.log('🔒 P1-3 SECURITY: Rate limiting system initialized with Redis persistence');
    } else {
      console.log('⚠️ Rate Limiting: Redis not available, using memory-based fallbacks');
    }
    
    await MetricsWorker.start();
    console.log('✅ MetricsWorker started with Redis queue system');
  } catch (error) {
    console.log('⚠️  MetricsWorker: Redis unavailable, using smart polling fallback');
    console.log('📊 Instagram metrics continue via existing polling system');
    console.log('⚠️ Rate Limiting: Using memory-based fallbacks without Redis persistence');
  }
  
  const wss = new WebSocketServer({ server: httpServer });
  
  // Add global error handler for WebSocket server
  wss.on('error', (error) => {
    console.error('[WebSocket Server] Error:', error.message);
    // Don't crash the server, just log the error
  });
  
  // Store WebSocket connections by conversation ID
  const wsConnections = new Map<number, Set<any>>();
  
  // Store buffered messages for conversations without active connections
  const messageBuffer = new Map<number, any[]>();
  
  // Helper function to safely send WebSocket messages
  const safeSend = (ws: any, message: any) => {
    try {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(message));
      }
    } catch (error) {
      console.error('[WebSocket] Send error:', error);
    }
  };
  
  wss.on('connection', (ws, req) => {
    console.log('[WebSocket] New client connected for chat streaming');
    
    // Add error handling to prevent crashes
    ws.on('error', (error) => {
      console.error('[WebSocket] Connection error:', error.message);
      // Don't crash the server, just log the error
    });
    
    ws.on('close', (code, reason) => {
      console.log(`[WebSocket] Client disconnected: ${code} ${reason}`);
      // Clean up connections
      for (const [convId, connections] of wsConnections.entries()) {
        if (connections.has(ws)) {
          connections.delete(ws);
          if (connections.size === 0) {
            wsConnections.delete(convId);
          }
        }
      }
    });
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('[WebSocket] Received:', data);
        
        if (data.type === 'subscribe' && data.conversationId) {
          const convId = parseInt(data.conversationId);
          if (!wsConnections.has(convId)) {
            wsConnections.set(convId, new Set());
          }
          wsConnections.get(convId)!.add(ws);
          console.log(`[WebSocket] Client subscribed to conversation ${convId}`);
          
          // Send subscription confirmation
          safeSend(ws, { type: 'subscribed', conversationId: convId });
          
          // Send any buffered messages immediately
          const buffered = messageBuffer.get(convId);
          if (buffered && buffered.length > 0) {
            console.log(`[WebSocket] Sending ${buffered.length} buffered messages to new client`);
            buffered.forEach(message => {
              safeSend(ws, message);
            });
            // Clear buffer after sending
            messageBuffer.delete(convId);
          }
        }
      } catch (error) {
        console.error('[WebSocket] Parse error:', error);
      }
    });
    
    ws.on('close', () => {
      // Remove from all conversations
      for (const [, connections] of wsConnections) {
        connections.delete(ws);
      }
      console.log('[WebSocket] Client disconnected');
    });
  });
  
  // Function to broadcast to all clients in a conversation
  (global as any).broadcastToConversation = (conversationId: number, data: any) => {
    const connections = wsConnections.get(conversationId);
    console.log(`[WebSocket] Broadcasting to conversation ${conversationId}, connections: ${connections?.size || 0}`);
    
    if (connections && connections.size > 0) {
      connections.forEach(ws => {
        if (ws.readyState === 1) { // WebSocket.OPEN
          safeSend(ws, data);
          console.log(`[WebSocket] Sent ${data.type} to client for conversation ${conversationId}`);
        } else {
          console.log(`[WebSocket] Removing closed connection for conversation ${conversationId}`);
          connections.delete(ws);
        }
      });
    } else {
      // Buffer the message for when client connects
      if (data.type === 'status') {
        if (!messageBuffer.has(conversationId)) {
          messageBuffer.set(conversationId, []);
        }
        messageBuffer.get(conversationId)!.push(data);
        console.log(`[WebSocket] Buffered ${data.type} message for conversation ${conversationId}`);
      } else {
        console.log(`[WebSocket] No active connections for conversation ${conversationId}`);
        console.log(`[WebSocket] Active conversations:`, Array.from(wsConnections.keys()));
      }
    }
  };

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Add health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      version: '1.0.0',
      services: {
        database: 'connected',
        server: 'running'
      }
    });
  });

  // Setup Vite in development and static serving in production
  if (app.get("env") === "development" || !isProduction) {
    // Temporarily disable REPL_ID to prevent cartographer plugin from loading
    const originalReplId = process.env.REPL_ID;
    delete process.env.REPL_ID;
    
    try {
      if (setupVite) {
        await setupVite(app, server);
        console.log('[DEBUG] Vite setup completed successfully - serving React application');
      } else {
        throw new Error('setupVite not available');
      }
    } catch (error) {
      console.error('[DEBUG] Vite setup failed:', error);
      console.log('[DEBUG] Falling back to static file serving');
      // Custom static serving as fallback
      const distPath = path.join(process.cwd(), 'dist/public');
      app.use(express.static(distPath));
      
      // Handle root route specifically to avoid path-to-regexp issues  
      app.get('/', (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
      
      // Handle common frontend routes
      app.get('/dashboard', (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
      
      app.get('/login', (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
      
      app.get('/signup', (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } finally {
      // Restore REPL_ID
      if (originalReplId) {
        process.env.REPL_ID = originalReplId;
      }
    }
  } else {
    // Production mode - use static file serving
    try {
      if (serveStatic) {
        serveStatic(app);
        console.log('[PRODUCTION] Static file serving enabled');
      } else {
        throw new Error('serveStatic not available');
      }
    } catch (error) {
      console.error('[PRODUCTION] Static serving failed, using fallback:', error);
      
      // Enhanced fallback static serving for production
      const possiblePaths = [
        path.join(process.cwd(), 'dist/public'),
        path.join(process.cwd(), 'client/dist'),
        path.join(process.cwd(), 'public'),
        path.join(process.cwd(), 'build')
      ];
      
      let staticPath: string | null = null;
      
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          staticPath = possiblePath;
          break;
        }
      }
      
      if (staticPath) {
        console.log('[PRODUCTION] Serving static files from:', staticPath);
        
        // Serve static files with caching
        app.use(express.static(staticPath, {
          maxAge: '1y',
          etag: true,
          lastModified: true
        }));
        
        // Handle SPA routes - serve index.html for all non-API routes
        app.get('*', (req, res, next) => {
          // Skip API routes and uploaded files
          if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
            return next();
          }
          
          const indexPath = path.join(staticPath, 'index.html');
          if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
          } else {
            res.status(404).json({ error: 'Application not found' });
          }
        });
        
        console.log('[PRODUCTION] Fallback static serving enabled');
      } else {
        console.error('[PRODUCTION] Build directory not found in any location');
        console.error('[PRODUCTION] Searched paths:', possiblePaths);
        
        app.get('*', (req, res) => {
          if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
            res.status(503).json({ 
              error: 'Application not built for production',
              message: 'Please run build command first',
              searchedPaths: possiblePaths
            });
          } else {
            res.status(404).json({ error: 'Not found' });
          }
        });
      }
    }
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  
  // Graceful shutdown handling (temporarily disabled for MVP)
  // process.on('SIGTERM', async () => {
  //   console.log('🛑 Received SIGTERM, shutting down gracefully...');
  //   await MetricsWorker.stop();
  //   RealtimeService.shutdown();
  //   process.exit(0);
  // });

  // process.on('SIGINT', async () => {
  //   console.log('🛑 Received SIGINT, shutting down gracefully...');
  //   await MetricsWorker.stop();
  //   RealtimeService.shutdown();
  //   process.exit(0);
  // });

  // Use HTTP server with WebSocket support instead of Express server directly
  httpServer.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port} with WebSocket support`);
    Logger.info('Server', `Instagram metrics system initialized and ready`);
  });
})();
