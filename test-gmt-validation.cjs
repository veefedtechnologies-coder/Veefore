const mongoose = require('mongoose');

async function testGMTValidation() {
  try {
    await mongoose.connect('mongodb+srv://veeforeuser:veeforepassword@veeforecluster.j8pko.mongodb.net/veeforedb?retryWrites=true&w=majority&appName=VeeForeCluster');
    
    console.log('Connected to MongoDB');
    console.log('Current GMT time:', new Date().toISOString());
    console.log('Current IST time (GMT+5:30):', new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString());
    
    // Update the automation rule to use GMT with restrictive hours
    const result = await mongoose.connection.db.collection('automationrules').updateOne(
      { _id: new mongoose.Types.ObjectId('684586d52a482c87f5ffebd6') },
      {
        $set: {
          'action.activeTime.timezone': 'GMT',
          'action.activeTime.startTime': '00:00',
          'action.activeTime.endTime': '12:00',
          'action.activeTime.enabled': true
        }
      }
    );
    
    console.log('Rule updated for GMT validation test:', result.modifiedCount > 0);
    
    // Verify the update
    const rule = await mongoose.connection.db.collection('automationrules').findOne(
      { _id: new mongoose.Types.ObjectId('684586d52a482c87f5ffebd6') }
    );
    
    console.log('Updated rule activeTime:', rule.action.activeTime);
    
    await mongoose.disconnect();
    console.log('Database disconnected');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testGMTValidation();