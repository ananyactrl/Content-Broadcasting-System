/**
 * Approval service.
 *
 * In development: delegates to mock handlers.
 * In production: swap mock imports for real Axios calls.
 */

import {
  mockGetPendingContent,
  mockApproveContent,
  mockRejectContent,
} from '@/src/mocks/handlers';

export async function getPendingContent(token) {
  // Production swap: return api.get('/content/pending').then(r => r.data)
  return mockGetPendingContent(token);
}

export async function approveContent(token, contentId) {
  // Production swap: return api.patch(`/content/${contentId}/approve`).then(r => r.data)
  return mockApproveContent(token, contentId);
}

export async function rejectContent(token, contentId, reason) {
  // Production swap: return api.patch(`/content/${contentId}/reject`, { reason }).then(r => r.data)
  return mockRejectContent(token, contentId, reason);
}
