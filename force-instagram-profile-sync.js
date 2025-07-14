/**
 * Force Instagram Profile Picture Sync
 * Manually triggers Instagram sync to populate profile_picture_url field
 */

import mongoose from 'mongoose';
import { config } from 'dotenv';
import { MongoStorage } from './server/mongodb-storage.js';

config();

async function forceInstagramProfileSync() {
  try {
    console.log('Starting Instagram profile sync...');
    
    // Initialize storage
    const storage = new MongoStorage();
    
    // Get Instagram accounts
    const allAccounts = await storage.getAllSocialAccounts();
    const instagramAccounts = allAccounts.filter(acc => acc.platform === 'instagram');
    
    console.log(`Found ${instagramAccounts.length} Instagram accounts`);
    
    for (const account of instagramAccounts) {
      console.log(`\nProcessing Instagram account: @${account.username}`);
      console.log('Current profile picture URL:', account.profilePictureUrl || 'NOT SET');
      
      if (!account.accessToken) {
        console.log('⚠️  No access token found, skipping sync');
        continue;
      }
      
      // Manually fetch Instagram profile data
      const apiUrl = `https://graph.instagram.com/me?fields=account_type,followers_count,media_count,profile_picture_url&access_token=${account.accessToken}`;
      
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (response.ok && data.profile_picture_url) {
          console.log('✅ Fetched profile picture from Instagram API:', data.profile_picture_url);
          
          // Update account with profile picture
          await storage.updateSocialAccount(account.id, {
            profilePictureUrl: data.profile_picture_url,
            followersCount: data.followers_count,
            mediaCount: data.media_count,
            lastSyncAt: new Date(),
            updatedAt: new Date()
          });
          
          console.log('✅ Successfully updated profile picture in database');
          
          // Verify the update
          const updatedAccount = await storage.getSocialAccountById(account.id);
          console.log('✅ Verification - Profile picture now set:', updatedAccount.profilePictureUrl ? 'YES' : 'NO');
          
        } else {
          console.error('❌ Instagram API error:', data.error?.message || 'Unknown error');
        }
      } catch (apiError) {
        console.error('❌ Failed to fetch from Instagram API:', apiError.message);
      }
    }
    
    console.log('\n✅ Instagram profile sync completed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Instagram profile sync failed:', error);
    process.exit(1);
  }
}

forceInstagramProfileSync();