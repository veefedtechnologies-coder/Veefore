import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { authenticateJWT, AuthenticatedRequest } from './middleware/auth';
import CompleteVideoGenerator from './services/complete-video-generator';
import { SimpleVideoGenerator } from './services/simple-video-generator';
import { WorkingVideoGenerator } from './services/working-video-generator';
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'video-images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// In-memory storage for video jobs (replace with database in production)
const videoJobs = new Map();
const userVideos = new Map();

// WebSocket connections for real-time updates
const wsConnections = new Map<string, WebSocket>();

// Initialize complete video generator
const videoGenerator = new CompleteVideoGenerator();

// WebSocket server setup function
export function setupVideoWebSocket(server: Server) {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws/video'
  });

  wss.on('connection', (ws: WebSocket, req) => {
    console.log('[WS] Video WebSocket client connected');
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'subscribe' && message.jobId) {
          wsConnections.set(message.jobId, ws);
          console.log(`[WS] Client subscribed to job: ${message.jobId}`);
        }
      } catch (error) {
        console.error('[WS] Invalid message format:', error);
      }
    });

    ws.on('close', () => {
      console.log('[WS] Video WebSocket client disconnected');
      // Remove connection from map
      for (const [jobId, connection] of wsConnections.entries()) {
        if (connection === ws) {
          wsConnections.delete(jobId);
          break;
        }
      }
    });
  });

  return wss;
}

// Broadcast progress update to WebSocket clients
export function broadcastProgress(jobId: string, progress: number, step: string, message?: string) {
  const ws = wsConnections.get(jobId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'progress',
      jobId,
      progress,
      step,
      message,
      timestamp: new Date().toISOString()
    }));
    console.log(`[WS] Progress broadcast for ${jobId}: ${progress}% - ${step}`);
  }
}

// Broadcast completion to WebSocket clients
export function broadcastComplete(jobId: string, videoUrl: string, processingTime?: string, thumbnailUrl?: string) {
  const ws = wsConnections.get(jobId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'complete',
      jobId,
      videoUrl,
      processingTime,
      thumbnailUrl,
      timestamp: new Date().toISOString()
    }));
    console.log(`[WS] Completion broadcast for ${jobId}`);
  }
}

// Broadcast error to WebSocket clients
export function broadcastError(jobId: string, error: string) {
  const ws = wsConnections.get(jobId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'error',
      jobId,
      error,
      timestamp: new Date().toISOString()
    }));
    console.log(`[WS] Error broadcast for ${jobId}: ${error}`);
  }
}

// Get user's video jobs
router.get('/jobs', authenticateJWT, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;
    const userJobsList = Array.from(videoJobs.values()).filter(job => job.userId === userId);
    res.json(userJobsList);
  } catch (error) {
    console.error('Error fetching video jobs:', error);
    res.status(500).json({ error: 'Failed to fetch video jobs' });
  }
});

