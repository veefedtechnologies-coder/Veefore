import { AIResponseGenerator } from './server/ai-response-generator.js';

async function testAntiSpamResponses() {
  console.log('🧪 Testing anti-spam response generation...');
  
  const generator = new AIResponseGenerator();
  
  // Test various comment scenarios
  const testComments = [
    { message: 'Price kitna hai?', username: 'user1' },
    { message: 'How much does this cost?', username: 'user2' },
    { message: 'Amazing post! Love it', username: 'user3' },
    { message: 'Bhai shipping kab hogi?', username: 'user4' },
    { message: 'Where can I buy this?', username: 'user5' },
    { message: 'Thanks for sharing!', username: 'user6' },
    { message: 'Dhanyawad bhai', username: 'user7' },
    { message: 'This is so cool 🔥', username: 'user8' },
    { message: 'Yaar ye kaha milega?', username: 'user9' },
    { message: 'Available hai kya?', username: 'user10' }
  ];
  
  const config = {
    personality: 'friendly',
    responseLength: 'short',
    businessContext: 'Fashion brand'
  };
  
  console.log('✅ Generating responses for different comments...\n');
  
  for (const comment of testComments) {
    try {
      const context = {
        message: comment.message,
        userProfile: { username: comment.username }
      };
      
      const response = await generator.generateContextualResponse(context, config);
      
      console.log(`Comment: "${comment.message}" (@${comment.username})`);
      console.log(`Response: "${response.response}"`);
      console.log(`Language: ${response.detectedLanguage}`);
      console.log(`Length: ${response.response.length} chars`);
      console.log('---');
    } catch (error) {
      console.error(`❌ Error generating response for "${comment.message}":`, error.message);
    }
  }
  
  // Test response uniqueness by generating multiple responses for the same comment
  console.log('\n🔄 Testing response uniqueness (same comment, different responses)...\n');
  
  const sameComment = { message: 'Price kitna hai?', username: 'testuser' };
  const responses = new Set();
  
  for (let i = 0; i < 5; i++) {
    try {
      const context = {
        message: sameComment.message,
        userProfile: { username: sameComment.username }
      };
      
      const response = await generator.generateContextualResponse(context, config);
      responses.add(response.response);
      
      console.log(`Attempt ${i + 1}: "${response.response}"`);
    } catch (error) {
      console.error(`❌ Error on attempt ${i + 1}:`, error.message);
    }
  }
  
  console.log(`\n📊 Generated ${responses.size} unique responses out of 5 attempts`);
  console.log('✅ Anti-spam system test completed!');
}

testAntiSpamResponses().catch(console.error);