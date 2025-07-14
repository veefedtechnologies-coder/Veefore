/**
 * Add Current Device to Approved Early Access List
 * This script adds the current device (from logs) to the approved early access list
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function addCurrentDeviceToApproved() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Current device from the logs
    const currentDevice = {
      email: 'current-device@example.com', // You can change this email
      name: 'Current Device User',
      status: 'early_access',
      referralCode: 'DEVICE' + Date.now(),
      joinedAt: new Date(),
      approvedAt: new Date(),
      updatedAt: new Date(),
      credits: 300,
      deviceFingerprint: {
        ip: '172.31.128.40', // From the logs
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
      }
    };
    
    // Clean up existing entry
    await db.collection('waitlist_users').deleteMany({ 
      'deviceFingerprint.ip': currentDevice.deviceFingerprint.ip 
    });
    
    // Add current device
    const result = await db.collection('waitlist_users').insertOne(currentDevice);
    console.log('✅ Added current device to approved list:', result.insertedId);
    
    // Show all approved devices
    console.log('\n📋 All Approved Early Access Devices:');
    const approvedDevices = await db.collection('waitlist_users').find({
      status: 'early_access'
    }).toArray();
    
    approvedDevices.forEach((device, index) => {
      console.log(`${index + 1}. ${device.email}`);
      console.log(`   IP: ${device.deviceFingerprint?.ip || 'N/A'}`);
      console.log(`   User Agent: ${device.deviceFingerprint?.userAgent?.substring(0, 50) || 'N/A'}...`);
      console.log('');
    });
    
    console.log('🎯 Now try refreshing the page - the access restricted modal should not appear');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

console.log('📱 Adding Current Device to Approved Early Access List');
addCurrentDeviceToApproved();