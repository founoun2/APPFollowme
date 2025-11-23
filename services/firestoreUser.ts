import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Save user data to Firestore
export async function saveUserData(uid: string, data: Record<string, any>) {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
}

// Get user data from Firestore
export async function getUserData(uid: string) {
  const docSnap = await getDoc(doc(db, 'users', uid));
  return docSnap.exists() ? docSnap.data() : null;
}
