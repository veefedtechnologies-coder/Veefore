/**
 * Debug Firebase Service Account Key Format
 */

console.log('🔍 Firebase Service Account Key Debug');
console.log('=====================================');

const firebaseKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!firebaseKey) {
  console.log('❌ FIREBASE_SERVICE_ACCOUNT_KEY environment variable not found');
  process.exit(1);
}

console.log('✅ FIREBASE_SERVICE_ACCOUNT_KEY found');
console.log(`📏 Length: ${firebaseKey.length} characters`);
console.log(`🔤 First 100 characters: ${firebaseKey.substring(0, 100)}...`);
console.log(`🔤 Last 100 characters: ...${firebaseKey.substring(firebaseKey.length - 100)}`);

// Check for common issues
const issues = [];

if (!firebaseKey.startsWith('{')) {
  issues.push('❌ Key does not start with "{"');
}

if (!firebaseKey.endsWith('}')) {
  issues.push('❌ Key does not end with "}"');
}

if (firebaseKey.includes('\\"')) {
  issues.push('⚠️  Key contains escaped quotes (\\")');}

if (firebaseKey.includes('\\n')) {
  issues.push('⚠️  Key contains escaped newlines (\\n)');
}

// Try to parse
console.log('\n🧪 Attempting to parse JSON...');
try {
  const parsed = JSON.parse(firebaseKey);
  console.log('✅ JSON parsing successful!');
  console.log('📋 Service account details:');
  console.log(`   Project ID: ${parsed.project_id || 'not found'}`);
  console.log(`   Client Email: ${parsed.client_email || 'not found'}`);
  console.log(`   Type: ${parsed.type || 'not found'}`);
  console.log(`   Private Key ID: ${parsed.private_key_id ? 'present' : 'missing'}`);
  console.log(`   Private Key: ${parsed.private_key ? 'present' : 'missing'}`);
} catch (error) {
  console.log('❌ JSON parsing failed!');
  console.log(`   Error: ${error.message}`);
  
  // Try to identify the problematic position
  const match = error.message.match(/position (\d+)/);
  if (match) {
    const position = parseInt(match[1]);
    const start = Math.max(0, position - 20);
    const end = Math.min(firebaseKey.length, position + 20);
    console.log(`   Problem area: "${firebaseKey.substring(start, end)}"`);
    console.log(`   Character at position ${position}: "${firebaseKey[position]}"`);
  }
}

if (issues.length > 0) {
  console.log('\n⚠️  Issues found:');
  issues.forEach(issue => console.log(`   ${issue}`));
} else {
  console.log('\n✅ No obvious formatting issues detected');
}

console.log('\n💡 Solutions:');
console.log('1. Make sure the key is a valid JSON object');
console.log('2. Remove any extra quotes or escaping around the entire key');
console.log('3. Ensure newlines in private_key are properly escaped as \\n');
console.log('4. Copy the key directly from Firebase Console without modifications');