import { MongoClient } from 'mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';

const DATABASE_URL = process.env.DATABASE_URL;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

async function testContextualDMResponse() {
  console.log('[TEST] Testing contextual DM response understanding...');
  
  if (!GOOGLE_API_KEY) {
    console.error('[ERROR] GOOGLE_API_KEY not found in environment');
    return;
  }
  
  const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  // Test messages that should be understood contextually
  const testMessages = [
    {
      message: "mai bhi thik hu",
      meaning: "I am also fine",
      expectedType: "wellbeing acknowledgment"
    },
    {
      message: "kya haal",
      meaning: "what's up",
      expectedType: "casual greeting/status inquiry"
    },
    {
      message: "hello bhai",
      meaning: "hello brother",
      expectedType: "friendly greeting"
    },
    {
      message: "nice yaar",
      meaning: "nice friend",
      expectedType: "positive feedback"
    }
  ];
  
  for (const test of testMessages) {
    console.log(`\n[TEST] Message: "${test.message}"`);
    console.log(`[TEST] Meaning: ${test.meaning}`);
    console.log(`[TEST] Expected: ${test.expectedType}`);
    
    const prompt = `You are an intelligent social media assistant responding to Instagram DMs. Your goal is to understand the message contextually and respond naturally like a real person.

UNDERSTAND THE MESSAGE MEANING:
- Read and comprehend what the person is actually saying
- Don't rely on keyword matching - understand the context
- For Hindi/Hinglish phrases like "mai bhi thik hu" (I am also fine), understand this means they're saying they're doing well
- For "kya haal" understand this is asking "what's up" 
- For wellbeing statements, respond appropriately (e.g., "achha hai", "nice yaar", "good to hear")

CUSTOMER MESSAGE: "${test.message}"
FROM: @testuser

RESPONSE REQUIREMENTS:
- Keep under 50 characters
- Sound completely natural and conversational  
- Match their language (English/Hindi/Hinglish) exactly
- Understand context, don't use templates
- Respond as a real person would

EXAMPLES OF NATURAL UNDERSTANDING:
- "mai bhi thik hu" → "achha hai" or "nice yaar" 
- "kya haal" → "bas timepass" or "nothing much yaar"
- "hello" → "hey" or "hi there"
- "thanks" → "welcome" or "no problem"

Generate ONE natural response that shows you understood their message:`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();
      
      console.log(`[AI RESPONSE] "${response}"`);
      
      // Check if response is contextual
      const isContextual = !response.toLowerCase().includes('hello') || test.message.toLowerCase().includes('hello');
      const isShort = response.length <= 50;
      const hasLanguageMatch = test.message.includes('mai') || test.message.includes('yaar') || test.message.includes('bhai') ? 
                              (response.includes('yaar') || response.includes('hai') || response.includes('achha') || response.includes('nice')) : true;
      
      console.log(`[ANALYSIS] Contextual: ${isContextual}, Short: ${isShort}, Language Match: ${hasLanguageMatch}`);
      
      if (isContextual && isShort && hasLanguageMatch) {
        console.log(`[SUCCESS] Response is contextual and appropriate`);
      } else {
        console.log(`[WARNING] Response may need improvement`);
      }
      
    } catch (error) {
      console.error(`[ERROR] Failed to generate response: ${error.message}`);
    }
  }
  
  console.log('\n[TEST] Contextual understanding test completed');
}

testContextualDMResponse();