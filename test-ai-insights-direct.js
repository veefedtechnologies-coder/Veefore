/**
 * Test AI Growth Insights Direct API Call
 * This script tests the AI Growth Insights API with proper authentication
 */

const axios = require('axios');

async function testAIInsightsAPI() {
  try {
    console.log('🧪 Testing AI Growth Insights API...');
    
    // Test without authentication first to see if it reaches the handler
    const response = await axios.get('http://localhost:5000/api/ai-growth-insights', {
      headers: {
        'Authorization': 'Bearer test-token-bypass-auth'
      },
      timeout: 30000
    });
    
    console.log('✅ API Response Status:', response.status);
    console.log('📊 Insights Count:', response.data.insights?.length || 0);
    
    if (response.data.insights && response.data.insights.length > 0) {
      console.log('🎯 First Insight:', {
        title: response.data.insights[0].title,
        type: response.data.insights[0].type,
        priority: response.data.insights[0].priority
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ API Test Failed:', error.response?.status, error.response?.data || error.message);
    return false;
  }
}

testAIInsightsAPI().then(success => {
  console.log('🔍 Test Result:', success ? 'SUCCESS' : 'FAILED');
  process.exit(success ? 0 : 1);
});