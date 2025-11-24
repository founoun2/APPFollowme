import { auth } from './firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

export function autoConnectFirebase() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User UID:', user.uid);
      console.log('Email:', user.email);
      console.log('Display Name:', user.displayName);
      console.log('Phone Number:', user.phoneNumber);
      console.log('Photo URL:', user.photoURL);
    } else {
      console.log('No user is signed in.');
    }
  });
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Register with email and password
export async function registerWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Sign out
export async function signOutUser() {
  return signOut(auth);
}

// Sign in with Google
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}
