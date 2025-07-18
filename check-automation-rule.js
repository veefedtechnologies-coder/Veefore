import mongoose from 'mongoose';

async function checkAutomationRule() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const rules = await db.collection('automationrules').find({}).toArray();
    
    console.log('All automation rules:');
    rules.forEach((rule, index) => {
      console.log(`\nRule ${index + 1}:`);
      console.log('Workspace ID:', rule.workspaceId);
      console.log('Name:', rule.name);
      console.log('Type:', rule.type);
      console.log('Keywords:', rule.keywords);
      console.log('Comment replies:', rule.commentReplies);
      console.log('DM responses:', rule.dmResponses);
      console.log('Action responses:', rule.action?.responses);
      console.log('Action DM responses:', rule.action?.dmResponses);
    });

    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAutomationRule();