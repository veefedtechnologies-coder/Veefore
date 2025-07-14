const mongoose = require('mongoose');
require('dotenv').config();

async function debugMongoFields() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB Atlas');
    
    const db = mongoose.connection.db;
    const collection = db.collection('socialaccounts');
    
    const account = await collection.findOne({
      username: 'arpit9996363',
      platform: 'instagram'
    });
    
    if (account) {
      console.log('\n=== FULL MONGODB DOCUMENT ===');
      console.log('_id:', account._id);
      console.log('username:', account.username);
      console.log('workspaceId:', account.workspaceId);
      
      console.log('\n=== ENGAGEMENT FIELDS ===');
      console.log('totalLikes:', account.totalLikes);
      console.log('totalComments:', account.totalComments);
      console.log('totalReach:', account.totalReach);
      console.log('avgEngagement:', account.avgEngagement);
      console.log('avgLikes:', account.avgLikes);
      console.log('avgComments:', account.avgComments);
      console.log('engagementRate:', account.engagementRate);
      
      console.log('\n=== BASIC FIELDS ===');
      console.log('followersCount:', account.followersCount);
      console.log('mediaCount:', account.mediaCount);
      console.log('lastSyncAt:', account.lastSyncAt);
      
      console.log('\n=== ALL FIELD NAMES ===');
      Object.keys(account).sort().forEach(key => {
        console.log(`${key}: ${account[key]}`);
      });
      
    } else {
      console.log('❌ Instagram account not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugMongoFields();