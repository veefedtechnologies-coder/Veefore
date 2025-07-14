import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const WorkspaceSchema = new mongoose.Schema({
  name: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDefault: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const UserSchema = new mongoose.Schema({
  email: String,
  username: String,
  firebaseUid: String
});

const SocialAccountSchema = new mongoose.Schema({
  workspaceId: String,
  platform: String,
  username: String
});

const ContentSchema = new mongoose.Schema({
  workspaceId: String,
  type: String,
  title: String
});

const AutomationRuleSchema = new mongoose.Schema({
  workspaceId: mongoose.Schema.Types.Mixed,
  name: String,
  type: String
});

const WorkspaceModel = mongoose.model('Workspace', WorkspaceSchema);
const UserModel = mongoose.model('User', UserSchema);
const SocialAccountModel = mongoose.model('SocialAccount', SocialAccountSchema);
const ContentModel = mongoose.model('Content', ContentSchema);
const AutomationRuleModel = mongoose.model('AutomationRule', AutomationRuleSchema);

async function cleanupDuplicateWorkspaces() {
  try {
    console.log('🔧 Starting workspace cleanup...');
    
    const dbUrl = process.env.DATABASE_URL || 'mongodb+srv://veeforedb:veeforedb@cluster0.fhcru.mongodb.net/veeforedb?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(dbUrl);
    console.log('✅ Connected to MongoDB');
    
    // Find all users
    const users = await UserModel.find({}).lean();
    console.log(`📊 Found ${users.length} users`);
    
    let totalCleaned = 0;
    
    for (const user of users) {
      const workspaces = await WorkspaceModel.find({ userId: user._id }).sort({ createdAt: 1 }).lean();
      
      if (workspaces.length > 1) {
        console.log(`\n👤 User ${user.email} has ${workspaces.length} workspaces`);
        
        // Keep the first (oldest) workspace
        const keepWorkspace = workspaces[0];
        const duplicateWorkspaces = workspaces.slice(1);
        
        console.log(`   ✅ Keeping workspace: ${keepWorkspace.name} (${keepWorkspace._id})`);
        
        for (const duplicateWorkspace of duplicateWorkspaces) {
          console.log(`   🔄 Processing duplicate: ${duplicateWorkspace.name} (${duplicateWorkspace._id})`);
          
          // Migrate social accounts
          const socialAccounts = await SocialAccountModel.find({ workspaceId: duplicateWorkspace._id.toString() });
          for (const account of socialAccounts) {
            await SocialAccountModel.updateOne(
              { _id: account._id },
              { workspaceId: keepWorkspace._id.toString() }
            );
          }
          console.log(`      📱 Migrated ${socialAccounts.length} social accounts`);
          
          // Migrate content
          const content = await ContentModel.find({ workspaceId: duplicateWorkspace._id.toString() });
          for (const item of content) {
            await ContentModel.updateOne(
              { _id: item._id },
              { workspaceId: keepWorkspace._id.toString() }
            );
          }
          console.log(`      📝 Migrated ${content.length} content items`);
          
          // Migrate automation rules
          const rules = await AutomationRuleModel.find({ 
            $or: [
              { workspaceId: duplicateWorkspace._id.toString() },
              { workspaceId: duplicateWorkspace._id }
            ]
          });
          for (const rule of rules) {
            await AutomationRuleModel.updateOne(
              { _id: rule._id },
              { workspaceId: keepWorkspace._id.toString() }
            );
          }
          console.log(`      🤖 Migrated ${rules.length} automation rules`);
          
          // Delete the duplicate workspace
          await WorkspaceModel.deleteOne({ _id: duplicateWorkspace._id });
          console.log(`      🗑️ Deleted duplicate workspace`);
          
          totalCleaned++;
        }
        
        // Ensure the kept workspace is marked as default
        await WorkspaceModel.updateOne(
          { _id: keepWorkspace._id },
          { isDefault: true }
        );
      }
    }
    
    console.log(`\n🎉 Cleanup completed! Removed ${totalCleaned} duplicate workspaces`);
    
    // Final verification
    console.log('\n📋 FINAL VERIFICATION:');
    for (const user of users) {
      const finalWorkspaces = await WorkspaceModel.find({ userId: user._id }).lean();
      if (finalWorkspaces.length > 1) {
        console.log(`⚠️  ${user.email}: Still has ${finalWorkspaces.length} workspaces`);
      } else {
        console.log(`✅ ${user.email}: ${finalWorkspaces.length} workspace`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📋 Database connection closed');
  }
}

cleanupDuplicateWorkspaces();