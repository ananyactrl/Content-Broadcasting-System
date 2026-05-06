/**
 * useAuth — thin wrapper around the Zustand auth store.
 *
 * Components should import this hook rather than the store directly.
 * This keeps the store implementation detail hidden and makes it easy
 * to swap the underlying mechanism without touching every consumer.
 */

import useAuthStore from '@/src/store/authStore';

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return {
    token,
    user,
    role,
    isAuthenticated: !!token,
    setAuth,
    clearAuth,
  };
}
