// src/data/invPrices.ts
export interface InvPriceEntry {
  asset: string;
  value: number | "Data Not Available";
}

export type InvPrices = Record<
  string, // Yıl (örneğin "1986")
  Record<
    string, // Ay (örneğin "1")
    InvPriceEntry[]
  >
>;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase with custom settings
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase. Please check your configuration.');
}
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
export const auth = getAuth(app);
const functions = getFunctions();
const getInvPricesFunction = httpsCallable(functions, 'getInvPrices');

export const fetchInvPrices = async (
  years: string[],
  assetsByYear: Record<string, string[]>
): Promise<InvPrices> => {
  try {
    const response = await getInvPricesFunction({
      token: import.meta.env.SPECIAL_SS_TOKEN,
      years,
      assetsByYear,
    });

    // Firebase Functions response.data içerisinde olmalı
    return response.data as InvPrices;
    
  } catch (error) {
    console.error('Veri alınırken hata:', error);
    return {};
  }
};
