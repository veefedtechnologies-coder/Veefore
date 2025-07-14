import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB Atlas - veeforedb database');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function fixDuplicateAutomationRules() {
  await connectToMongoDB();
  
  console.log('=== CHECKING AUTOMATION RULES ===');
  
  const AutomationRule = mongoose.model('AutomationRule', new mongoose.Schema({}, { strict: false }), 'automationrules');
  
  // Get all automation rules for the workspace
  const workspaceId = '684402c2fd2cd4eb6521b386';
  const rules = await AutomationRule.find({ workspaceId }).lean();
  
  console.log('Total automation rules found:', rules.length);
  
  rules.forEach((rule, index) => {
    console.log(`\nRule ${index + 1}:`);
    console.log('ID:', rule._id.toString());
    console.log('Name:', rule.name);
    console.log('Type:', rule.type);
    console.log('Platform:', rule.platform);
    console.log('Is Active:', rule.isActive);
    console.log('Trigger:', rule.trigger);
    console.log('Action:', rule.action);
    console.log('Triggers:', rule.triggers);
  });
  
  // Check for duplicate DM rules
  const dmRules = rules.filter(rule => {
    const hasTrigger = rule.trigger && typeof rule.trigger === 'object';
    const hasAction = rule.action && typeof rule.action === 'object';
    
    const isDmTypeTrigger = hasTrigger && rule.trigger.type === 'dm';
    const isDmTypeAction = hasAction && rule.action.type === 'dm';
    const isDmType = isDmTypeTrigger || isDmTypeAction;
    
    return rule.isActive && isDmType;
  });
  
  console.log(`\n=== ACTIVE DM RULES: ${dmRules.length} ===`);
  dmRules.forEach((rule, index) => {
    console.log(`DM Rule ${index + 1}: ${rule.name} (ID: ${rule._id.toString()})`);
  });
  
  // If we have multiple active DM rules, keep only the most recent one
  if (dmRules.length > 1) {
    console.log('\n=== FIXING DUPLICATE DM RULES ===');
    
    // Sort by creation date (most recent first)
    dmRules.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const keepRule = dmRules[0];
    const rulesToDeactivate = dmRules.slice(1);
    
    console.log(`Keeping rule: ${keepRule.name} (ID: ${keepRule._id.toString()})`);
    console.log(`Deactivating ${rulesToDeactivate.length} duplicate rules:`);
    
    for (const rule of rulesToDeactivate) {
      console.log(`- Deactivating: ${rule.name} (ID: ${rule._id.toString()})`);
      await AutomationRule.updateOne(
        { _id: rule._id },
        { isActive: false, updatedAt: new Date() }
      );
    }
    
    console.log('\n✓ Duplicate DM rules have been deactivated');
    console.log(`✓ Only one active DM rule remains: ${keepRule.name}`);
  } else if (dmRules.length === 1) {
    console.log('\n✓ Only one active DM rule found - no duplicates to fix');
  } else {
    console.log('\n⚠ No active DM rules found');
  }
  
  // Verify the fix
  const remainingActiveDmRules = await AutomationRule.find({ 
    workspaceId,
    isActive: true,
    $or: [
      { 'trigger.type': 'dm' },
      { 'action.type': 'dm' }
    ]
  }).lean();
  
  console.log(`\n=== VERIFICATION ===`);
  console.log(`Active DM rules after cleanup: ${remainingActiveDmRules.length}`);
  
  await mongoose.disconnect();
  console.log('\n=== CLEANUP COMPLETE ===');
}

fixDuplicateAutomationRules().catch(console.error);