/**
 * Generate Random Security Keys for VeeFore
 * Run this script to generate JWT_SECRET and SESSION_SECRET
 */

import crypto from 'crypto';

function generateRandomSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

console.log('🔐 VeeFore Security Keys Generator');
console.log('=====================================');
console.log('');
console.log('Copy these values to your Replit Secrets:');
console.log('');
console.log(`JWT_SECRET=${generateRandomSecret(32)}`);
console.log(`SESSION_SECRET=${generateRandomSecret(32)}`);
console.log('');
console.log('✅ Use these secure random keys for your VeeFore app');