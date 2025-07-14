const { MongoClient } = require('mongodb');

async function fixTeamAddon() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('veeforedb');
    const addonsCollection = db.collection('addons');
    
    const userId = '6844027426cae0200f88b5db';
    const userIdNum = 6844027426;
    
    console.log('=== FIXING TEAM ADDON USERID FORMAT ===');
    
    // 1. Find all team-member addons with numeric userId
    const teamAddons = await addonsCollection.find({ 
      type: 'team-member',
      userId: userIdNum
    }).toArray();
    
    console.log(`Found ${teamAddons.length} team-member addons with numeric userId`);
    
    if (teamAddons.length > 0) {
      // 2. Update userId format to string for all team-member addons
      const updateResult = await addonsCollection.updateMany(
        { 
          type: 'team-member',
          userId: userIdNum
        },
        { 
          $set: { userId: userId }
        }
      );
      
      console.log(`✓ Updated ${updateResult.modifiedCount} team-member addons to string userId format`);
    }
    
    // 3. Verify the fix
    const verifyAddons = await addonsCollection.find({ 
      $or: [
        { userId: userId, isActive: true },
        { userId: userIdNum, isActive: true }
      ]
    }).toArray();
    
    console.log(`\nVerification - Found ${verifyAddons.length} active addons:`);
    verifyAddons.forEach(addon => {
      console.log(`  - ${addon.type}: ${addon.name} (userId: ${addon.userId})`);
    });
    
    // 4. Check specifically for team-member addons
    const teamMemberAddons = verifyAddons.filter(addon => addon.type === 'team-member');
    console.log(`\n${teamMemberAddons.length > 0 ? '✓' : '✗'} Team-member addons found: ${teamMemberAddons.length}`);
    
    console.log('\n=== FIX COMPLETE ===');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixTeamAddon();