#!/usr/bin/env node

/**
 * Production Build Script for VeeFore
 * 
 * This script handles production builds by:
 * 1. Building the client with Vite
 * 2. Building the server with esbuild without Vite dependencies
 * 3. Handling production-specific optimizations
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function buildProduction() {
  console.log('🚀 Starting production build...');
  
  try {
    // Step 1: Build client with Vite
    console.log('📦 Building client with Vite...');
    await execAsync('NODE_ENV=production vite build');
    console.log('✅ Client build completed');
    
    // Step 2: Build server with esbuild, excluding Vite dependencies
    console.log('🔧 Building server with esbuild...');
    await execAsync(`esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --define:process.env.NODE_ENV='"production"' --external:vite --external:@vitejs/plugin-react --external:@replit/vite-plugin-cartographer --external:@replit/vite-plugin-runtime-error-modal --external:esbuild --external:fsevents --external:lightningcss --external:rollup --external:vite/client --external:vite/runtime`);
    console.log('✅ Server build completed');
    
    // Step 3: Copy necessary files
    console.log('📋 Copying configuration files...');
    
    // Create dist directory structure
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Copy package.json for production dependencies
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const prodPackageJson = {
      name: packageJson.name,
      version: packageJson.version,
      type: packageJson.type,
      dependencies: packageJson.dependencies,
      scripts: {
        start: 'NODE_ENV=production node index.js'
      }
    };
    
    fs.writeFileSync(
      path.join(distDir, 'package.json'),
      JSON.stringify(prodPackageJson, null, 2)
    );
    
    console.log('✅ Production build completed successfully!');
    console.log('📁 Build output in ./dist/');
    console.log('🎯 To start in production: cd dist && npm install --production && npm start');
    
  } catch (error) {
    console.error('❌ Production build failed:', error);
    process.exit(1);
  }
}

// Run the build
buildProduction();