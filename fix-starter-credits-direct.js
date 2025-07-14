/**
 * Direct Fix for Starter Credits - Update User to 300 Credits
 * Uses direct MongoDB connection to fix the credit allocation
 */

const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

async function fixStarterCredits() {
  try {
    // Connect to MongoDB using the same connection string format as the app
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL not found');
    }
    
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(connectionString);
    
    const userId = '6844027426cae0200f88b5db';
    const starterCredits = 300;
    
    // Get the database and collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Find user by id field
    const user = await usersCollection.findOne({ id: userId });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('Before fix:');
    console.log(`  Plan: ${user.plan}`);
    console.log(`  Credits: ${user.credits}`);
    
    // Update user with correct Starter plan credits (300)
    const result = await usersCollection.updateOne(
      { id: userId },
      { 
        $set: { 
          credits: starterCredits,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('\n✅ Successfully updated user credits!');
      console.log(`  New credits: ${starterCredits}`);
      console.log(`  Plan: starter`);
      
      // Also add a transaction record
      const transactionsCollection = db.collection('credittransactions');
      await transactionsCollection.insertOne({
        userId: userId,
        type: 'plan_adjustment',
        amount: starterCredits - (user.credits || 0),
        description: 'Starter plan credit adjustment - set to 300 monthly credits',
        referenceId: 'starter_plan_fix',
        createdAt: new Date()
      });
      
      console.log('\n🎉 Starter plan credits fixed successfully!');
      console.log('User now has the correct 300 credits for the Starter plan.');
    } else {
      console.log('❌ Failed to update user credits');
    }
    
  } catch (error) {
    console.error('❌ Error fixing Starter credits:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixStarterCredits();