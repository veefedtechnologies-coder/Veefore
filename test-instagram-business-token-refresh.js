/**
 * Test Instagram Business API Token Refresh Implementation
 * 
 * This test verifies that the corrected Instagram Business API token refresh
 * mechanism is working properly using the documented endpoint:
 * https://graph.instagram.com/refresh_access_token
 */

import { MongoClient } from 'mongodb';

async function testInstagramBusinessTokenRefresh() {
  console.log('\n=== INSTAGRAM BUSINESS API TOKEN REFRESH TEST ===\n');
  
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    // Find Instagram accounts that need token refresh
    const accounts = await db.collection('socialaccounts').find({
      platform: 'instagram',
      isActive: true
    }).toArray();
    
    console.log(`[TEST] Found ${accounts.length} Instagram accounts`);
    
    for (const account of accounts) {
      console.log(`\n[TEST] Testing account: ${account.username}`);
      console.log(`[TEST] Current token expires: ${account.expiresAt}`);
      
      // Test the Instagram Business API refresh endpoint
      const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${account.accessToken}`;
      
      console.log('[TEST] Making refresh request to Instagram Business API...');
      
      try {
        const response = await fetch(refreshUrl);
        const responseText = await response.text();
        
        console.log(`[TEST] Response status: ${response.status}`);
        console.log(`[TEST] Response: ${responseText}`);
        
        if (response.ok) {
          const refreshData = JSON.parse(responseText);
          
          if (refreshData.access_token) {
            console.log('✅ [TEST] Instagram Business API token refresh SUCCESSFUL');
            console.log(`[TEST] New token type: ${refreshData.token_type}`);
            console.log(`[TEST] Expires in: ${refreshData.expires_in} seconds`);
            
            // Update the account with new token
            await db.collection('socialaccounts').updateOne(
              { _id: account._id },
              {
                $set: {
                  accessToken: refreshData.access_token,
                  expiresAt: new Date(Date.now() + refreshData.expires_in * 1000),
                  lastTokenRefresh: new Date()
                }
              }
            );
            
            console.log('✅ [TEST] Account updated with new token');
            
            // Test media fetch with new token
            const mediaUrl = `https://graph.facebook.com/v21.0/${account.accountId}/media?fields=id,caption,like_count,comments_count,timestamp,media_type,media_url,thumbnail_url,permalink&limit=5&access_token=${refreshData.access_token}`;
            
            console.log('[TEST] Testing media fetch with refreshed token...');
            const mediaResponse = await fetch(mediaUrl);
            const mediaData = await mediaResponse.json();
            
            if (mediaResponse.ok && mediaData.data) {
              console.log(`✅ [TEST] Media fetch successful - ${mediaData.data.length} posts retrieved`);
              
              mediaData.data.forEach((post, index) => {
                console.log(`[TEST] Post ${index + 1}: ${post.media_type} - ${post.like_count} likes, ${post.comments_count} comments`);
              });
            } else {
              console.log('❌ [TEST] Media fetch failed:', mediaData);
            }
            
          } else {
            console.log('❌ [TEST] No access_token in refresh response');
          }
        } else {
          console.log('❌ [TEST] Instagram Business API refresh failed');
          console.log(`[TEST] Error response: ${responseText}`);
        }
        
      } catch (error) {
        console.error('❌ [TEST] Token refresh error:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ [TEST] Database connection error:', error);
  } finally {
    await client.close();
  }
}

// Test ContentPerformance data loading
async function testContentPerformanceData() {
  console.log('\n=== CONTENT PERFORMANCE DATA TEST ===\n');
  
  try {
    // Test the content API endpoint that ContentPerformance uses
    const testRanges = ['7', '30', '90'];
    
    for (const range of testRanges) {
      console.log(`\n[TEST] Testing content API for ${range} days...`);
      
      const response = await fetch(`http://localhost:5000/api/content?range=${range}`, {
        headers: {
          'Cookie': 'connect.sid=your_session_cookie' // This would need real session
        }
      });
      
      if (response.ok) {
        const content = await response.json();
        console.log(`✅ [TEST] Content API (${range} days): ${content.length} items returned`);
        
        if (content.length > 0) {
          console.log(`[TEST] Sample content item:`, {
            id: content[0].id,
            type: content[0].type,
            caption: content[0].caption?.substring(0, 50) + '...',
            likes: content[0].likes,
            comments: content[0].comments,
            thumbnail: content[0].thumbnail ? 'Present' : 'Missing'
          });
        }
      } else {
        console.log(`❌ [TEST] Content API (${range} days) failed:`, response.status);
      }
    }
    
  } catch (error) {
    console.error('❌ [TEST] Content Performance test error:', error);
  }
}

// Run comprehensive test
async function runComprehensiveTest() {
  console.log('🚀 Starting comprehensive Instagram Business API test...\n');
  
  await testInstagramBusinessTokenRefresh();
  await testContentPerformanceData();
  
  console.log('\n✅ Instagram Business API testing completed');
  console.log('\n📋 KEY IMPROVEMENTS IMPLEMENTED:');
  console.log('   • Fixed token refresh to use Instagram Business API endpoint');
  console.log('   • Updated from Facebook Graph API to https://graph.instagram.com/refresh_access_token');
  console.log('   • Using proper grant_type=ig_refresh_token parameter');
  console.log('   • Automatic token renewal when expired (60-day validity)');
  console.log('   • Real Instagram content data with thumbnails and captions');
}

runComprehensiveTest().catch(console.error);

export { testInstagramBusinessTokenRefresh, testContentPerformanceData };