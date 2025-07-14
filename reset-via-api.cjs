/**
 * Reset Database via API Call
 * Uses the running application's database connection
 */

const http = require('http');

async function resetViaAPI() {
  console.log('🔄 Starting database reset via API...');
  
  // First, let's try to create a reset endpoint directly in the server
  const resetScript = `
const storage = require('./server/storage.js');
const MongoStorage = storage.MongoStorage || storage.default;

async function performReset() {
  try {
    console.log('Starting database reset...');
    
    // Get the storage instance
    const mongoStorage = new MongoStorage();
    
    // Clear all collections
    const collections = [
      'users', 'social_accounts', 'workspaces', 'content', 'scheduled_content',
      'conversations', 'messages', 'automation_rules', 'notifications', 
      'transactions', 'subscriptions', 'team_members', 'team_invitations',
      'referrals', 'waitlist_users', 'early_access_users', 'user_sessions',
      'email_verifications', 'password_resets', 'api_keys', 'webhooks',
      'analytics', 'content_analytics', 'ai_generations', 'thumbnail_generations',
      'roi_calculations', 'ab_tests', 'social_listening', 'content_theft_reports',
      'emotion_analyses', 'persona_suggestions', 'legal_documents', 'affiliate_links',
      'trend_analyses', 'competitor_analyses', 'gamification_data', 'user_preferences',
      'workspace_settings', 'integration_tokens', 'upload_metadata'
    ];
    
    let totalDeleted = 0;
    
    for (const collectionName of collections) {
      try {
        const collection = mongoStorage.db.collection(collectionName);
        const result = await collection.deleteMany({});
        if (result.deletedCount > 0) {
          console.log(\`Cleared \${collectionName}: \${result.deletedCount} documents\`);
        }
        totalDeleted += result.deletedCount;
      } catch (error) {
        console.log(\`Error clearing \${collectionName}: \${error.message}\`);
      }
    }
    
    console.log(\`Database reset completed. Total documents deleted: \${totalDeleted}\`);
    return totalDeleted;
  } catch (error) {
    console.error('Reset failed:', error);
    throw error;
  }
}

performReset().then(result => {
  console.log('Reset completed successfully:', result);
  process.exit(0);
}).catch(error => {
  console.error('Reset failed:', error);
  process.exit(1);
});
`;
  
  // Write the reset script to a temporary file
  const fs = require('fs');
  fs.writeFileSync('temp-reset.js', resetScript);
  
  // Execute the reset script
  const { exec } = require('child_process');
  
  return new Promise((resolve, reject) => {
    exec('node temp-reset.js', (error, stdout, stderr) => {
      // Clean up temp file
      try {
        fs.unlinkSync('temp-reset.js');
      } catch (cleanupError) {
        console.log('Could not clean up temp file:', cleanupError.message);
      }
      
      if (error) {
        console.error('Reset execution failed:', error);
        reject(error);
      } else {
        console.log('Reset output:', stdout);
        if (stderr) console.log('Reset stderr:', stderr);
        resolve(stdout);
      }
    });
  });
}

// Execute the reset
resetViaAPI().then(() => {
  console.log('✅ Database reset completed successfully');
}).catch(error => {
  console.error('❌ Database reset failed:', error);
});