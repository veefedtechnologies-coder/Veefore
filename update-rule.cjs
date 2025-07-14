const mongoose = require("mongoose");

async function testTimeValidation() {
  try {
    await mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/veeforedb");
    
    const AutomationRule = mongoose.model("AutomationRule", new mongoose.Schema({}, { strict: false }), "automationrules");
    
    console.log("Updating rule with restrictive GMT hours (00:00-12:00)...");
    console.log("Current GMT time:", new Date().toISOString(), "- should be blocked");
    
    const result = await AutomationRule.updateOne(
      { _id: new mongoose.Types.ObjectId("684586d52a482c87f5ffebd6") },
      {
        $set: {
          "action.activeTime": {
            enabled: true,
            startTime: "00:00",
            endTime: "12:00", 
            timezone: "GMT",
            activeDays: [1, 2, 3, 4, 5, 6, 7]
          }
        }
      }
    );
    
    console.log("Rule updated:", result.modifiedCount > 0);
    await mongoose.disconnect();
    console.log("Database disconnected");
    
  } catch (error) {
    console.error("Error:", error.message);
    await mongoose.disconnect();
  }
}

testTimeValidation();
