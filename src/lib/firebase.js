

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  limit,
  writeBatch,
} from "firebase/firestore";

import { getAnalytics, logEvent, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

let analyticsInstance = null;

export const hasAnalyticsConsent = () => {
  return localStorage.getItem("cookieConsent") === "accepted";
};

const getAnalyticsInstance = async () => {
  if (!hasAnalyticsConsent()) return null;

  const supported = await isSupported();
  if (!supported) return null;

  if (!analyticsInstance) {
    analyticsInstance = getAnalytics(app);
  }

  return analyticsInstance;
};

export const logAnalyticsEvent = async (eventName, eventParams = {}) => {
  try {
    const analytics = await getAnalyticsInstance();

    if (!analytics) return;

    logEvent(analytics, eventName, eventParams);
  } catch (error) {
    console.warn("Analytics error:", error);
  }
};

// Re-export Firestore + Auth helpers so other modules only need one import
export {
  collection, doc, addDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy,
  serverTimestamp, onSnapshot, limit, writeBatch,
  signInWithPopup, signOut, onAuthStateChanged, deleteUser,
};
