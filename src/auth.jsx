// ============================================================
// CIMPLE — Auth context (Increment D foundation)
//
// Two modes, decided at runtime by whether Firebase is configured:
//
//  • LOCAL MODE  (no Firebase env vars)  → the prototype as it is
//    today. A synthetic local user is provided so nothing gates;
//    the app is fully usable offline with no sign-in.
//
//  • CONNECTED MODE (Firebase configured) → real Firebase Auth.
//    App.jsx shows <SignIn/> until a user is authenticated.
//
// This keeps the live prototype working unchanged while the real
// backend is switched on purely by supplying env vars.
// ============================================================
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { isFirebaseConfigured, auth } from "./firebase.js";

const AuthContext = createContext(null);

// Synthetic user used in LOCAL MODE so downstream code can always
// assume `user` exists. Clearly marked as local/unauthenticated.
const LOCAL_USER = {
  uid: "local",
  email: null,
  displayName: "Local user",
  isLocal: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(isFirebaseConfigured ? null : LOCAL_USER);
  const [ready, setReady] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return; // local mode — nothing to subscribe to
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setReady(true);
    });
    return () => unsub();
  }, []);

  const value = {
    user,
    ready,
    connected: isFirebaseConfigured,
    async signIn(email, password) {
      return signInWithEmailAndPassword(auth, email, password);
    },
    async signOutUser() {
      if (!isFirebaseConfigured) return;
      return signOut(auth);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
