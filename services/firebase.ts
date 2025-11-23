import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config from google-services.json and inferred web fields
const firebaseConfig = {
  apiKey: 'AIzaSyAqtcQ5qB4nEwYG4gAOXoaj0xItqt9-fbQ',
  authDomain: 'followme-3fb6d.firebaseapp.com',
  projectId: 'followme-3fb6d',
  storageBucket: 'followme-3fb6d.firebasestorage.app',
  messagingSenderId: '1043329567828',
  appId: '1:1043329567828:web:0d028df8d082d080e6b1c1',
  measurementId: 'G-SKY7TXPPGF'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
