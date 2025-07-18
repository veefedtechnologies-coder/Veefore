const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

async function addTargetMediaIds() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    console.log('🔧 FIXING targetMediaIds CONFIGURATION');
    console.log('=' .repeat(50));
    
    const db = client.db('veeforedb');
    const collection = db.collection('automationrules');
    
    // Get all active comment-to-DM rules
    const rules = await collection.find({
      type: 'comment_dm',
      isActive: true
    }).toArray();
    
    console.log(`Found ${rules.length} active comment-to-DM rules`);
    
    // Target media IDs for post-specific targeting
    const targetMediaIds = [
      '18076220419901491',
      '18056872022594716', 
      '18048694391163016',
      '17891533449259045'
    ];
    
    for (const rule of rules) {
      console.log(`\n🎯 Updating rule: ${rule.name}`);
      console.log(`  Current targetMediaIds: ${rule.targetMediaIds || 'MISSING'}`);
      
      const updateResult = await collection.updateOne(
        { _id: rule._id },
        {
          $set: {
            targetMediaIds: targetMediaIds,
            updatedAt: new Date()
          }
        }
      );
      
      if (updateResult.matchedCount === 1) {
        console.log(`  ✅ Successfully added targetMediaIds: ${targetMediaIds.join(', ')}`);
      } else {
        console.log(`  ❌ Failed to update rule`);
      }
    }
    
    // Verify the update
    console.log('\n🔍 VERIFICATION:');
    const updatedRules = await collection.find({
      type: 'comment_dm',
      isActive: true
    }).toArray();
    
    updatedRules.forEach((rule, index) => {
      console.log(`\n📋 Rule ${index + 1}: ${rule.name}`);
      console.log(`  targetMediaIds: ${rule.targetMediaIds || 'STILL MISSING'}`);
      console.log(`  Length: ${rule.targetMediaIds?.length || 0}`);
    });
    
    console.log('\n✅ POST-SPECIFIC TARGETING CONFIGURED!');
    console.log('Now the webhook will only trigger on these specific posts:');
    targetMediaIds.forEach((postId, index) => {
      console.log(`  ${index + 1}. ${postId}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

addTargetMediaIds();