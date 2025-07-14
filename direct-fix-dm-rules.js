import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://veeforeuser:veeforepassword@veeforecluster.j8pko.mongodb.net/veeforedb?retryWrites=true&w=majority';

// Define schema to match the existing structure
const AutomationRuleSchema = new mongoose.Schema({
  name: String,
  workspaceId: String,
  description: String,
  isActive: Boolean,
  type: String,
  trigger: Object,
  action: Object,
  lastRun: Date,
  nextRun: Date,
  createdAt: Date,
  updatedAt: Date
});

const AutomationRule = mongoose.model('AutomationRule', AutomationRuleSchema, 'automationrules');

async function fixDMAutomationRules() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get current IST time for reference
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const currentHour = istTime.getHours();
    const currentMinute = istTime.getMinutes();
    const currentDay = istTime.getDay(); // 0=Sunday, 1=Monday, etc.
    
    console.log(`Current IST: ${currentHour}:${currentMinute.toString().padStart(2, '0')} on ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDay]}`);
    
    // Find the DM automation rule
    const rule = await AutomationRule.findById('684586d52a482c87f5ffebd6');
    
    if (!rule) {
      console.log('DM automation rule not found');
      return;
    }
    
    console.log('Current rule config:', {
      name: rule.name,
      activeTime: rule.action?.activeTime
    });
    
    // Update with restrictive settings that should block current time/day
    const updateData = {
      $set: {
        'action.activeTime.enabled': true,
        'action.activeTime.startTime': '09:00',
        'action.activeTime.endTime': '17:00',
        'action.activeTime.timezone': 'Asia/Kolkata',
        'action.activeTime.activeDays': [1, 2, 3, 4, 5, 6], // Monday-Saturday only (exclude Sunday=7)
        updatedAt: new Date()
      }
    };
    
    console.log('\nApplying restrictive settings:');
    console.log('- Active hours: 09:00-17:00 IST');
    console.log('- Active days: Monday-Saturday only (excludes Sunday)');
    
    const result = await AutomationRule.updateOne(
      { _id: '684586d52a482c87f5ffebd6' },
      updateData
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Database update successful');
      
      // Verify the update
      const updatedRule = await AutomationRule.findById('684586d52a482c87f5ffebd6');
      console.log('\nVerification - activeTime configuration:');
      console.log(`- Enabled: ${updatedRule.action.activeTime.enabled}`);
      console.log(`- Hours: ${updatedRule.action.activeTime.startTime}-${updatedRule.action.activeTime.endTime} IST`);
      console.log(`- Days: ${updatedRule.action.activeTime.activeDays} (1=Mon, 2=Tue, ..., 6=Sat)`);
      
      console.log('\nExpected validation with current time:');
      console.log(`Current: ${currentHour}:${currentMinute.toString().padStart(2, '0')} IST on ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDay]}`);
      
      // Check what should happen
      const mondayFirst = currentDay === 0 ? 7 : currentDay; // Convert to 1=Monday format
      const currentTimeMinutes = currentHour * 60 + currentMinute;
      const startTimeMinutes = 9 * 60; // 09:00
      const endTimeMinutes = 17 * 60; // 17:00
      
      if (mondayFirst === 7) { // Sunday
        console.log('❌ Should BLOCK: Sunday (7) not in allowed days [1,2,3,4,5,6]');
      }
      if (currentTimeMinutes < startTimeMinutes || currentTimeMinutes > endTimeMinutes) {
        console.log('❌ Should BLOCK: Time outside 09:00-17:00 IST range');
      }
      if (mondayFirst !== 7 && currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes) {
        console.log('✅ Should ALLOW: Time and day within restrictions');
      }
      
    } else {
      console.log('❌ Database update failed');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

fixDMAutomationRules();