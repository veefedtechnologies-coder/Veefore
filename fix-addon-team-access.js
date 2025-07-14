import mongoose from 'mongoose';

async function fixAddonTeamAccess() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const userId = '6844027426cae0200f88b5db';
    
    // Check if user has any successful team member addon payments
    const teamMemberPayments = await db.collection('payments').find({
      userId: userId,
      purpose: 'team-member',
      status: 'success'
    }).toArray();
    
    console.log(`Found ${teamMemberPayments.length} successful team member payments`);
    
    if (teamMemberPayments.length > 0) {
      // Check if addon record exists
      const existingAddon = await db.collection('addons').findOne({
        userId: userId,
        type: 'team-member'
      });
      
      if (!existingAddon) {
        console.log('Creating missing team member addon record...');
        
        // Create the addon record
        const addonResult = await db.collection('addons').insertOne({
          name: 'Additional Team Member Seat',
          userId: userId,
          type: 'team-member',
          price: 199,
          isActive: true,
          expiresAt: null, // No expiration for one-time purchase
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: {
            paymentId: teamMemberPayments[0]._id,
            purchaseDate: teamMemberPayments[0].createdAt
          }
        });
        
        console.log('Created addon record:', addonResult.insertedId);
      } else {
        console.log('Addon record exists, ensuring it is active...');
        
        // Ensure the addon is active
        await db.collection('addons').updateOne(
          { _id: existingAddon._id },
          { 
            $set: { 
              isActive: true,
              updatedAt: new Date()
            }
          }
        );
        
        console.log('Updated addon to active status');
      }
    } else {
      console.log('No successful team member payments found');
    }
    
    // Verify the fix
    const userAddons = await db.collection('addons').find({
      userId: userId,
      isActive: true
    }).toArray();
    
    console.log(`User now has ${userAddons.length} active addons:`);
    userAddons.forEach(addon => {
      console.log(`- ${addon.name} (${addon.type})`);
    });
    
    await mongoose.disconnect();
    console.log('Fix completed successfully');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixAddonTeamAccess();