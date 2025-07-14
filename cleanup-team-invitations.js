import { MongoStorage } from './server/mongodb-storage.js';

async function cleanupTeamInvitations() {
  const storage = new MongoStorage();
  
  try {
    await storage.connect();
    console.log('Connected to MongoDB successfully');
    
    // Clean up duplicate invitations for workspace 684402c2fd2cd4eb6521b386
    const workspaceId = '684402c2fd2cd4eb6521b386';
    const userId = '6844027426cae0200f88b5db';
    
    console.log(`\n=== DEBUGGING TEAM INVITATION ISSUE ===`);
    
    // 1. Check user's addons
    console.log(`Checking addons for user: ${userId}`);
    const userAddons = await storage.getUserAddons(parseInt(userId.substring(0, 10), 16));
    console.log(`Found ${userAddons.length} addons:`);
    userAddons.forEach(addon => {
      console.log(`- ${addon.type}: ${addon.name} (Active: ${addon.isActive})`);
    });
    
    // 2. Check pending invitations
    console.log(`\nChecking invitations for workspace: ${workspaceId}`);
    const invitations = await storage.getWorkspaceInvitations(parseInt(workspaceId.substring(0, 6)));
    console.log(`Found ${invitations.length} pending invitations:`);
    invitations.forEach(inv => {
      console.log(`- ${inv.email} (Status: ${inv.status})`);
    });
    
    // 3. Check workspace members
    console.log(`\nChecking members for workspace: ${workspaceId}`);
    const members = await storage.getWorkspaceMembers(parseInt(workspaceId.substring(0, 6)));
    console.log(`Found ${members.length} members:`);
    members.forEach(member => {
      console.log(`- ${member.user ? member.user.username : 'Unknown'} (Role: ${member.role})`);
    });
    
    console.log('\n=== CLEANUP COMPLETE ===');
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
  
  process.exit(0);
}

cleanupTeamInvitations().catch(console.error);