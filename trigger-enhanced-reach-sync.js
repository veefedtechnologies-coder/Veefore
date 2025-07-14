import { MongoStorage } from './server/mongodb-storage.ts';
import { InstagramDirectSync } from './server/instagram-direct-sync.ts';

async function triggerEnhancedReachSync() {
  console.log('[ENHANCED REACH SYNC] Starting comprehensive reach extraction...');
  
  try {
    const storage = new MongoStorage();
    const instagramSync = new InstagramDirectSync(storage);
    
    // Target the workspace showing 139 reach instead of ~747
    const workspaceId = '68449f3852d33d75b31ce737';
    
    console.log('[ENHANCED REACH SYNC] Triggering comprehensive post-level reach extraction...');
    console.log('[ENHANCED REACH SYNC] Expected: 341+124+130+20+14+118 = ~747 total reach');
    console.log('[ENHANCED REACH SYNC] Current: 139 reach (missing ~608 reach)');
    
    await instagramSync.updateAccountWithRealData(workspaceId);
    
    console.log('[ENHANCED REACH SYNC] Enhanced reach extraction complete');
    
  } catch (error) {
    console.error('[ENHANCED REACH SYNC] Error:', error);
  } finally {
    process.exit(0);
  }
}

triggerEnhancedReachSync();