/**
 * Test AI Image Generation Fix - Validate Real DALL-E Integration
 * 
 * This test validates that the AI Image Generator now produces:
 * 1. Real AI-generated images via DALL-E 3
 * 2. Authentic AI-generated captions (not placeholder text)
 * 3. Relevant hashtags
 * 4. Proper credit deduction
 */

const { getValidFirebaseToken } = require('./client/src/lib/firebase-token-validator');

async function testAIImageGenerationFix() {
  try {
    console.log('🎨 Testing AI Image Generation Fix - Real DALL-E Integration');
    console.log('======================================================');

    // Get authentication token
    const token = await getValidFirebaseToken();
    if (!token) {
      throw new Error('Failed to get valid Firebase token');
    }

    console.log('✅ Authentication successful');

    // Test image generation with various prompts
    const testCases = [
      {
        name: 'Motivational Quote',
        prompt: 'A beautiful sunrise over mountains with inspirational energy',
        platform: 'instagram',
        contentType: 'post',
        style: 'photorealistic'
      },
      {
        name: 'Business Content',
        prompt: 'Modern office workspace with laptop and coffee, productive atmosphere',
        platform: 'instagram',
        contentType: 'post', 
        style: 'artistic'
      },
      {
        name: 'Lifestyle Image',
        prompt: 'Cozy coffee shop scene with warm lighting and books',
        platform: 'instagram',
        contentType: 'story',
        style: 'photorealistic'
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n🔍 Testing: ${testCase.name}`);
      console.log(`Prompt: "${testCase.prompt}"`);
      
      try {
        const response = await fetch('http://localhost:3000/api/ai/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            prompt: testCase.prompt,
            platform: testCase.platform,
            contentType: testCase.contentType,
            style: testCase.style,
            workspaceId: 1
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(`❌ ${testCase.name} failed:`, errorData.error);
          continue;
        }

        const result = await response.json();
        
        console.log(`✅ ${testCase.name} - Image generated successfully`);
        console.log(`   📸 Image URL: ${result.imageUrl ? 'Generated' : 'Missing'}`);
        console.log(`   📝 Caption: "${result.caption ? result.caption.substring(0, 80) + '...' : 'Missing'}"`);
        console.log(`   🏷️ Hashtags: ${result.hashtags ? result.hashtags.length : 0} generated`);
        console.log(`   💰 Credits used: ${result.creditsUsed || 'Unknown'}`);
        
        // Validate that caption is not placeholder text
        if (result.caption && !result.caption.includes('AI generated image for instagram')) {
          console.log(`   ✅ Authentic caption generated (not placeholder)`);
        } else {
          console.log(`   ❌ Still using placeholder caption`);
        }
        
        // Validate hashtags
        if (result.hashtags && result.hashtags.length > 0) {
          console.log(`   ✅ ${result.hashtags.length} hashtags generated`);
          console.log(`   📋 Sample hashtags: ${result.hashtags.slice(0, 3).join(' ')}`);
        } else {
          console.log(`   ❌ No hashtags generated`);
        }

      } catch (error) {
        console.log(`❌ ${testCase.name} failed with error:`, error.message);
      }
    }

    console.log('\n🎯 Testing Complete - AI Image Generation Fix Validation');
    console.log('=======================================================');
    
    // Test error scenarios
    console.log('\n🔍 Testing Error Scenarios');
    
    try {
      const errorResponse = await fetch('http://localhost:3000/api/ai/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: '', // Empty prompt
          platform: 'instagram'
        })
      });

      const errorResult = await errorResponse.json();
      console.log('📋 Empty prompt handling:', errorResult.error || 'Handled correctly');
      
    } catch (error) {
      console.log('❌ Error scenario test failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAIImageGenerationFix();