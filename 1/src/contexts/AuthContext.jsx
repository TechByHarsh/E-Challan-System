import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../firebase";

// ✅ FIX: Add export here
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set persistence to localStorage to keep user logged in on page refresh
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.error("Error setting auth persistence:", err);
    });

    // Listen for auth state changes (handles page refresh automatically)
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const googleProvider = useMemo(() => new GoogleAuthProvider(), []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
      signUp: (email, password) => createUserWithEmailAndPassword(auth, email, password),
      signOut: () => signOut(auth),
      logout: () => signOut(auth), 
      googleSignIn: () => signInWithPopup(auth, googleProvider),
    }),
    [user, loading, error, googleProvider]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
