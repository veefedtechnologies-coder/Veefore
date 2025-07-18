/**
 * NEW AUTOMATION SYSTEM - REBUILT TO MATCH FRONTEND CONFIGURATION
 * Built specifically for Comment → DM automation with pre-defined responses
 * Matches exact frontend structure and data format
 */

import { IStorage } from './storage';

export interface FrontendAutomationRule {
  id?: string;
  name: string;
  workspaceId: string;
  type: 'comment_dm' | 'dm_only' | 'comment_only';
  isActive: boolean;
  
  // Frontend structure - exactly matching your interface
  triggers: {
    aiMode: 'contextual' | 'keyword';
    keywords: string[];
    hashtags: string[];
    mentions: boolean;
    newFollowers: boolean;
    postInteraction: boolean;
  };
  
  // Pre-defined responses (NO AI automation)
  responses: string[];
  
  // Additional frontend fields
  aiPersonality?: string;
  responseLength?: string;
  conditions?: any;
  schedule?: any;
  aiConfig?: any;
  duration?: any;
  activeTime?: {
    start: string;
    end: string;
    days: string[];
  };
  
  // Post-specific targeting
  targetPosts?: string[];
  
  // DM-specific responses
  dmResponses?: string[];
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DatabaseAutomationRule {
  _id?: string;
  name: string;
  workspaceId: string;
  type: 'comment_dm' | 'dm_only' | 'comment_only';
  isActive: boolean;
  
  // Direct fields for webhook processing
  keywords: string[];
  targetMediaIds?: string[];
  
  // Response configuration
  action: {
    responses: string[];        // Comment responses
    dmResponses?: string[];     // DM responses
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export class NewAutomationSystem {
  constructor(private storage: IStorage) {}

  /**
   * Create automation rule - converts frontend format to database format
   */
  async createRule(frontendRule: FrontendAutomationRule): Promise<DatabaseAutomationRule> {
    console.log('[NEW AUTOMATION] Creating rule with frontend data:', frontendRule);
    
    // Convert frontend format to database format
    const dbRule: DatabaseAutomationRule = {
      name: frontendRule.name,
      workspaceId: frontendRule.workspaceId,
      type: frontendRule.type,
      isActive: frontendRule.isActive,
      
      // Extract keywords from frontend triggers
      keywords: frontendRule.triggers.keywords || [],
      
      // Extract target posts if provided
      targetMediaIds: frontendRule.targetPosts || [],
      
      // Configure responses
      action: {
        responses: frontendRule.responses || [],
        dmResponses: frontendRule.dmResponses || []
      },
      
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('[NEW AUTOMATION] Converted to database format:', dbRule);
    
    // Save to database using direct MongoDB operation
    const result = await this.saveToDatabase(dbRule);
    
    console.log('[NEW AUTOMATION] Rule saved successfully:', result._id);
    return result;
  }

  /**
   * Get automation rules - converts database format to frontend format
   */
  async getRules(workspaceId: string): Promise<FrontendAutomationRule[]> {
    console.log('[NEW AUTOMATION] Getting rules for workspace:', workspaceId);
    
    const dbRules = await this.loadFromDatabase(workspaceId);
    
    // Convert database format to frontend format
    const frontendRules: FrontendAutomationRule[] = dbRules.map(rule => ({
      id: rule._id?.toString(),
      name: rule.name,
      workspaceId: rule.workspaceId,
      type: rule.type,
      isActive: rule.isActive,
      
      // Reconstruct frontend triggers structure
      triggers: {
        aiMode: 'keyword' as const,
        keywords: rule.keywords || [],
        hashtags: [],
        mentions: false,
        newFollowers: false,
        postInteraction: rule.type === 'comment_dm' || rule.type === 'comment_only'
      },
      
      // Map responses
      responses: rule.action.responses || [],
      dmResponses: rule.action.dmResponses || [],
      targetPosts: rule.targetMediaIds || [],
      
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt
    }));
    
    console.log('[NEW AUTOMATION] Converted to frontend format:', frontendRules.length, 'rules');
    return frontendRules;
  }

  /**
   * Get rules for webhook processing - returns database format
   */
  async getRulesForWebhook(workspaceId: string): Promise<DatabaseAutomationRule[]> {
    console.log('[NEW AUTOMATION] Getting webhook rules for workspace:', workspaceId);
    return await this.loadFromDatabase(workspaceId);
  }

  /**
   * Update automation rule
   */
  async updateRule(ruleId: string, updates: Partial<FrontendAutomationRule>): Promise<DatabaseAutomationRule> {
    console.log('[NEW AUTOMATION] Updating rule:', ruleId, updates);
    
    // Convert frontend updates to database format
    const dbUpdates: Partial<DatabaseAutomationRule> = {
      updatedAt: new Date()
    };
    
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.type) dbUpdates.type = updates.type;
    if (updates.isActive !== undefined) dbUpdates.isActive = updates.isActive;
    
    if (updates.triggers?.keywords) {
      dbUpdates.keywords = updates.triggers.keywords;
    }
    
    if (updates.targetPosts) {
      dbUpdates.targetMediaIds = updates.targetPosts;
    }
    
    if (updates.responses || updates.dmResponses) {
      dbUpdates.action = {
        responses: updates.responses || [],
        dmResponses: updates.dmResponses || []
      };
    }
    
    const result = await this.updateInDatabase(ruleId, dbUpdates);
    console.log('[NEW AUTOMATION] Rule updated successfully');
    return result;
  }

  /**
   * Delete automation rule
   */
  async deleteRule(ruleId: string): Promise<void> {
    console.log('[NEW AUTOMATION] Deleting rule:', ruleId);
    await this.deleteFromDatabase(ruleId);
    console.log('[NEW AUTOMATION] Rule deleted successfully');
  }

  /**
   * Save to MongoDB database
   */
  private async saveToDatabase(rule: DatabaseAutomationRule): Promise<DatabaseAutomationRule> {
    const { MongoClient, ObjectId } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db('veeforedb');
      const collection = db.collection('automationrules');
      
      const result = await collection.insertOne(rule);
      
      return {
        ...rule,
        _id: result.insertedId.toString()
      };
    } finally {
      await client.close();
    }
  }

  /**
   * Load from MongoDB database
   */
  private async loadFromDatabase(workspaceId: string): Promise<DatabaseAutomationRule[]> {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db('veeforedb');
      const collection = db.collection('automationrules');
      
      const rules = await collection.find({
        workspaceId: workspaceId,
        isActive: true
      }).toArray();
      
      return rules.map(rule => ({
        ...rule,
        _id: rule._id.toString()
      }));
    } finally {
      await client.close();
    }
  }

  /**
   * Update in MongoDB database
   */
  private async updateInDatabase(ruleId: string, updates: Partial<DatabaseAutomationRule>): Promise<DatabaseAutomationRule> {
    const { MongoClient, ObjectId } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db('veeforedb');
      const collection = db.collection('automationrules');
      
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(ruleId) },
        { $set: updates },
        { returnDocument: 'after' }
      );
      
      return {
        ...result.value,
        _id: result.value._id.toString()
      };
    } finally {
      await client.close();
    }
  }

  /**
   * Delete from MongoDB database
   */
  private async deleteFromDatabase(ruleId: string): Promise<void> {
    const { MongoClient, ObjectId } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db('veeforedb');
      const collection = db.collection('automationrules');
      
      await collection.deleteOne({ _id: new ObjectId(ruleId) });
    } finally {
      await client.close();
    }
  }
}