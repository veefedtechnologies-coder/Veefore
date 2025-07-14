import { MongoClient } from 'mongodb';

async function debugCredits() {
  // Get DATABASE_URL from environment
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log('DATABASE_URL not found in environment');
    return;
  }
  
  const client = new MongoClient(dbUrl);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    // Find the user
    const user = await db.collection('users').findOne({ 
      username: 'choudharyarpit977' 
    });
    
    console.log('=== USER CREDIT DEBUG ===');
    console.log('User ID:', user._id.toString());
    console.log('Username:', user.username);
    console.log('Credits in DB:', user.credits);
    console.log('Plan:', user.plan);
    
    // Check recent credit transactions
    const transactions = await db.collection('credit_transactions').find({
      userId: user._id
    }).sort({ createdAt: -1 }).limit(10).toArray();
    
    console.log('\n=== RECENT TRANSACTIONS ===');
    transactions.forEach((tx, index) => {
      console.log(`${index + 1}. Amount: ${tx.amount}, Purpose: ${tx.purpose}, Date: ${tx.createdAt}`);
    });
    
    // Calculate total credits from transactions
    const totalCreditsFromTransactions = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    console.log('\n=== CALCULATIONS ===');
    console.log('Total from recent transactions:', totalCreditsFromTransactions);
    console.log('User credits field:', user.credits);
    
  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await client.close();
  }
}

debugCredits();