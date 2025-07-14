// Comprehensive Instagram Business API reach testing
const fetch = require('node-fetch');

async function testComprehensiveReach() {
  const accessToken = 'EAADZCZCjpnwUBO4bpYnqKR9JGMJTjPGqXdZBJiMIWFCEJLZCoWwIb4rKt7k98IqfQsyoKpllFkXUCZA8Cg4MZBlz5eJlAEG8b1k6J6IIOG8Ci6jm0aFOEuUlNnb5JABAVUGd4v5Zr0a4G3feLZBoEUKhWrBDhV6QPsv8YpgTZA4nDbMpkUMxjUxUBZBNQVGAgQpLhQkZAl3ZB';
  const profileId = '29667910129519739';

  console.log('[COMPREHENSIVE REACH TEST] Starting Instagram Business API reach extraction...');
  
  // Test 1: Direct reach metric (as shown in documentation)
  console.log('\n=== TEST 1: Direct reach metric ===');
  try {
    const response1 = await fetch(
      `https://graph.instagram.com/${profileId}/insights?metric=reach&access_token=${accessToken}`
    );
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('SUCCESS - Direct reach:', JSON.stringify(data1, null, 2));
      
      if (data1.data && data1.data.length > 0) {
        const reachMetric = data1.data.find(m => m.name === 'reach');
        if (reachMetric) {
          console.log('REACH FOUND:', reachMetric.values);
        }
      }
    } else {
      const error1 = await response1.text();
      console.log('FAILED - Direct reach:', error1);
    }
  } catch (err) {
    console.log('ERROR - Direct reach:', err.message);
  }

  // Test 2: Reach with period parameter
  console.log('\n=== TEST 2: Reach with period ===');
  try {
    const response2 = await fetch(
      `https://graph.instagram.com/${profileId}/insights?metric=reach&period=day&access_token=${accessToken}`
    );
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('SUCCESS - Reach with period:', JSON.stringify(data2, null, 2));
    } else {
      const error2 = await response2.text();
      console.log('FAILED - Reach with period:', error2);
    }
  } catch (err) {
    console.log('ERROR - Reach with period:', err.message);
  }

  // Test 3: Multiple metrics approach
  console.log('\n=== TEST 3: Multiple metrics ===');
  try {
    const response3 = await fetch(
      `https://graph.instagram.com/${profileId}/insights?metric=reach,impressions,profile_views&access_token=${accessToken}`
    );
    
    if (response3.ok) {
      const data3 = await response3.json();
      console.log('SUCCESS - Multiple metrics:', JSON.stringify(data3, null, 2));
    } else {
      const error3 = await response3.text();
      console.log('FAILED - Multiple metrics:', error3);
    }
  } catch (err) {
    console.log('ERROR - Multiple metrics:', err.message);
  }

  // Test 4: Account insights endpoint
  console.log('\n=== TEST 4: Account insights endpoint ===');
  try {
    const response4 = await fetch(
      `https://graph.facebook.com/v22.0/${profileId}/insights/reach?access_token=${accessToken}`
    );
    
    if (response4.ok) {
      const data4 = await response4.json();
      console.log('SUCCESS - Account insights:', JSON.stringify(data4, null, 2));
    } else {
      const error4 = await response4.text();
      console.log('FAILED - Account insights:', error4);
    }
  } catch (err) {
    console.log('ERROR - Account insights:', err.message);
  }

  // Test 5: Business Discovery API
  console.log('\n=== TEST 5: Business Discovery ===');
  try {
    const response5 = await fetch(
      `https://graph.facebook.com/v22.0/?id=${profileId}&fields=business_discovery.username(arpit9996363){followers_count,media_count,biography}&access_token=${accessToken}`
    );
    
    if (response5.ok) {
      const data5 = await response5.json();
      console.log('SUCCESS - Business Discovery:', JSON.stringify(data5, null, 2));
    } else {
      const error5 = await response5.text();
      console.log('FAILED - Business Discovery:', error5);
    }
  } catch (err) {
    console.log('ERROR - Business Discovery:', err.message);
  }

  console.log('\n[COMPREHENSIVE REACH TEST] Testing complete');
}

testComprehensiveReach().catch(console.error);