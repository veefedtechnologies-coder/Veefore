/**
 * Test video generation with simple visible content
 */

import dotenv from 'dotenv';
import { WorkingVideoGenerator } from './server/services/working-video-generator.js';
import { promises as fs } from 'fs';
import path from 'path';

dotenv.config();

async function testVideoGeneration() {
  console.log('Testing video generation...');
  
  const generator = new WorkingVideoGenerator();
  
  const testJob = {
    id: 'test-' + Date.now(),
    prompt: 'A simple test video with visible content',
    duration: 15,
    status: 'generating',
    progress: 0,
    currentStep: 'Starting...'
  };
  
  try {
    console.log('Starting video generation...');
    const videoPath = await generator.generateWorkingVideo(testJob);
    
    console.log('Video generated at:', videoPath);
    
    // Check if file exists and get its stats
    const stats = await fs.stat(videoPath);
    console.log('Video file size:', stats.size, 'bytes');
    console.log('Video file exists:', stats.isFile());
    
    // Try to get video info using ffprobe
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execPromise = promisify(exec);
    
    try {
      const { stdout } = await execPromise(`ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=width,height,codec_name -of json "${videoPath}"`);
      const info = JSON.parse(stdout);
      console.log('Video info:', JSON.stringify(info, null, 2));
    } catch (error) {
      console.log('Could not get video info:', error.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testVideoGeneration();