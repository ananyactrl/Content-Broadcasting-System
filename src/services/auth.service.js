/**
 * Auth service.
 *
 * In development: delegates to mock handlers.
 * In production: swap the mock imports for real Axios calls against api.js.
 * The function signatures and return shapes are identical either way.
 */

import { mockLogin, mockGetProfile, mockLogout } from '@/src/mocks/handlers';

export async function login({ email, password }) {
  // Production swap: return api.post('/auth/login', { email, password }).then(r => r.data)
  return mockLogin({ email, password });
}

export async function getProfile(token) {
  // Production swap: return api.get('/auth/me').then(r => r.data)
  return mockGetProfile(token);
}

export async function logout(token) {
  // Production swap: return api.post('/auth/logout').then(r => r.data)
  return mockLogout(token);
}
