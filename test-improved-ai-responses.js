const { AIResponseGenerator } = require('./server/ai-response-generator.ts');

async function testImprovedAIResponses() {
  console.log('[TEST] Testing improved AI response system with contextual understanding...');
  
  try {
    const aiGenerator = new AIResponseGenerator();
    
    // Test cases for Hindi/Hinglish understanding
    const testMessages = [
      {
        message: "mai bhi thik hu",
        expected: "Should understand this means 'I am also fine' and respond appropriately"
      },
      {
        message: "kya haal",
        expected: "Should understand this means 'what's up' and respond casually"
      },
      {
        message: "hello bhai",
        expected: "Should respond to Hindi greeting appropriately"
      },
      {
        message: "acha yaar",
        expected: "Should understand casual Hindi acknowledgment"
      },
      {
        message: "thanks bro",
        expected: "Should respond to mixed language thanks"
      }
    ];
    
    for (const test of testMessages) {
      console.log(`\n[TEST] Message: "${test.message}"`);
      console.log(`[TEST] Expected: ${test.expected}`);
      
      const context = {
        message: test.message,
        userProfile: {
          username: 'testuser',
          language: 'hinglish'
        }
      };
      
      const config = {
        personality: 'friendly',
        responseLength: 'short',
        businessContext: 'Social media management'
      };
      
      const response = await aiGenerator.generateContextualResponse(context, config);
      
      console.log(`[TEST] AI Response: "${response.response}"`);
      console.log(`[TEST] Detected Language: ${response.detectedLanguage}`);
      console.log(`[TEST] Confidence: ${response.confidence}`);
      
      // Check if response is contextual (not generic)
      const isGeneric = response.response.toLowerCase().includes('hello') && 
                       test.message.toLowerCase() !== 'hello' &&
                       !test.message.toLowerCase().includes('hello');
      
      if (isGeneric) {
        console.log(`[WARNING] Response seems generic for message: "${test.message}"`);
      } else {
        console.log(`[SUCCESS] Response appears contextual and appropriate`);
      }
    }
    
    console.log('\n[TEST] AI response system testing completed');
    
  } catch (error) {
    console.error('[ERROR] Test failed:', error.message);
  }
}

testImprovedAIResponses();