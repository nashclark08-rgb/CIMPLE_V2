// ============================================================
// CIMPLE — Firebase initialisation (Increment D foundation)
//
// GRACEFUL BY DESIGN: until a Firebase project exists and its
// config is supplied via VITE_FIREBASE_* env vars, this module is
// an inert no-op — `isFirebaseConfigured` is false and the app runs
// exactly as the localStorage-only prototype does today.
//
// To go live: create the project in the Firebase console, enable
// Authentication (Email/Password) + Firestore, then set the env
// vars below in Vercel (and .env.local for local dev). See
// docs/firebase-setup.md for the exact click-path.
// ============================================================
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Configured only when the essential keys are present.
export const isFirebaseConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId
);

let _app = null;
let _auth = null;
let _db = null;

if (isFirebaseConfigured) {
  _app = initializeApp(config);
  _auth = getAuth(_app);
  // Offline-first cache — the answer to the resilience NFR. Reads/writes
  // queue locally and sync on reconnect; multi-tab coordinated.
  _db = initializeFirestore(_app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
}

export const firebaseApp = _app;
export const auth = _auth;
export const db = _db;
