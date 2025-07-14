// Test Instagram API configuration
import axios from 'axios';

async function testInstagramAuth() {
  console.log('[TEST] Starting Instagram API test...');
  
  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  
  console.log(`[TEST] App ID: ${appId ? 'Present' : 'Missing'}`);
  console.log(`[TEST] App Secret: ${appSecret ? 'Present' : 'Missing'}`);
  
  if (!appId || !appSecret) {
    console.log('[TEST] Missing Instagram credentials');
    return;
  }
  
  // Test redirect URI generation
  const redirectUri = 'https://15a46e73-e0eb-45c2-8225-17edc84946f6-00-1dy2h828k4y1r.worf.replit.dev/api/instagram/callback';
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish&response_type=code&state=test`;
  
  console.log('[TEST] Generated auth URL:', authUrl);
  
  // Test if we can validate the app configuration
  try {
    // This won't work without valid token, but we can check URL structure
    console.log('[TEST] Testing URL structure...');
    const url = new URL(authUrl);
    console.log('[TEST] URL is valid');
    console.log('[TEST] Client ID in URL:', url.searchParams.get('client_id'));
    console.log('[TEST] Redirect URI in URL:', url.searchParams.get('redirect_uri'));
    console.log('[TEST] Scope in URL:', url.searchParams.get('scope'));
  } catch (error) {
    console.log('[TEST] URL structure error:', error.message);
  }
}

testInstagramAuth().catch(console.error);