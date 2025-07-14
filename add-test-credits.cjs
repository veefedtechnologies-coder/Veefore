/**
 * Test Credit Update - Add 157 credits to reach 300 total
 */

const mongoose = require('mongoose');

async function addTestCredits() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    
    // Connect using the actual MongoDB URI from the app
    await mongoose.connect('mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      dbName: 'veeforedb'
    });
    
    const userId = '6844027426cae0200f88b5db';
    const targetCredits = 300;
    
    console.log('📊 Current status:');
    console.log('  User ID:', userId);
    console.log('  Target credits:', targetCredits);
    
    // Get the database and update directly
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Get current user data using ObjectId
    const { ObjectId } = require('mongodb');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('  Current credits:', user.credits);
    console.log('  Plan:', user.plan);
    
    const creditsToAdd = targetCredits - (user.credits || 0);
    console.log('  Credits to add:', creditsToAdd);
    
    // Update user credits to 300 (Starter plan amount)
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          credits: targetCredits,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Successfully updated user credits!');
      console.log('🎉 User now has', targetCredits, 'credits for Starter plan');
      
      // Create transaction record
      const transactionsCollection = db.collection('credittransactions');
      await transactionsCollection.insertOne({
        userId: userId,
        type: 'plan_credit_fix',
        amount: creditsToAdd,
        description: 'Starter plan credit correction - 300 monthly credits',
        referenceId: 'starter_plan_300_credits',
        createdAt: new Date()
      });
      
      console.log('📝 Transaction record created');
    } else {
      console.log('❌ Failed to update user credits');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database disconnected');
  }
}

addTestCredits();