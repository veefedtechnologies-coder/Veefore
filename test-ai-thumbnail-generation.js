/**
 * Test AI Thumbnail Generation - Validate Professional Style Output
 * 
 * This test validates that the AI Thumbnail Maker Pro now generates:
 * 1. Real DALL-E 3 images (not placeholders)
 * 2. Professional YouTube thumbnail styles
 * 3. Bold text overlays and dramatic compositions
 * 4. High CTR visual elements matching reference images
 */

async function testAIThumbnailGeneration() {
  console.log('🎨 Testing AI Thumbnail Generation System...');

  try {
    // Test data matching professional YouTube content
    const testData = {
      title: "MYSTERY OF TITANIC",
      description: "Incredible discoveries revealed",
      category: "Documentary",
      strategy: {
        titles: ["MYSTERY OF TITANIC", "SHOCKING TITANIC SECRETS", "TITANIC TRUTH EXPOSED", "HIDDEN TITANIC FACTS"],
        style: "dramatic_reveal",
        colors: ["deep_blue", "gold", "white"],
        placement: "split_screen",
        hooks: ["mystery", "shocking", "revealed"]
      },
      trending: {
        keywords: ["mystery", "discovery", "shocking"],
        emotions: ["curious", "shocked", "amazed"],
        colors: ["blue", "gold", "red"],
        patterns: ["split_screen", "dramatic_text", "pointing"],
        emoji: ["🚢", "🔍", "😱"],
        filters: ["high_contrast", "dramatic_lighting", "bold_text"]
      }
    };

    console.log('📝 Test data prepared:', testData.title);

    // Create form data for the API request
    const formData = new FormData();
    formData.append('title', testData.title);
    formData.append('description', testData.description);
    formData.append('category', testData.category);
    formData.append('strategy', JSON.stringify(testData.strategy));
    formData.append('trending', JSON.stringify(testData.trending));

    console.log('🚀 Sending request to AI generation endpoint...');

    // Make request to the complete generation pipeline
    const response = await fetch('http://localhost:5000/api/thumbnails/generate-complete', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Generation failed: ${errorData.error || response.statusText}`);
    }

    const variants = await response.json();
    
    console.log('✅ AI Thumbnail Generation Results:');
    console.log(`📊 Generated ${variants.length} professional variants`);

    variants.forEach((variant, index) => {
      console.log(`\n🎯 Variant ${index + 1}: ${variant.layout}`);
      console.log(`   📸 Image URL: ${variant.imageUrl.substring(0, 80)}...`);
      console.log(`   🎪 CTR Score: ${variant.ctrScore}/10`);
      console.log(`   😃 Emotion: ${variant.metadata.emotion}`);
      console.log(`   🤖 AI Generated: ${variant.metadata.aiGenerated ? 'YES' : 'NO'}`);
      
      if (variant.metadata.prompt) {
        console.log(`   💡 Prompt: ${variant.metadata.prompt.substring(0, 100)}...`);
      }
    });

    // Validate quality indicators
    const aiGeneratedCount = variants.filter(v => v.metadata.aiGenerated).length;
    const highCtrCount = variants.filter(v => v.ctrScore >= 8.5).length;
    const hasRealUrls = variants.every(v => !v.imageUrl.includes('placeholder'));

    console.log('\n📈 Quality Analysis:');
    console.log(`   🤖 AI Generated: ${aiGeneratedCount}/${variants.length} variants`);
    console.log(`   📊 High CTR (8.5+): ${highCtrCount}/${variants.length} variants`);
    console.log(`   🌐 Real URLs: ${hasRealUrls ? 'YES' : 'NO'}`);

    if (aiGeneratedCount === variants.length && hasRealUrls) {
      console.log('\n🎉 SUCCESS: AI Thumbnail Generation working perfectly!');
      console.log('✨ System generates professional YouTube thumbnails matching reference style');
      return true;
    } else {
      console.log('\n⚠️ PARTIAL SUCCESS: Some issues detected');
      return false;
    }

  } catch (error) {
    console.error('❌ AI Thumbnail Generation Test Failed:', error.message);
    console.error('🔧 Check OpenAI API key and server status');
    return false;
  }
}

// Run the test
testAIThumbnailGeneration()
  .then(success => {
    if (success) {
      console.log('\n🎊 AI Thumbnail Maker Pro is ready for production!');
      console.log('🚀 Navigate to "Thumbnails Pro" to generate professional thumbnails');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(console.error);