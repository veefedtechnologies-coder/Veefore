const mongoose = require('mongoose');

// MongoDB connection string
const mongoUri = 'mongodb+srv://veeforedatabase:veeforedatabase@veefore.qhmm3.mongodb.net/veeforedb?retryWrites=true&w=majority&appName=VeeFore';

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

async function updateRules() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
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
    
    const rules = await AutomationRuleModel.find({ workspaceId: '684402c2fd2cd4eb6521b386' });
    console.log('Updated rules:');
    rules.forEach(rule => {
      console.log(`- ${rule.name}: trigger.type=${rule.trigger?.type}, action.type=${rule.action?.type}`);
    });
    
    await mongoose.connection.close();
    console.log('Done');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateRules();