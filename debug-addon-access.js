import mongoose from 'mongoose';

async function debugAddonAccess() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Check all addons in the database
    const allAddons = await db.collection('addons').find({}).toArray();
    console.log('\n=== ALL ADDONS ===');
    console.log(JSON.stringify(allAddons, null, 2));
    
    // Check specific user's addons
    const userId = '6844027426cae0200f88b5db';
    const userAddons = await db.collection('addons').find({ userId }).toArray();
    console.log('\n=== USER ADDONS ===');
    console.log(`Found ${userAddons.length} addons for user ${userId}`);
    console.log(JSON.stringify(userAddons, null, 2));
    
    // Check if there are any team-member type addons
    const teamMemberAddons = await db.collection('addons').find({ type: 'team-member' }).toArray();
    console.log('\n=== TEAM MEMBER ADDONS ===');
    console.log(`Found ${teamMemberAddons.length} team-member addons`);
    console.log(JSON.stringify(teamMemberAddons, null, 2));
    
    // Check user's payments to see if team addon was purchased
    const userPayments = await db.collection('payments').find({ userId }).toArray();
    console.log('\n=== USER PAYMENTS ===');
    console.log(`Found ${userPayments.length} payments for user`);
    userPayments.forEach(payment => {
      console.log(`Payment: ${payment.purpose} - Status: ${payment.status} - Amount: ${payment.amount}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

debugAddonAccess();