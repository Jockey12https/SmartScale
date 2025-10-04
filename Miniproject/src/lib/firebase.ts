import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, off } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: (import.meta as any).env.VITE_FIREBASE_DATABASE_URL,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase with error handling
let app: any;
let auth: any;
let db: any;
let storage: any;
let database: any;
let isConnected = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  database = getDatabase(app);
  isConnected = true;
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  isConnected = false;
}

// Export services
export { auth, db, storage, database };


// Listen to scale data
export const listenToScaleData = (callback: (data: any) => void) => {
  if (!database) {
    console.error('Firebase database not initialized');
    return () => {};
  }

  const scaleRef = ref(database, 'scale');
  const unsubscribe = onValue(scaleRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return () => off(scaleRef, 'value', unsubscribe);
};

// Write scale data
export const writeScaleData = async (data: any): Promise<boolean> => {
  if (!database) {
    console.error('Firebase database not initialized');
    return false;
  }

  try {
    const scaleRef = ref(database, 'scale');
    await set(scaleRef, { ...data, timestamp: Date.now() });
    return true;
  } catch (error) {
    console.error('Error writing scale data:', error);
    return false;
  }
};


export default app;
