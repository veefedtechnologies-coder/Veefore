/**
 * Test Waitlist System - Create test waitlist entries for authentication flow testing
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');
const crypto = require('crypto');

async function testWaitlistSystem() {
  const client = new MongoClient(process.env.MONGODB_URI || process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    // Create a device fingerprint for testing
    const testDeviceFingerprint = crypto.createHash('sha256').update('test-device-172.31.128.40-Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb').digest('hex');
    
    console.log('🔍 Creating test waitlist entries...');
    
    // Create test waitlist entries for different scenarios
    const testEntries = [
      {
        email: 'test@example.com',
        deviceFingerprint: testDeviceFingerprint,
        ipAddress: '172.31.128.40',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb',
        referralCode: `TEST${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        status: 'early_access',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'waitlist@example.com',
        deviceFingerprint: crypto.createHash('sha256').update('waitlist-device-123').digest('hex'),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb',
        referralCode: `WAIT${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        status: 'waitlist',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert test entries
    const result = await db.collection('early_access_users').insertMany(testEntries);
    console.log('✅ Created test waitlist entries:', result.insertedIds);
    
    // Test device lookup
    console.log('\n🔍 Testing device lookup...');
    const foundUser = await db.collection('early_access_users').findOne({
      deviceFingerprint: testDeviceFingerprint
    });
    
    if (foundUser) {
      console.log('✅ Device lookup successful:', {
        email: foundUser.email,
        status: foundUser.status,
        referralCode: foundUser.referralCode
      });
    } else {
      console.log('❌ Device lookup failed');
    }
    
    // Test email lookup
    console.log('\n🔍 Testing email lookup...');
    const foundByEmail = await db.collection('early_access_users').findOne({
      email: 'test@example.com'
    });
    
    if (foundByEmail) {
      console.log('✅ Email lookup successful:', {
        email: foundByEmail.email,
        status: foundByEmail.status,
        referralCode: foundByEmail.referralCode
      });
    } else {
      console.log('❌ Email lookup failed');
    }
    
    console.log('\n🎉 Test waitlist system setup complete!');
    console.log('📱 Test Device Fingerprint:', testDeviceFingerprint);
    console.log('🌐 Test IP Address: 172.31.128.40');
    console.log('📧 Test Email: test@example.com');
    console.log('🔑 Test Referral Code:', testEntries[0].referralCode);
    console.log('✅ Test Status: early_access');
    
  } catch (error) {
    console.error('❌ Error testing waitlist system:', error);
  } finally {
    await client.close();
  }
}

testWaitlistSystem();