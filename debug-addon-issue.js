import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const addonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, default: null },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AddonModel = mongoose.model('Addon', addonSchema);

async function debugAddonIssue() {
  try {
    await connectDB();
    
    const userId = '6844027426cae0200f88b5db';
    const userIdNum = 6844027426;
    
    console.log('=== DEBUGGING ADDON DETECTION ISSUE ===');
    
    // 1. Find all addons for this user with different userId formats
    console.log('\n1. Searching for addons with string userId...');
    const addonsString = await AddonModel.find({ userId: userId });
    console.log(`Found ${addonsString.length} addons with string userId:`);
    addonsString.forEach(addon => {
      console.log(`  - ${addon.type}: ${addon.name} (userId: ${addon.userId}, active: ${addon.isActive})`);
    });
    
    console.log('\n2. Searching for addons with numeric userId...');
    const addonsNumeric = await AddonModel.find({ userId: userIdNum });
    console.log(`Found ${addonsNumeric.length} addons with numeric userId:`);
    addonsNumeric.forEach(addon => {
      console.log(`  - ${addon.type}: ${addon.name} (userId: ${addon.userId}, active: ${addon.isActive})`);
    });
    
    console.log('\n3. Searching for all active addons (any userId format)...');
    const allActiveAddons = await AddonModel.find({ 
      $or: [
        { userId: userId, isActive: true },
        { userId: userIdNum, isActive: true }
      ]
    });
    console.log(`Found ${allActiveAddons.length} active addons:`);
    allActiveAddons.forEach(addon => {
      console.log(`  - ${addon.type}: ${addon.name} (userId: ${addon.userId} [${typeof addon.userId}], active: ${addon.isActive})`);
    });
    
    console.log('\n4. Looking specifically for team-member addons...');
    const teamMemberAddons = await AddonModel.find({ 
      type: 'team-member',
      isActive: true,
      $or: [
        { userId: userId },
        { userId: userIdNum }
      ]
    });
    console.log(`Found ${teamMemberAddons.length} team-member addons:`);
    teamMemberAddons.forEach(addon => {
      console.log(`  - ID: ${addon._id}`);
      console.log(`  - Name: ${addon.name}`);
      console.log(`  - UserId: ${addon.userId} (${typeof addon.userId})`);
      console.log(`  - Active: ${addon.isActive}`);
      console.log(`  - Created: ${addon.createdAt}`);
    });
    
    // 5. If team-member addon exists but isn't being found, let's check exact format
    if (teamMemberAddons.length > 0) {
      console.log('\n✓ Team-member addon EXISTS but lookup is failing');
      console.log('Issue: getUserAddons method may have format mismatch');
      
      // Test the exact query used in getUserAddons
      console.log('\n5. Testing exact getUserAddons query...');
      const userIdStr = userId.toString();
      const testQuery = await AddonModel.find({ 
        $or: [
          { userId: userIdStr, isActive: true },
          { userId: userId, isActive: true }
        ]
      });
      console.log(`Query result: ${testQuery.length} addons found`);
      testQuery.forEach(addon => {
        console.log(`  - ${addon.type}: ${addon.name}`);
      });
      
    } else {
      console.log('\n✗ No team-member addon found - need to create one');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

debugAddonIssue();