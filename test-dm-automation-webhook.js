const { MongoStorage } = require('./server/mongodb-storage.ts');
const { InstagramWebhookHandler } = require('./server/instagram-webhook.ts');

async function testDMAutomationWebhook() {
  console.log('[TEST] Starting DM automation webhook test...');
  
  try {
    // Initialize storage
    const storage = new MongoStorage();
    await storage.connect();
    
    // Initialize webhook handler
    const webhookHandler = new InstagramWebhookHandler(storage);
    
    // Test workspace ID
    const workspaceId = '684402c2fd2cd4eb6521b386';
    
    console.log('[TEST] Getting automation rules for workspace:', workspaceId);
    const automationRules = await storage.getAutomationRules(workspaceId);
    console.log('[TEST] Found', automationRules.length, 'automation rules');
    
    automationRules.forEach(rule => {
      console.log('[TEST] Rule:', {
        id: rule.id,
        name: rule.name,
        type: rule.type,
        isActive: rule.isActive,
        trigger: rule.trigger,
        action: rule.action
      });
    });
    
    // Filter DM rules
    const dmRules = automationRules.filter(rule => {
      const isActive = rule.isActive;
      const isDmType = rule.type === 'dm';
      
      console.log('[TEST] Rule check:', {
        name: rule.name,
        isActive,
        type: rule.type,
        isDmType
      });
      
      return isActive && isDmType;
    });
    
    console.log('[TEST] Found', dmRules.length, 'active DM rules');
    
    if (dmRules.length > 0) {
      console.log('[TEST] ✅ DM automation rules are properly detected');
      console.log('[TEST] Active DM rule:', dmRules[0].name);
      console.log('[TEST] Rule configuration:', {
        aiPersonality: dmRules[0].action?.aiPersonality,
        responseLength: dmRules[0].action?.responseLength,
        dailyLimit: dmRules[0].action?.dailyLimit,
        responseDelay: dmRules[0].action?.responseDelay
      });
    } else {
      console.log('[TEST] ❌ No active DM rules found - automation will not work');
    }
    
    // Test social account lookup
    console.log('[TEST] Getting social accounts for workspace:', workspaceId);
    const socialAccounts = await storage.getSocialAccountsByWorkspace(workspaceId);
    console.log('[TEST] Found', socialAccounts.length, 'social accounts');
    
    const instagramAccount = socialAccounts.find(acc => acc.platform === 'instagram');
    if (instagramAccount) {
      console.log('[TEST] ✅ Instagram account found:', instagramAccount.username);
      console.log('[TEST] Account ID:', instagramAccount.id);
      console.log('[TEST] Page ID:', instagramAccount.pageId);
    } else {
      console.log('[TEST] ❌ No Instagram account found');
    }
    
    console.log('[TEST] DM automation system test completed');
    
  } catch (error) {
    console.error('[TEST] Error testing DM automation:', error.message);
  }
  
  process.exit(0);
}

testDMAutomationWebhook();