/**
 * Instagram Publishing Debug - Comprehensive Diagnosis
 * 
 * This script tests the complete Instagram publishing flow to identify
 * why posts aren't appearing despite successful API responses.
 */

import { MongoClient } from 'mongodb';

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/veeforedb';

async function debugInstagramPublishing() {
  console.log('🔍 INSTAGRAM PUBLISHING DEBUG - Comprehensive Analysis');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  let client;
  
  try {
    // Connect to MongoDB
    console.log('\n=== STEP 1: Database Connection ===');
    client = new MongoClient(mongoUrl);
    await client.connect();
    const db = client.db('veeforedb');
    console.log('✓ Connected to MongoDB');
    
    // Check Instagram accounts
    console.log('\n=== STEP 2: Instagram Account Verification ===');
    const socialAccounts = await db.collection('social_accounts').find({
      platform: 'instagram'
    }).toArray();
    
    console.log(`Found ${socialAccounts.length} Instagram accounts:`);
    socialAccounts.forEach((account, index) => {
      console.log(`  ${index + 1}. @${account.username}`);
      console.log(`     Account ID: ${account.accountId}`);
      console.log(`     Access Token: ${account.accessToken ? 'Present' : 'Missing'}`);
      console.log(`     Token Preview: ${account.accessToken ? account.accessToken.substring(0, 20) + '...' : 'N/A'}`);
      console.log(`     Workspace: ${account.workspaceId}`);
    });
    
    if (socialAccounts.length === 0) {
      console.log('❌ NO INSTAGRAM ACCOUNTS FOUND');
      console.log('   This is the primary issue - no connected Instagram accounts');
      return;
    }
    
    const account = socialAccounts[0];
    
    // Test media URL accessibility
    console.log('\n=== STEP 3: Media URL Testing ===');
    const testUrls = [
      'http://localhost:5000/api/generated-content/test_image_debug.jpg',
      'http://localhost:5000/api/generated-content/test_video_debug.mp4'
    ];
    
    for (const url of testUrls) {
      try {
        const response = await fetch(url, { redirect: 'manual' });
        console.log(`✓ ${url}`);
        console.log(`  Status: ${response.status}`);
        console.log(`  Redirect: ${response.headers.get('location') || 'None'}`);
      } catch (error) {
        console.log(`❌ ${url}`);
        console.log(`  Error: ${error.message}`);
      }
    }
    
    // Test Instagram API connectivity
    console.log('\n=== STEP 4: Instagram API Connectivity ===');
    
    if (!account.accessToken || !account.accountId) {
      console.log('❌ Missing access token or account ID');
      console.log('   Cannot test Instagram API without valid credentials');
      return;
    }
    
    // Test basic Instagram API access
    const profileUrl = `https://graph.instagram.com/v21.0/${account.accountId}?fields=id,username,account_type&access_token=${account.accessToken}`;
    
    try {
      const profileResponse = await fetch(profileUrl);
      const profileData = await profileResponse.json();
      
      if (profileResponse.ok) {
        console.log('✓ Instagram API connectivity successful');
        console.log(`  Profile: @${profileData.username}`);
        console.log(`  Account Type: ${profileData.account_type}`);
        console.log(`  Account ID: ${profileData.id}`);
      } else {
        console.log('❌ Instagram API connectivity failed');
        console.log(`  Error: ${profileData.error?.message || 'Unknown error'}`);
        console.log(`  Code: ${profileData.error?.code || 'N/A'}`);
        
        if (profileData.error?.code === 190) {
          console.log('   → ACCESS TOKEN EXPIRED - User needs to reconnect Instagram');
        }
        return;
      }
    } catch (error) {
      console.log('❌ Network error connecting to Instagram API');
      console.log(`  Error: ${error.message}`);
      return;
    }
    
    // Test media container creation (simulation)
    console.log('\n=== STEP 5: Media Container Creation Test ===');
    
    const testMediaUrl = 'http://localhost:5000/api/generated-content/debug_test_image.jpg';
    const containerPayload = {
      image_url: testMediaUrl,
      caption: 'VeeFore Instagram Publishing Debug Test',
      access_token: account.accessToken
    };
    
    console.log('Container payload:', JSON.stringify(containerPayload, null, 2));
    
    const containerEndpoint = `https://graph.instagram.com/v21.0/${account.accountId}/media`;
    
    try {
      console.log(`Calling: ${containerEndpoint}`);
      
      // Note: This is a simulation - we won't actually create the container
      // to avoid posting test content to the real Instagram account
      console.log('⚠️  SIMULATION MODE - Not creating actual container');
      console.log('   Real container creation would use:');
      console.log(`   POST ${containerEndpoint}`);
      console.log(`   Body: ${JSON.stringify(containerPayload, null, 2)}`);
      
    } catch (error) {
      console.log('❌ Container creation simulation failed');
      console.log(`  Error: ${error.message}`);
    }
    
    // Check for potential issues
    console.log('\n=== STEP 6: Issue Analysis ===');
    
    const issues = [];
    
    // Check media URL format
    if (!testMediaUrl.startsWith('http')) {
      issues.push('Media URLs must be absolute URLs for Instagram API');
    }
    
    // Check access token validity
    if (account.accessToken && account.accessToken.length < 50) {
      issues.push('Access token appears too short - may be invalid');
    }
    
    // Check account permissions
    if (profileData && profileData.account_type !== 'BUSINESS') {
      issues.push('Instagram publishing requires a Business account');
    }
    
    if (issues.length > 0) {
      console.log('❌ Potential Issues Found:');
      issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
    } else {
      console.log('✓ No obvious issues detected');
    }
    
    // Recommendations
    console.log('\n=== STEP 7: Recommendations ===');
    console.log('1. Verify media URLs return actual images/videos (not redirects)');
    console.log('2. Ensure Instagram access token is fresh and valid');
    console.log('3. Check that Instagram account has publishing permissions');
    console.log('4. Verify two-step publishing process completes both steps');
    console.log('5. Monitor Instagram API responses for detailed error messages');
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('• Test with a fresh Instagram access token');
    console.log('• Implement better error handling in publishing flow');
    console.log('• Add detailed logging for each publishing step');
    console.log('• Verify media content meets Instagram requirements');
    
  } catch (error) {
    console.error('❌ Debug script failed:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run debug analysis
debugInstagramPublishing().catch(console.error);