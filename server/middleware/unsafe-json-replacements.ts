/**
 * P1-4.2 SECURITY: Safe replacements for dangerous JSON.parse() calls
 * 
 * This file provides secure alternatives to raw JSON.parse() throughout the codebase
 */

import { z } from 'zod';
import { safeJsonParse } from './validation';

// Schema for Instagram state data validation
export const instagramStateSchema = z.object({
  workspaceId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid workspace ID'),
  source: z.enum(['integration', 'oauth', 'callback']).optional(),
  returnUrl: z.string().url().optional()
});

// Schema for OAuth callback state validation
export const oauthStateSchema = z.object({
  workspaceId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid workspace ID'),
  service: z.enum(['instagram', 'facebook', 'youtube', 'twitter', 'linkedin']),
  returnUrl: z.string().url().optional(),
  timestamp: z.number().optional()
});

// Schema for JWT payload validation
export const jwtPayloadSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email().optional(),
  exp: z.number(),
  iat: z.number(),
  aud: z.string().optional(),
  iss: z.string().optional()
});

// Schema for AI response validation
export const aiResponseSchema = z.object({
  content: z.string().max(10000),
  type: z.enum(['text', 'json', 'markdown']).optional(),
  tokens: z.number().min(0).optional(),
  model: z.string().optional(),
  timestamp: z.number().optional()
});

// Schema for automation data validation
export const automationDataSchema = z.object({
  rules: z.array(z.object({
    id: z.string(),
    type: z.enum(['comment_reply', 'dm_reply', 'follow', 'like']),
    keywords: z.array(z.string().max(100)).max(50),
    response: z.string().max(2000).optional(),
    enabled: z.boolean().default(true)
  })).max(100),
  settings: z.object({
    maxActionsPerHour: z.number().min(1).max(100).default(10),
    delayBetweenActions: z.number().min(5).max(3600).default(30)
  }).optional()
});

// Schema for analytics request validation
export const analyticsRequestSchema = z.object({
  accounts: z.array(z.string()).max(10),
  metrics: z.array(z.enum(['followers', 'engagement', 'reach', 'impressions'])).max(10),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime()
  })
});

/**
 * P1-4.2: Safe replacements for specific JSON.parse patterns found in routes.ts
 */

// Replace: JSON.parse(Buffer.from(finalParts[1], 'base64').toString())
export function safeParseJWTPayload(base64Token: string) {
  try {
    const decoded = Buffer.from(base64Token, 'base64').toString();
    return safeJsonParse(decoded, jwtPayloadSchema);
  } catch (error) {
    return {
      success: false,
      error: `Invalid JWT token format: ${error instanceof Error ? error.message : 'Unknown error'}`
    } as const;
  }
}

// Replace: JSON.parse(decodedState) for Instagram OAuth
export function safeParseInstagramState(stateParam: string) {
  try {
    const decoded = Buffer.from(stateParam, 'base64').toString();
    return safeJsonParse(decoded, instagramStateSchema);
  } catch (error) {
    return {
      success: false,
      error: `Invalid Instagram state format: ${error instanceof Error ? error.message : 'Unknown error'}`
    } as const;
  }
}

// Replace: JSON.parse(Buffer.from(state as string, 'base64').toString())
export function safeParseOAuthState(stateParam: string) {
  try {
    const decoded = Buffer.from(stateParam, 'base64').toString();
    return safeJsonParse(decoded, oauthStateSchema);
  } catch (error) {
    return {
      success: false,
      error: `Invalid OAuth state format: ${error instanceof Error ? error.message : 'Unknown error'}`
    } as const;
  }
}

// Replace: JSON.parse(response.choices[0].message.content || '{}')
export function safeParseAIResponse(aiContent: string) {
  if (!aiContent.trim()) {
    return { success: false, error: 'Empty AI response' } as const;
  }
  
  return safeJsonParse(aiContent, aiResponseSchema);
}

// Replace: typeof accounts === 'string' ? JSON.parse(accounts) : accounts
export function safeParseAccountsData(accounts: unknown): {
  success: true;
  data: string[];
} | {
  success: false;
  error: string;
} {
  if (typeof accounts === 'string') {
    return safeJsonParse(accounts, z.array(z.string()));
  } else if (Array.isArray(accounts) && accounts.every(item => typeof item === 'string')) {
    return { success: true, data: accounts };
  } else {
    return { success: false, error: 'Invalid accounts data format' };
  }
}

/**
 * P1-4.2: Generic safe JSON parsing for migration
 */
export function migrateUnsafeJsonParse<T>(
  input: string,
  schema: z.ZodSchema<T>,
  context: string = 'data'
): T {
  const result = safeJsonParse(input, schema);
  
  if (!result.success) {
    console.error(`🚨 SECURITY: Unsafe JSON parse blocked in ${context}:`, result.error);
    throw new Error(`Invalid ${context} format: ${result.error}`);
  }
  
  console.log(`✅ SECURITY: Safe JSON parse successful in ${context}`);
  return result.data;
}

/**
 * P1-4.2: Validation for common request patterns
 */

// Validate workspace access in query parameters
export function validateWorkspaceInQuery(query: any): {
  success: true;
  workspaceId: string;
} | {
  success: false;
  error: string;
} {
  const schema = z.object({
    workspaceId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid workspace ID format')
  });
  
  const result = schema.safeParse(query);
  if (result.success) {
    return { success: true, workspaceId: result.data.workspaceId };
  } else {
    return { success: false, error: result.error.errors[0].message };
  }
}

// Validate pagination parameters
export function validatePaginationParams(query: any): {
  success: true;
  data: { page: number; limit: number; sort?: string; order: 'asc' | 'desc' };
} | {
  success: false;
  error: string;
} {
  const schema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('desc')
  });
  
  const result = schema.safeParse(query);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error.errors[0].message };
  }
}