/**
 * Complete Email Verification Flow Test
 * Tests the end-to-end email verification and automatic sign-in process
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import dotenv from 'dotenv';

dotenv.config();

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testCompleteEmailVerificationFlow() {
  console.log('=== Testing Complete Email Verification and Auto Sign-in Flow ===');
  
  const testEmail = `flowtest${Date.now()}@example.com`;
  const testPassword = 'password123';
  const firstName = 'Flow';
  const lastName = 'Test';
  
  try {
    // Step 1: Send verification email
    console.log('\n1. Sending verification email...');
    const sendResponse = await fetch('http://localhost:5000/api/auth/send-verification-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        firstName,
        lastName
      })
    });
    
    const sendResult = await sendResponse.json();
    console.log('Send verification result:', sendResult);
    
    if (!sendResult.developmentOtp) {
      throw new Error('No development OTP received');
    }
    
    // Step 2: Verify email with OTP
    console.log('\n2. Verifying email with OTP...');
    const verifyResponse = await fetch('http://localhost:5000/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        otp: sendResult.developmentOtp,
        password: testPassword,
        firstName,
        lastName
      })
    });
    
    const verifyResult = await verifyResponse.json();
    console.log('Email verification result:', verifyResult);
    
    if (!verifyResult.autoSignIn) {
      throw new Error('autoSignIn flag not set in verification response');
    }
    
    // Step 3: Test Firebase user creation (simulates frontend auto-signin)
    console.log('\n3. Testing Firebase user creation (auto-signin simulation)...');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('✅ Firebase user created successfully:', {
        uid: userCredential.user.uid,
        email: userCredential.user.email
      });
      
      // Step 4: Test database sync with Firebase JWT
      console.log('\n4. Testing database sync with Firebase JWT...');
      const idToken = await userCredential.user.getIdToken();
      
      const syncResponse = await fetch('http://localhost:5000/api/user', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (syncResponse.ok) {
        const userData = await syncResponse.json();
        console.log('✅ Database sync successful:', {
          id: userData.id,
          email: userData.email,
          isOnboarded: userData.isOnboarded
        });
        
        console.log('\n🎉 Complete email verification flow working correctly!');
        console.log('Users should now be automatically redirected to onboarding after email verification.');
        
      } else {
        const errorResult = await syncResponse.json();
        console.error('❌ Database sync failed:', errorResult);
        throw new Error(`Database sync failed: ${errorResult.error}`);
      }
      
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/email-already-in-use') {
        console.log('📝 Firebase user already exists, testing sign-in instead...');
        
        const signInCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
        console.log('✅ Firebase sign-in successful:', {
          uid: signInCredential.user.uid,
          email: signInCredential.user.email
        });
        
        // Test database sync
        const idToken = await signInCredential.user.getIdToken();
        const syncResponse = await fetch('http://localhost:5000/api/user', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (syncResponse.ok) {
          const userData = await syncResponse.json();
          console.log('✅ Database sync successful:', {
            id: userData.id,
            email: userData.email,
            isOnboarded: userData.isOnboarded
          });
          
          console.log('\n🎉 Complete email verification flow working correctly!');
        } else {
          const errorResult = await syncResponse.json();
          console.error('❌ Database sync failed:', errorResult);
        }
        
      } else {
        throw firebaseError;
      }
    }
    
  } catch (error) {
    console.error('❌ Email verification flow failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run the test
testCompleteEmailVerificationFlow();