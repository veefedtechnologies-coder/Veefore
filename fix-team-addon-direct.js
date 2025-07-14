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

// Define the Addon schema
const addonSchema = new mongoose.Schema({
  userId: { type: String, required: true },
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

async function fixTeamAddonDirect() {
  try {
    await connectDB();
    
    const userId = '6844027426cae0200f88b5db';
    
    console.log('=== FIXING TEAM ADDON TYPE ===');
    
    // 1. Check current addons
    const currentAddons = await AddonModel.find({ userId, isActive: true });
    console.log(`Found ${currentAddons.length} active addons:`);
    currentAddons.forEach((addon, index) => {
      console.log(`  ${index + 1}. ${addon.name} (Type: ${addon.type}, Price: ₹${addon.price/100})`);
    });
    
    // 2. Check if team-member addon already exists
    const teamMemberAddon = currentAddons.find(addon => addon.type === 'team-member');
    if (teamMemberAddon) {
      console.log('\n✓ Team member addon already exists!');
      return;
    }
    
    // 3. Find workspace addon with ₹199 price (should be team-member)
    const workspaceAddon = currentAddons.find(addon => 
      addon.type === 'workspace' && addon.price === 19900
    );
    
    if (workspaceAddon) {
      console.log('\nFound incorrect workspace addon that should be team-member');
      
      // 4. Create correct team-member addon
      const newTeamAddon = new AddonModel({
        userId: userId,
        name: 'Additional Team Member Seat',
        type: 'team-member',
        price: 19900,
        isActive: true,
        expiresAt: null,
        metadata: {
          convertedFromWorkspaceAddon: workspaceAddon._id.toString(),
          originalPayment: true,
          conversionDate: new Date()
        }
      });
      
      await newTeamAddon.save();
      console.log('✓ Created correct team-member addon');
      
      // 5. Deactivate the incorrect workspace addon
      await AddonModel.updateOne(
        { _id: workspaceAddon._id },
        { 
          isActive: false,
          metadata: {
            ...workspaceAddon.metadata,
            deactivatedReason: 'Converted to team-member addon',
            deactivatedAt: new Date()
          }
        }
      );
      console.log('✓ Deactivated incorrect workspace addon');
      
    } else {
      // 4. Create team-member addon from scratch (user has valid payment)
      console.log('\nCreating team-member addon from valid ₹199 payment...');
      
      const newTeamAddon = new AddonModel({
        userId: userId,
        name: 'Additional Team Member Seat',
        type: 'team-member',
        price: 19900,
        isActive: true,
        expiresAt: null,
        metadata: {
          createdFromPayment: true,
          paymentAmount: 199,
          purpose: 'team-member addon purchase'
        }
      });
      
      await newTeamAddon.save();
      console.log('✓ Created team-member addon');
    }
    
    // 6. Verify final state
    const finalAddons = await AddonModel.find({ userId, isActive: true });
    console.log(`\nFinal active addons (${finalAddons.length}):`);
    finalAddons.forEach((addon, index) => {
      console.log(`  ${index + 1}. ${addon.name} (Type: ${addon.type})`);
    });
    
    const hasTeamMember = finalAddons.some(addon => addon.type === 'team-member');
    console.log(`\n${hasTeamMember ? '✓' : '✗'} Team member addon is ${hasTeamMember ? 'active' : 'missing'}`);
    
    console.log('\n=== ADDON FIX COMPLETE ===');
    console.log('Team invitations should now work properly!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixTeamAddonDirect();