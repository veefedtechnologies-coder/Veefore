import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb+srv://veefore:veefore2025@cluster0.2llb1.mongodb.net/veeforedb?retryWrites=true&w=majority&appName=Cluster0');

// Define the schema
const CreditTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  workspaceId: { type: mongoose.Schema.Types.Mixed },
  referenceId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const CreditTransaction = mongoose.model('CreditTransaction', CreditTransactionSchema);

async function seedTransactions() {
  try {
    const userId = "6844027426cae0200f88b5db"; // Your user ID
    
    console.log('Creating sample credit transactions...');

    // Create sample transactions
    const transactions = [
      {
        userId: userId,
        type: 'earned',
        amount: 50,
        description: 'Monthly Free Plan Credits',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        userId: userId,
        type: 'spent',
        amount: -5,
        description: 'AI Content Generation - Instagram Post',
        referenceId: 'content_12345',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        userId: userId,
        type: 'spent',
        amount: -3,
        description: 'Hashtag Analysis & Suggestions',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        userId: userId,
        type: 'earned',
        amount: 10,
        description: 'Referral Bonus - Friend Signup',
        referenceId: 'referral_abc123',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        userId: userId,
        type: 'spent',
        amount: -2,
        description: 'AI Caption Optimization',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    for (const transaction of transactions) {
      await CreditTransaction.create(transaction);
      console.log('Created transaction:', transaction.description);
    }

    console.log('Successfully created', transactions.length, 'sample credit transactions');
    process.exit(0);
  } catch (error) {
    console.error('Error creating credit transactions:', error);
    process.exit(1);
  }
}

seedTransactions();