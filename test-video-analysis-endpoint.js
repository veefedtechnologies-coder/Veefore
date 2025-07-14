/**
 * Test Video Analysis Endpoint Response
 * This script tests the actual API response structure from the video analysis endpoint
 */

const testVideoAnalysisAPI = async () => {
  try {
    // Test with a sample YouTube URL
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    
    console.log('Testing video analysis endpoint...');
    console.log('Test URL:', testUrl);
    
    const response = await fetch('http://localhost:5000/api/ai/analyze-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({
        videoUrl: testUrl
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    const data = await response.json();
    
    console.log('\nAPI Response Structure:');
    console.log(JSON.stringify(data, null, 2));
    
    // Validate response structure
    console.log('\nResponse Validation:');
    console.log('✓ success:', data.hasOwnProperty('success') ? 'Present' : 'Missing');
    console.log('✓ creditsUsed:', data.hasOwnProperty('creditsUsed') ? 'Present' : 'Missing');
    console.log('✓ remainingCredits:', data.hasOwnProperty('remainingCredits') ? 'Present' : 'Missing');
    console.log('✓ analysis:', data.hasOwnProperty('analysis') ? 'Present' : 'Missing');
    
    if (data.analysis) {
      console.log('\nAnalysis Object Validation:');
      console.log('✓ title:', data.analysis.hasOwnProperty('title') ? 'Present' : 'Missing');
      console.log('✓ totalDuration:', data.analysis.hasOwnProperty('totalDuration') ? 'Present' : 'Missing');
      console.log('✓ themes:', data.analysis.hasOwnProperty('themes') ? 'Present' : 'Missing');
      console.log('✓ bestSegments:', data.analysis.hasOwnProperty('bestSegments') ? 'Present' : 'Missing');
    }
    
    return data;
    
  } catch (error) {
    console.error('Test failed:', error.message);
    return null;
  }
};

testVideoAnalysisAPI();