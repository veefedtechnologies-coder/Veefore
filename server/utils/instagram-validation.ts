import { MongoStorage } from '../mongodb-storage';

/**
 * Utility functions for Instagram account validation and management
 */

/**
 * Check if an Instagram account is already connected to any workspace
 */
export async function checkInstagramAccountExists(instagramAccountId: string): Promise<{
  exists: boolean;
  user?: any;
  workspaceId?: string;
}> {
  try {
    const storage = new MongoStorage();
    await storage.connect();
    
    const users = await storage.getAllUsers();
    const existingUser = users.find(u => u.instagramAccountId === instagramAccountId);
    
    if (existingUser) {
      return {
        exists: true,
        user: existingUser,
        workspaceId: existingUser.workspaceId
      };
    }
    
    return { exists: false };
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
 */
export function validateInstagramConnection(existingConnection: any): {
  isValid: boolean;
  errorMessage?: string;
  errorCode?: string;
} {
  if (!existingConnection.exists) {
    return { isValid: true };
  }
  
  const existingUser = existingConnection.user;
  const errorMessage = `This Instagram account (@${existingUser.instagramUsername}) is already connected to another workspace. Each Instagram account can only be connected to one workspace at a time.`;
  
  return {
    isValid: false,
    errorMessage,
    errorCode: 'INSTAGRAM_ALREADY_CONNECTED'
  };
}