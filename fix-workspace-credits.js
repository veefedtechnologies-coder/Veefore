import mongoose from 'mongoose';

// Define the workspace schema
const workspaceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: null },
  avatar: { type: String, default: null },
  credits: { type: Number, default: 0 },
  theme: { type: String, default: 'default' },
  aiPersonality: { type: String, default: 'professional' },
  isDefault: { type: Boolean, default: false },
  maxTeamMembers: { type: Number, default: 1 },
  inviteCode: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const WorkspaceModel = mongoose.model('Workspace', workspaceSchema);

async function fixWorkspaceCredits() {
  try {
    // Use the same connection string format as the app
    const dbUrl = 'mongodb+srv://veefore:veefore123@cluster0.k8g2i.mongodb.net/veefore?retryWrites=true&w=majority';
    await mongoose.connect(dbUrl);
    console.log('Connected to MongoDB');
    
    // Find the specific workspace
    const workspace = await WorkspaceModel.findById('68449f3852d33d75b31ce737');
    console.log('Current workspace:', workspace ? {
      id: workspace._id,
      name: workspace.name,
      credits: workspace.credits
    } : 'Not found');
    
    if (workspace) {
      // Update credits to 2
      const result = await WorkspaceModel.findByIdAndUpdate(
        '68449f3852d33d75b31ce737',
        { credits: 2, updatedAt: new Date() },
        { new: true }
      );
      console.log('Updated workspace credits:', result.credits);
    }
    
    await mongoose.disconnect();
    console.log('Credits fixed successfully');
  } catch (error) {
    console.error('Error fixing credits:', error);
  }
}

fixWorkspaceCredits();