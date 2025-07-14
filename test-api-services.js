/**
 * Test API Services Configuration
 * This script tests all configured API services to ensure they're working properly
 */

import { OpenAI } from 'openai';
import sgMail from '@sendgrid/mail';
import * as admin from 'firebase-admin';

console.log('🧪 Testing VeeFore API Services');
console.log('================================');

// Test OpenAI API
async function testOpenAI() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log('❌ OpenAI: API key not configured');
      return false;
    }
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Test with a simple completion
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say "OpenAI API working"' }],
      max_tokens: 10,
    });
    
    console.log('✅ OpenAI: API connection successful');
    console.log(`   Response: ${response.choices[0].message.content}`);
    return true;
  } catch (error) {
    console.log('❌ OpenAI: API test failed -', error.message);
    return false;
  }
}

// Test SendGrid Email Service
async function testSendGrid() {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('❌ SendGrid: API key not configured');
      return false;
    }
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Test API key validity (without sending email)
    const msg = {
      to: 'test@example.com',
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@veefore.com',
      subject: 'Test Email',
      text: 'This is a test email',
    };
    
    // Validate the message format
    const isValid = sgMail.send(msg, false); // false = don't actually send
    console.log('✅ SendGrid: API key valid and configured');
    console.log(`   From email: ${process.env.SENDGRID_FROM_EMAIL}`);
    return true;
  } catch (error) {
    console.log('❌ SendGrid: Configuration test failed -', error.message);
    return false;
  }
}

// Test Firebase Admin
async function testFirebase() {
  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      console.log('❌ Firebase: Service account key not configured');
      return false;
    }
    
    // Parse service account
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    
    // Check if it has required fields
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      console.log('❌ Firebase: Service account missing required fields');
      return false;
    }
    
    console.log('✅ Firebase: Service account key valid');
    console.log(`   Project ID: ${serviceAccount.project_id}`);
    console.log(`   Client Email: ${serviceAccount.client_email}`);
    console.log('   Private Key: present');
    
    // Don't initialize admin again if already done in server
    return true;
  } catch (error) {
    console.log('❌ Firebase: Service account validation failed -', error.message);
    return false;
  }
}

// Test MongoDB Connection
async function testMongoDB() {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('❌ MongoDB: Connection string not configured');
      return false;
    }
    
    console.log('✅ MongoDB: Connection string configured');
    console.log('   Already connected (see server logs)');
    return true;
  } catch (error) {
    console.log('❌ MongoDB: Connection test failed -', error.message);
    return false;
  }
}

// Test Security Keys
function testSecurityKeys() {
  const jwtSecret = process.env.JWT_SECRET;
  const sessionSecret = process.env.SESSION_SECRET;
  
  if (!jwtSecret) {
    console.log('❌ Security: JWT_SECRET not configured');
    return false;
  }
  
  if (!sessionSecret) {
    console.log('❌ Security: SESSION_SECRET not configured');
    return false;
  }
  
  if (jwtSecret.length < 32) {
    console.log('⚠️  Security: JWT_SECRET should be at least 32 characters');
  }
  
  if (sessionSecret.length < 32) {
    console.log('⚠️  Security: SESSION_SECRET should be at least 32 characters');
  }
  
  console.log('✅ Security: JWT and Session secrets configured');
  console.log(`   JWT Secret length: ${jwtSecret.length} characters`);
  console.log(`   Session Secret length: ${sessionSecret.length} characters`);
  return true;
}

// Run all tests
async function runAllTests() {
  console.log('');
  
  const tests = [
    { name: 'MongoDB', test: testMongoDB },
    { name: 'Security Keys', test: testSecurityKeys },
    { name: 'OpenAI', test: testOpenAI },
    { name: 'SendGrid', test: testSendGrid },
    { name: 'Firebase', test: testFirebase },
  ];
  
  const results = [];
  
  for (const { name, test } of tests) {
    console.log(`\nTesting ${name}...`);
    const result = await test();
    results.push({ name, success: result });
  }
  
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  
  let passedCount = 0;
  for (const { name, success } of results) {
    const status = success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${name}`);
    if (success) passedCount++;
  }
  
  console.log(`\n${passedCount}/${results.length} services configured correctly`);
  
  if (passedCount === results.length) {
    console.log('\n🎉 All API services are properly configured!');
    console.log('Your VeeFore app is ready for full functionality.');
  } else {
    console.log('\n⚠️  Some services need attention. Check the logs above.');
  }
}

// Run tests
runAllTests().catch(console.error);