import mongoose from 'mongoose';

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define schemas
const TeamInvitationSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  email: { type: String, required: true },
  workspaceId: { type: String, required: true },
  status: { type: String, default: 'pending' },
  role: { type: String, default: 'member' },
  invitedBy: { type: Number, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date, default: null }
});

const AddonSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  userId: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, default: null },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TeamInvitationModel = mongoose.model('TeamInvitation', TeamInvitationSchema, 'teaminvitations');
const AddonModel = mongoose.model('Addon', AddonSchema, 'addons');

async function fixTeamInvitations() {
  await connectDB();
  
  console.log('=== TEAM INVITATION CLEANUP ===');
  
  // 1. Find and remove duplicate invitations
  const allInvitations = await TeamInvitationModel.find({}).sort({ createdAt: 1 });
  console.log(`Found ${allInvitations.length} total invitations`);
  
  const uniqueInvitations = new Map();
  const duplicates = [];
  
  for (const invitation of allInvitations) {
    const key = `${invitation.workspaceId}-${invitation.email}`;
    if (uniqueInvitations.has(key)) {
      duplicates.push(invitation._id);
      console.log(`Duplicate found: ${invitation.email} in workspace ${invitation.workspaceId}`);
    } else {
      uniqueInvitations.set(key, invitation);
    }
  }
  
  if (duplicates.length > 0) {
    console.log(`Removing ${duplicates.length} duplicate invitations...`);
    await TeamInvitationModel.deleteMany({ _id: { $in: duplicates } });
    console.log('Duplicates removed successfully');
  }
  
  // 2. Check addon records for user
  const userId = '6844027426cae0200f88b5db';
  console.log(`\n=== CHECKING ADDONS FOR USER ${userId} ===`);
  
  const userAddons = await AddonModel.find({ 
    $or: [
      { userId: userId },
      { userId: parseInt(userId.substring(0, 10), 16) } // Try numeric conversion
    ]
  });
  
  console.log(`Found ${userAddons.length} addons for user:`);
  userAddons.forEach(addon => {
    console.log(`- ${addon.type}: ${addon.name} (Active: ${addon.isActive})`);
  });
  
  // 3. Show remaining invitations per workspace
  console.log('\n=== REMAINING INVITATIONS BY WORKSPACE ===');
  const workspaces = await TeamInvitationModel.distinct('workspaceId');
  
  for (const workspaceId of workspaces) {
    const invitations = await TeamInvitationModel.find({ 
      workspaceId, 
      status: 'pending' 
    });
    console.log(`Workspace ${workspaceId}: ${invitations.length} pending invitations`);
    invitations.forEach(inv => {
      console.log(`  - ${inv.email} (${inv.status})`);
    });
  }
  
  console.log('\n=== CLEANUP COMPLETE ===');
  process.exit(0);
}

fixTeamInvitations().catch(console.error);