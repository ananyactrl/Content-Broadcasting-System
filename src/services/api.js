/**
 * Axios instance with auth interceptors.
 *
 * Request interceptor: reads the token from Zustand's persisted localStorage
 * state and attaches it as a Bearer header on every outgoing request.
 *
 * Response interceptor: on 401, clears the auth store and redirects to /login.
 * This handles token expiry transparently without any component needing to
 * know about it.
 *
 * In development the service files call mock handlers directly, so this
 * instance is only used when the mock layer is swapped for a real backend.
 * It is exported so services can import it when needed.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor ─────────────────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    // Read directly from localStorage to avoid a circular import with the
    // Zustand store (which itself imports nothing from services).
    try {
      const raw = localStorage.getItem('cbs-auth');
      if (raw) {
        const { state } = JSON.parse(raw);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    } catch {
      // localStorage unavailable (SSR) — proceed without token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear persisted auth state
      try {
        localStorage.removeItem('cbs-auth');
      } catch {
        // ignore
      }
      // Redirect to login — works in both client and edge contexts
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
