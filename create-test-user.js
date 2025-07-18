const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

async function createTestUser() {
  const client = new MongoClient('mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db('veeforedb')
    const users = db.collection('users')
    const workspaces = db.collection('workspaces')
    
    // Create test user
    const testUser = {
      email: 'test@veefore.com',
      password: await bcrypt.hash('testpass123', 10),
      name: 'Test User',
      isOnboarded: true,
      isEmailVerified: true,
      plan: 'free',
      credits: 100,
      firebaseUid: 'test-uid-123',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Insert or update user
    await users.replaceOne(
      { email: testUser.email },
      testUser,
      { upsert: true }
    )
    
    const insertedUser = await users.findOne({ email: testUser.email })
    console.log('Test user created:', insertedUser._id)
    
    // Create test workspace
    const testWorkspace = {
      name: 'Test Workspace',
      ownerId: insertedUser._id.toString(),
      credits: 100,
      plan: 'free',
      members: [{
        userId: insertedUser._id.toString(),
        role: 'owner',
        joinedAt: new Date()
      }],
      settings: {
        autoSync: true,
        notifications: true,
        timezone: 'UTC'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await workspaces.replaceOne(
      { ownerId: insertedUser._id.toString() },
      testWorkspace,
      { upsert: true }
    )
    
    const insertedWorkspace = await workspaces.findOne({ ownerId: insertedUser._id.toString() })
    console.log('Test workspace created:', insertedWorkspace._id)
    
    console.log('✅ Test user and workspace created successfully')
    console.log('Email: test@veefore.com')
    console.log('Password: testpass123')
    
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await client.close()
  }
}

createTestUser()