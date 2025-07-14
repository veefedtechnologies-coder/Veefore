import { MongoStorage } from './server/mongodb-storage.js';

async function updateRuleDirectly() {
  const storage = new MongoStorage();
  
  try {
    // Get current IST time
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const currentHour = istTime.getHours();
    const currentMinute = istTime.getMinutes();
    const currentDay = istTime.getDay(); // 0=Sunday, 1=Monday, etc.
    
    console.log(`Current IST time: ${currentHour}:${currentMinute.toString().padStart(2, '0')}`);
    console.log(`Current day: ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDay]}`);
    
    // Update automation rule with restrictive settings that should block current time/day
    const updates = {
      action: {
        type: "dm",
        responses: [""],
        aiPersonality: "friendly",
        responseLength: "medium",
        aiConfig: {
          personality: "casual",
          responseLength: "long",
          dailyLimit: 50,
          responseDelay: 1,
          language: "auto",
          contextualMode: true
        },
        conditions: {
          timeDelay: 0,
          maxPerDay: 10,
          excludeKeywords: [],
          minFollowers: 0,
          responseDelay: 30,
          ruleDuration: 30
        },
        duration: {
          startDate: "2025-06-08",
          durationDays: 30,
          autoExpire: true
        },
        activeTime: {
          enabled: true,
          startTime: "09:00",
          endTime: "17:00",
          timezone: "Asia/Kolkata",
          activeDays: [1, 2, 3, 4, 5, 6]  // Monday-Saturday only (exclude Sunday=7)
        }
      }
    };
    
    console.log('\nUpdating automation rule with restrictive settings...');
    console.log('- Active hours: 09:00-17:00 IST');
    console.log('- Active days: Monday-Saturday only');
    
    const result = await storage.updateAutomationRule('684586d52a482c87f5ffebd6', updates);
    
    console.log('Update completed successfully');
    console.log('Rule ID:', result.id);
    console.log('Active Time Config:', result.action.activeTime);
    
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
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updateRuleDirectly();