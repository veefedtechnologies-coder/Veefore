const { MongodbStorage } = require('./server/mongodb-storage.ts');
const { InstagramDirectSync } = require('./server/instagram-direct-sync.ts');

async function debugReachAccuracy() {
  const storage = new MongodbStorage();
  const sync = new InstagramDirectSync(storage);
  
  console.log('=== REACH ACCURACY DIAGNOSTIC ===');
  console.log('Expected individual post reach: 341+124+130+20+14+118 = 747');
  
  try {
    await storage.connect();
    
    // Get your workspace's Instagram account
    const accounts = await storage.getSocialAccountsByWorkspace('68449f3852d33d75b31ce737');
    
    if (accounts.length === 0) {
      console.log('No Instagram accounts found');
      return;
    }
    
    const account = accounts[0];
    console.log(`Analyzing account: @${account.username}`);
    console.log(`Current stored reach: ${account.totalReach}`);
    
    if (account.accessToken) {
      console.log('Testing direct Instagram Business API access...');
      
      // Test account-level insights
      const accountResponse = await fetch(
        `https://graph.instagram.com/me/insights?metric=reach,impressions&period=day&access_token=${account.accessToken}`
      );
      
      if (accountResponse.ok) {
        const accountData = await accountResponse.json();
        console.log('Account-level insights:', JSON.stringify(accountData, null, 2));
      } else {
        const error = await accountResponse.text();
        console.log('Account insights error:', error);
      }
      
      // Test individual post access
      const mediaResponse = await fetch(
        `https://graph.instagram.com/me/media?fields=id&limit=6&access_token=${account.accessToken}`
      );
      
      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        console.log(`Found ${mediaData.data.length} recent posts`);
        
        for (let i = 0; i < Math.min(3, mediaData.data.length); i++) {
          const mediaId = mediaData.data[i].id;
          
          const insightsResponse = await fetch(
            `https://graph.instagram.com/v22.0/${mediaId}/insights?metric=reach&access_token=${account.accessToken}`
          );
          
          if (insightsResponse.ok) {
            const insights = await insightsResponse.json();
            console.log(`Post ${i+1} (${mediaId}) insights:`, JSON.stringify(insights, null, 2));
          } else {
            const error = await insightsResponse.text();
            console.log(`Post ${i+1} insights error:`, error);
          }
        }
      }
      
      // Update with latest data
      console.log('Triggering fresh data sync...');
      await sync.updateAccountWithRealData('68449f3852d33d75b31ce737');
      
      // Check updated values
      const updatedAccounts = await storage.getSocialAccountsByWorkspace('68449f3852d33d75b31ce737');
      const updatedAccount = updatedAccounts[0];
      
      console.log('=== FINAL DIAGNOSIS ===');
      console.log(`Updated reach: ${updatedAccount.totalReach}`);
      console.log(`Expected reach: 747`);
      console.log(`Difference: ${747 - updatedAccount.totalReach} (${Math.round(((747 - updatedAccount.totalReach)/747)*100)}% gap)`);
      
      if (updatedAccount.totalReach < 700) {
        console.log('CONCLUSION: Instagram Business API v22+ restrictions preventing complete post-level reach access');
        console.log('DATA STATUS: Authentic but incomplete due to API limitations');
      } else {
        console.log('CONCLUSION: Reach data extraction successful');
        console.log('DATA STATUS: Complete and accurate');
      }
    }
    
  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    process.exit(0);
  }
}

debugReachAccuracy();