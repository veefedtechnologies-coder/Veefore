import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Define the automation rule schema
const automationRuleSchema = new mongoose.Schema({
  name: String,
  workspaceId: String,
  description: String,
  isActive: { type: Boolean, default: true },
  trigger: { type: Object, default: {} },
  action: { type: Object, default: {} },
  lastRun: Date,
  nextRun: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AutomationRuleModel = mongoose.model('AutomationRule', automationRuleSchema, 'automation_rules');

async function fixAutomationRules() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Update existing automation rules to have proper DM structure
    const result = await AutomationRuleModel.updateMany(
      { workspaceId: '684402c2fd2cd4eb6521b386' },
      { 
        $set: {
          trigger: {
            type: 'dm',
            aiMode: 'contextual',
            keywords: [],
            hashtags: [],
            mentions: false,
            newFollowers: false,
            postInteraction: false
          },
          action: {
            type: 'dm',
            responses: [],
            aiPersonality: 'friendly',
            responseLength: 'medium'
          },
          updatedAt: new Date()
        }
      }
    );
    
    console.log(`Updated ${result.modifiedCount} automation rules`);
    
    // Verify the update
    const updatedRules = await AutomationRuleModel.find({ 
      workspaceId: '684402c2fd2cd4eb6521b386' 
    });
    
    console.log('Verification - Updated rules:');
    updatedRules.forEach(rule => {
      console.log(`Rule: ${rule.name}, trigger.type: ${rule.trigger?.type}, action.type: ${rule.action?.type}`);
    });
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error updating automation rules:', error);
    process.exit(1);
  }
}

fixAutomationRules();