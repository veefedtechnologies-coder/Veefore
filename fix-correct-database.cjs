/**
 * Fix User in Correct Database
 * 
 * The server is using: mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net/veeforedb
 * My scripts were using: mongodb+srv://arpit9996363:jdlghZrjUE2bq5D@cluster0.cbnlr.mongodb.net/veeforedb
 * 
 * I need to update the user in the CORRECT database (the one the server uses)
 */

const { MongoClient, ObjectId } = require('mongodb');

// Use the same URI that the server is using (from environment variable)
const MONGODB_URI = process.env.MONGODB_URI;

async function fixCorrectDatabase() {
  console.log('=== FIXING USER IN CORRECT DATABASE ===');
  console.log('Using server database URI:', MONGODB_URI);
  
  if (!MONGODB_URI) {
    console.log('❌ MONGODB_URI not found in environment variables');
    return;
  }
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB (server database)');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    console.log('Database name:', db.databaseName);
    
    const email = 'arpit9996363@gmail.com';
    const firebaseUid = 'skO8UqUZMBMmPVfSEQxTlPcercq2';
    const mysteryUserId = '6847b9cdfabaede1706f2990';
    
    // 1. Find the user the server is currently finding
    console.log('\n1. Finding user in server database...');
    const serverUser = await usersCollection.findOne({ firebaseUid });
    
    if (!serverUser) {
      console.log('❌ No user found with firebaseUid:', firebaseUid);
      return;
    }
    
    console.log('✅ Server database user found:');
    console.log('   - _id:', serverUser._id.toString());
    console.log('   - email:', serverUser.email);
    console.log('   - username:', serverUser.username);
    console.log('   - isOnboarded:', serverUser.isOnboarded);
    console.log('   - isEmailVerified:', serverUser.isEmailVerified);
    console.log('   - createdAt:', serverUser.createdAt);
    console.log('   - updatedAt:', serverUser.updatedAt);
    
    // 2. Check if this is the mystery user
    if (serverUser._id.toString() === mysteryUserId) {
      console.log('\n✅ This is the mystery user the server finds!');
      console.log('   Current isOnboarded:', serverUser.isOnboarded);
      console.log('   Current isEmailVerified:', serverUser.isEmailVerified);
      
      // 3. Update the user to have correct onboarding status
      console.log('\n2. Updating user to have correct onboarding status...');
      
      const updateResult = await usersCollection.updateOne(
        { _id: serverUser._id },
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
        console.log('✅ Successfully updated user!');
        
        // 4. Verify the update
        console.log('\n3. Verifying the update...');
        const updatedUser = await usersCollection.findOne({ _id: serverUser._id });
        
        console.log('Updated user:');
        console.log('   - _id:', updatedUser._id.toString());
        console.log('   - email:', updatedUser.email);
        console.log('   - isOnboarded:', updatedUser.isOnboarded);
        console.log('   - isEmailVerified:', updatedUser.isEmailVerified);
        console.log('   - updatedAt:', updatedUser.updatedAt);
        
        if (updatedUser.isOnboarded === true && updatedUser.isEmailVerified === true) {
          console.log('\n🎉 SUCCESS! User is now properly onboarded!');
          console.log('✅ The server should now find user with isOnboarded: true');
          console.log('✅ Authentication should now work correctly');
          console.log('✅ User should be redirected to dashboard instead of onboarding');
        } else {
          console.log('\n❌ Update failed - user still has incorrect status');
        }
      } else {
        console.log('❌ Update failed - no documents modified');
      }
    } else {
      console.log('\n❌ This is NOT the mystery user!');
      console.log('   Expected:', mysteryUserId);
      console.log('   Found:', serverUser._id.toString());
      console.log('   There may be a different issue');
    }
    
    console.log('\n=== FINAL STATUS ===');
    console.log('The fix has been applied to the correct database.');
    console.log('Ask the user to try signing in again to test the fix.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixCorrectDatabase();