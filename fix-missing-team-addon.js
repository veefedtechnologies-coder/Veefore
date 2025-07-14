import { MongoClient } from 'mongodb';

async function fixMissingTeamAddon() {
  let client;
  try {
    // Connect to MongoDB
    client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('veeforedb');
    const userId = '6844027426cae0200f88b5db';

    // Check payments collection for team member payments
    const payments = await db.collection('payments').find({
      userId: userId,
      $or: [
        { purpose: { $regex: /team-member/i } },
        { purpose: { $regex: /Team Member/i } }
      ],
      status: 'captured'
    }).toArray();

    console.log(`Found ${payments.length} team member payments for user ${userId}`);
    
    if (payments.length === 0) {
      console.log('No team member payments found. Checking all payments for this user:');
      const allPayments = await db.collection('payments').find({ userId: userId }).toArray();
      console.log(`Total payments for user: ${allPayments.length}`);
      allPayments.forEach((payment, index) => {
        console.log(`Payment ${index + 1}: Purpose: "${payment.purpose}", Status: "${payment.status}", Amount: ${payment.amount}`);
      });
      return;
    }

    // Check if team member addon already exists
    const existingAddon = await db.collection('addons').findOne({
      userId: userId,
      type: 'team-member'
    });

    if (existingAddon) {
      console.log('Team member addon already exists:', existingAddon.name);
      return;
    }

    // Create team member addon from the payment
    const payment = payments[0];
    console.log('Creating team member addon from payment:', {
      paymentId: payment._id,
      purpose: payment.purpose,
      amount: payment.amount,
      status: payment.status
    });

    const newAddon = {
      userId: userId,
      name: 'Additional Team Member Seat',
      type: 'team-member',
      price: 19900,
      isActive: true,
      expiresAt: null,
      metadata: {
        paymentId: payment._id.toString(),
        orderId: payment.razorpayOrderId,
        createdFromPayment: true,
        originalPaymentDate: payment.createdAt
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('addons').insertOne(newAddon);
    console.log('Successfully created team member addon:', result.insertedId);

    // Verify the addon was created
    const verifyAddon = await db.collection('addons').findOne({ _id: result.insertedId });
    console.log('Verification - addon created:', {
      id: verifyAddon._id,
      name: verifyAddon.name,
      type: verifyAddon.type,
      isActive: verifyAddon.isActive
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

fixMissingTeamAddon();