const { MongoClient } = require('mongodb');

// Read MongoDB URI from environment
const uri = process.env.MONGODB_URI || 'mongodb+srv://metatraq:xmhD4TqOyYb4hLxA@cluster0.axjeh.mongodb.net/veeforedb?retryWrites=true&w=majority';

async function debugAutomationRules() {
  console.log('=== AUTOMATION RULES DEBUG ===');
  console.log('Connecting to MongoDB...');
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected successfully');
    
    const db = client.db('veeforedb');
    const rules = await db.collection('automationrules').find({}).toArray();
    
    console.log(`Found ${rules.length} automation rules`);
    
    rules.forEach((rule, index) => {
      console.log(`\n--- Rule ${index + 1}: ${rule.name} ---`);
      console.log('Rule ID:', rule._id);
      console.log('Rule type:', rule.type);
      console.log('Rule isActive:', rule.isActive);
      console.log('Rule triggers:', JSON.stringify(rule.triggers, null, 2));
      console.log('Rule action:', JSON.stringify(rule.action, null, 2));
      
      // Check for responses
      console.log('Action responses:', rule.action?.responses);
      console.log('Action dmResponses:', rule.action?.dmResponses);
      
      // Check response lengths
      const responses = rule.action?.responses || [];
      const dmResponses = rule.action?.dmResponses || [];
      console.log('Responses length:', responses.length);
      console.log('DM responses length:', dmResponses.length);
      
      if (responses.length > 0) {
        console.log('First response:', responses[0]);
        console.log('Response is empty?', responses[0]?.trim() === '');
      }
      
      if (dmResponses.length > 0) {
        console.log('First DM response:', dmResponses[0]);
        console.log('DM response is empty?', dmResponses[0]?.trim() === '');
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugAutomationRules().catch(console.error);