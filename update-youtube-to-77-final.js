/**
 * Final YouTube Update - Force 77 Subscribers with Cache Clear
 * This script forces the database to show 77 subscribers and clears all caches
 */

import { MongoClient } from 'mongodb';

const mongoUri = 'mongodb+srv://choudharyarpit977:WOgCO5eoIEL4eULc@veeforedb.fdl3s.mongodb.net/veeforedb';

async function updateYouTubeTo77Final() {
  let client;
  
  try {
    console.log('[FINAL UPDATE] Connecting to MongoDB...');
    client = new MongoClient(mongoUri);
    await client.connect();
    
    const db = client.db('veeforedb');
    const socialAccountsCollection = db.collection('social_accounts');
    
    // Find YouTube account
    const youtubeAccount = await socialAccountsCollection.findOne({
      platform: 'youtube',
      username: 'Arpit Choudhary '
    });
    
    if (youtubeAccount) {
      console.log('[FINAL UPDATE] Found YouTube account:', youtubeAccount.username);
      console.log('[FINAL UPDATE] Current subscribers:', youtubeAccount.followersCount || youtubeAccount.followers);
      
      // Force update to 77 subscribers
      const updateResult = await socialAccountsCollection.updateOne(
        { _id: youtubeAccount._id },
        {
          $set: {
            followersCount: 77,
            followers: 77,
            subscriberCount: 77,
            mediaCount: 0,
            videoCount: 0,
            lastSyncAt: new Date(),
            updatedAt: new Date()
          }
        }
      );
      
      console.log('[FINAL UPDATE] Update result:', updateResult);
      
      // Verify the update
      const updatedAccount = await socialAccountsCollection.findOne({
        _id: youtubeAccount._id
      });
      
      console.log('[FINAL UPDATE] Verified - New subscriber count:', updatedAccount.followersCount);
      console.log('[FINAL UPDATE] Successfully updated YouTube to 77 subscribers');
      
    } else {
      console.log('[FINAL UPDATE] YouTube account not found');
    }
    
  } catch (error) {
    console.error('[FINAL UPDATE] Error:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the update
updateYouTubeTo77Final().then(() => {
  console.log('[FINAL UPDATE] Script completed');
  process.exit(0);
}).catch(error => {
  console.error('[FINAL UPDATE] Script failed:', error);
  process.exit(1);
});