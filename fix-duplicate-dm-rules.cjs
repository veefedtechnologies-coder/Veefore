const mongoose = require('mongoose');
require('dotenv').config();

async function fixDuplicateAutomationRules() {
  try {
    console.log('=== FIXING DUPLICATE AUTOMATION RULES ===');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB Atlas');
    
    // Define the automation rule model
    const AutomationRule = mongoose.model('AutomationRule', new mongoose.Schema({}, { strict: false }), 'automationrules');
    
    const workspaceId = '684402c2fd2cd4eb6521b386';
    const rules = await AutomationRule.find({ workspaceId }).lean();
    
    console.log(`Total automation rules found: ${rules.length}`);
    
    // Find active DM rules that are causing duplicates
    const activeDmRules = rules.filter(rule => {
      if (!rule.isActive) return false;
      
      const hasTrigger = rule.trigger && typeof rule.trigger === 'object';
      const hasAction = rule.action && typeof rule.action === 'object';
      
      const isDmTypeTrigger = hasTrigger && rule.trigger.type === 'dm';
      const isDmTypeAction = hasAction && rule.action.type === 'dm';
      const isDmType = isDmTypeTrigger || isDmTypeAction;
      
      return isDmType;
    });
    
    console.log(`\nActive DM rules causing duplicates: ${activeDmRules.length}`);
    activeDmRules.forEach((rule, index) => {
      console.log(`${index + 1}. ${rule.name} (ID: ${rule._id.toString()}) - Created: ${rule.createdAt}`);
    });
    
    if (activeDmRules.length > 1) {
      console.log('\n=== DEACTIVATING DUPLICATE RULES ===');
      
      // Sort by creation date - keep the most recent one
      activeDmRules.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      const keepRule = activeDmRules[0];
      const rulesToDeactivate = activeDmRules.slice(1);
      
      console.log(`✓ Keeping active: ${keepRule.name} (ID: ${keepRule._id.toString()})`);
      console.log(`✗ Deactivating ${rulesToDeactivate.length} duplicate rules:`);
      
      for (const rule of rulesToDeactivate) {
        console.log(`  - Deactivating: ${rule.name} (ID: ${rule._id.toString()})`);
        
        await AutomationRule.updateOne(
          { _id: rule._id },
          { 
            isActive: false,
            updatedAt: new Date(),
            deactivationReason: 'Duplicate DM rule - prevented multiple responses to same message'
          }
        );
        
        console.log(`  ✓ Deactivated successfully`);
      }
      
      console.log('\n=== VERIFICATION ===');
      
      // Verify only one active DM rule remains
      const remainingActiveDmRules = await AutomationRule.find({ 
        workspaceId,
        isActive: true,
        $or: [
          { 'trigger.type': 'dm' },
          { 'action.type': 'dm' }
        ]
      }).lean();
      
      console.log(`Active DM rules after cleanup: ${remainingActiveDmRules.length}`);
      
      if (remainingActiveDmRules.length === 1) {
        console.log(`✓ SUCCESS: Only one active DM rule remains: ${remainingActiveDmRules[0].name}`);
        console.log('✓ Duplicate response issue has been resolved');
      } else {
        console.log('⚠ Warning: Expected exactly 1 active DM rule, found:', remainingActiveDmRules.length);
      }
      
    } else if (activeDmRules.length === 1) {
      console.log('\n✓ Only one active DM rule found - no duplicates to fix');
    } else {
      console.log('\n⚠ No active DM rules found');
    }
    
    await mongoose.disconnect();
    console.log('\n=== CLEANUP COMPLETE ===');
    
  } catch (error) {
    console.error('Error fixing duplicate automation rules:', error);
    process.exit(1);
  }
}

fixDuplicateAutomationRules();