/**
 * Clean up Firebase user account that was created during early access but never completed
 */

const admin = require('firebase-admin');

async function cleanupFirebaseUser() {
  try {
    // Initialize Firebase Admin (reuse existing initialization)
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    const email = 'aasthaareenavlog934@gmail.com';
    
    console.log(`[CLEANUP] Looking for Firebase user with email: ${email}`);
    
    try {
      // Get user by email
      const userRecord = await admin.auth().getUserByEmail(email);
      console.log(`[CLEANUP] Found Firebase user: ${userRecord.uid}`);
      
      // Delete the user
      await admin.auth().deleteUser(userRecord.uid);
      console.log(`[CLEANUP] Successfully deleted Firebase user: ${userRecord.uid}`);
      
      console.log(`[CLEANUP] ✅ User ${email} has been cleaned up from Firebase`);
      console.log(`[CLEANUP] ✅ You can now sign up with this email again`);
      
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`[CLEANUP] ✅ No Firebase user found with email: ${email}`);
        console.log(`[CLEANUP] ✅ Email is already clean - you can sign up normally`);
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error('[CLEANUP] Error:', error);
    process.exit(1);
  }
}

cleanupFirebaseUser();