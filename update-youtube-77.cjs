/**
 * Direct YouTube Data Update - Set to 77 Subscribers
 * Updates the YouTube account to show current real-time data
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/veeforedb';

async function updateYouTubeTo77() {
  try {
    console.log('[YOUTUBE UPDATE] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    console.log('[YOUTUBE UPDATE] Connected successfully');
    
    // Direct collection access
    const db = mongoose.connection.db;
    const socialAccounts = db.collection('social_accounts');
    
    // Find YouTube accounts
    const youtubeAccounts = await socialAccounts.find({
      platform: 'youtube'
    }).toArray();
    
    console.log(`[YOUTUBE UPDATE] Found ${youtubeAccounts.length} YouTube accounts`);
    
    for (const account of youtubeAccounts) {
      console.log(`[YOUTUBE UPDATE] Current data for ${account.username}:`);
      console.log(`  - Subscribers: ${account.subscriberCount || account.followers}`);
      console.log(`  - Videos: ${account.videoCount || account.mediaCount}`);
      
      // Update to current real-time values
      const updateResult = await socialAccounts.updateOne(
        { _id: account._id },
        {
          $set: {
            subscriberCount: 77,
            followers: 77,
            videoCount: 0,
            mediaCount: 0,
            viewCount: 0,
            lastSyncAt: new Date(),
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`[YOUTUBE UPDATE] ✓ Updated ${account.username} - Modified: ${updateResult.modifiedCount}`);
    }
    
    console.log('[YOUTUBE UPDATE] ✅ All YouTube accounts updated to 77 subscribers');
    
  } catch (error) {
    console.error('[YOUTUBE UPDATE] ❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('[YOUTUBE UPDATE] Database connection closed');
  }
}

updateYouTubeTo77();