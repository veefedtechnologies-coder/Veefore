import { MongoStorage } from '../mongodb-storage';

/**
 * Utility functions for Instagram account validation and management
 */

/**
 * Validate if an Instagram account's access token is still valid
 */
async function validateInstagramAccessToken(socialAccount: any): Promise<boolean> {
  try {
    // Check if token exists and has not expired
    const tokenExpiresAt = socialAccount.expiresAt;
    if (!tokenExpiresAt) {
      console.log(`[TOKEN VALIDATION] Account ${socialAccount.username} has no expiration date - token likely invalid`);
      return false;
    }
    
    // Check if token has expired
    if (new Date() >= new Date(tokenExpiresAt)) {
      console.log(`[TOKEN VALIDATION] Account ${socialAccount.username} token expired at ${tokenExpiresAt}`);
      return false;
    }
    
    // Additional check: Test the token with Instagram API
    let testToken;
    
    // Create a mock storage instance to use decryptStoredToken
    const { MongoStorage } = await import('../mongodb-storage');
    const tempStorage = new MongoStorage();
    
    testToken = await tempStorage.getAccessTokenFromAccount(socialAccount);
    
    if (!testToken) {
      console.log(`[TOKEN VALIDATION] Account ${socialAccount.username} has no valid access token`);
      return false;
    }
    
    // Test the token with Instagram API
    const fetch = await import('node-fetch');
    const tokenResponse = await fetch.default(`https://graph.instagram.com/me?fields=id&access_token=${testToken}`);
    
    if (!tokenResponse.ok) {
      console.log(`[TOKEN VALIDATION] Account ${socialAccount.username} token test failed with status ${tokenResponse.status}`);
      return false;
    }
    
    const tokenData = await tokenResponse.json();
    if (!tokenData.id || tokenData.id !== socialAccount.accountId) {
      console.log(`[TOKEN VALIDATION] Account ${socialAccount.username} token test returned invalid response`);
      return false;
    }
    
    console.log(`[TOKEN VALIDATION] Account ${socialAccount.username} token is valid`);
    return true;
  } catch (error) {
    console.log(`[TOKEN VALIDATION] Account ${socialAccount.username} token validation failed:`, error);
    return false;
  }
}

/**
 * Check if an Instagram account is already connected to any workspace
 * Only considers accounts with valid access tokens as "connected"
 */
export async function checkInstagramAccountExists(instagramAccountId: string): Promise<{
  exists: boolean;
  user?: any;
  workspaceId?: string;
  hasValidToken?: boolean;
}> {
  try {
    const storage = new MongoStorage();
    await storage.connect();
    
    // Check SocialAccounts collection (the actual source of truth)
    const socialAccounts = await storage.getAllSocialAccounts();
    const existingAccount = socialAccounts.find(acc => 
      acc.platform === 'instagram' && acc.accountId === instagramAccountId
    );
    
    if (existingAccount) {
      // Check if the account has a valid access token
      const hasValidToken = await validateInstagramAccessToken(existingAccount);
      
      // Only consider the account "connected" if it has a valid token
      return {
        exists: hasValidToken,
        user: existingAccount,
        workspaceId: String(existingAccount.workspaceId), // Ensure workspaceId is a string
        hasValidToken: hasValidToken
      };
    }
    
    return { exists: false, hasValidToken: false };
  } catch (error) {
    console.error('🚨 Error checking Instagram account:', error);
    throw error;
  }
}

/**
 * Find all duplicate Instagram accounts across workspaces
 */
export async function findDuplicateInstagramAccounts(): Promise<Array<{
  instagramAccountId: string;
  instagramUsername: string;
  users: Array<{
    userId: string;
    username: string;
    email: string;
    workspaceId: string;
  }>;
}>> {
  try {
    const storage = new MongoStorage();
    await storage.connect();
    
    const users = await storage.getAllUsers();
    const instagramUsers = users.filter(u => u.instagramAccountId);
    
    // Group by Instagram account ID
    const accountGroups: { [key: string]: any[] } = {};
    instagramUsers.forEach(user => {
      const accountId = user.instagramAccountId;
      if (!accountGroups[accountId]) {
        accountGroups[accountId] = [];
      }
      accountGroups[accountId].push(user);
    });
    
    // Find duplicates
    const duplicates = Object.entries(accountGroups)
      .filter(([_, users]) => users.length > 1)
      .map(([accountId, users]) => ({
        instagramAccountId: accountId,
        instagramUsername: users[0].instagramUsername,
        users: users.map(u => ({
          userId: u.userId,
          username: u.username,
          email: u.email,
          workspaceId: u.workspaceId
        }))
      }));
    
    return duplicates;
  } catch (error) {
    console.error('🚨 Error finding duplicates:', error);
    throw error;
  }
}

/**
 * Remove Instagram connection from a specific user while keeping it for others
 */
export async function removeInstagramConnectionFromUser(userId: string): Promise<boolean> {
  try {
    const storage = new MongoStorage();
    await storage.connect();
    
    const user = await storage.getUserById(userId);
    if (!user) {
      console.warn(`⚠️ User ${userId} not found`);
      return false;
    }
    
    console.log(`🔓 Removing Instagram connection from user: ${user.username}`);
    
    // Update user to remove Instagram connection
    const updatedUser = {
      ...user,
      instagramToken: null,
      instagramRefreshToken: null,
      instagramTokenExpiry: null,
      instagramAccountId: null,
      instagramUsername: null,
      tokenStatus: 'active'
    };
    
    await storage.updateUser(userId, updatedUser);
    console.log(`✅ Instagram connection removed from user: ${user.username}`);
    
    return true;
  } catch (error) {
    console.error('🚨 Error removing Instagram connection:', error);
    throw error;
  }
}

