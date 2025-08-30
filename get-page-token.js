// Helper script to convert User Access Token to Page Access Token
// Usage: node get-page-token.js YOUR_USER_ACCESS_TOKEN

const userToken = process.argv[2];

if (!userToken) {
  console.log('❌ Please provide your User Access Token');
  console.log('Usage: node get-page-token.js YOUR_USER_ACCESS_TOKEN');
  process.exit(1);
}

async function getPageToken() {
  try {
    console.log('🔍 Getting your Facebook Pages...');
    
    const response = await fetch(`https://graph.facebook.com/me/accounts?access_token=${userToken}`);
    const data = await response.json();
    
    if (data.error) {
      console.log('❌ Error:', data.error.message);
      return;
    }
    
    console.log('📱 Found', data.data.length, 'pages:');
    console.log('');
    
    for (const page of data.data) {
      console.log('📄 Page:', page.name);
      console.log('🆔 Page ID:', page.id);
      console.log('🔑 Page Access Token:', page.access_token);
      console.log('📋 Permissions:', page.tasks);
      
      // Check if this page has Instagram
      try {
        const igResponse = await fetch(`https://graph.facebook.com/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`);
        const igData = await igResponse.json();
        
        if (igData.instagram_business_account) {
          console.log('📸 ✅ Has Instagram Business Account:', igData.instagram_business_account.id);
          console.log('🎯 USE THIS TOKEN FOR VEEFORE:', page.access_token);
        } else {
          console.log('📸 ❌ No Instagram Business Account');
        }
      } catch (error) {
        console.log('📸 ❓ Instagram check failed');
      }
      
      console.log('─'.repeat(80));
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

getPageToken();