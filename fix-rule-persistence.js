import { MongoClient } from 'mongodb';

const mongoUri = 'mongodb+srv://veeforeuser:veeforepassword@veeforecluster.j8pko.mongodb.net/veeforedb?retryWrites=true&w=majority';

async function fixRulePersistence() {
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('veeforedb');
    const collection = db.collection('automationrules');
    
    // Get current IST time for reference
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const currentHour = istTime.getHours();
    const currentMinute = istTime.getMinutes();
    const currentDay = istTime.getDay(); // 0=Sunday, 1=Monday, etc.
    
    console.log(`Current IST: ${currentHour}:${currentMinute.toString().padStart(2, '0')} on ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDay]}`);
    
    // Update with restrictive settings that should block current time/day
    const result = await collection.updateOne(
      { _id: new client.constructor.ObjectId('684586d52a482c87f5ffebd6') },
      {
        $set: {
          'action.activeTime.enabled': true,
          'action.activeTime.startTime': '09:00',
          'action.activeTime.endTime': '17:00',
          'action.activeTime.timezone': 'Asia/Kolkata',
          'action.activeTime.activeDays': [1, 2, 3, 4, 5, 6],  // Monday-Saturday only (exclude Sunday=7)
          'updatedAt': new Date()
        }
      }
    );
    
    console.log(`Update result: ${result.modifiedCount > 0 ? 'SUCCESS' : 'FAILED'}`);
    
    // Verify the update
    const updatedRule = await collection.findOne({ _id: new client.constructor.ObjectId('684586d52a482c87f5ffebd6') });
    
    console.log('\nVerification - Updated activeTime:');
    console.log(`- Enabled: ${updatedRule.action.activeTime.enabled}`);
    console.log(`- Hours: ${updatedRule.action.activeTime.startTime}-${updatedRule.action.activeTime.endTime} IST`);
    console.log(`- Days: ${updatedRule.action.activeTime.activeDays} (1=Mon, 2=Tue, ..., 6=Sat)`);
    
    console.log('\nExpected validation behavior:');
    if (currentDay === 0) {
      console.log('❌ Should BLOCK - Sunday (day 7) not in allowed days [1,2,3,4,5,6]');
    }
    if (currentHour >= 17) {
      console.log('❌ Should BLOCK - Current time after 17:00 IST end time');
    }
    
  } catch (error) {
    console.error('MongoDB operation failed:', error.message);
  } finally {
    await client.close();
  }
}

fixRulePersistence();