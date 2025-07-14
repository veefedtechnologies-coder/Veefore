import { MongoClient } from 'mongodb';

async function testRealContentAPI() {
  console.log('Testing real Instagram content API...');
  
  try {
    const client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    const db = client.db('veeforedb');
    
    // Find the Instagram account
    const account = await db.collection('social_accounts').findOne({
      platform: 'instagram',
      username: 'arpit9996363'
    });
    
    if (!account) {
      console.log('No Instagram account found');
      return;
    }
    
    console.log('✓ Account found:', account.username);
    console.log('✓ Account ID:', account.accountId);
    console.log('✓ Has access token:', !!account.accessToken);
    
    if (account.accessToken) {
      // Test Instagram Business API media endpoint
      const mediaUrl = `https://graph.facebook.com/v21.0/${account.accountId}/media?fields=id,caption,like_count,comments_count,timestamp,media_type,media_url,thumbnail_url,permalink&limit=10&access_token=${account.accessToken}`;
      
      console.log('\n📱 Testing Instagram Business API media fetch...');
      
      const response = await fetch(mediaUrl);
      const result = await response.json();
      
      console.log('API Status:', response.status);
      
      if (response.ok && result.data) {
        console.log('🎉 SUCCESS: Found', result.data.length, 'real Instagram posts');
        
        result.data.forEach((post, i) => {
          console.log(`\nPost ${i+1}:`);
          console.log('  ID:', post.id);
          console.log('  Type:', post.media_type);
          console.log('  Caption:', post.caption ? post.caption.substring(0, 80) + '...' : 'No caption');
          console.log('  Likes:', post.like_count || 0);
          console.log('  Comments:', post.comments_count || 0);
          console.log('  Date:', new Date(post.timestamp).toLocaleDateString());
          console.log('  Has media URL:', !!post.media_url);
          console.log('  Has thumbnail:', !!post.thumbnail_url);
        });
        
        // Test transform to content format
        console.log('\n🔄 Testing content transformation...');
        const transformedContent = result.data.map((post) => ({
          id: post.id,
          title: post.caption ? (post.caption.length > 60 ? post.caption.substring(0, 60) + '...' : post.caption) : 'Instagram Content',
          caption: post.caption || '',
          platform: 'instagram',
          type: post.media_type?.toLowerCase() === 'video' ? 'video' : 
                post.media_type?.toLowerCase() === 'carousel_album' ? 'carousel' : 'post',
          status: 'published',
          publishedAt: post.timestamp,
          mediaUrl: post.media_url,
          thumbnailUrl: post.thumbnail_url || post.media_url,
          permalink: post.permalink,
          engagement: {
            likes: post.like_count || 0,
            comments: post.comments_count || 0,
            shares: 0,
            reach: Math.round((post.like_count + post.comments_count) * 12.5)
          }
        }));
        
        console.log('✓ Transformed', transformedContent.length, 'posts for ContentPerformance display');
        console.log('Sample transformed post:', JSON.stringify(transformedContent[0], null, 2));
        
      } else {
        console.log('❌ API Error:', result.error || result);
        
        // Try token refresh if needed
        if (result.error?.code === 190) {
          console.log('\n🔄 Token expired, testing refresh...');
          const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${account.accessToken}`;
          
          const refreshResponse = await fetch(refreshUrl);
          const refreshResult = await refreshResponse.json();
          
          if (refreshResponse.ok && refreshResult.access_token) {
            console.log('✓ Token refreshed successfully');
            
            // Retry with new token
            const retryUrl = `https://graph.facebook.com/v21.0/${account.accountId}/media?fields=id,caption,like_count,comments_count,timestamp,media_type,media_url,thumbnail_url,permalink&limit=10&access_token=${refreshResult.access_token}`;
            const retryResponse = await fetch(retryUrl);
            const retryResult = await retryResponse.json();
            
            if (retryResponse.ok && retryResult.data) {
              console.log('🎉 SUCCESS after refresh:', retryResult.data.length, 'posts found');
            } else {
              console.log('❌ Still failed after refresh:', retryResult);
            }
          } else {
            console.log('❌ Token refresh failed:', refreshResult);
          }
        }
      }
    }
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRealContentAPI().catch(console.error);