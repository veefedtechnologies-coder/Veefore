/**
 * Monthly Credit Allocator System
 * 
 * This system automatically allocates monthly credits to users based on their subscription plan
 * WITHOUT removing their existing credits. Credits are additive, not replacements.
 * 
 * Features:
 * 1. Monthly credit allocation based on subscription plan
 * 2. Preserves existing credits (additive system)
 * 3. Tracks allocation history to prevent duplicates
 * 4. Works with all subscription plans (Free, Starter, Pro, Business)
 */

const mongoose = require('mongoose');

// Inline subscription plans to avoid import issues
const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    credits: 20
  },
  starter: {
    id: 'starter',
    name: 'Starter Plan',
    credits: 300
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    credits: 1100
  },
  business: {
    id: 'business',
    name: 'Business Plan',
    credits: 2000
  }
};

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

// Monthly credit allocation function
async function allocateMonthlyCredits() {
  try {
    await connectToDatabase();
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    const transactionsCollection = db.collection('transactions');
    
    // Get current date for tracking
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const allocationId = `monthly-${currentYear}-${currentMonth}`;
    
    console.log(`🔄 Starting monthly credit allocation for ${currentYear}-${currentMonth + 1}`);
    
    // Get all users
    const users = await usersCollection.find({}).toArray();
    console.log(`📊 Found ${users.length} users to process`);
    
    let processedCount = 0;
    let skippedCount = 0;
    
    for (const user of users) {
      try {
        // Check if user already received monthly credits for this month
        const existingAllocation = await transactionsCollection.findOne({
          userId: user._id.toString(),
          type: 'monthly_allocation',
          'metadata.allocationId': allocationId
        });
        
        if (existingAllocation) {
          console.log(`⏭️  User ${user.username} already received monthly credits for this month`);
          skippedCount++;
          continue;
        }
        
        // Get user's subscription plan
        const userPlan = user.subscriptionPlan || 'free';
        const planConfig = SUBSCRIPTION_PLANS[userPlan];
        
        if (!planConfig) {
          console.log(`⚠️  User ${user.username} has invalid plan: ${userPlan}`);
          skippedCount++;
          continue;
        }
        
        const monthlyCredits = planConfig.credits;
        const currentCredits = user.credits || 0;
        const newTotalCredits = currentCredits + monthlyCredits;
        
        // Update user credits (additive)
        await usersCollection.updateOne(
          { _id: user._id },
          { 
            $set: { 
              credits: newTotalCredits,
              updatedAt: now,
              lastMonthlyAllocation: now
            }
          }
        );
        
        // Create transaction record
        await transactionsCollection.insertOne({
          userId: user._id.toString(),
          type: 'monthly_allocation',
          amount: monthlyCredits,
          description: `Monthly ${planConfig.name} plan credits`,
          status: 'completed',
          metadata: {
            allocationId,
            plan: userPlan,
            previousCredits: currentCredits,
            allocatedCredits: monthlyCredits,
            newTotalCredits: newTotalCredits,
            month: currentMonth + 1,
            year: currentYear
          },
          createdAt: now,
          updatedAt: now
        });
        
        console.log(`✅ ${user.username} (${userPlan}): ${currentCredits} + ${monthlyCredits} = ${newTotalCredits} credits`);
        processedCount++;
        
      } catch (error) {
        console.error(`❌ Error processing user ${user.username}:`, error);
      }
    }
    
    console.log(`\n📈 Monthly Credit Allocation Complete:`);
    console.log(`   • Processed: ${processedCount} users`);
    console.log(`   • Skipped: ${skippedCount} users`);
    console.log(`   • Total: ${users.length} users`);
    
  } catch (error) {
    console.error('❌ Monthly credit allocation failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database disconnected');
  }
}

// Run allocation for specific user (testing)
async function allocateCreditsForUser(userId) {
  try {
    await connectToDatabase();
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    const transactionsCollection = db.collection('transactions');
    const { ObjectId } = require('mongodb');
    
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    const userPlan = user.subscriptionPlan || 'free';
    const planConfig = SUBSCRIPTION_PLANS[userPlan];
    const monthlyCredits = planConfig.credits;
    const currentCredits = user.credits || 0;
    const newTotalCredits = currentCredits + monthlyCredits;
    
    console.log(`📊 User: ${user.username}`);
    console.log(`📋 Plan: ${userPlan} (${monthlyCredits} monthly credits)`);
    console.log(`💳 Current Credits: ${currentCredits}`);
    console.log(`➕ Monthly Allocation: ${monthlyCredits}`);
    console.log(`🎯 New Total: ${newTotalCredits}`);
    
    // Update user credits
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          credits: newTotalCredits,
          updatedAt: new Date(),
          lastMonthlyAllocation: new Date()
        }
      }
    );
    
    // Create transaction record
    const now = new Date();
    await transactionsCollection.insertOne({
      userId: userId,
      type: 'monthly_allocation',
      amount: monthlyCredits,
      description: `Monthly ${planConfig.name} plan credits`,
      status: 'completed',
      metadata: {
        plan: userPlan,
        previousCredits: currentCredits,
        allocatedCredits: monthlyCredits,
        newTotalCredits: newTotalCredits,
        manual: true
      },
      createdAt: now,
      updatedAt: now
    });
    
    console.log('✅ Monthly credits allocated successfully!');
    
  } catch (error) {
    console.error('❌ Error allocating credits:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Run for all users
    allocateMonthlyCredits();
  } else if (args[0] === 'user' && args[1]) {
    // Run for specific user
    allocateCreditsForUser(args[1]);
  } else {
    console.log('Usage:');
    console.log('  node monthly-credit-allocator.js                    # Allocate for all users');
    console.log('  node monthly-credit-allocator.js user <userId>      # Allocate for specific user');
  }
}

module.exports = {
  allocateMonthlyCredits,
  allocateCreditsForUser
};