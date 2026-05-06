/**
 * Zustand auth store.
 *
 * Owns only client-side auth state: the token, user object, and role.
 * Persisted to localStorage so sessions survive page refreshes.
 *
 * Nothing server-derived (content lists, stats) lives here — that's
 * TanStack Query's domain.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,

      setAuth: ({ token, user }) =>
        set({
          token,
          user,
          role: user?.role ?? null,
        }),

      clearAuth: () =>
        set({
          token: null,
          user: null,
          role: null,
        }),
    }),
    {
      name: 'cbs-auth', // localStorage key
      // Only persist the fields we need — avoids stale derived state
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        role: state.role,
      }),
    }
  )
);

export default useAuthStore;
