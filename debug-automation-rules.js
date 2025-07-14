const mongoose = require('mongoose');

// Automation Rule Schema
const AutomationRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workspaceId: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  trigger: { type: mongoose.Schema.Types.Mixed },
  action: { type: mongoose.Schema.Types.Mixed },
  lastRun: { type: Date },
  nextRun: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AutomationRule = mongoose.model('AutomationRule', AutomationRuleSchema);

async function debugAutomationRules() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');
    
    // Find all automation rules
    const allRules = await AutomationRule.find({});
    console.log(`\nTotal automation rules in database: ${allRules.length}`);
    
    allRules.forEach((rule, index) => {
      console.log(`\n--- Rule ${index + 1} ---`);
      console.log(`ID: ${rule._id}`);
      console.log(`Name: ${rule.name}`);
      console.log(`WorkspaceId: ${rule.workspaceId} (type: ${typeof rule.workspaceId})`);
      console.log(`IsActive: ${rule.isActive}`);
      console.log(`CreatedAt: ${rule.createdAt}`);
    });
    
    // Find rules for specific workspace
    const targetWorkspace = '684402c2fd2cd4eb6521b386';
    console.log(`\n\nSearching for rules in workspace: ${targetWorkspace}`);
    
    const workspaceRules = await AutomationRule.find({ workspaceId: targetWorkspace });
    console.log(`Found ${workspaceRules.length} rules for workspace ${targetWorkspace}`);
    
    workspaceRules.forEach((rule, index) => {
      console.log(`\n--- Workspace Rule ${index + 1} ---`);
      console.log(`ID: ${rule._id}`);
      console.log(`Name: ${rule.name}`);
      console.log(`WorkspaceId: ${rule.workspaceId}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugAutomationRules();