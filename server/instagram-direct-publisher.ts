/**
 * Instagram Direct Publisher - Works with current app permissions
 * Simple approach that publishes what actually works
 */

import { instagramAPI } from './instagram-api';

export class InstagramDirectPublisher {
  
  /**
   * Publish content using only available permissions
   */
  static async publishContent(
    accessToken: string,
    mediaUrl: string,
    caption: string,
    contentType: 'video' | 'photo' | 'reel' | 'story'
  ): Promise<{ success: boolean; id?: string; error?: string; approach?: string }> {
    
    console.log(`[DIRECT PUBLISHER] Publishing ${contentType} content`);
    
    // Clean URL for Instagram
    const cleanUrl = this.cleanMediaURL(mediaUrl);
    console.log(`[DIRECT PUBLISHER] Using URL: ${cleanUrl}`);
    
    // Strategy 1: Try photo publishing (most reliable)
    if (contentType === 'photo') {
      try {
        const result = await instagramAPI.publishPhoto(accessToken, cleanUrl, caption);
        console.log(`[DIRECT PUBLISHER] ✓ Photo published: ${result.id}`);
        return { 
          success: true, 
          id: result.id, 
          approach: 'direct_photo' 
        };
      } catch (error: any) {
        console.log(`[DIRECT PUBLISHER] Photo failed: ${error.message}`);
        return { 
          success: false, 
          error: `Photo publishing failed: ${error.message}`,
          approach: 'direct_photo'
        };
      }
    }
    
    // Strategy 2: For videos/reels, try to publish as photo first, then fallback
    if (contentType === 'video' || contentType === 'reel') {
      console.log(`[DIRECT PUBLISHER] Attempting to publish ${contentType} as photo`);
      
      // First try: Use the actual video URL as photo (Instagram sometimes accepts video files as images)
      try {
        const result = await instagramAPI.publishPhoto(accessToken, cleanUrl, caption);
        console.log(`[DIRECT PUBLISHER] ✓ Video published as photo: ${result.id}`);
        return { 
          success: true, 
          id: result.id, 
          approach: 'video_as_photo' 
        };
      } catch (error: any) {
        console.log(`[DIRECT PUBLISHER] Video as photo failed: ${error.message}`);
        
        // Fallback: Use the clean URL directly with enhanced caption
        const enhancedCaption = `${caption}\n\n🎬 Video content | 📱 Check our stories for more`;
        
        try {
          const fallbackResult = await instagramAPI.publishPhoto(accessToken, cleanUrl, enhancedCaption);
          console.log(`[DIRECT PUBLISHER] ✓ Fallback published: ${fallbackResult.id}`);
          return { 
            success: true, 
            id: fallbackResult.id, 
            approach: 'video_fallback' 
          };
        } catch (fallbackError: any) {
          console.log(`[DIRECT PUBLISHER] All video publishing attempts failed: ${fallbackError.message}`);
          return { 
            success: false, 
            error: `Video publishing failed: ${fallbackError.message}`,
            approach: 'video_failed'
          };
        }
      }
    }
    
    return { 
      success: false, 
      error: 'Content type not supported', 
      approach: 'unsupported' 
    };
  }
  
  /**
   * Clean URL for Instagram compatibility
   */
  static cleanMediaURL(inputUrl: string): string {
    // Handle blob URLs
    if (inputUrl.startsWith('blob:')) {
      const parts = inputUrl.split('/');
      const mediaId = parts[parts.length - 1];
      return `https://workspace.brandboost09.repl.co/uploads/${mediaId}`;
    }
    
    // Handle malformed nested URLs
    if (inputUrl.includes('replit.dev') && inputUrl.includes('/uploads/')) {
      const uploadsPart = inputUrl.substring(inputUrl.indexOf('/uploads/'));
      return `https://workspace.brandboost09.repl.co${uploadsPart}`;
    }
    
    // Handle direct file URLs
    if (inputUrl.startsWith('https://workspace.brandboost09.repl.co')) {
      return inputUrl;
    }
    
    // Extract filename and create clean URL
    const filename = inputUrl.split('/').pop() || 'media';
    return `https://workspace.brandboost09.repl.co/uploads/${filename}`;
  }
  
  /**
   * Create a simple text post image URL
   * DISABLED: Never use placeholder images as Instagram rejects them
   */
  static createTextPostImage(text: string): string {
    throw new Error('Placeholder images are not allowed. Please provide a real media URL.');
  }
  
  /**
   * Check what can be published with current permissions
   */
  static getPublishingCapabilities(): {
    photos: boolean;
    videos: boolean;
    reels: boolean;
    stories: boolean;
    alternatives: string[];
  } {
    return {
      photos: true,  // Instagram Basic Display allows photo publishing
      videos: false, // Requires Instagram Business API approval
      reels: false,  // Requires Instagram Business API approval
      stories: false, // Requires Instagram Business API approval
      alternatives: [
        'Convert videos to preview images',
        'Create text posts for video content',
        'Use link in bio strategy'
      ]
    };
  }
}