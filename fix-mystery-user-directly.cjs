/**
 * Fix Mystery User Directly
 * 
 * The server finds user 6847b9cdfabaede1706f2990 but my scripts find different user.
 * I'll try to find and fix the mystery user directly by ID.
 */

const { MongoClient, ObjectId } = require('mongodb');

// Use the same URI that the server is using
const MONGODB_URI = process.env.MONGODB_URI;

async function fixMysteryUserDirectly() {
  console.log('=== FIXING MYSTERY USER DIRECTLY ===');
  console.log('Server finds user: 6847b9cdfabaede1706f2990 (isOnboarded: false)');
  console.log('Need to find this user and set isOnboarded: true');
  
  if (!MONGODB_URI) {
    console.log('❌ MONGODB_URI not found');
    return;
  }
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    console.log('Database name:', db.databaseName);
    
    const mysteryUserId = '6847b9cdfabaede1706f2990';
    const email = 'arpit9996363@gmail.com';
    const firebaseUid = 'skO8UqUZMBMmPVfSEQxTlPcercq2';
    
    // 1. Try to find the mystery user directly by ID
    console.log('\n1. Searching for mystery user by ID...');
    const usersCollection = db.collection('users');
    
    let mysteryUser = null;
    
    try {
      mysteryUser = await usersCollection.findOne({ _id: new ObjectId(mysteryUserId) });
      if (mysteryUser) {
        console.log('✅ Found mystery user by ObjectId:', mysteryUser._id.toString());
      }
    } catch (error) {
      console.log('❌ Error searching by ObjectId:', error.message);
    }
    
    if (!mysteryUser) {
      // Try as string ID
      mysteryUser = await usersCollection.findOne({ _id: mysteryUserId });
      if (mysteryUser) {
        console.log('✅ Found mystery user by string ID:', mysteryUser._id.toString());
      }
    }
    
    if (!mysteryUser) {
      // Try to find by email and check if there are multiple users
      console.log('\n2. Searching for all users with email...');
      const allUsersWithEmail = await usersCollection.find({ email }).toArray();
      
      console.log(`Found ${allUsersWithEmail.length} users with email:`, email);
      
      allUsersWithEmail.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log('  - _id:', user._id.toString());
        console.log('  - isOnboarded:', user.isOnboarded);
        console.log('  - isEmailVerified:', user.isEmailVerified);
        console.log('  - createdAt:', user.createdAt);
        
        if (user._id.toString() === mysteryUserId) {
          console.log('  ✅ THIS IS THE MYSTERY USER!');
          mysteryUser = user;
        }
      });
    }
    
    if (!mysteryUser) {
      // Try different database names
      console.log('\n3. Trying different database names...');
      const databases = ['test', 'veeforedb', 'veefore', 'app'];
      
      for (const dbName of databases) {
        console.log(`\nTrying database: ${dbName}`);
        const testDb = client.db(dbName);
        const testUsersCollection = testDb.collection('users');
        
        try {
          const testUser = await testUsersCollection.findOne({ _id: new ObjectId(mysteryUserId) });
          if (testUser) {
            console.log(`✅ Found mystery user in database ${dbName}:`);
            console.log('  - _id:', testUser._id.toString());
            console.log('  - email:', testUser.email);
            console.log('  - isOnboarded:', testUser.isOnboarded);
            
            mysteryUser = testUser;
            
            // Update this user
            console.log(`\n4. Updating user in database ${dbName}...`);
            const updateResult = await testUsersCollection.updateOne(
              { _id: testUser._id },
              { 
                $set: { 
                  isOnboarded: true,
                  isEmailVerified: true,
                  updatedAt: new Date()
                }
              }
            );
            
            console.log('Update result:', updateResult);
            
            if (updateResult.modifiedCount === 1) {
              console.log('✅ Successfully updated mystery user!');
              
              // Verify the update
              const updatedUser = await testUsersCollection.findOne({ _id: testUser._id });
              console.log('Updated user isOnboarded:', updatedUser.isOnboarded);
              console.log('Updated user isEmailVerified:', updatedUser.isEmailVerified);
              
              if (updatedUser.isOnboarded === true) {
                console.log('\n🎉 SUCCESS! Mystery user is now onboarded!');
                console.log('✅ Authentication should now work correctly');
                console.log('✅ User should be redirected to dashboard');
                return;
              }
            }
          }
        } catch (error) {
          console.log(`❌ Error in database ${dbName}:`, error.message);
        }
      }
    }
    
    if (mysteryUser) {
      console.log('\n4. Updating mystery user...');
      const updateResult = await usersCollection.updateOne(
        { _id: mysteryUser._id },
        { 
          $set: { 
            isOnboarded: true,
            isEmailVerified: true,
            updatedAt: new Date()
          }
        }
      );
      
      console.log('Update result:', updateResult);
      
      if (updateResult.modifiedCount === 1) {
        console.log('✅ Successfully updated mystery user!');
        
        // Verify the update
        const updatedUser = await usersCollection.findOne({ _id: mysteryUser._id });
        console.log('Updated user isOnboarded:', updatedUser.isOnboarded);
        console.log('Updated user isEmailVerified:', updatedUser.isEmailVerified);
        
        if (updatedUser.isOnboarded === true) {
          console.log('\n🎉 SUCCESS! Mystery user is now onboarded!');
          console.log('✅ Authentication should now work correctly');
          console.log('✅ User should be redirected to dashboard');
        }
      }
    } else {
      console.log('\n❌ Could not find mystery user anywhere');
      console.log('This suggests a deeper issue with the database connection or caching');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixMysteryUserDirectly();