import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

// Set the ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

interface CompressionOptions {
  targetSizeMB?: number;
  maxSizeMB?: number;
  quality?: 'high' | 'medium' | 'low';
  maintainAspectRatio?: boolean;
}

interface CompressionResult {
  success: boolean;
  outputPath?: string;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  error?: string;
}

export class VideoCompressor {
  private static readonly INSTAGRAM_MAX_SIZE_MB = 50; // Instagram's recommended max
  private static readonly QUALITY_PRESETS = {
    high: { crf: 23, preset: 'medium' },
    medium: { crf: 28, preset: 'fast' },
    low: { crf: 32, preset: 'faster' }
  };

  /**
   * Intelligently compress video only when needed for Instagram compatibility
   * Maintains quality while reducing file size below Instagram's acceptance threshold
   */
  static async compressForInstagram(
    inputPath: string,
    options: CompressionOptions = {}
  ): Promise<CompressionResult> {
    try {
      const {
        targetSizeMB = 25, // More aggressive target
        quality = 'medium',
        maintainAspectRatio = true
      } = options;

      console.log(`[VIDEO COMPRESSION] Starting intelligent compression for Instagram compatibility`);
      console.log(`[VIDEO COMPRESSION] Input file: ${inputPath}`);
      console.log(`[VIDEO COMPRESSION] Target size: ${targetSizeMB}MB`);
      
      // Get original file size
      const stats = fs.statSync(inputPath);
      const originalSizeMB = stats.size / (1024 * 1024);
      
      console.log(`[VIDEO COMPRESSION] Original file size: ${originalSizeMB.toFixed(2)}MB`);
      
      // If file is already under the target size, no compression needed
      if (originalSizeMB <= targetSizeMB) {
        console.log(`[VIDEO COMPRESSION] File already under ${targetSizeMB}MB, no compression needed`);
        return {
          success: true,
          outputPath: inputPath,
          originalSize: stats.size,
          compressedSize: stats.size,
          compressionRatio: 1.0
        };
      }

      // Generate output path
      const ext = path.extname(inputPath);
      const basename = path.basename(inputPath, ext);
      const outputPath = path.join(path.dirname(inputPath), `${basename}_compressed${ext}`);

      console.log(`[VIDEO COMPRESSION] Target size: ${targetSizeMB}MB, Quality: ${quality}`);
      
      // Get video info first
      const videoInfo = await VideoCompressor.getVideoInfo(inputPath);
      console.log(`[VIDEO COMPRESSION] Video info:`, {
        duration: videoInfo.duration,
        width: videoInfo.width,
        height: videoInfo.height,
        bitrate: videoInfo.bitrate
      });

      // Calculate target bitrate based on desired file size
      const targetBitrate = VideoCompressor.calculateTargetBitrate(
        videoInfo.duration,
        targetSizeMB,
        originalSizeMB
      );

      console.log(`[VIDEO COMPRESSION] Calculated target bitrate: ${targetBitrate}k`);

      // Perform compression with intelligent settings
      await VideoCompressor.performCompression(
        inputPath,
        outputPath,
        targetBitrate,
        quality,
        videoInfo,
        maintainAspectRatio
      );

      // Verify compressed file size
      const compressedStats = fs.statSync(outputPath);
      const compressedSizeMB = compressedStats.size / (1024 * 1024);
      const compressionRatio = compressedStats.size / stats.size;

      console.log(`[VIDEO COMPRESSION] Compression complete!`);
      console.log(`[VIDEO COMPRESSION] Compressed size: ${compressedSizeMB.toFixed(2)}MB`);
      console.log(`[VIDEO COMPRESSION] Compression ratio: ${(compressionRatio * 100).toFixed(1)}%`);

      return {
        success: true,
        outputPath,
        originalSize: stats.size,
        compressedSize: compressedStats.size,
        compressionRatio
      };

    } catch (error: any) {
      console.error(`[VIDEO COMPRESSION] Failed:`, error.message);
      return {
        success: false,
        originalSize: fs.statSync(inputPath).size,
        error: error.message
      };
    }
  }

