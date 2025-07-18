const { MongoClient } = require('mongodb');

async function updateAutomationWithMultipleReplies() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    const rulesCollection = db.collection('automationrules');
    
    // Update the automation rule with 3 different comment replies
    const result = await rulesCollection.updateOne(
      { workspaceId: '684402c2fd2cd4eb6521b386' },
      {
        $set: {
          commentReplies: [
            "Thank you for your interest! Please check your DMs for more details. 💬",
            "Hi there! I've sent you the details via DM. Check your messages! 📩",
            "Thanks for reaching out! I've messaged you with all the information. ✨"
          ],
          dmResponses: [
            "Thank you for your interest! Here are the details you requested about our product.",
            "Hi! I'm excited to share more details about our product with you. Let me know if you have any questions!",
            "Thanks for your comment! Here's everything you need to know about our product and how it can help you."
          ],
          updatedAt: new Date()
        }
      }
    );
    
    console.log('Updated automation rule:', result.modifiedCount, 'documents');
    
    // Verify the update
    const updatedRule = await rulesCollection.findOne({ 
      workspaceId: '684402c2fd2cd4eb6521b386' 
    });
    
    console.log('Updated commentReplies:', updatedRule.commentReplies);
    console.log('Updated dmResponses:', updatedRule.dmResponses);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateAutomationWithMultipleReplies();