import { db } from './db';
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';
import { 
  users, workspaces, socialAccounts, content, analytics, 
  automationRules, suggestions, creditTransactions, referrals,
  subscriptions, payments, addons,
  type User, type Workspace, type SocialAccount, type Content,
  type Analytics, type AutomationRule, type Suggestion,
  type CreditTransaction, type Referral, type Subscription, 
  type Payment, type Addon,
  type InsertUser, type InsertWorkspace, type InsertSocialAccount,
  type InsertContent, type InsertAutomationRule, type InsertAnalytics,
  type InsertSuggestion, type InsertCreditTransaction, type InsertReferral,
  type InsertSubscription, type InsertPayment, type InsertAddon
} from "@shared/schema";
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.referralCode, referralCode));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number | string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, typeof id === 'string' ? parseInt(id) : id))
      .returning();
    return user;
  }

  async updateUserCredits(id: number, credits: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ credits, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId, 
        stripeSubscriptionId,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Workspace operations
  async getWorkspace(id: number): Promise<Workspace | undefined> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, id));
    return workspace || undefined;
  }

  async getWorkspacesByUserId(userId: number | string): Promise<Workspace[]> {
    return await db.select().from(workspaces).where(eq(workspaces.userId, typeof userId === 'string' ? parseInt(userId) : userId));
  }

  async getDefaultWorkspace(userId: number): Promise<Workspace | undefined> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.userId, userId)).limit(1);
    return workspace || undefined;
  }

  async createWorkspace(insertWorkspace: InsertWorkspace): Promise<Workspace> {
    const [workspace] = await db.insert(workspaces).values(insertWorkspace).returning();
    return workspace;
  }

  async updateWorkspace(id: number, updates: Partial<Workspace>): Promise<Workspace> {
    const [workspace] = await db
      .update(workspaces)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(workspaces.id, id))
      .returning();
    return workspace;
  }

  async deleteWorkspace(id: number): Promise<void> {
    await db.delete(workspaces).where(eq(workspaces.id, id));
  }

  // Social account operations
  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    const [account] = await db.select().from(socialAccounts).where(eq(socialAccounts.id, id));
    return account || undefined;
  }

  async getSocialAccountsByWorkspace(workspaceId: number): Promise<SocialAccount[]> {
    return await db.select().from(socialAccounts).where(eq(socialAccounts.workspaceId, workspaceId));
  }

  async getSocialAccountByPlatform(workspaceId: number | string, platform: string): Promise<SocialAccount | undefined> {
    const [account] = await db
      .select()
      .from(socialAccounts)
      .where(and(
        eq(socialAccounts.workspaceId, typeof workspaceId === 'string' ? parseInt(workspaceId) : workspaceId),
        eq(socialAccounts.platform, platform)
      ));
    return account || undefined;
  }

  async createSocialAccount(insertAccount: InsertSocialAccount): Promise<SocialAccount> {
    const [account] = await db.insert(socialAccounts).values(insertAccount).returning();
    return account;
  }

  async updateSocialAccount(id: number | string, updates: Partial<SocialAccount>): Promise<SocialAccount> {
    const [account] = await db
      .update(socialAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(socialAccounts.id, typeof id === 'string' ? parseInt(id) : id))
      .returning();
    return account;
  }

  async deleteSocialAccount(id: number): Promise<void> {
    await db.delete(socialAccounts).where(eq(socialAccounts.id, id));
  }

  // Content operations
  async getContent(id: number): Promise<Content | undefined> {
    const [contentItem] = await db.select().from(content).where(eq(content.id, id));
    return contentItem || undefined;
  }

  async getContentByWorkspace(workspaceId: number | string, limit = 50): Promise<Content[]> {
    return await db
      .select()
      .from(content)
      .where(eq(content.workspaceId, typeof workspaceId === 'string' ? parseInt(workspaceId) : workspaceId))
      .orderBy(desc(content.createdAt))
      .limit(limit);
  }

  async getScheduledContent(workspaceId?: number | string): Promise<Content[]> {
    const query = db.select().from(content).where(eq(content.status, 'scheduled'));
    
    if (workspaceId) {
      return await query.where(eq(content.workspaceId, typeof workspaceId === 'string' ? parseInt(workspaceId) : workspaceId));
    }
    
    return await query;
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const [contentItem] = await db.insert(content).values(insertContent).returning();
    return contentItem;
  }

  async updateContent(id: number, updates: Partial<Content>): Promise<Content> {
    const [contentItem] = await db
      .update(content)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(content.id, id))
      .returning();
    return contentItem;
  }

  async deleteContent(id: number): Promise<void> {
    await db.delete(content).where(eq(content.id, id));
  }

  // Analytics operations
  async getAnalytics(workspaceId: number, platform?: string, days = 30): Promise<Analytics[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    let query = db
      .select()
      .from(analytics)
      .where(and(
        eq(analytics.workspaceId, workspaceId),
        gte(analytics.date, cutoffDate)
      ))
      .orderBy(desc(analytics.date));

    if (platform) {
      query = query.where(eq(analytics.platform, platform));
    }

    return await query;
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const [analyticsItem] = await db.insert(analytics).values(insertAnalytics).returning();
    return analyticsItem;
  }

  async getLatestAnalytics(workspaceId: number, platform: string): Promise<Analytics | undefined> {
    const [analyticsItem] = await db
      .select()
      .from(analytics)
      .where(and(
        eq(analytics.workspaceId, workspaceId),
        eq(analytics.platform, platform)
      ))
      .orderBy(desc(analytics.date))
      .limit(1);
    return analyticsItem || undefined;
  }

  // Automation rules
  async getAutomationRules(workspaceId: number): Promise<AutomationRule[]> {
    return await db.select().from(automationRules).where(eq(automationRules.workspaceId, workspaceId));
  }

  async getActiveAutomationRules(): Promise<AutomationRule[]> {
    return await db.select().from(automationRules).where(eq(automationRules.isActive, true));
  }

  async createAutomationRule(insertRule: InsertAutomationRule): Promise<AutomationRule> {
    const [rule] = await db.insert(automationRules).values(insertRule).returning();
    return rule;
  }

  async updateAutomationRule(id: number, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    const [rule] = await db
      .update(automationRules)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(automationRules.id, id))
      .returning();
    return rule;
  }

  async deleteAutomationRule(id: number): Promise<void> {
    await db.delete(automationRules).where(eq(automationRules.id, id));
  }

  // Suggestions
  async getSuggestions(workspaceId: number, type?: string): Promise<Suggestion[]> {
    let query = db.select().from(suggestions).where(eq(suggestions.workspaceId, workspaceId));
    
    if (type) {
      query = query.where(eq(suggestions.type, type));
    }

    return await query.orderBy(desc(suggestions.createdAt));
  }

  async getValidSuggestions(workspaceId: number): Promise<Suggestion[]> {
    return await db
      .select()
      .from(suggestions)
      .where(and(
        eq(suggestions.workspaceId, workspaceId),
        eq(suggestions.isUsed, false)
      ))
      .orderBy(desc(suggestions.createdAt));
  }

  async createSuggestion(insertSuggestion: InsertSuggestion): Promise<Suggestion> {
    const [suggestion] = await db.insert(suggestions).values(insertSuggestion).returning();
    return suggestion;
  }

  async markSuggestionUsed(id: number): Promise<Suggestion> {
    const [suggestion] = await db
      .update(suggestions)
      .set({ isUsed: true, updatedAt: new Date() })
      .where(eq(suggestions.id, id))
      .returning();
    return suggestion;
  }

  // Credit transactions
  async getCreditTransactions(userId: number, limit = 50): Promise<CreditTransaction[]> {
    return await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(limit);
  }

  async createCreditTransaction(insertTransaction: InsertCreditTransaction): Promise<CreditTransaction> {
    const [transaction] = await db.insert(creditTransactions).values(insertTransaction).returning();
    return transaction;
  }

  // Referrals
  async getReferrals(referrerId: number): Promise<Referral[]> {
    return await db.select().from(referrals).where(eq(referrals.referrerId, referrerId));
  }

  async getReferralStats(userId: number): Promise<{ totalReferrals: number; activePaid: number; totalEarned: number }> {
    const userReferrals = await this.getReferrals(userId);
    const totalReferrals = userReferrals.length;
    
    // Get referred users to check their plan status
    const referredUserIds = userReferrals.map(r => r.referredId);
    const referredUsers = referredUserIds.length > 0 
      ? await db.select().from(users).where(sql`${users.id} = ANY(${referredUserIds})`)
      : [];
    
    const activePaid = referredUsers.filter(user => user.plan !== "free").length;
    const totalEarned = userReferrals.reduce((sum, referral) => sum + (referral.rewardAmount || 0), 0);
    
    return { totalReferrals, activePaid, totalEarned };
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const [referral] = await db.insert(referrals).values(insertReferral).returning();
    return referral;
  }

  async confirmReferral(id: number): Promise<Referral> {
    const [referral] = await db
      .update(referrals)
      .set({ status: "confirmed", confirmedAt: new Date() })
      .where(eq(referrals.id, id))
      .returning();
    return referral;
  }

  async getLeaderboard(limit = 10): Promise<Array<User & { referralCount: number }>> {
    const referralCounts = await db
      .select({
        referrerId: referrals.referrerId,
        count: sql<number>`count(*)`.as('count')
      })
      .from(referrals)
      .groupBy(referrals.referrerId);

    const topReferrerIds = referralCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(r => r.referrerId);

    if (topReferrerIds.length === 0) return [];

    const topUsers = await db.select().from(users).where(sql`${users.id} = ANY(${topReferrerIds})`);
    
    return topUsers.map(user => ({
      ...user,
      referralCount: referralCounts.find(r => r.referrerId === user.id)?.count || 0
    })).sort((a, b) => b.referralCount - a.referralCount);
  }

  // Subscription operations
  async getSubscription(userId: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return subscription || undefined;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db.insert(subscriptions).values(insertSubscription).returning();
    return subscription;
  }

  async updateSubscriptionStatus(userId: number, status: string, canceledAt?: Date): Promise<Subscription> {
    const [subscription] = await db
      .update(subscriptions)
      .set({ 
        status, 
        canceledAt: canceledAt || null, 
        updatedAt: new Date() 
      })
      .where(eq(subscriptions.userId, userId))
      .returning();
    return subscription;
  }

  // Payment operations
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }

  // Addon operations
  async getUserAddons(userId: number): Promise<Addon[]> {
    return await db
      .select()
      .from(addons)
      .where(and(
        eq(addons.userId, userId),
        eq(addons.isActive, true)
      ));
  }

  async createAddon(insertAddon: InsertAddon): Promise<Addon> {
    const [addon] = await db.insert(addons).values(insertAddon).returning();
    return addon;
  }
}