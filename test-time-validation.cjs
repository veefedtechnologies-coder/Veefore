const mongoose = require('mongoose');

async function testTimeValidation() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    
    // Update the automation rule to have restrictive GMT hours
    const AutomationRule = mongoose.model('AutomationRule', new mongoose.Schema({}, { strict: false }), 'automationrules');
    
    const result = await AutomationRule.updateOne(
      { _id: new mongoose.Types.ObjectId('684586d52a482c87f5ffebd6') },
      {
        $set: {
          'action.activeTime': {
            enabled: true,
            startTime: '00:00',
            endTime: '12:00',
            timezone: 'GMT',
            activeDays: [1, 2, 3, 4, 5, 6, 7]
          }
        }
      }
    );
    
    console.log('Rule updated successfully:', result.modifiedCount > 0);
    
    // Now test with a webhook call that should be blocked (current time is ~13:05 GMT)
    const fetch = require('node-fetch');
    
    const webhookData = {
      object: "instagram",
      entry: [{
        time: Math.floor(Date.now() / 1000),
        id: "17841474747481653",
        messaging: [{
          sender: { id: "1479580653003691" },
          recipient: { id: "17841474747481653" },
          timestamp: Date.now(),
          message: {
            mid: "test_time_restriction_001",
            text: "This should be blocked - testing GMT time restriction"
          }
        }]
      }]
    };
    
    console.log('Sending webhook to test time restriction...');
    console.log('Current GMT time:', new Date().toISOString());
    console.log('Rule allows: 00:00-12:00 GMT, current time should be blocked');
    
    const response = await fetch('http://localhost:5000/webhook/instagram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': 'sha256=test'
      },
      body: JSON.stringify(webhookData)
    });
    
    console.log('Webhook response:', await response.text());
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

testTimeValidation();