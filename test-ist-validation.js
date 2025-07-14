import mongoose from 'mongoose';

// MongoDB connection string
const mongoUri = 'mongodb+srv://veeforeuser:veeforepassword@veeforecluster.j8pko.mongodb.net/veeforedb?retryWrites=true&w=majority';

async function testISTValidation() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('automationrules');
    
    // Get current IST time
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const currentHour = istTime.getHours();
    const currentMinute = istTime.getMinutes();
    const currentDay = istTime.getDay(); // 0=Sunday, 1=Monday, etc.
    
    console.log(`\nCurrent IST time: ${currentHour}:${currentMinute.toString().padStart(2, '0')}`);
    console.log(`Current day: ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDay]}`);
    
    // Update rule to be restrictive (should block current time/day)
    console.log('\nUpdating automation rule with restrictive settings...');
    
    const result = await collection.updateOne(
      { _id: new mongoose.Types.ObjectId('684586d52a482c87f5ffebd6') },
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
    
    console.log('Update result:', result.modifiedCount > 0 ? 'SUCCESS' : 'FAILED');
    
    // Verify the update
    const updatedRule = await collection.findOne({ _id: new mongoose.Types.ObjectId('684586d52a482c87f5ffebd6') });
    
    console.log('\nUpdated activeTime configuration:');
    console.log('- Enabled:', updatedRule.action.activeTime.enabled);
    console.log('- Hours:', updatedRule.action.activeTime.startTime, '-', updatedRule.action.activeTime.endTime);
    console.log('- Timezone:', updatedRule.action.activeTime.timezone);
    console.log('- Active days:', updatedRule.action.activeTime.activeDays);
    
    console.log('\nExpected validation result:');
    if (currentDay === 0) { // Sunday
      console.log('❌ Should be BLOCKED - Current day is Sunday (not in Monday-Saturday)');
    }
    if (currentHour < 9 || currentHour >= 17) {
      console.log('❌ Should be BLOCKED - Current time outside 09:00-17:00 IST');
    }
    if (currentDay !== 0 && currentHour >= 9 && currentHour < 17) {
      console.log('✅ Should be ALLOWED - Current time and day within restrictions');
    }
    
    console.log('\nRule update completed. Testing webhook validation...');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testISTValidation();