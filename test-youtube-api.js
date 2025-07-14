/**
 * Test YouTube API integration directly
 */

import { youtubeService } from './server/youtube-service.js';

async function testYouTubeAPI() {
  console.log('Testing YouTube API integration...');
  
  try {
    // Test with a known YouTube channel
    console.log('\n1. Testing channel search by username...');
    const channelId = await youtubeService.findChannelByUsername('MrBeast');
    
    if (channelId) {
      console.log(`✓ Found channel ID: ${channelId}`);
      
      console.log('\n2. Testing channel statistics...');
      const stats = await youtubeService.getChannelStats(channelId);
      
      if (stats) {
        console.log('✓ Channel statistics retrieved:');
        console.log(`  - Channel: ${stats.channelTitle}`);
        console.log(`  - Subscribers: ${stats.subscriberCount.toLocaleString()}`);
        console.log(`  - Videos: ${stats.videoCount.toLocaleString()}`);
        console.log(`  - Views: ${stats.viewCount.toLocaleString()}`);
        
        console.log('\n3. Testing recent videos...');
        const videos = await youtubeService.getChannelVideos(channelId, 3);
        console.log(`✓ Retrieved ${videos.length} recent videos`);
        videos.forEach((video, index) => {
          console.log(`  ${index + 1}. ${video.title} - ${video.viewCount.toLocaleString()} views`);
        });
        
      } else {
        console.log('✗ Failed to get channel statistics');
      }
    } else {
      console.log('✗ Channel not found');
    }
    
  } catch (error) {
    console.error('✗ YouTube API test failed:', error.message);
  }
}

testYouTubeAPI();