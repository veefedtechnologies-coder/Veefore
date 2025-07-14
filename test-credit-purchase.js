import { CREDIT_PACKAGES } from './server/pricing-config.js';

async function testCreditPurchase() {
  try {
    console.log('Testing credit purchase system...');
    console.log('Available credit packages:', CREDIT_PACKAGES);
    
    // Test a purchase request
    const packageId = 'credits-150';
    const packageData = CREDIT_PACKAGES.find(pkg => pkg.id === packageId);
    
    if (packageData) {
      console.log(`Found package ${packageId}:`, packageData);
      console.log(`Price: ₹${packageData.price}, Credits: ${packageData.totalCredits}`);
    } else {
      console.log(`Package ${packageId} not found`);
      console.log('Available package IDs:', CREDIT_PACKAGES.map(p => p.id));
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testCreditPurchase();