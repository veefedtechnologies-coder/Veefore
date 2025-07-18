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
  
  // Direct fields from frontend
  keywords: string[];
  targetMediaIds?: string[];
  
  // Response configuration as nested object
  responses: {
    responses: string[];        // Comment responses
    dmResponses?: string[];     // DM responses
  };
  
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
      isActive: frontendRule.isActive ?? true,
      
      // Extract keywords directly from frontend (new format)
      keywords: frontendRule.keywords || [],
      
      // Extract target posts if provided
      targetMediaIds: frontendRule.targetMediaIds || [],
      
      // Configure responses from nested responses object
      action: {
        responses: frontendRule.responses?.responses || [],
        dmResponses: frontendRule.responses?.dmResponses || []
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
    
    try {
      const dbRules = await this.loadFromDatabase(workspaceId);
      
      // Convert database format to frontend format with error handling
      const frontendRules: FrontendAutomationRule[] = dbRules.map(rule => {
        // Support both old and new database formats
        const commentResponses = rule.action?.responses || rule.commentReplies || [];
        const dmResponses = rule.action?.dmResponses || rule.dmResponses || [];
        
        console.log(`[NEW AUTOMATION] Converting rule: ${rule.name} - commentResponses: ${commentResponses.length}, dmResponses: ${dmResponses.length}`);
        
        return {
          id: rule._id?.toString(),
          name: rule.name,
          workspaceId: rule.workspaceId,
          type: rule.type,
          isActive: rule.isActive,
          
          // Direct field mapping to match new frontend structure
          keywords: rule.keywords || [],
          targetMediaIds: rule.targetMediaIds || [],
          
          // Map responses in nested structure - support both formats
          responses: {
            responses: commentResponses,
            dmResponses: dmResponses
          },
          
          createdAt: rule.createdAt,
          updatedAt: rule.updatedAt
        };
      });
      
      console.log('[NEW AUTOMATION] Converted to frontend format:', frontendRules.length, 'rules');
      return frontendRules;
    } catch (error) {
      console.error('[NEW AUTOMATION] Get rules error:', error);
      throw new Error('Failed to fetch automation rules');
    }
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
    
    if (updates.keywords) {
      dbUpdates.keywords = updates.keywords;
    }
    
    if (updates.targetMediaIds) {
      dbUpdates.targetMediaIds = updates.targetMediaIds;
    }
    
    if (updates.responses) {
      dbUpdates.action = {
        responses: updates.responses.responses || [],
        dmResponses: updates.responses.dmResponses || []
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
    const { MongoClient, ObjectId } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI!);
    
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
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI!);
    
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
    const { MongoClient, ObjectId } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI!);
    
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
    const { MongoClient, ObjectId } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI!);
    
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