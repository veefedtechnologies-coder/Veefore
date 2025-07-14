import axios from 'axios';

async function testCurrentTokenStatus() {
  console.log('Testing current Instagram access token status...');
  
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.log('No INSTAGRAM_ACCESS_TOKEN found in environment');
    return;
  }
  
  try {
    // Test token validity
    const response = await axios.get(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
    
    if (response.status === 200 && response.data.id) {
      console.log('Token is valid and active');
      console.log('Instagram Account:', response.data);
    }
    
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    console.log('Token validation failed:', errorMessage);
    
    if (errorMessage.includes('expired') || errorMessage.includes('Cannot parse access token')) {
      console.log('Token has expired - need to refresh or get new token');
    }
    
    if (errorMessage.includes('Invalid') || errorMessage.includes('malformed')) {
      console.log('Token format is invalid');
    }
  }
}

testCurrentTokenStatus().catch(console.error);