/**
 * Update User Subscription Plan
 * 
 * This script updates a user's subscription plan to ensure they get the correct
 * monthly credit allocation. Since you have the Starter plan, this will update
 * your plan from "free" to "starter".
 */

const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

// Connect to MongoDB Atlas
async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      dbName: 'veeforedb'
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

// Update user plan and add starter credits
async function updateUserPlan(userId, newPlan) {
  try {
    await connectToDatabase();
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    const transactionsCollection = db.collection('transactions');
    
    // Get user
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log(`📊 User: ${user.username}`);
    console.log(`📋 Current Plan: ${user.subscriptionPlan || 'free'}`);
    console.log(`📋 New Plan: ${newPlan}`);
    console.log(`💳 Current Credits: ${user.credits || 0}`);
    
    // Plan credit allocations
    const planCredits = {
      free: 20,
      starter: 300,
      pro: 1100,
      business: 2000
    };
    
    const planCreditsToAdd = planCredits[newPlan] || 0;
    const newTotalCredits = (user.credits || 0) + planCreditsToAdd;
    
    console.log(`➕ Plan Credits: ${planCreditsToAdd}`);
    console.log(`🎯 New Total: ${newTotalCredits}`);
    
    // Update user plan and add credits
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          subscriptionPlan: newPlan,
          credits: newTotalCredits,
          updatedAt: new Date(),
          planUpgradedAt: new Date()
        }
      }
    );
    
    // Create transaction record
    const now = new Date();
    await transactionsCollection.insertOne({
      userId: userId,
      type: 'plan_upgrade',
      amount: planCreditsToAdd,
      description: `Plan upgrade to ${newPlan} with ${planCreditsToAdd} credits`,
      status: 'completed',
      metadata: {
        newPlan: newPlan,
        previousPlan: user.subscriptionPlan || 'free',
        previousCredits: user.credits || 0,
        allocatedCredits: planCreditsToAdd,
        newTotalCredits: newTotalCredits
      },
      createdAt: now,
      updatedAt: now
    });
    
    console.log('✅ Plan updated successfully!');
    console.log(`🔄 ${user.username} plan updated from ${user.subscriptionPlan || 'free'} to ${newPlan}`);
    console.log(`💳 Credits: ${user.credits || 0} → ${newTotalCredits}`);
    
  } catch (error) {
    console.error('❌ Error updating plan:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 2) {
    const userId = args[0];
    const newPlan = args[1];
    
    if (!['free', 'starter', 'pro', 'business'].includes(newPlan)) {
      console.log('❌ Invalid plan. Use: free, starter, pro, or business');
      process.exit(1);
    }
    
    updateUserPlan(userId, newPlan);
  } else {
    console.log('Usage: node update-user-plan.cjs <userId> <newPlan>');
    console.log('Plans: free, starter, pro, business');
    console.log('Example: node update-user-plan.cjs 6844027426cae0200f88b5db starter');
  }
}

module.exports = { updateUserPlan };