/**
 * Test simple video generation with guaranteed visible content
 */

import ffmpeg from 'fluent-ffmpeg';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createTestVideo() {
  const outputDir = path.join(__dirname, 'media', 'generated');
  const outputPath = path.join(outputDir, `test-visible-${Date.now()}.mp4`);
  
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });
  
  console.log('Creating test video with guaranteed visible content...');
  
  return new Promise((resolve, reject) => {
    // Create a simple video with bright blue background and white text
    ffmpeg()
      .input('color=c=0x2563EB:s=1920x1080:d=10')
      .inputFormat('lavfi')
      .complexFilter([
        {
          filter: 'drawtext',
          options: {
            text: 'VeeFore AI Video Test',
            fontsize: 120,
            fontcolor: 'white',
            x: '(w-text_w)/2',
            y: '(h-text_h)/2',
            box: 1,
            boxcolor: 'black@0.5',
            boxborderw: 10
          }
        }
      ])
      .outputOptions([
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'fast',
        '-crf', '23'
      ])
      .output(outputPath)
      .on('start', (cmd) => {
        console.log('FFmpeg command:', cmd);
      })
      .on('progress', (progress) => {
        console.log('Progress:', progress.percent + '%');
      })
      .on('end', async () => {
        console.log('Video created successfully at:', outputPath);
        
        // Check file info
        const stats = await fs.stat(outputPath);
        console.log('File size:', stats.size, 'bytes');
        
        // Try to get video properties
        ffmpeg.ffprobe(outputPath, (err, metadata) => {
          if (err) {
            console.error('Error getting video info:', err);
          } else {
            console.log('Video properties:');
            console.log('- Duration:', metadata.format.duration, 'seconds');
            console.log('- Size:', metadata.format.size, 'bytes');
            console.log('- Bitrate:', metadata.format.bit_rate, 'bps');
            
            const videoStream = metadata.streams.find(s => s.codec_type === 'video');
            if (videoStream) {
              console.log('- Resolution:', videoStream.width + 'x' + videoStream.height);
              console.log('- Codec:', videoStream.codec_name);
              console.log('- Pixel format:', videoStream.pix_fmt);
            }
          }
          resolve(outputPath);
        });
      })
      .on('error', (err) => {
        console.error('Error creating video:', err);
        reject(err);
      })
      .run();
  });
}

createTestVideo().catch(console.error);