// Test script generation API
const fetch = require('node-fetch');

async function testScriptGeneration() {
  console.log('Testing script generation API...');
  
  try {
    // Test with the exact prompt from the user
    const response = await fetch('http://localhost:5000/api/video/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({
        prompt: 'a man fight with lion',
        duration: 30,
        visualStyle: 'cinematic',
        tone: 'professional',
        voiceGender: 'female',
        language: 'English',
        accent: 'American'
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.script) {
      console.log('Script generated successfully!');
      console.log('Title:', data.script.title);
      console.log('Scenes:', data.script.scenes?.length || 0);
      if (data.script.scenes && data.script.scenes.length > 0) {
        console.log('First scene voiceover:', data.script.scenes[0].voiceover);
      }
    } else {
      console.log('No script in response');
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testScriptGeneration();