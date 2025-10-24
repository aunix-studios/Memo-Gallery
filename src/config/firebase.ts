import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCF2BoHdQz3rz7UePJCUEML0a74L205D1s",
  authDomain: "memo-gallery-9d355.firebaseapp.com",
  databaseURL: "https://memo-gallery-9d355-default-rtdb.firebaseio.com",
  projectId: "memo-gallery-9d355",
  storageBucket: "memo-gallery-9d355.firebasestorage.app",
  messagingSenderId: "754328524443",
  appId: "1:754328524443:android:0f8dd9ff2e1b1d5966183e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
