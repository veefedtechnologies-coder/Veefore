import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut, User, setPersistence, browserLocalPersistence, getRedirectResult } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'veefore-b84c8.firebaseapp.com', // Use Firebase's default domain for OAuth
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

console.log('🔥 Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '✅ SET' : '❌ MISSING',
  projectId: firebaseConfig.projectId ? '✅ SET' : '❌ MISSING',
  appId: firebaseConfig.appId ? '✅ SET' : '❌ MISSING',
  authDomain: firebaseConfig.authDomain
})

// Log the current domain for debugging
console.log('🌐 Current domain:', window.location.hostname)
console.log('🔧 Using authDomain:', firebaseConfig.authDomain)
console.log('🔧 Full URL:', window.location.href)

// Validate the authDomain configuration
if (window.location.hostname === 'localhost') {
  console.log('✅ Running on localhost - Firebase authDomain configured correctly')
  console.log('ℹ️ Firebase will handle OAuth on firebaseapp.com, then redirect back to localhost:5000')
} else {
  console.warn('⚠️ Domain mismatch - Firebase may not work correctly')
  console.warn('Expected: localhost, Got:', window.location.hostname)
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
console.log('🔥 Firebase App Initialized:', app)

// Initialize Auth
export const auth = getAuth(app)
console.log('🔥 Firebase Auth Initialized:', auth)

// Set persistence
setPersistence(auth, browserLocalPersistence)
console.log('🔥 Firebase Persistence Set')

// Create Google Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})
console.log('🔥 Google Provider Created:', googleProvider)

// Export all auth functions
export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect,
  signOut,
  getRedirectResult
}

export type { User }