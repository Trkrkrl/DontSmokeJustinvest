// src/data/sigaraPrices.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase. Please check your configuration.');
}

export const auth = getAuth(app);
const functions = getFunctions();
const getSigaraPricesFunction = httpsCallable(functions, 'getSigaraPrices');

export const fetchSigaraPrices = async (
  years: string[]
): Promise<Record<string, Record<string, Array<{ brand: string; value: number }>>>> => {
  try {
    const response = await getSigaraPricesFunction({
      token: import.meta.env.SPECIAL_SS_TOKEN,
      years
    });

    return response.data as Record<string, Record<string, Array<{ brand: string; value: number }>>>;
  } catch (error) {
    console.error('Sigara fiyatları alınırken hata:', error);
    return {};
  }
};

