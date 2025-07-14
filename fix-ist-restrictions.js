import { MongoClient, ObjectId } from 'mongodb';

async function fixISTRestrictions() {
  let client;
  try {
    // Use the same connection string from the server
    const mongoUri = 'mongodb+srv://veeforeuser:veeforepassword@veeforecluster.j8pko.mongodb.net/veeforedb?retryWrites=true&w=majority';
    client = new MongoClient(mongoUri);
    await client.connect();
    
    const db = client.db('veeforedb');
    const collection = db.collection('automationrules');
    
    // Get current IST time
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const currentHour = istTime.getHours();
    const currentMinute = istTime.getMinutes();
    const currentDay = istTime.getDay(); // 0=Sunday, 1=Monday, etc.
    
    console.log(`Current IST: ${currentHour}:${currentMinute.toString().padStart(2, '0')} on ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDay]}`);
    
    // Update automation rule with restrictive settings
    // Current time: ~6:47 PM IST on Sunday
    // Setting: 9 AM - 5 PM IST, Monday-Saturday only
    // This SHOULD block the current request
    
    const updateResult = await collection.updateOne(
      { _id: new ObjectId('684586d52a482c87f5ffebd6') },
      {
        $set: {
          'action.activeTime.enabled': true,
          'action.activeTime.startTime': '09:00',
          'action.activeTime.endTime': '17:00', 
          'action.activeTime.timezone': 'Asia/Kolkata',
          'action.activeTime.activeDays': [1, 2, 3, 4, 5, 6], // Mon-Sat only (exclude Sunday=7)
          updatedAt: new Date()
        }
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log('✅ MongoDB update successful');
      
      // Verify the update
      const updatedRule = await collection.findOne({ _id: new ObjectId('684586d52a482c87f5ffebd6') });
      console.log('\nVerification:');
      console.log(`- Hours: ${updatedRule.action.activeTime.startTime}-${updatedRule.action.activeTime.endTime} IST`);
      console.log(`- Days: ${updatedRule.action.activeTime.activeDays} (1=Mon, 2=Tue, ..., 6=Sat)`);
      console.log(`- Enabled: ${updatedRule.action.activeTime.enabled}`);
      
      console.log('\nValidation Logic:');
      console.log(`Current time: ${currentHour}:${currentMinute.toString().padStart(2, '0')} (${currentHour >= 17 ? 'AFTER' : 'WITHIN'} 17:00 end time)`);
      console.log(`Current day: ${currentDay} (${currentDay === 0 ? 'Sunday - NOT IN' : 'IN'} allowed days)`);
      
      if (currentDay === 0) {
        console.log('❌ Should BLOCK: Sunday not in Monday-Saturday restriction');
      }
      if (currentHour >= 17) {
        console.log('❌ Should BLOCK: After 17:00 IST end time');
      }
      
    } else {
      console.log('❌ MongoDB update failed - no documents modified');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('ENOTFOUND')) {
      console.log('Note: Running from external environment, MongoDB connection may be restricted');
    }
  } finally {
    if (client) {
      await client.close();
    }
  }
}

fixISTRestrictions();