// src/hooks/useAuth.js
// Encapsulates Firebase auth state so any component can subscribe cleanly.

import { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "../lib/firebase.js";

/**
 * Returns { user, authReady }
 *   user      — the Firebase User object, or null if signed out
 *   authReady — false until the initial auth check completes
 */
export function useAuth() {
  const [user, setUser]         = useState(null);
  const [authReady, setReady]   = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return unsub; // clean up listener on unmount
  }, []);

  return { user, authReady };
}
