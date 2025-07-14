// Script to manually trigger Instagram reach data sync with individual post insights
import { InstagramDirectSync } from './server/instagram-direct-sync.ts';
import { MongoStorage } from './server/mongodb-storage.ts';

async function fixInstagramReachData() {
  console.log('[FIX REACH] Starting Instagram reach data fix...');
  
  try {
    const storage = new MongoStorage();
    const instagramSync = new InstagramDirectSync(storage);
    
    // Target workspace with incorrect reach data
    const workspaceId = '68449f3852d33d75b31ce737';
    
    console.log('[FIX REACH] Updating Instagram data with individual post insights...');
    await instagramSync.updateAccountWithRealData(workspaceId);
    
    // Get updated data
    const accounts = await storage.getSocialAccountsByWorkspace(workspaceId);
    const instagramAccount = accounts.find(acc => acc.platform === 'instagram');
    
    console.log('[FIX REACH] Updated Instagram account data:', {
      username: instagramAccount?.username,
      totalReach: instagramAccount?.totalReach,
      totalLikes: instagramAccount?.totalLikes,
      totalComments: instagramAccount?.totalComments,
      mediaCount: instagramAccount?.mediaCount,
      avgEngagement: instagramAccount?.avgEngagement
    });
    
    console.log('[FIX REACH] Instagram reach data fix completed successfully!');
  } catch (error) {
    console.error('[FIX REACH] Error fixing Instagram reach data:', error);
  }
}

fixInstagramReachData();