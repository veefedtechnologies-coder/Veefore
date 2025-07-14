/**
 * Fix Instagram Connection Bug - Direct Database Update
 * 
 * This script fixes the critical OAuth callback bug where Instagram accounts
 * are saved but don't appear as connected due to workspace ID type mismatch.
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function fixInstagramConnectionBug() {
  console.log('=== Fixing Instagram Connection Bug ===');
  
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    const socialAccounts = db.collection('socialaccounts');
    
    // 1. Find all Instagram accounts
    console.log('1. Finding Instagram accounts...');
    const instagramAccounts = await socialAccounts.find({ platform: 'instagram' }).toArray();
    
    console.log(`Found ${instagramAccounts.length} Instagram accounts:`);
    instagramAccounts.forEach(acc => {
      console.log(`- @${acc.username}: workspace ${acc.workspaceId} (${typeof acc.workspaceId})`);
    });
    
    // 2. Fix workspace ID type mismatches
    console.log('\n2. Fixing workspace ID types...');
    let fixedCount = 0;
    
    for (const account of instagramAccounts) {
      if (typeof account.workspaceId === 'number') {
        console.log(`Fixing @${account.username}: ${account.workspaceId} (number) -> ${account.workspaceId.toString()} (string)`);
        
        await socialAccounts.updateOne(
          { _id: account._id },
          { 
            $set: { 
              workspaceId: account.workspaceId.toString(),
              updatedAt: new Date()
            }
          }
        );
        
        fixedCount++;
      } else {
        console.log(`@${account.username}: workspace ID already string format`);
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} Instagram accounts`);
    
    // 3. Verify the fix works
    console.log('\n3. Verifying fix...');
    const testWorkspaceId = '684402c2fd2cd4eb6521b386';
    
    const accountsAfterFix = await socialAccounts.find({ 
      workspaceId: testWorkspaceId,
      platform: 'instagram'
    }).toArray();
    
    console.log(`Accounts found for workspace ${testWorkspaceId}: ${accountsAfterFix.length}`);
    
    if (accountsAfterFix.length > 0) {
      accountsAfterFix.forEach(acc => {
        console.log(`✅ @${acc.username} now properly queryable`);
      });
      console.log('\n🎉 SUCCESS: Instagram accounts will now appear as connected!');
    } else {
      console.log('❌ No accounts found - may need different workspace ID');
    }
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  } finally {
    await client.close();
  }
}

fixInstagramConnectionBug();