/**
 * Update YouTube Data to Current 77 Subscribers
 * Direct MongoDB update to fix subscriber count
 */

const { MongoClient } = require('mongodb');

async function updateYouTubeData() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    console.log('[YOUTUBE UPDATE] Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db();
    const socialAccounts = db.collection('SocialAccount');
    
    console.log('[YOUTUBE UPDATE] Updating YouTube account to 77 subscribers...');
    
    // Update YouTube account with current data
    const result = await socialAccounts.updateOne(
      { platform: 'youtube', username: /Arpit/i },
      {
        $set: {
          subscriberCount: 77,
          followersCount: 77,
          followers: 77,
          videoCount: 0,
          mediaCount: 0,
          viewCount: 0,
          lastSyncAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount > 0) {
      console.log('[YOUTUBE UPDATE] ✓ Successfully updated YouTube account');
      console.log('[YOUTUBE UPDATE] ✓ Subscriber count: 77');
      console.log('[YOUTUBE UPDATE] ✓ Video count: 0');
    } else {
      console.log('[YOUTUBE UPDATE] ✗ No YouTube account found to update');
    }
    
    // Verify the update
    const updatedAccount = await socialAccounts.findOne({ platform: 'youtube' });
    if (updatedAccount) {
      console.log('[YOUTUBE UPDATE] ✓ Verification - Current data:');
      console.log(`[YOUTUBE UPDATE]   - Username: ${updatedAccount.username}`);
      console.log(`[YOUTUBE UPDATE]   - Subscribers: ${updatedAccount.subscriberCount || updatedAccount.followersCount}`);
      console.log(`[YOUTUBE UPDATE]   - Videos: ${updatedAccount.videoCount || updatedAccount.mediaCount}`);
    }
    
  } catch (error) {
    console.log('[YOUTUBE UPDATE] Error:', error);
  } finally {
    await client.close();
    console.log('[YOUTUBE UPDATE] MongoDB connection closed');
  }
}

updateYouTubeData();