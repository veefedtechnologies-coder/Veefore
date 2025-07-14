#!/usr/bin/env node

/**
 * VeeFore Deployment Configuration
 * 
 * This file contains all deployment-specific configurations and fixes
 * for production deployment issues.
 */

import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
config();

export const deploymentConfig = {
  // Environment detection
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '5000'),
    host: process.env.HOST || '0.0.0.0',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/veefore',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  
  // Build configuration
  build: {
    clientDir: 'client',
    serverDir: 'server',
    distDir: 'dist',
    publicDir: 'dist/public',
    serverBundle: 'dist/server/index.js',
  },
  
  // Static file serving
  static: {
    maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
    compression: true,
    etag: true,
    index: 'index.html',
    fallthrough: false,
  },
  
  // Health check configuration
  health: {
    path: '/api/health',
    timeout: 10000,
    interval: 30000,
    retries: 3,
  },
  
  // Required environment variables
  requiredEnvVars: [
    'NODE_ENV',
    'DATABASE_URL',
    'JWT_SECRET',
    'OPENAI_API_KEY',
    'FIREBASE_PROJECT_ID',
    'SENDGRID_API_KEY',
  ],
  
  // Optional environment variables
  optionalEnvVars: [
    'STRIPE_SECRET_KEY',
    'INSTAGRAM_CLIENT_ID',
    'ANTHROPIC_API_KEY',
    'GOOGLE_API_KEY',
    'RAZORPAY_KEY_ID',
  ],
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'dev',
    requestLogging: true,
    errorLogging: true,
  },
  
  // Security configuration
  security: {
    trustProxy: process.env.TRUST_PROXY === 'true',
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
    helmet: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    },
  },
  
  // File upload configuration
  uploads: {
    directory: process.env.UPLOADS_DIR || 'uploads',
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ],
  },
  
  // Cache configuration
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600'), // 1 hour
    checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || '600'), // 10 minutes
  },
  
  // External API timeouts
  apiTimeouts: {
    openai: 60000,
    instagram: 30000,
    sendgrid: 15000,
    stripe: 30000,
  },
};

/**
 * Validates deployment configuration
 */
export function validateDeployment() {
  const errors = [];
  const warnings = [];
  
  console.log('🔍 Validating deployment configuration...');
  
  // Check environment
  if (!deploymentConfig.isProduction && !deploymentConfig.isDevelopment) {
    warnings.push('NODE_ENV not set to production or development');
  }
  
  // Check required environment variables
  for (const envVar of deploymentConfig.requiredEnvVars) {
    if (!process.env[envVar]) {
      errors.push(`Required environment variable ${envVar} is not set`);
    }
  }
  
  // Check database URL format
  if (deploymentConfig.database.url && !deploymentConfig.database.url.startsWith('mongodb://') && !deploymentConfig.database.url.startsWith('mongodb+srv://')) {
    errors.push('DATABASE_URL must be a valid MongoDB connection string');
  }
  
  // Check build directories in production
  if (deploymentConfig.isProduction) {
    const requiredPaths = [
      deploymentConfig.build.distDir,
      deploymentConfig.build.publicDir,
    ];
    
    for (const dirPath of requiredPaths) {
      if (!fs.existsSync(dirPath)) {
        errors.push(`Required build directory ${dirPath} does not exist`);
      }
    }
    
    // Check if server bundle exists
    if (!fs.existsSync(deploymentConfig.build.serverBundle)) {
      errors.push(`Server bundle ${deploymentConfig.build.serverBundle} does not exist`);
    }
  }
  
  // Check uploads directory
  const uploadsDir = deploymentConfig.uploads.directory;
  if (!fs.existsSync(uploadsDir)) {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`✅ Created uploads directory: ${uploadsDir}`);
    } catch (error) {
      errors.push(`Cannot create uploads directory: ${error.message}`);
    }
  }
  
  // Check port availability
  if (deploymentConfig.server.port < 1024 && process.getuid && process.getuid() !== 0) {
    warnings.push(`Port ${deploymentConfig.server.port} requires root privileges`);
  }
  
  // Report results
  if (errors.length > 0) {
    console.error('\n❌ Deployment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    return false;
  }
  
  if (warnings.length > 0) {
    console.warn('\n⚠️  Deployment warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
  
  console.log('\n✅ Deployment validation passed!');
  return true;
}

/**
 * Logs deployment configuration
 */
export function logDeploymentConfig() {
  console.log('\n📋 Deployment Configuration:');
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Port: ${deploymentConfig.server.port}`);
  console.log(`  Host: ${deploymentConfig.server.host}`);
  console.log(`  Database: ${deploymentConfig.database.url ? 'Connected' : 'Not configured'}`);
  console.log(`  Build Mode: ${deploymentConfig.isProduction ? 'Production' : 'Development'}`);
  console.log(`  Static Files: ${deploymentConfig.build.publicDir}`);
  console.log(`  Uploads: ${deploymentConfig.uploads.directory}`);
  console.log(`  Cache TTL: ${deploymentConfig.cache.ttl}s`);
  console.log('');
}

/**
 * Production readiness check
 */
export function checkProductionReadiness() {
  console.log('🚀 Checking production readiness...');
  
  const checks = [
    {
      name: 'Environment Variables',
      check: () => deploymentConfig.requiredEnvVars.every(env => process.env[env]),
      critical: true,
    },
    {
      name: 'Build Files',
      check: () => fs.existsSync(deploymentConfig.build.publicDir),
      critical: true,
    },
    {
      name: 'Server Bundle',
      check: () => fs.existsSync(deploymentConfig.build.serverBundle),
      critical: true,
    },
    {
      name: 'Database Connection',
      check: () => deploymentConfig.database.url && deploymentConfig.database.url.includes('mongodb'),
      critical: true,
    },
    {
      name: 'Uploads Directory',
      check: () => fs.existsSync(deploymentConfig.uploads.directory),
      critical: false,
    },
    {
      name: 'SSL Configuration',
      check: () => process.env.SSL_CERT && process.env.SSL_KEY,
      critical: false,
    },
  ];
  
  const results = checks.map(check => ({
    ...check,
    passed: check.check(),
  }));
  
  const criticalFailures = results.filter(r => !r.passed && r.critical);
  const warnings = results.filter(r => !r.passed && !r.critical);
  
  console.log('\n📊 Production Readiness Results:');
  results.forEach(result => {
    const status = result.passed ? '✅' : (result.critical ? '❌' : '⚠️');
    console.log(`  ${status} ${result.name}`);
  });
  
  if (criticalFailures.length > 0) {
    console.error('\n❌ Critical issues found. Deployment not recommended.');
    return false;
  }
  
  if (warnings.length > 0) {
    console.warn('\n⚠️  Non-critical issues found. Deployment possible with caution.');
  } else {
    console.log('\n✅ All checks passed! Ready for production deployment.');
  }
  
  return true;
}

// Export configuration for use in other modules
export default deploymentConfig;

// CLI functionality
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'validate':
      validateDeployment();
      break;
    case 'config':
      logDeploymentConfig();
      break;
    case 'ready':
      checkProductionReadiness();
      break;
    default:
      console.log('Usage: node deployment-config.js [validate|config|ready]');
      console.log('  validate - Validate deployment configuration');
      console.log('  config   - Show deployment configuration');
      console.log('  ready    - Check production readiness');
  }
}