import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, User, setPersistence, browserLocalPersistence } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Set persistence to local storage to maintain login across sessions
// Wrapped in try-catch to handle IndexedDB issues gracefully
try {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Firebase: Auth persistence set to LOCAL')
    })
    .catch((error) => {
      console.warn('Firebase: Persistence setup failed, using default:', error.message)
    })
} catch (error) {
  console.warn('Firebase: IndexedDB not available, using memory persistence')
}

export const googleProvider = new GoogleAuthProvider()

// Configure Google provider
googleProvider.addScope('email')
googleProvider.addScope('profile')
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Auth functions
export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const signUpWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider)
}

export const logOut = () => {
  return signOut(auth)
}

export type { User }