import { storage } from './server/storage.js';

async function createSampleTransactions() {
  try {
    const userId = "6844027426cae0200f88b5db";
    
    const transactions = [
      {
        userId: userId,
        type: 'earned',
        amount: 50,
        description: 'Monthly Free Plan Credits'
      },
      {
        userId: userId,
        type: 'spent',
        amount: -5,
        description: 'AI Content Generation - Instagram Post',
        referenceId: 'content_12345'
      },
      {
        userId: userId,
        type: 'spent',
        amount: -3,
        description: 'Hashtag Analysis & Suggestions'
      },
      {
        userId: userId,
        type: 'earned',
        amount: 10,
        description: 'Referral Bonus - Friend Signup',
        referenceId: 'referral_abc123'
      },
      {
        userId: userId,
        type: 'spent',
        amount: -2,
        description: 'AI Caption Optimization'
      }
    ];

    for (const transaction of transactions) {
      await storage.createCreditTransaction(transaction);
      console.log('Created transaction:', transaction.description);
    }

    console.log('Successfully created', transactions.length, 'sample credit transactions');
    process.exit(0);
  } catch (error) {
    console.error('Error creating transactions:', error);
    process.exit(1);
  }
}

createSampleTransactions();