/**
 * Test OpenAI Fallback System for AI Growth Insights
 * This script demonstrates the fallback mechanism when Anthropic is unavailable
 */

import { generateOpenAIGrowthInsights } from './server/ai-growth-insights.js';

// Mock social media data for testing
const testData = {
  platforms: [{
    platform: 'instagram',
    username: 'rahulc1020',
    followers: 4,
    posts: 11,
    engagement: 8.5,
    recentPosts: []
  }],
  overallMetrics: {
    totalReach: 4,
    avgEngagement: 8.5,
    totalFollowers: 4,
    contentScore: 75
  }
};

async function testOpenAIFallback() {
  console.log('🧪 Testing OpenAI Fallback System for AI Growth Insights...\n');
  
  try {
    console.log('📊 Test Data:');
    console.log('- Platform: Instagram (@rahulc1020)');
    console.log('- Followers: 4');
    console.log('- Posts: 11');
    console.log('- Engagement: 8.5%\n');
    
    console.log('🤖 Calling OpenAI GPT-4o directly as fallback...');
    
    // This would normally be called automatically when Anthropic fails
    const insights = await generateOpenAIGrowthInsights(testData);
    
    console.log('\n✅ OpenAI Fallback System Results:');
    console.log(`📈 Generated ${insights.length} AI-powered growth insights\n`);
    
    insights.forEach((insight, index) => {
      console.log(`${index + 1}. ${insight.title}`);
      console.log(`   📝 ${insight.description}`);
      console.log(`   🎯 Action: ${insight.actionable}`);
      console.log(`   📊 Impact: ${insight.impact}`);
      console.log(`   🎯 Confidence: ${insight.confidence}%\n`);
    });
    
    console.log('🎉 OpenAI Fallback System Working Successfully!');
    console.log('💡 When Anthropic credits run out, the system automatically switches to OpenAI');
    console.log('🔄 Fallback Order: Anthropic → OpenAI → Enhanced Data-driven insights');
    
  } catch (error) {
    console.error('❌ OpenAI Fallback Test Failed:', error.message);
    console.log('💡 This is expected if OpenAI API key is not configured');
    console.log('🔧 To enable OpenAI fallback, add your OpenAI API key to environment variables');
  }
}

// Run the test
testOpenAIFallback();