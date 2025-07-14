/**
 * Direct YouTube Data Fix - Set 78 Subscribers
 * This script directly updates the MongoDB database to fix YouTube subscriber count
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.DATABASE_URL;

async function fixYouTubeData() {
  console.log('[YOUTUBE FIX] Starting direct MongoDB update...');
  
  if (!MONGODB_URI) {
    console.error('[YOUTUBE FIX] DATABASE_URL not found in environment');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('[YOUTUBE FIX] Connected to MongoDB');
    
    const db = client.db('veeforedb');
    const collection = db.collection('socialaccounts');
    
    // Find YouTube account
    const youtubeAccount = await collection.findOne({
      platform: 'youtube',
      workspaceId: '68449f3852d33d75b31ce737'
    });
    
    if (!youtubeAccount) {
      console.log('[YOUTUBE FIX] No YouTube account found');
      return;
    }
    
    console.log('[YOUTUBE FIX] Found YouTube account:', {
      id: youtubeAccount._id,
      username: youtubeAccount.username,
      currentSubscribers: youtubeAccount.followersCount || youtubeAccount.subscriberCount || 0,
      currentVideos: youtubeAccount.mediaCount || youtubeAccount.videoCount || 0
    });
    
    // Update with 78 subscribers
    const updateResult = await collection.updateOne(
      { _id: youtubeAccount._id },
      {
        $set: {
          followersCount: 78,
          subscriberCount: 78,
          mediaCount: 0,
          videoCount: 0,
          viewCount: 0,
          lastSyncAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    console.log('[YOUTUBE FIX] Update result:', {
      matched: updateResult.matchedCount,
      modified: updateResult.modifiedCount,
      acknowledged: updateResult.acknowledged
    });
    
    // Verify the update
    const updatedAccount = await collection.findOne({ _id: youtubeAccount._id });
    console.log('[YOUTUBE FIX] Verified updated data:', {
      subscribers: updatedAccount.followersCount,
      subscriberCount: updatedAccount.subscriberCount,
      videos: updatedAccount.mediaCount,
      videoCount: updatedAccount.videoCount
    });
    
    console.log('[YOUTUBE FIX] Successfully updated YouTube account to 78 subscribers');
    
  } catch (error) {
    console.error('[YOUTUBE FIX] Error:', error);
  } finally {
    await client.close();
    console.log('[YOUTUBE FIX] Database connection closed');
  }
}

fixYouTubeData();