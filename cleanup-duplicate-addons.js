import mongoose from 'mongoose';

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define addon schema
const AddonSchema = new mongoose.Schema({
  id: { type: Number, required: true },
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

const AddonModel = mongoose.model('Addon', AddonSchema, 'addons');

async function cleanupDuplicateAddons() {
  await connectDB();
  
  const userId = '6844027426cae0200f88b5db';
  
  console.log('🔍 Finding duplicate team-member addons...');
  
  // Find all team-member addons for this user (both string and number userId formats)
  const teamAddons = await AddonModel.find({
    type: 'team-member',
    $or: [
      { userId: userId },
      { userId: 6844027426 }
    ]
  }).sort({ createdAt: 1 });
  
  console.log(`📊 Found ${teamAddons.length} team-member addons total`);
  
  if (teamAddons.length > 1) {
    // Keep the first addon (oldest) and remove duplicates
    const addonToKeep = teamAddons[0];
    const addonsToRemove = teamAddons.slice(1);
    
    console.log(`✅ Keeping addon: ${addonToKeep._id} (created: ${addonToKeep.createdAt})`);
    console.log(`🗑️  Removing ${addonsToRemove.length} duplicate addons...`);
    
    // Update the addon to keep with proper userId format
    await AddonModel.updateOne(
      { _id: addonToKeep._id },
      { 
        $set: { 
          userId: userId,
          name: 'Additional Team Member Seat',
          updatedAt: new Date()
        }
      }
    );
    console.log(`🔧 Updated kept addon with correct userId format`);
    
    // Remove duplicate addons
    const removeIds = addonsToRemove.map(addon => addon._id);
    const deleteResult = await AddonModel.deleteMany({
      _id: { $in: removeIds }
    });
    
    console.log(`🗑️  Successfully removed ${deleteResult.deletedCount} duplicate addons`);
  } else {
    console.log('✅ No duplicate addons found');
  }
  
  // Verify the cleanup
  const remainingAddons = await AddonModel.find({
    type: 'team-member',
    userId: userId
  });
  
  console.log(`✅ Final result: ${remainingAddons.length} team-member addon(s) remaining`);
  
  // Show all user addons for verification
  const allUserAddons = await AddonModel.find({
    $or: [
      { userId: userId },
      { userId: 6844027426 }
    ]
  });
  
  console.log('\n📋 All user addons after cleanup:');
  allUserAddons.forEach((addon, index) => {
    console.log(`  ${index + 1}. ${addon.type} - ${addon.name} (active: ${addon.isActive})`);
  });
  
  await mongoose.disconnect();
  console.log('\n🎉 Cleanup completed successfully!');
}

cleanupDuplicateAddons().catch(console.error);