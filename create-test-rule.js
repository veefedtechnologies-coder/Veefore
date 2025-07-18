import mongoose from 'mongoose';

async function createTestRule() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Create a test automation rule that matches your UI configuration
    const testRule = {
      name: "Test Comment to DM Rule",
      workspaceId: "6847b9cdfabaede1706f2994",
      type: "comment_dm",
      isActive: true,
      keywords: ["free", "details", "info", "product"],
      targetMediaIds: [],
      action: {
        responses: ["Message sent!", "Found it? 😊", "Sent just now! 🚀"],
        dmResponses: ["hi", "See products"]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating test rule:', testRule);
    
    // Save to automationrules collection
    const result = await db.collection('automationrules').insertOne(testRule);
    
    console.log('✅ Test rule created successfully with ID:', result.insertedId);
    
    // Verify the rule was saved
    const savedRule = await db.collection('automationrules').findOne({ _id: result.insertedId });
    console.log('\n=== SAVED RULE VERIFICATION ===');
    console.log('Name:', savedRule.name);
    console.log('Workspace ID:', savedRule.workspaceId);
    console.log('Type:', savedRule.type);
    console.log('Keywords:', savedRule.keywords);
    console.log('Comment replies:', savedRule.action.responses);
    console.log('DM responses:', savedRule.action.dmResponses);
    console.log('Is Active:', savedRule.isActive);
    
    // Test webhook simulation
    console.log('\n=== WEBHOOK SIMULATION ===');
    const testKeyword = 'free';
    const keywordMatches = savedRule.keywords.some(keyword => 
      keyword.toLowerCase().includes(testKeyword.toLowerCase())
    );
    
    if (keywordMatches && savedRule.isActive) {
      console.log('✅ Keyword "' + testKeyword + '" matches');
      console.log('✅ Rule is active');
      console.log('📝 Would reply to comment:', savedRule.action.responses[0]);
      console.log('💬 Would send DM:', savedRule.action.dmResponses[0]);
    } else {
      console.log('❌ No match or rule inactive');
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createTestRule();