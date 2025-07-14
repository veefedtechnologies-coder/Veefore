/**
 * Test OpenAI API Direct
 * This script tests if OpenAI API is working correctly
 */

const OpenAI = require('openai');

async function testOpenAI() {
  try {
    console.log('🧪 Testing OpenAI API directly...');
    console.log('🔑 API Key available:', !!process.env.OPENAI_API_KEY);
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('📡 Making OpenAI API call...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that responds in JSON format."
        },
        {
          role: "user",
          content: "Generate 2 simple test insights in JSON array format with id, title, and description fields."
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0.7
    });

    console.log('✅ OpenAI Response received');
    console.log('📊 Response content:', response.choices[0].message.content);
    
    const parsed = JSON.parse(response.choices[0].message.content);
    console.log('🎯 Parsed insights:', parsed);
    
    return true;
  } catch (error) {
    console.error('❌ OpenAI Test Failed:', error.message);
    console.error('📄 Full Error:', error);
    return false;
  }
}

testOpenAI().then(success => {
  console.log('🏁 Test Result:', success ? 'SUCCESS' : 'FAILED');
  process.exit(success ? 0 : 1);
});