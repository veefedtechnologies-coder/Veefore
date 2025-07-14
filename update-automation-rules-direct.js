// Direct MongoDB update for automation rules
import mongoose from 'mongoose';

// Use the existing MongoDB connection string
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

const AutomationRule = mongoose.model('AutomationRule', automationRuleSchema, 'automation_rules');

async function updateDMRules() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');
    
    // Find automation rules for the workspace
    const rules = await AutomationRule.find({ workspaceId: '684402c2fd2cd4eb6521b386' });
    console.log(`Found ${rules.length} automation rules`);
    
    // Update each rule with proper DM structure
    for (const rule of rules) {
      console.log(`Updating rule: ${rule.name} (${rule._id})`);
      
      await AutomationRule.findByIdAndUpdate(rule._id, {
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
      });
      
      console.log(`✓ Updated: ${rule.name}`);
    }
    
    // Verify the updates
    console.log('\nVerifying updates...');
    const updatedRules = await AutomationRule.find({ workspaceId: '684402c2fd2cd4eb6521b386' });
    
    updatedRules.forEach(rule => {
      console.log(`- ${rule.name}: trigger.type=${rule.trigger?.type}, action.type=${rule.action?.type}`);
    });
    
    await mongoose.connection.close();
    console.log('\n✓ DM automation rules updated successfully!');
    
  } catch (error) {
    console.error('Error updating automation rules:', error);
    process.exit(1);
  }
}

updateDMRules();