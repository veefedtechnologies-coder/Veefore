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

async function debugTeamAddon() {
  try {
    await connectDB();
    
    console.log('=== DEBUGGING TEAM ADDON DETECTION ===');
    
    // Search for ALL addons for this user
    const userId = '6844027426cae0200f88b5db';
    const userIdNum = 6844027426;
    
    console.log('1. All addons with string userId:');
    const stringAddons = await AddonModel.find({ userId: userId });
    console.log(`Found ${stringAddons.length} addons:`);
    stringAddons.forEach(addon => {
      console.log(`  - ${addon.type}: ${addon.name} (userId: ${addon.userId}, active: ${addon.isActive})`);
    });
    
    console.log('\n2. All addons with numeric userId:');
    const numericAddons = await AddonModel.find({ userId: userIdNum });
    console.log(`Found ${numericAddons.length} addons:`);
    numericAddons.forEach(addon => {
      console.log(`  - ${addon.type}: ${addon.name} (userId: ${addon.userId}, active: ${addon.isActive})`);
    });
    
    console.log('\n3. Team-member addons specifically:');
    const teamAddons = await AddonModel.find({ type: 'team-member' });
    console.log(`Found ${teamAddons.length} team-member addons:`);
    teamAddons.forEach(addon => {
      console.log(`  - ID: ${addon._id}`);
      console.log(`  - UserId: ${addon.userId} (type: ${typeof addon.userId})`);
      console.log(`  - Active: ${addon.isActive}`);
      console.log(`  - Created: ${addon.createdAt}`);
    });
    
    // Fix: Update team-member addon to use string userId format
    console.log('\n4. Fixing userId format for team-member addons...');
    const teamAddonToFix = await AddonModel.findOne({ 
      type: 'team-member', 
      userId: userIdNum 
    });
    
    if (teamAddonToFix) {
      console.log('Found team addon to fix, updating userId format...');
      await AddonModel.updateOne(
        { _id: teamAddonToFix._id },
        { userId: userId }
      );
      console.log('✓ Updated team addon userId to string format');
    }
    
    console.log('\n5. Verification - All active addons after fix:');
    const finalAddons = await AddonModel.find({ 
      $or: [
        { userId: userId, isActive: true },
        { userId: userIdNum, isActive: true }
      ]
    });
    console.log(`Found ${finalAddons.length} active addons:`);
    finalAddons.forEach(addon => {
      console.log(`  - ${addon.type}: ${addon.name} (userId: ${addon.userId})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

debugTeamAddon();