import mongoose from 'mongoose';

async function fixInstagramRealData() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('socialaccounts');
    
    // Update Instagram account with your real data
    const result = await collection.updateOne(
      { 
        username: 'rahulc1020',
        platform: 'instagram',
        workspaceId: '684402c2fd2cd4eb6521b386'
      },
      { 
        $set: {
          followersCount: 3,
          followers: 3,
          followingCount: 6,
          mediaCount: 0,
          totalLikes: 0,
          totalComments: 0,
          avgLikes: 0,
          avgComments: 0,
          avgEngagement: 0,
          totalReach: 0,
          impressions: 0,
          biography: '',
          profilePictureUrl: '',
          isVerified: false,
          businessAccountType: 'PERSONAL',
          lastSyncAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    console.log('✓ Updated Instagram account with real data');
    console.log('Matched count:', result.matchedCount);
    console.log('Modified count:', result.modifiedCount);
    
    // Verify the update
    const updated = await collection.findOne({
      username: 'rahulc1020',
      platform: 'instagram'
    });
    
    if (updated) {
      console.log('\n=== VERIFIED REAL DATA ===');
      console.log('Username:', updated.username);
      console.log('Followers:', updated.followersCount || updated.followers);
      console.log('Following:', updated.followingCount);
      console.log('Media Count:', updated.mediaCount);
      console.log('Total Likes:', updated.totalLikes);
      console.log('Total Comments:', updated.totalComments);
      console.log('Last Sync:', updated.lastSyncAt);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  }
}

fixInstagramRealData();