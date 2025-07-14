/**
 * Debug Welcome Bonus - Check if user has claimed welcome bonus
 */

const { MongoStorage } = require('./server/storage');

async function debugWelcomeBonus() {
  console.log('=== DEBUG: Welcome Bonus Status ===');
  
  try {
    const storage = new MongoStorage();
    await storage.connect();
    
    // Find user by email
    const user = await storage.getUserByEmail('arpitchoudhary128@gmail.com');
    
    if (user) {
      console.log('✅ User found:', user.email);
      console.log('📊 User details:');
      console.log('  - ID:', user._id.toString());
      console.log('  - Credits:', user.credits);
      console.log('  - Status:', user.status);
      console.log('  - Has claimed welcome bonus:', user.hasClaimedWelcomeBonus);
      console.log('  - Welcome bonus claimed at:', user.welcomeBonusClaimedAt);
      
      // Check if the field exists
      if (user.hasClaimedWelcomeBonus === undefined) {
        console.log('⚠️  hasClaimedWelcomeBonus field is undefined - needs migration');
      } else if (user.hasClaimedWelcomeBonus === false) {
        console.log('✅ User is eligible for welcome bonus');
      } else {
        console.log('ℹ️  User has already claimed welcome bonus');
      }
    } else {
      console.log('❌ User not found');
    }
    
    await storage.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugWelcomeBonus();