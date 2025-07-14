const mongoose = require('mongoose');

// MongoDB connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('[TEST] Connected to MongoDB');
  } catch (error) {
    console.error('[TEST] MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Automation Rule Schema (matching the one in the app)
const AutomationRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workspaceId: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  type: { type: String, enum: ['dm', 'comment'], default: 'dm' },
  trigger: { type: mongoose.Schema.Types.Mixed },
  action: { type: mongoose.Schema.Types.Mixed },
  lastRun: { type: Date },
  nextRun: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AutomationRule = mongoose.model('AutomationRule', AutomationRuleSchema);

// Test functions
const testAutomationRuleQueries = async () => {
  try {
    console.log('\n[TEST] Testing automation rule queries...');
    
    // Test 1: Find by type 'dm'
    console.log('[TEST] Querying rules by type "dm"...');
    const dmRules = await AutomationRule.find({ 
      isActive: true,
      type: 'dm'
    });
    console.log(`[TEST] Found ${dmRules.length} DM rules`);
    
    // Test 2: Find by type 'instagram_dm' (old format that was causing issues)
    console.log('[TEST] Querying rules by type "instagram_dm"...');
    const instagramDmRules = await AutomationRule.find({ 
      isActive: true,
      type: 'instagram_dm'
    });
    console.log(`[TEST] Found ${instagramDmRules.length} Instagram DM rules`);
    
    // Test 3: Check trigger.type field
    console.log('[TEST] Querying rules by trigger.type "dm"...');
    const triggerDmRules = await AutomationRule.find({ 
      isActive: true,
      'trigger.type': 'dm'
    });
    console.log(`[TEST] Found ${triggerDmRules.length} rules with trigger.type = dm`);
    
    // Test 4: List all rules to see structure
    console.log('[TEST] Getting all active rules...');
    const allRules = await AutomationRule.find({ isActive: true });
    console.log(`[TEST] Found ${allRules.length} total active rules`);
    
    if (allRules.length > 0) {
      console.log('[TEST] Sample rule structure:');
      const sample = allRules[0];
      console.log({
        id: sample._id.toString(),
        name: sample.name,
        type: sample.type,
        triggerType: sample.trigger?.type,
        actionType: sample.action?.type,
        workspaceId: sample.workspaceId
      });
    }
    
    return { dmRules, instagramDmRules, triggerDmRules, allRules };
  } catch (error) {
    console.error('[TEST] Query test failed:', error.message);
    return null;
  }
};

const createTestRule = async () => {
  try {
    console.log('\n[TEST] Creating test automation rule...');
    
    const testRule = new AutomationRule({
      name: 'Test Auto DM Rule',
      workspaceId: '684402c2fd2cd4eb6521b386', // Using actual workspace ID from logs
      description: 'Test rule for auto DM functionality',
      type: 'dm',
      isActive: true,
      trigger: {
        type: 'dm',
        aiMode: 'contextual',
        keywords: ['hello', 'help', 'info'],
        hashtags: [],
        mentions: false,
        newFollowers: true,
        postInteraction: false
      },
      action: {
        type: 'dm',
        responses: [
          'Hello! Thanks for reaching out. How can I help you today?',
          'Hi there! I\'d be happy to assist you. What would you like to know?'
        ],
        aiPersonality: 'friendly',
        responseLength: 'medium',
        aiConfig: {
          personality: 'friendly',
          responseLength: 'medium',
          dailyLimit: 50,
          responseDelay: 5,
          language: 'auto',
          contextualMode: true
        }
      }
    });
    
    const savedRule = await testRule.save();
    console.log('[TEST] Test rule created successfully:', savedRule._id.toString());
    return savedRule;
  } catch (error) {
    console.error('[TEST] Test rule creation failed:', error.message);
    return null;
  }
};

const testWebhookProcessing = async () => {
  try {
    console.log('\n[TEST] Testing webhook processing logic...');
    
    // Simulate Instagram DM webhook data
    const webhookData = {
      entry: [{
        messaging: [{
          sender: { id: 'test_sender_123' },
          recipient: { id: 'test_recipient_456' },
          message: {
            mid: 'test_message_id_789',
            text: 'Hello! I need help with your products'
          },
          timestamp: Date.now()
        }]
      }]
    };
    
    console.log('[TEST] Sample webhook data:', JSON.stringify(webhookData, null, 2));
    
    // Test rule matching logic
    const workspaceId = '684402c2fd2cd4eb6521b386';
    const dmRules = await AutomationRule.find({
      isActive: true,
      $or: [
        { type: 'dm' },
        { 'trigger.type': 'dm' },
        { 'action.type': 'dm' }
      ]
    });
    
    console.log(`[TEST] Found ${dmRules.length} matching DM rules for webhook processing`);
    
    if (dmRules.length > 0) {
      const rule = dmRules[0];
      console.log('[TEST] Rule would trigger for this message:', {
        ruleName: rule.name,
        triggers: rule.trigger,
        responses: rule.action?.responses?.length || 0
      });
    }
    
    return dmRules;
  } catch (error) {
    console.error('[TEST] Webhook processing test failed:', error.message);
    return [];
  }
};

const cleanupTestData = async () => {
  try {
    console.log('\n[TEST] Cleaning up test data...');
    const result = await AutomationRule.deleteMany({
      name: { $regex: /^Test Auto DM Rule/ }
    });
    console.log(`[TEST] Removed ${result.deletedCount} test rules`);
  } catch (error) {
    console.error('[TEST] Cleanup failed:', error.message);
  }
};

// Main test execution
const runTests = async () => {
  console.log('[TEST] Starting auto reply functionality tests...');
  
  await connectMongoDB();
  
  // Run tests
  const queryResults = await testAutomationRuleQueries();
  const testRule = await createTestRule();
  const webhookResults = await testWebhookProcessing();
  
  // Cleanup
  await cleanupTestData();
  
  console.log('\n[TEST] Test Summary:');
  console.log('- Query tests completed');
  console.log('- Test rule creation:', testRule ? 'SUCCESS' : 'FAILED');
  console.log('- Webhook processing:', webhookResults?.length > 0 ? 'SUCCESS' : 'FAILED');
  
  await mongoose.disconnect();
  console.log('[TEST] Tests completed');
};

// Run tests
runTests().catch(error => {
  console.error('[TEST] Test execution failed:', error);
  process.exit(1);
});