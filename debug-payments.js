import mongoose from 'mongoose';
import { MongoStorage } from './server/mongodb-storage.js';

async function debugUserPayments() {
  try {
    const storage = new MongoStorage();
    await storage.connect();
    console.log('Connected to MongoDB');

    const userId = '6844027426cae0200f88b5db';
    console.log(`Debugging payments for user: ${userId}`);

    // Direct MongoDB query for payments
    const db = mongoose.connection.db;
    const paymentsCollection = db.collection('payments');
    
    // Find all payments for this user
    const allPayments = await paymentsCollection.find({}).toArray();
    console.log(`Total payments in database: ${allPayments.length}`);
    
    // Check for payments by this specific user
    const userPayments = await paymentsCollection.find({ userId }).toArray();
    console.log(`Payments for user ${userId}: ${userPayments.length}`);
    
    if (userPayments.length > 0) {
      userPayments.forEach((payment, index) => {
        console.log(`Payment ${index + 1}:`, {
          id: payment._id,
          userId: payment.userId,
          purpose: payment.purpose,
          status: payment.status,
          amount: payment.amount,
          createdAt: payment.createdAt
        });
      });
    }
    
    // Check for team-member payments specifically
    const teamPayments = await paymentsCollection.find({ 
      userId, 
      purpose: 'team-member' 
    }).toArray();
    console.log(`Team member payments for user: ${teamPayments.length}`);
    
    // Check for successful team-member payments
    const successfulTeamPayments = await paymentsCollection.find({ 
      userId, 
      purpose: 'team-member',
      status: 'success'
    }).toArray();
    console.log(`Successful team member payments: ${successfulTeamPayments.length}`);
    
    // Check if userId is stored as ObjectId instead of string
    const objectIdUser = new mongoose.Types.ObjectId(userId);
    const objectIdPayments = await paymentsCollection.find({ userId: objectIdUser }).toArray();
    console.log(`Payments with ObjectId user: ${objectIdPayments.length}`);
    
    // Check all payment purposes
    const paymentPurposes = await paymentsCollection.distinct('purpose');
    console.log('All payment purposes in database:', paymentPurposes);
    
    // Check all user IDs in payments
    const userIds = await paymentsCollection.distinct('userId');
    console.log('All user IDs in payments:', userIds.slice(0, 5), '...');
    
  } catch (error) {
    console.error('Error debugging payments:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugUserPayments();