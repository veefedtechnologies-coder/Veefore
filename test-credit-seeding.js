// Quick test to seed credit transactions via API
const transactions = [
  {
    userId: "6844027426cae0200f88b5db",
    type: 'earned',
    amount: 50,
    description: 'Monthly Free Plan Credits'
  },
  {
    userId: "6844027426cae0200f88b5db", 
    type: 'spent',
    amount: -5,
    description: 'AI Content Generation - Instagram Post',
    referenceId: 'content_12345'
  },
  {
    userId: "6844027426cae0200f88b5db",
    type: 'spent', 
    amount: -3,
    description: 'Hashtag Analysis & Suggestions'
  },
  {
    userId: "6844027426cae0200f88b5db",
    type: 'earned',
    amount: 10,
    description: 'Referral Bonus - Friend Signup',
    referenceId: 'referral_abc123'
  },
  {
    userId: "6844027426cae0200f88b5db",
    type: 'spent',
    amount: -2, 
    description: 'AI Caption Optimization'
  }
];

console.log('Sample transactions to create:', JSON.stringify(transactions, null, 2));