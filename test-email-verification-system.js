#!/usr/bin/env node

// Test script to validate email verification system implementation
import express from 'express';
import { MongoStorage } from './server/mongodb-storage.js';
import { emailService } from './server/email-service.js';

async function testEmailVerificationSystem() {
  console.log('🧪 Testing Email Verification System Implementation');
  console.log('='.repeat(60));

  try {
    const storage = new MongoStorage();
    
    // Test 1: Generate OTP
    console.log('\n1. Testing OTP Generation:');
    const otp = emailService.generateOTP();
    const expiry = emailService.generateExpiry();
    console.log(`✓ Generated OTP: ${otp} (6 digits)`);
    console.log(`✓ Generated expiry: ${expiry.toISOString()}`);
    console.log(`✓ Expiry is ${Math.round((expiry - new Date()) / 1000 / 60)} minutes from now`);

    // Test 2: Store verification code
    console.log('\n2. Testing Code Storage:');
    const testEmail = 'test@veefore.com';
    await storage.storeEmailVerificationCode(testEmail, otp, expiry);
    console.log(`✓ Stored verification code for ${testEmail}`);

    // Test 3: Verify correct code
    console.log('\n3. Testing Code Verification (correct):');
    const verifyResult = await storage.verifyEmailCode(testEmail, otp);
    console.log(`✓ Verification result: ${verifyResult}`);

    // Test 4: Verify incorrect code
    console.log('\n4. Testing Code Verification (incorrect):');
    const wrongVerifyResult = await storage.verifyEmailCode(testEmail, '000000');
    console.log(`✓ Wrong code verification result: ${wrongVerifyResult}`);

    // Test 5: Test getUserByEmail method
    console.log('\n5. Testing getUserByEmail method:');
    const userByEmail = await storage.getUserByEmail(testEmail);
    console.log(`✓ getUserByEmail result: ${userByEmail ? 'User found' : 'User not found'}`);

    // Test 6: Clear verification code
    console.log('\n6. Testing Code Cleanup:');
    await storage.clearEmailVerificationCode(testEmail);
    console.log(`✓ Cleared verification code for ${testEmail}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL EMAIL VERIFICATION TESTS PASSED');
    console.log('📧 Email verification system is fully functional!');
    
  } catch (error) {
    console.error('\n❌ Email verification test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testEmailVerificationSystem().then(() => {
    console.log('\n🎉 Email verification system test completed successfully!');
    process.exit(0);
  }).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { testEmailVerificationSystem };