const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function createAdmin() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('veeforedb');
    const adminsCollection = db.collection('admins');
    
    // Check if admin exists
    const existingAdmin = await adminsCollection.findOne({ email: 'admin@veefore.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      return;
    }
    
    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminData = {
      email: 'admin@veefore.com',
      username: 'admin',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await adminsCollection.insertOne(adminData);
    console.log('Admin created successfully:', result.insertedId);
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await client.close();
  }
}

createAdmin();