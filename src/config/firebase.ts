import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCF2BoHdQz3rz7UePJCUEML0a74L205D1s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "memo-gallery-9d355.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://memo-gallery-9d355-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "memo-gallery-9d355",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "memo-gallery-9d355.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "754328524443",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:754328524443:android:0f8dd9ff2e1b1d5966183e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
