/**
 * Add Credits to User - Direct MongoDB Update
 * This script adds the remaining credits to bring the user to 300 total credits
 */

// Simple direct MongoDB update using the established connection
const script = `
const mongoose = require('mongoose');

async function addCredits() {
  try {
    console.log('🔧 Adding credits to user...');
    
    // Connect to MongoDB (using the same connection as the app)
    await mongoose.connect('mongodb+srv://veefore:veefore123@cluster0.e6xr0.mongodb.net/veeforedb?retryWrites=true&w=majority');
    
    const userId = '6844027426cae0200f88b5db';
    const currentCredits = 143;
    const targetCredits = 300;
    const creditsToAdd = targetCredits - currentCredits;
    
    console.log('Current credits:', currentCredits);
    console.log('Target credits:', targetCredits);
    console.log('Credits to add:', creditsToAdd);
    
    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Update user credits
    const result = await usersCollection.updateOne(
      { id: userId },
      { 
        $set: { 
          credits: targetCredits,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Successfully updated user credits!');
      console.log('New credits:', targetCredits);
      
      // Add transaction record
      const transactionsCollection = db.collection('credittransactions');
      await transactionsCollection.insertOne({
        userId: userId,
        type: 'plan_adjustment',
        amount: creditsToAdd,
        description: 'Starter plan monthly credits allocation - 300 total',
        referenceId: 'starter_monthly_credits',
        createdAt: new Date()
      });
      
      console.log('🎉 User now has correct 300 credits for Starter plan!');
    } else {
      console.log('❌ Failed to update user credits');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addCredits();
`;

console.log('Running direct MongoDB credit update...');
eval(script);