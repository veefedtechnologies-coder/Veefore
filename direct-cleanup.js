// Direct MongoDB cleanup using mongoose
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Define schemas matching the application
const AddonSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.Mixed,
  name: String,
  type: String,
  price: Number,
  isActive: { type: Boolean, default: true },
  expiresAt: Date,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TeamInvitationSchema = new mongoose.Schema({
  workspaceId: mongoose.Schema.Types.Mixed,
  email: String,
  role: { type: String, default: 'member' },
  permissions: mongoose.Schema.Types.Mixed,
  token: String,
  expiresAt: Date,
  status: { type: String, default: 'pending' },
  invitedBy: Number,
  acceptedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const AddonModel = mongoose.model('Addon', AddonSchema);
const TeamInvitationModel = mongoose.model('TeamInvitation', TeamInvitationSchema);

async function directCleanup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    const userId = '6844027426cae0200f88b5db';
    const numericUserId = 6844027426;
    
    console.log('=== BEFORE CLEANUP ===');
    
    // Count current addons
    const addonCount = await AddonModel.countDocuments({
      $or: [
        { userId: userId },
        { userId: numericUserId },
        { userId: userId.toString() }
      ]
    });
    
    // Count current invitations
    const invitationCount = await TeamInvitationModel.countDocuments({
      $or: [
        { workspaceId: 684402 },
        { workspaceId: '684402c2fd2cd4eb6521b386' },
        { workspaceId: 'My VeeFore Workspace' }
      ]
    });
    
    console.log(`Found ${addonCount} addons and ${invitationCount} invitations`);
    
    console.log('=== PERFORMING CLEANUP ===');
    
    // Delete all addons
    const addonResult = await AddonModel.deleteMany({
      $or: [
        { userId: userId },
        { userId: numericUserId },
        { userId: userId.toString() }
      ]
    });
    
    console.log(`✓ Deleted ${addonResult.deletedCount} addons`);
    
    // Delete all invitations
    const invitationResult = await TeamInvitationModel.deleteMany({
      $or: [
        { workspaceId: 684402 },
        { workspaceId: '684402c2fd2cd4eb6521b386' },
        { workspaceId: 'My VeeFore Workspace' }
      ]
    });
    
    console.log(`✓ Deleted ${invitationResult.deletedCount} invitations`);
    
    console.log('=== VERIFICATION ===');
    
    // Verify cleanup
    const remainingAddons = await AddonModel.countDocuments({
      $or: [
        { userId: userId },
        { userId: numericUserId },
        { userId: userId.toString() }
      ]
    });
    
    const remainingInvitations = await TeamInvitationModel.countDocuments({
      $or: [
        { workspaceId: 684402 },
        { workspaceId: '684402c2fd2cd4eb6521b386' },
        { workspaceId: 'My VeeFore Workspace' }
      ]
    });
    
    console.log(`Remaining addons: ${remainingAddons}`);
    console.log(`Remaining invitations: ${remainingInvitations}`);
    
    if (remainingAddons === 0 && remainingInvitations === 0) {
      console.log('\n🎉 CLEANUP SUCCESSFUL');
      console.log('Team invitations should now be blocked');
    } else {
      console.log('\n⚠️ Cleanup incomplete');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

directCleanup();