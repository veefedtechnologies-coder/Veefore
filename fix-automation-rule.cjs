const { MongoClient } = require('mongodb');

async function fixAutomationRule() {
  const client = new MongoClient('mongodb+srv://veeforeuser:veeforepassword@veeforecluster.j8pko.mongodb.net/?retryWrites=true&w=majority&appName=VeeForeCluster');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('veeforedb');
    const collection = db.collection('automationrules');
    
    console.log('Current GMT time:', new Date().toISOString());
    console.log('Current day:', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getUTCDay()]);
    console.log('Updating rule to block current time (13:09 GMT) and day (Sunday)...');
    
    const result = await collection.updateOne(
      { _id: new require('mongodb').ObjectId('684586d52a482c87f5ffebd6') },
      {
        $set: {
          'action.activeTime.timezone': 'GMT',
          'action.activeTime.startTime': '00:00',
          'action.activeTime.endTime': '12:00',
          'action.activeTime.activeDays': [1, 2, 3, 4, 5, 6],  // Monday-Saturday only (exclude Sunday=7)
          'action.activeTime.enabled': true
        }
      }
    );
    
    console.log('Update result:', result.modifiedCount > 0 ? 'SUCCESS' : 'FAILED');
    
    // Verify the update
    const updatedRule = await collection.findOne({ _id: new require('mongodb').ObjectId('684586d52a482c87f5ffebd6') });
    console.log('\nUpdated activeTime configuration:');
    console.log('- Timezone:', updatedRule.action.activeTime.timezone);
    console.log('- Hours:', updatedRule.action.activeTime.startTime, '-', updatedRule.action.activeTime.endTime);
    console.log('- Active days:', updatedRule.action.activeTime.activeDays);
    console.log('- Enabled:', updatedRule.action.activeTime.enabled);
    
    console.log('\nExpected result: Webhook should be BLOCKED because:');
    console.log('1. Current time ~13:09 GMT > 12:00 GMT end time');
    console.log('2. Current day Sunday (7) not in allowed days [1,2,3,4,5,6]');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

fixAutomationRule();