// Upload image for video generation
router.post('/upload-image', authenticateJWT, upload.single('image'), (req: AuthenticatedRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageUrl = `/uploads/video-images/${req.file.filename}`;
    res.json({
      success: true,
      imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Note: Script generation routes are defined below with proper ES module imports

// Generate video with approved script
router.post('/generate', authenticateJWT, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;
    
    const {
      title,
      prompt,
      script,
      duration,
      voiceProfile,
      enableAvatar,
      enableMusic,
      visualStyle,
      motionEngine,
      uploadedImages = []
    } = req.body;

    // Validate required fields
    if (!prompt?.trim() || !script) {
      return res.status(400).json({ error: 'Video prompt and approved script are required' });
    }

    // Create enhanced video job with complete 9-step structure
    const videoJob = createVideoJob(userId, {
      title: title || script.title,
      prompt,
      duration,
      voiceProfile,
      enableAvatar,
      enableMusic,
      visualStyle,
      motionEngine,
      uploadedImages
    });
    
    // Add the approved script to the job
    videoJob.script = script;
    videoJob.currentStep = 'Processing approved script and generating scenes...';
    const jobId = videoJob.id;

    videoJobs.set(jobId, videoJob);
    
    // Store user videos
    if (!userVideos.has(userId)) {
      userVideos.set(userId, []);
    }
    userVideos.get(userId).push(jobId);

    // Start complete video generation process
    startCompleteVideoGeneration(jobId, videoJob);

    res.json({
      success: true,
      jobId,
      message: 'Video generation started'
    });

  } catch (error) {
    console.error('Error starting video generation:', error);
    res.status(500).json({ error: 'Failed to start video generation' });
  }
});

// Get specific video job
router.get('/job/:jobId', authenticateJWT, (req: AuthenticatedRequest, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    
    const job = videoJobs.get(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Video job not found' });
    }
    
    if (job.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Error fetching video job:', error);
    res.status(500).json({ error: 'Failed to fetch video job' });
  }
});

// Delete video job
router.delete('/job/:jobId', authenticateJWT, (req: AuthenticatedRequest, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    
    const job = videoJobs.get(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Video job not found' });
    }
    
    if (job.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    videoJobs.delete(jobId);
    
    // Remove from user videos
    const userJobsList = userVideos.get(userId) || [];
    const updatedList = userJobsList.filter(id => id !== jobId);
    userVideos.set(userId, updatedList);
    
    res.json({ success: true, message: 'Video job deleted' });
  } catch (error) {
    console.error('Error deleting video job:', error);
    res.status(500).json({ error: 'Failed to delete video job' });
  }
});

// Complete 9-step video generation process
async function startCompleteVideoGeneration(jobId: string, job: any) {
  try {
    console.log(`[VIDEO API] Starting complete generation for job: ${jobId}`);
    
    // Use the working video generator for now
    const workingGenerator = new WorkingVideoGenerator();
    
    // Convert job format for working generator
    const workingJob = {
      id: jobId,
      prompt: job.prompt,
      duration: job.duration || 30,
      status: 'generating',
      progress: 0,
      currentStep: 'Initializing...'
    };
    
    // Update progress via WebSocket
    const updateProgress = (progress: number, step: string) => {
      job.progress = progress;
      job.currentStep = step;
      workingJob.progress = progress;
      workingJob.currentStep = step;
      broadcastProgress(jobId, progress, step);
      videoJobs.set(jobId, job);
    };
    
    // Monitor working job progress
    const progressInterval = setInterval(() => {
      if (workingJob.progress !== job.progress) {
        updateProgress(workingJob.progress, workingJob.currentStep);
      }
    }, 500);
    
    // Run the working video generation
    const finalPath = await workingGenerator.generateWorkingVideo(workingJob);
    
    clearInterval(progressInterval);
    
    // Update job with final result
    job.status = 'completed';
    job.progress = 100;
    job.currentStep = 'Video generation complete!';
    job.finalVideo = finalPath;
    job.script = workingJob.script;
    
    videoJobs.set(jobId, job);
    broadcastComplete(jobId, finalPath);
    
    console.log(`[VIDEO API] Complete generation finished for job: ${jobId}`);
    
  } catch (error) {
    console.error(`[VIDEO API] Generation failed for job ${jobId}:`, error);
    
    // Update job with error status
    job.status = 'failed';
    job.currentStep = `Generation failed: ${error.message}`;
    job.progress = 0;
    videoJobs.set(jobId, job);
    broadcastError(jobId, error.message);
  }
}

// Additional API endpoints for complete video generation workflow

// Generate or regenerate script
router.post('/generate-script', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const { prompt, duration = 30, visualStyle = 'cinematic', tone = 'professional' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Generate script using OpenAI
    const { default: OpenAIService } = await import('./openai-client');
    const service = new OpenAIService();
    
    console.log('[VIDEO API] Creating OpenAI service for script generation');
    
    const script = await service.generateVideoScript({
      prompt,
      duration,
      visualStyle,
      tone
    });

    res.json({
      success: true,
      script,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[VIDEO API] Script generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate script',
      details: error.message 
    });
  }
});

// Regenerate specific scene in script
router.post('/regenerate-scene', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const { 
      originalPrompt, 
      sceneId, 
      visualStyle = 'cinematic', 
      tone = 'professional',
      currentScript 
    } = req.body;
    
    if (!originalPrompt || !sceneId || !currentScript) {
      return res.status(400).json({ 
        error: 'originalPrompt, sceneId, and currentScript are required' 
      });
    }

    // Regenerate scene using OpenAI
    const { default: OpenAIService } = await import('./openai-client');
    const service = new OpenAIService();
    
    const updatedScene = await service.regenerateScene({
      originalPrompt,
      sceneId,
      visualStyle,
      tone,
      currentScript
    });

    res.json({
      success: true,
      updatedScene,
      regeneratedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[VIDEO API] Scene regeneration error:', error);
    res.status(500).json({ 
      error: 'Failed to regenerate scene',
      details: error.message 
    });
  }
});

// Get generation progress for a specific job (WebSocket alternative via polling)
router.get('/job/:jobId/progress', authenticateJWT, (req: AuthenticatedRequest, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    
    const job = videoJobs.get(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Video job not found' });
    }
    
    if (job.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({
      jobId,
      status: job.status,
      progress: job.progress,
      currentStep: job.currentStep,
      creditsUsed: job.creditsUsed,
      lastUpdated: job.updatedAt || job.createdAt
    });
    
  } catch (error) {
    console.error('[VIDEO API] Progress fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Enhanced video job creation with proper 9-step structure
function createVideoJob(userId: string, jobData: any) {
  const jobId = uuidv4();
  
  const videoJob = {
    id: jobId,
    userId,
    prompt: jobData.prompt,
    title: jobData.title || 'Untitled Video',
    status: 'generating',
    progress: 0,
    currentStep: 'Initializing video generation...',
    duration: jobData.duration || 30,
    voiceProfile: {
      gender: jobData.voiceProfile?.gender || 'female',
      language: jobData.voiceProfile?.language || 'english',
      accent: jobData.voiceProfile?.accent || 'american',
      tone: jobData.voiceProfile?.tone || 'professional'
    },
    enableAvatar: jobData.enableAvatar || false,
    enableMusic: jobData.enableMusic || false,
    visualStyle: jobData.visualStyle || 'cinematic',
    motionEngine: jobData.motionEngine || 'auto',
    uploadedImages: jobData.uploadedImages || [],
    script: null,
    scenes: [],
    generatedImages: [],
    enhancedImages: [],
    motionVideos: [],
    voiceAudio: [],
    avatarVideo: null,
    finalVideo: null,
    creditsUsed: 0,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };
  
  return videoJob;
}

// Test broadcast route for debugging WebSocket progress updates
router.post('/test-broadcast', async (req, res) => {
  try {
    const jobId = '3a659be2-8c2b-4bcc-969b-f86ee252f54d';
    const job = videoJobs.get(jobId);
    
    if (job) {
      console.log(`[TEST] Broadcasting current job status: ${job.progress}% - ${job.currentStep}`);
      broadcastProgress(jobId, job.progress, job.currentStep);
      res.json({ 
        success: true, 
        message: `Broadcasted progress for job ${jobId}`,
        progress: job.progress,
        step: job.currentStep,
        connectedClients: wsConnections.size 
      });
    } else {
      // Broadcast test progress anyway
      broadcastProgress(jobId, 60, 'Generating voiceover with ElevenLabs...');
      res.json({ 
        success: true, 
        message: `Broadcasted test progress for job ${jobId}`,
        progress: 60,
        step: 'Generating voiceover with ElevenLabs...',
        connectedClients: wsConnections.size 
      });
    }
  } catch (error) {
    console.error('[TEST] Broadcast error:', error);
    res.status(500).json({ error: 'Failed to broadcast progress' });
  }
});

// Test job status without authentication
router.get('/test-job/:jobId', async (req, res) => {
  try {
    const job = videoJobs.get(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ job });
  } catch (error) {
    console.error('[TEST] Get job error:', error);
    res.status(500).json({ error: 'Failed to get job' });
  }
});

// Test pipeline directly without authentication for debugging
router.post('/test-pipeline', async (req, res) => {
  try {
    console.log('[TEST PIPELINE] Starting test video generation...');
    
    const jobId = uuidv4();
    const testJob = createVideoJob('test-user', {
      prompt: req.body.prompt || 'Create a 10-second test video with AI narration',
      duration: req.body.duration || 10,
      title: 'Test Video Generation'
    });
    
    videoJobs.set(jobId, testJob);
    
    // Start the generation asynchronously
    startCompleteVideoGeneration(jobId, testJob);
    
    res.json({
      success: true,
      message: 'Test video generation started',
      jobId: jobId
    });
  } catch (error) {
    console.error('[TEST PIPELINE] Error:', error);
    res.status(500).json({ error: 'Failed to start test pipeline' });
  }
});

// Get all video jobs without authentication for debugging
router.get('/test-jobs', (req, res) => {
  const allJobs = Array.from(videoJobs.entries()).map(([id, job]) => ({
    id,
    status: job.status,
    progress: job.progress,
    currentStep: job.currentStep,
    userId: job.userId,
    createdAt: job.createdAt
  }));
  
  res.json({
    totalJobs: allJobs.length,
    jobs: allJobs
  });
});

// Simple test route that bypasses complex pipeline
router.post('/test-simple', async (req, res) => {
  try {
    console.log('[TEST SIMPLE] Starting simple video generation...');
    
    const { prompt = 'Test video', duration = 5 } = req.body;
    const simpleGenerator = new SimpleVideoGenerator();
    
    const jobId = uuidv4();
    const job = createVideoJob('test-user', { prompt, duration });
    videoJobs.set(jobId, job);

    // Update job progress
    job.progress = 20;
    job.currentStep = 'Generating simple video...';
    broadcastProgress(jobId, 20, 'Generating simple video...');

    // Generate simple video
    simpleGenerator.generateSimpleVideo(prompt, duration)
      .then(result => {
        job.status = 'completed';
        job.progress = 100;
        job.currentStep = 'Video generation complete';
        job.finalVideo = result.videoPath;
        broadcastComplete(jobId, result.videoPath);
        console.log('[TEST SIMPLE] Video completed:', result.videoPath);
      })
      .catch(error => {
        job.status = 'failed';
        job.currentStep = 'Failed: ' + error.message;
        broadcastError(jobId, error.message);
        console.error('[TEST SIMPLE] Generation failed:', error);
      });

    res.json({
      success: true,
      message: 'Simple test started',
      jobId
    });
  } catch (error) {
    console.error('[TEST SIMPLE] Error:', error);
    res.status(500).json({ error: 'Simple test failed', details: error.message });
  }
});

// Working video generator test route - includes voiceover
router.post('/test-working', async (req, res) => {
  try {
    console.log('[TEST WORKING] Starting working video generation...');
    
    const { prompt = 'Create a motivational video about success', duration = 10 } = req.body;
    const workingGenerator = new WorkingVideoGenerator();
    
    const jobId = uuidv4();
    const job = {
      id: jobId,
      prompt,
      duration,
      status: 'generating',
      progress: 0,
      currentStep: 'Initializing...'
    };
    videoJobs.set(jobId, job);

    // Broadcast initial progress
    broadcastProgress(jobId, 5, 'Starting video generation...');

    // Generate working video with progress updates
    workingGenerator.generateWorkingVideo(job)
      .then(finalPath => {
        job.status = 'completed';
        job.finalVideo = finalPath;
        broadcastComplete(jobId, finalPath);
        console.log('[TEST WORKING] Video completed:', finalPath);
      })
      .catch(error => {
        job.status = 'failed';
        broadcastError(jobId, error.message);
        console.error('[TEST WORKING] Generation failed:', error);
      });

    res.json({
      success: true,
      message: 'Working video generation started',
      jobId
    });
  } catch (error) {
    console.error('[TEST WORKING] Error:', error);
    res.status(500).json({ error: 'Working test failed', details: error.message });
  }
});

export default router;