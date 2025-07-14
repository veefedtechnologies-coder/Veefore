const { MongoClient } = require('mongodb');
require('dotenv').config();

async function createFifthAddon() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('veeforedb');
    const addonsCollection = db.collection('addons');
    
    // Check current addon count
    const currentAddons = await addonsCollection.find({ userId: 6844027426, type: 'team-member', isActive: true }).toArray();
    console.log('Current addon count:', currentAddons.length);
    
    // Create the 5th addon (should have been auto-created from recent payment order_QeTXEagxBlmXWu)
    const fifthAddon = {
      userId: 6844027426,
      type: 'team-member',
      name: 'Additional Team Member Seat',
      price: 19900,
      isActive: true,
      expiresAt: null,
      metadata: {
        addonId: 'team-member',
        benefit: 'Add one additional team member to your workspace',
        paymentId: 'order_QeTXEagxBlmXWu',
        purchaseDate: new Date().toISOString(),
        autoCreated: false,
        createdFromPayment: true,
        manualFix: true,
        note: 'Created manually to fix missing auto-creation from payment verification bug'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await addonsCollection.insertOne(fifthAddon);
    console.log('Fifth addon created:', result.insertedId);
    
    // Verify final count
    const finalAddons = await addonsCollection.find({ userId: 6844027426, type: 'team-member', isActive: true }).toArray();
    console.log('User now has', finalAddons.length, 'team-member addons');
    console.log('Max team size is now:', 1 + finalAddons.length, 'members');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createFifthAddon();