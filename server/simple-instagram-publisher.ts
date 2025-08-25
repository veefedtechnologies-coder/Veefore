/**
 * Simple Instagram Publisher - Direct approach without complex fallbacks
 * Focuses on what actually works with current Instagram permissions
 */

import { instagramAPI } from './instagram-api';

export class SimpleInstagramPublisher {

  /**
   * Enhanced publishPost method for comprehensive social media posting
   */
  async publishPost(publishData: {
    accountId: string;
    accessToken: string;
    content: string;
    mediaFiles: any[];
    hashtags?: string;
    firstComment?: string;
    location?: string;
    pinFirstComment?: boolean;
    postType?: string;
  }): Promise<{ success: boolean; postId?: string; url?: string; error?: string }> {
    
    console.log('[SIMPLE PUBLISHER] Publishing post with enhanced features:', {
      accountId: publishData.accountId,
      mediaCount: publishData.mediaFiles.length,
      hasFirstComment: !!publishData.firstComment,
      pinFirstComment: publishData.pinFirstComment,
      hasLocation: !!publishData.location,
      postType: publishData.postType
    });

    try {
      // Build complete caption
      let fullCaption = publishData.content || '';
      
      if (publishData.hashtags) {
        fullCaption += '\n\n' + publishData.hashtags;
      }

      // Handle different scenarios based on media
      if (publishData.mediaFiles.length === 0) {
        return { success: false, error: 'Media files are required for Instagram posting' };
      }

      const firstMedia = publishData.mediaFiles[0];
      
      // Determine content type based on post type selection or media type
      let contentType: 'video' | 'photo' | 'reel' | 'story';
      
      if (publishData.postType === 'story') {
        contentType = 'story';
        console.log('[SIMPLE PUBLISHER] Publishing as Instagram Story');
      } else if (publishData.postType === 'reel') {
        contentType = 'reel';
        console.log('[SIMPLE PUBLISHER] Publishing as Instagram Reel');
      } else if (firstMedia.type === 'video') {
        contentType = 'video';
        console.log('[SIMPLE PUBLISHER] Publishing as Instagram Video');
      } else {
        contentType = 'photo';
        console.log('[SIMPLE PUBLISHER] Publishing as Instagram Photo');
      }
      
      // Build full media URL
      const mediaUrl = this.buildFullMediaUrl(firstMedia);
      console.log('[SIMPLE PUBLISHER] Media URL:', mediaUrl);

      // Publish the main post
      const result = await SimpleInstagramPublisher.publishContent(
        publishData.accessToken,
        mediaUrl,
        fullCaption,
        contentType
      );

      if (!result.success) {
        return result;
      }

      // Handle first comment if provided
      if (publishData.firstComment && result.id) {
        try {
          // Note: Instagram doesn't support pinning comments via API, so we skip pin functionality
          if (publishData.pinFirstComment) {
            console.log('[SIMPLE PUBLISHER] ⚠️ Pin comment requested but not supported on Instagram platform');
          }
          await this.addComment(publishData.accessToken, result.id, publishData.firstComment, false); // Always false for Instagram
          console.log('[SIMPLE PUBLISHER] ✓ First comment added (pin not supported on Instagram)');
        } catch (commentError: any) {
          console.log('[SIMPLE PUBLISHER] ⚠️ Failed to add first comment:', commentError.message);
          // Don't fail the entire post for comment failures
        }
      }

      return {
        success: true,
        postId: result.id,
        url: `https://instagram.com/p/${result.id}`
      };

    } catch (error: any) {
      console.error('[SIMPLE PUBLISHER] Enhanced publish error:', error);
      return { success: false, error: error.message || 'Publishing failed' };
    }
  }