/**
 * Clean up duplicate Instagram accounts by keeping only the most recent connection
 */
export async function cleanupDuplicateInstagramAccounts(currentUserWorkspaceId?: string): Promise<void> {
  try {
    console.log('🧹 Starting cleanup of duplicate Instagram accounts...');
    
    const duplicates = await findDuplicateInstagramAccounts();
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicate Instagram accounts found!');
      return;
    }
    
    console.log(`🚨 Found ${duplicates.length} duplicate Instagram accounts to clean up`);
    
    for (const duplicate of duplicates) {
      console.log(`\n📱 Cleaning up Instagram account: ${duplicate.instagramAccountId} (@${duplicate.instagramUsername})`);
      
      // Sort users - prioritize current workspace, then by creation date
      const sortedUsers = duplicate.users.sort((a, b) => {
        // If currentUserWorkspaceId is provided, prioritize that workspace
        if (currentUserWorkspaceId) {
          if (a.workspaceId === currentUserWorkspaceId && b.workspaceId !== currentUserWorkspaceId) return -1;
          if (b.workspaceId === currentUserWorkspaceId && a.workspaceId !== currentUserWorkspaceId) return 1;
        }
        // Otherwise, keep the first one (assume it's the original)
        return 0;
      });
      
      const keepUser = sortedUsers[0];
      const removeUsers = sortedUsers.slice(1);
      
      console.log(`✅ Keeping connection for: ${keepUser.username} (${keepUser.email}) in workspace ${keepUser.workspaceId}`);
      
      // Remove connection from other users
      for (const removeUser of removeUsers) {
        console.log(`🔓 Removing connection from: ${removeUser.username} (${removeUser.email})`);
        await removeInstagramConnectionFromUser(removeUser.userId);
      }
    }
    
    console.log('✅ Duplicate cleanup completed!');
  } catch (error) {
    console.error('🚨 Error during cleanup:', error);
    throw error;
  }
}

/**
 * Validate Instagram connection attempt and return appropriate error message
 * SECURE: If account has an active token, it MUST be explicitly disconnected first
 */
export function validateInstagramConnection(
  existingConnection: any, 
  targetWorkspaceId?: string
): {
  isValid: boolean;
  errorMessage?: string;
  errorCode?: string;
} {
  if (!existingConnection.exists) {
    console.log(`✅ No existing connection found - allowing new connection`);
    return { isValid: true };
  }
  
  const existingUser = existingConnection.user;
  const username = existingUser.username || existingUser.instagramUsername || 'Unknown';
  const existingWorkspaceId = String(existingConnection.workspaceId);
  const targetWorkspace = targetWorkspaceId ? String(targetWorkspaceId) : 'unknown';
  
  console.log(`[VALIDATION] 🔍 Checking Instagram account @${username}:`, {
    existingWorkspaceId,
    targetWorkspace,
    isSameWorkspace: existingWorkspaceId === targetWorkspace,
    hasValidToken: existingConnection.hasValidToken,
    hasEncryptedToken: existingUser.encryptedAccessToken ? true : false
  });
  
  // CRITICAL SECURITY CHECK: If account has an encrypted token (active connection),
  // it MUST be explicitly disconnected first - no exceptions!
  if (existingUser.encryptedAccessToken) {
    console.log(`🚨 [VALIDATION] BLOCKING: Account @${username} has active encrypted token`);
    
    const errorMessage = existingWorkspaceId === targetWorkspace
      ? `This Instagram account is already connected to your current workspace. To reconnect, please disconnect it first from the Social Accounts page, then try connecting again.`
      : `This Instagram account is already connected to another workspace. Each Instagram account can only be linked to one workspace at a time.\n\nTo use this account here, please:\n1. Go to the other workspace\n2. Disconnect the Instagram account\n3. Return here and connect again\n\nAlternatively, you can connect a different Instagram account to this workspace.`;
    
    return {
      isValid: false,
      errorMessage,
      errorCode: 'INSTAGRAM_ALREADY_CONNECTED'
    };
  }
  
  // If no encrypted token, check for legacy token or valid token status
  if (existingConnection.hasValidToken === true) {
    console.log(`🚨 [VALIDATION] BLOCKING: Account @${username} has valid token but no encrypted token (legacy?)`);
    
    const errorMessage = existingWorkspaceId === targetWorkspace
      ? `This Instagram account is already connected to your current workspace. Please disconnect it first from the Social Accounts page, then try connecting again.`
      : `This Instagram account is already connected to another workspace. Please disconnect it from the other workspace first, then try connecting again here.`;
    
    return {
      isValid: false,
      errorMessage,
      errorCode: 'INSTAGRAM_ALREADY_CONNECTED'
    };
  }
  
  // Only allow reconnection if there's NO active token at all
  console.log(`✅ [VALIDATION] ALLOWING: Account @${username} has no active token - safe to reconnect`);
  return { isValid: true };
}