  private static async getVideoInfo(inputPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }
        
        const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
        if (!videoStream) {
          reject(new Error('No video stream found'));
          return;
        }

        resolve({
          duration: metadata.format.duration || 0,
          width: videoStream.width || 0,
          height: videoStream.height || 0,
          bitrate: parseInt(metadata.format.bit_rate || '0') / 1000 // Convert to kbps
        });
      });
    });
  }

  private static calculateTargetBitrate(
    duration: number,
    targetSizeMB: number,
    originalSizeMB: number
  ): number {
    // Calculate target bitrate to achieve desired file size
    // Formula: (targetSize in bits) / (duration in seconds) = target bitrate
    const targetSizeBytes = targetSizeMB * 1024 * 1024;
    const targetSizeBits = targetSizeBytes * 8;
    
    // Reserve 20% for audio and overhead
    const videoBitrate = (targetSizeBits * 0.8) / duration / 1000; // Convert to kbps
    
    // Ensure minimum quality - don't go below 500kbps for videos
    const minBitrate = 500;
    const maxBitrate = 4000; // Cap at 4Mbps for quality
    
    return Math.max(minBitrate, Math.min(maxBitrate, Math.floor(videoBitrate)));
  }

  private static async performCompression(
    inputPath: string,
    outputPath: string,
    targetBitrate: number,
    quality: 'high' | 'medium' | 'low',
    videoInfo: any,
    maintainAspectRatio: boolean
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const qualitySettings = VideoCompressor.QUALITY_PRESETS[quality];
      
      let command = ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .audioBitrate('128k')
        .audioChannels(2)
        .audioFrequency(44100)
        .videoBitrate(`${targetBitrate}k`)
        .addOption('-crf', qualitySettings.crf.toString())
        .addOption('-preset', qualitySettings.preset)
        .addOption('-movflags', '+faststart') // Optimize for web playback
        .addOption('-profile:v', 'main') // Instagram-compatible profile
        .addOption('-level', '4.0') // H.264 level compatible with most devices
        .format('mp4');

      // Optimize resolution if needed while maintaining aspect ratio
      if (maintainAspectRatio && videoInfo.width && videoInfo.height) {
        // Instagram recommends max 1920x1080 for videos
        if (videoInfo.width > 1920 || videoInfo.height > 1080) {
          command = command.size('1920x1080').aspect('16:9');
          console.log(`[VIDEO COMPRESSION] Resizing to Instagram-optimal resolution: 1920x1080`);
        }
      }

      command
        .on('start', (commandLine) => {
          console.log(`[VIDEO COMPRESSION] FFmpeg command: ${commandLine}`);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`[VIDEO COMPRESSION] Progress: ${Math.round(progress.percent)}%`);
          }
        })
        .on('end', () => {
          console.log(`[VIDEO COMPRESSION] Processing finished successfully`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`[VIDEO COMPRESSION] Processing failed:`, err.message);
          reject(err);
        })
        .save(outputPath);
    });
  }

  /**
   * Check if a video file needs compression for Instagram
   */
  static needsCompression(filePath: string, maxSizeMB: number = VideoCompressor.INSTAGRAM_MAX_SIZE_MB): boolean {
    try {
      const stats = fs.statSync(filePath);
      const fileSizeMB = stats.size / (1024 * 1024);
      return fileSizeMB > maxSizeMB;
    } catch (error) {
      console.error(`[VIDEO COMPRESSION] Error checking file size:`, error);
      return false;
    }
  }

  /**
   * Get file size in MB
   */
  static getFileSizeMB(filePath: string): number {
    try {
      const stats = fs.statSync(filePath);
      return stats.size / (1024 * 1024);
    } catch (error) {
      console.error(`[VIDEO COMPRESSION] Error getting file size:`, error);
      return 0;
    }
  }
}