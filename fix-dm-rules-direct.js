import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function fixDMRules() {
  console.log('=== FIXING DUPLICATE DM AUTOMATION RULES ===');
  
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('veeforedb');
    const collection = db.collection('automationrules');
    
    const workspaceId = '684402c2fd2cd4eb6521b386';
    
    // Find all automation rules for the workspace
    const allRules = await collection.find({ workspaceId }).toArray();
    console.log(`Total automation rules found: ${allRules.length}`);
    
    // Find active DM rules that are causing duplicates
    const activeDmRules = allRules.filter(rule => {
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
        
        await collection.updateOne(
          { _id: rule._id },
          { 
            $set: {
              isActive: false,
              updatedAt: new Date(),
              deactivationReason: 'Duplicate DM rule - prevented multiple responses to same message'
            }
          }
        );
        
        console.log(`  ✓ Deactivated successfully`);
      }
      
      console.log('\n=== VERIFICATION ===');
      
      // Verify only one active DM rule remains
      const updatedRules = await collection.find({ workspaceId }).toArray();
      const remainingActiveDmRules = updatedRules.filter(rule => {
        if (!rule.isActive) return false;
        
        const hasTrigger = rule.trigger && typeof rule.trigger === 'object';
        const hasAction = rule.action && typeof rule.action === 'object';
        
        const isDmTypeTrigger = hasTrigger && rule.trigger.type === 'dm';
        const isDmTypeAction = hasAction && rule.action.type === 'dm';
        const isDmType = isDmTypeTrigger || isDmTypeAction;
        
        return isDmType;
      });
      
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
    
    console.log('\n=== CLEANUP COMPLETE ===');
    
  } catch (error) {
    console.error('Error fixing duplicate automation rules:', error);
  } finally {
    await client.close();
  }
}

fixDMRules();