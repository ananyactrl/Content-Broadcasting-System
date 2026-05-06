/**
 * AuthContext — provides auth state to the component tree.
 *
 * This is a thin wrapper around the Zustand store. It exists so that
 * components can consume auth state via useContext(AuthContext) if preferred,
 * and so the auth provider can be placed at the app root cleanly.
 *
 * The actual state lives in Zustand (persisted to localStorage).
 * This context just re-exports the same values for convenience.
 */

'use client';

import { createContext, useContext } from 'react';
import { useAuth } from '@/src/hooks/useAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}
