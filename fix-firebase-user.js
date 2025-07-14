/**
 * Fix Firebase user account by deleting the incomplete account
 * Uses curl to call Firebase Admin API directly
 */

const email = 'aasthaareenavlog934@gmail.com';

console.log(`[FIX] Creating API endpoint to delete Firebase user: ${email}`);
console.log(`[FIX] This will allow you to sign up fresh with this email`);

// We'll add a temporary endpoint to the server to handle this
const express = require('express');
const admin = require('firebase-admin');

console.log(`[FIX] Please add this endpoint to your server temporarily:`);
console.log(`
app.post('/api/cleanup-firebase-user', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log('Found Firebase user:', userRecord.uid);
    
    // Delete the user
    await admin.auth().deleteUser(userRecord.uid);
    console.log('Successfully deleted Firebase user:', userRecord.uid);
    
    res.json({ success: true, message: 'Firebase user deleted successfully' });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      res.json({ success: true, message: 'No Firebase user found - email is clean' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});
`);

console.log(`[FIX] Then call: curl -X POST http://localhost:3000/api/cleanup-firebase-user -H "Content-Type: application/json" -d '{"email":"${email}"}'`);