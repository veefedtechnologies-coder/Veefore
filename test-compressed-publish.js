import axios from 'axios';
import fs from 'fs';

async function testCompressedVideoPublish() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const videoUrl = 'https://15a46e73-e0eb-45c2-8225-17edc84946f6-00-1dy2h828k4y1r.worf.replit.dev/uploads/compressed-ready-for-instagram.mp4';
  
  console.log('Testing compressed video publish...');
  console.log('Video URL:', videoUrl);
  
  try {
    // Create media container
    console.log('Creating media container...');
    const containerResponse = await axios.post('https://graph.instagram.com/me/media', {
      video_url: videoUrl,
      caption: 'Test compressed video from VeeFore - 55MB compressed to 258KB',
      media_type: 'REELS',
      access_token: accessToken
    });
    
    const containerId = containerResponse.data.id;
    console.log('Container created:', containerId);
    
    // Wait for processing
    console.log('Waiting 15 seconds for processing...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Publish the container
    console.log('Publishing container...');
    const publishResponse = await axios.post('https://graph.instagram.com/me/media_publish', {
      creation_id: containerId,
      access_token: accessToken
    });
    
    console.log('SUCCESS! Published video:', publishResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testCompressedVideoPublish();