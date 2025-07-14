#!/usr/bin/env node

/**
 * Production Build Script for VeeFore
 * 
 * This script handles production builds by:
 * 1. Building the client with Vite
 * 2. Building the server with esbuild excluding Vite dependencies
 * 3. Handling production-specific optimizations
 * 4. Creating dist directory and ensuring proper file structure
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('🚀 Starting VeeFore production build...');

// Clean dist directory
if (fs.existsSync('dist')) {
  console.log('🧹 Cleaning dist directory...');
  fs.rmSync('dist', { recursive: true, force: true });
}

// Create dist directory
fs.mkdirSync('dist', { recursive: true });

try {
  // Step 1: Build client with Vite
  console.log('📦 Building client with Vite...');
  execSync('npm run build:client', { stdio: 'inherit' });
  
  // Step 2: Build server with esbuild
  console.log('🛠️ Building server with esbuild...');
  
  // External dependencies to exclude from bundling
  const externals = [
    'express',
    'mongoose',
    'mongodb',
    'bcryptjs',
    'jsonwebtoken',
    'multer',
    'sharp',
    'canvas',
    'fabric',
    'nodemailer',
    'axios',
    'dotenv',
    'cors',
    'helmet',
    'compression',
    'cookie-parser',
    'express-rate-limit',
    'express-session',
    'connect-mongo',
    'passport',
    'passport-local',
    'passport-jwt',
    'stripe',
    'razorpay',
    'openai',
    '@anthropic-ai/sdk',
    '@google/generative-ai',
    'firebase-admin',
    'twilio',
    '@sendgrid/mail',
    'ws',
    'socket.io',
    'puppeteer',
    'ffmpeg-static',
    'fluent-ffmpeg',
    'jimp',
    'html2canvas',
    'vite',
    '@vitejs/plugin-react',
    '@replit/vite-plugin-cartographer',
    '@replit/vite-plugin-runtime-error-modal'
  ];

  // Build server
  await esbuild.build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    outfile: 'dist/server.js',
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    external: externals,
    sourcemap: false,
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    banner: {
      js: '#!/usr/bin/env node'
    }
  });

  // Step 3: Copy package.json and create production version
  console.log('📋 Creating production package.json...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Create production package.json with only runtime dependencies
  const prodPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    main: 'server.js',
    scripts: {
      start: 'node server.js'
    },
    dependencies: {
      express: packageJson.dependencies.express,
      mongoose: packageJson.dependencies.mongoose,
      mongodb: packageJson.dependencies.mongodb,
      bcryptjs: packageJson.dependencies.bcryptjs,
      jsonwebtoken: packageJson.dependencies.jsonwebtoken,
      multer: packageJson.dependencies.multer,
      sharp: packageJson.dependencies.sharp,
      canvas: packageJson.dependencies.canvas,
      fabric: packageJson.dependencies.fabric,
      nodemailer: packageJson.dependencies.nodemailer,
      axios: packageJson.dependencies.axios,
      dotenv: packageJson.dependencies.dotenv,
      cors: packageJson.dependencies.cors,
      helmet: packageJson.dependencies.helmet,
      compression: packageJson.dependencies.compression,
      'cookie-parser': packageJson.dependencies['cookie-parser'],
      'express-rate-limit': packageJson.dependencies['express-rate-limit'],
      'express-session': packageJson.dependencies['express-session'],
      'connect-mongo': packageJson.dependencies['connect-mongo'],
      passport: packageJson.dependencies.passport,
      'passport-local': packageJson.dependencies['passport-local'],
      'passport-jwt': packageJson.dependencies['passport-jwt'],
      stripe: packageJson.dependencies.stripe,
      razorpay: packageJson.dependencies.razorpay,
      openai: packageJson.dependencies.openai,
      '@anthropic-ai/sdk': packageJson.dependencies['@anthropic-ai/sdk'],
      '@google/generative-ai': packageJson.dependencies['@google/generative-ai'],
      'firebase-admin': packageJson.dependencies['firebase-admin'],
      twilio: packageJson.dependencies.twilio,
      '@sendgrid/mail': packageJson.dependencies['@sendgrid/mail'],
      ws: packageJson.dependencies.ws,
      'socket.io': packageJson.dependencies['socket.io'],
      puppeteer: packageJson.dependencies.puppeteer,
      'ffmpeg-static': packageJson.dependencies['ffmpeg-static'],
      'fluent-ffmpeg': packageJson.dependencies['fluent-ffmpeg'],
      jimp: packageJson.dependencies.jimp,
      'html2canvas': packageJson.dependencies['html2canvas']
    },
    engines: {
      node: '>=18.0.0'
    }
  };

  fs.writeFileSync('dist/package.json', JSON.stringify(prodPackageJson, null, 2));

  // Step 4: Copy necessary files
  console.log('📁 Copying necessary files...');
  
  // Copy client build to dist/client
  if (fs.existsSync('client/dist')) {
    fs.cpSync('client/dist', 'dist/client', { recursive: true });
  }
  
  // Copy shared directory
  if (fs.existsSync('shared')) {
    fs.cpSync('shared', 'dist/shared', { recursive: true });
  }
  
  // Copy uploads directory (if exists)
  if (fs.existsSync('uploads')) {
    fs.cpSync('uploads', 'dist/uploads', { recursive: true });
  }

  // Step 5: Create startup script
  console.log('🎯 Creating startup script...');
  const startupScript = `#!/usr/bin/env node

/**
 * Production Startup Script
 * Handles environment setup and graceful server startup
 */

const fs = require('fs');
const path = require('path');

// Environment validation
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'FIREBASE_PROJECT_ID'
];

console.log('🚀 Starting VeeFore production server...');

// Check required environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Set production environment
process.env.NODE_ENV = 'production';

// Start the server
try {
  require('./server.js');
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
}
`;

  fs.writeFileSync('dist/start.js', startupScript);
  fs.chmodSync('dist/start.js', 0o755);

  console.log('✅ Production build completed successfully!');
  console.log('📦 Build artifacts:');
  console.log('   - dist/server.js (bundled server)');
  console.log('   - dist/client/ (static files)');
  console.log('   - dist/package.json (production dependencies)');
  console.log('   - dist/start.js (startup script)');
  console.log('');
  console.log('🚀 To run in production:');
  console.log('   cd dist && npm install --production && node start.js');

} catch (error) {
  console.error('❌ Production build failed:', error.message);
  process.exit(1);
}

/**
 * Production Deployment Validation
 * Validates that all required components are present for deployment
 */
function validateDeployment() {
  const requiredFiles = [
    'dist/server.js',
    'dist/package.json',
    'dist/start.js'
  ];

  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing required files for deployment:', missingFiles);
    return false;
  }

  console.log('✅ All required files present for deployment');
  return true;
}

// Run validation
validateDeployment();