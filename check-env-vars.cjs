/**
 * Check Environment Variables - See what MongoDB URI is actually being used
 */

console.log('=== ENVIRONMENT VARIABLES CHECK ===');
console.log('MONGODB_URI from process.env:', process.env.MONGODB_URI);
console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL);

console.log('\n=== COMPARISON ===');
console.log('Expected (from .env file): mongodb+srv://arpit9996363:jdlghZrjUE2bq5D@cluster0.cbnlr.mongodb.net/veeforedb');
console.log('Actual (from process.env):', process.env.MONGODB_URI);

if (process.env.MONGODB_URI) {
  console.log('\nMONGODB_URI is set');
  
  // Extract database name from URI
  const dbMatch = process.env.MONGODB_URI.match(/\/([^?]+)/);
  if (dbMatch && dbMatch[1]) {
    console.log('Database name from URI:', dbMatch[1]);
  } else {
    console.log('No database name in URI (will use default)');
  }
  
  // Extract cluster
  const clusterMatch = process.env.MONGODB_URI.match(/@([^/]+)/);
  if (clusterMatch && clusterMatch[1]) {
    console.log('Cluster from URI:', clusterMatch[1]);
  }
} else {
  console.log('❌ MONGODB_URI is not set!');
}

console.log('\n=== ISSUE ANALYSIS ===');
console.log('The server is connecting to: mongodb+srv://brandboost09:Arpitc8433@cluster0.mekr2dh.mongodb.net');
console.log('But .env file shows: mongodb+srv://arpit9996363:jdlghZrjUE2bq5D@cluster0.cbnlr.mongodb.net/veeforedb');
console.log('This suggests the server is using Replit Secrets or a different environment variable source.');