  /**
   * Add comment to post with optional pinning
   */
  private async addComment(accessToken: string, postId: string, comment: string, pinComment = false): Promise<void> {
    try {
      // Add the comment
      const commentResult = await instagramAPI.addComment(accessToken, postId, comment);
      console.log('[SIMPLE PUBLISHER] Comment added:', commentResult.id);

      // Pin the comment if requested
      if (pinComment && commentResult.id) {
        try {
          await instagramAPI.pinComment(accessToken, commentResult.id);
          console.log('[SIMPLE PUBLISHER] Comment pinned successfully');
        } catch (pinError: any) {
          console.log('[SIMPLE PUBLISHER] Pin comment failed:', pinError.message);
          // Don't throw error for pin failures
        }
      }
    } catch (error: any) {
      console.error('[SIMPLE PUBLISHER] Add comment failed:', error);
      throw error;
    }
  }

  /**
   * Build full media URL from file info
   */
  private buildFullMediaUrl(mediaFile: any): string {
    if (mediaFile.url.startsWith('http')) {
      return mediaFile.url;
    }

    // Environment-agnostic URL generation
    const getBaseUrl = () => {
      if (process.env.REPLIT_DEV_DOMAIN) return `https://${process.env.REPLIT_DEV_DOMAIN}`;
      if (process.env.REPL_SLUG && process.env.REPL_OWNER) return `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
      if (process.env.VITE_APP_URL) return process.env.VITE_APP_URL;
      return process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:5000';
    };
    
    const baseUrl = getBaseUrl();
    
    return `${baseUrl}${mediaFile.url}`;
  }
  
  /**
   * Publish content with simple, reliable approach
   */
  static async publishContent(
    accessToken: string,
    mediaUrl: string,
    caption: string,
    contentType: 'video' | 'photo' | 'reel' | 'story'
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    
    console.log(`[SIMPLE PUBLISHER] Publishing ${contentType} content`);
    console.log(`[SIMPLE PUBLISHER] Media URL: ${mediaUrl}`);
    
    // Clean and optimize URL for Instagram
    const cleanUrl = this.cleanURLForInstagram(mediaUrl);
    console.log(`[SIMPLE PUBLISHER] Cleaned URL: ${cleanUrl}`);
    
    // For videos/reels, publish as actual video content
    if (contentType === 'video' || contentType === 'reel') {
      console.log(`[SIMPLE PUBLISHER] Publishing ${contentType} as video content`);
      
      try {
        const result = await instagramAPI.publishVideo(accessToken, cleanUrl, caption);
        console.log(`[SIMPLE PUBLISHER] ✓ Published ${contentType} as video: ${result.id}`);
        return { success: true, id: result.id };
        
      } catch (error: any) {
        console.log(`[SIMPLE PUBLISHER] Video publishing failed: ${error.message}`);
        // Fallback to photo if video fails
        console.log(`[SIMPLE PUBLISHER] Attempting fallback to photo post for video content`);
        try {
          const fallbackResult = await instagramAPI.publishPhoto(accessToken, cleanUrl, caption);
          console.log(`[SIMPLE PUBLISHER] ✓ Published video as photo fallback: ${fallbackResult.id}`);
          return { success: true, id: fallbackResult.id };
        } catch (fallbackError: any) {
          return { success: false, error: `Video publishing failed: ${error.message}. Photo fallback also failed: ${fallbackError.message}` };
        }
      }
    }
    
    // For stories, use story publishing API
    if (contentType === 'story') {
      try {
        // Determine if media is video based on URL or type
        const isVideo = cleanUrl.includes('video') || cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.mov');
        
        const result = await instagramAPI.publishStory(accessToken, cleanUrl, isVideo);
        console.log(`[SIMPLE PUBLISHER] ✓ Published story: ${result.id}`);
        return { success: true, id: result.id };
        
      } catch (error: any) {
        console.log(`[SIMPLE PUBLISHER] Story publishing failed: ${error.message}`);
        // Fallback to regular photo if story fails
        console.log(`[SIMPLE PUBLISHER] Attempting fallback to photo post for story content`);
        try {
          const fallbackResult = await instagramAPI.publishPhoto(accessToken, cleanUrl, caption);
          console.log(`[SIMPLE PUBLISHER] ✓ Published story as photo fallback: ${fallbackResult.id}`);
          return { success: true, id: fallbackResult.id };
        } catch (fallbackError: any) {
          return { success: false, error: `Story publishing failed: ${error.message}. Photo fallback also failed: ${fallbackError.message}` };
        }
      }
    }
    
    // For photos, publish directly
    if (contentType === 'photo') {
      try {
        const result = await instagramAPI.publishPhoto(accessToken, cleanUrl, caption);
        console.log(`[SIMPLE PUBLISHER] ✓ Published photo: ${result.id}`);
        return { success: true, id: result.id };
        
      } catch (error: any) {
        console.log(`[SIMPLE PUBLISHER] Photo publishing failed: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
    
    return { success: false, error: 'Unsupported content type' };
  }
  
  /**
   * Clean URL for Instagram compatibility
   */
  static cleanURLForInstagram(inputUrl: string): string {
    console.log(`[URL CLEANER] Processing: ${inputUrl}`);
    
    // Get the current domain from environment or default
    const currentDomain = process.env.REPLIT_DEV_DOMAIN || 'localhost:5000';
    const baseUrl = currentDomain.includes('localhost') ? `http://${currentDomain}` : `https://${currentDomain}`;
    
    console.log(`[URL CLEANER] Current domain: ${currentDomain}`);
    console.log(`[URL CLEANER] Base URL: ${baseUrl}`);
    
    // Handle blob URLs
    if (inputUrl.startsWith('blob:')) {
      const parts = inputUrl.split('/');
      const mediaId = parts[parts.length - 1];
      const cleanUrl = `${baseUrl}/uploads/${mediaId}`;
      console.log(`[URL CLEANER] Blob converted: ${cleanUrl}`);
      return cleanUrl;
    }
    
    // Handle malformed URLs with nested domains
    if (inputUrl.includes('replit.dev') && inputUrl.includes('/uploads/')) {
      const uploadsPart = inputUrl.substring(inputUrl.indexOf('/uploads/'));
      const cleanUrl = `${baseUrl}${uploadsPart}`;
      console.log(`[URL CLEANER] Nested domain fixed: ${cleanUrl}`);
      return cleanUrl;
    }
    
    // Handle already proper URLs with current domain
    if (inputUrl.startsWith(baseUrl)) {
      console.log(`[URL CLEANER] URL already clean: ${inputUrl}`);
      return inputUrl;
    }
    
    // Extract filename and create clean URL
    const filename = inputUrl.split('/').pop() || 'media';
    const cleanUrl = `${baseUrl}/uploads/${filename}`;
    console.log(`[URL CLEANER] Generic clean: ${cleanUrl}`);
    return cleanUrl;
  }
  
  /**
   * Convert video URL to image URL for photo publishing
   */
  static convertVideoToImageURL(videoUrl: string): string {
    // Convert video extension to image
    let imageUrl = videoUrl.replace(/\.(mp4|mov|avi|webm)$/i, '.jpg');
    
    // If no video extension found, add image extension
    if (imageUrl === videoUrl && !imageUrl.match(/\.(jpg|jpeg|png)$/i)) {
      imageUrl = `${videoUrl}.jpg`;
    }
    
    console.log(`[URL CONVERTER] Video to image: ${videoUrl} → ${imageUrl}`);
    return imageUrl;
  }
  
  /**
   * Check if content can be published with current permissions
   */
  static canPublishContent(contentType: 'video' | 'photo' | 'reel' | 'story'): boolean {
    // Currently only photo publishing is reliable
    return contentType === 'photo';
  }
  
  /**
   * Get recommended publishing approach
   */
  static getPublishingStrategy(contentType: 'video' | 'photo' | 'reel' | 'story'): {
    canPublish: boolean;
    approach: string;
    message: string;
  } {
    
    if (contentType === 'photo') {
      return {
        canPublish: true,
        approach: 'direct',
        message: 'Photo will be published directly'
      };
    }
    
    if (contentType === 'video' || contentType === 'reel') {
      return {
        canPublish: true,
        approach: 'photo_conversion',
        message: 'Video will be published as preview image with caption'
      };
    }
    
    return {
      canPublish: false,
      approach: 'unsupported',
      message: 'Content type not supported with current permissions'
    };
  }
}