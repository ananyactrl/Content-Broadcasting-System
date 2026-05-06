/**
 * Content service.
 *
 * In development: delegates to mock handlers.
 * In production: swap mock imports for real Axios calls.
 * Service interface (signatures + return shapes) stays identical.
 */

import {
  mockUploadContent,
  mockGetMyContent,
  mockGetAllContent,
  mockGetLiveContent,
} from '@/src/mocks/handlers';

/**
 * Convert a File object to a base64 data URL.
 * The mock db cannot store File objects (they're not serialisable),
 * so we convert before passing to the handler. A real backend would
 * receive the File via multipart/form-data instead.
 */
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadContent(token, payload) {
  // Convert the File object to a base64 data URL so it can be stored
  // in the in-memory mock db and rendered by <img> / next/image later.
  let fileUrl = '/placeholder-content.png';
  if (payload.file instanceof File) {
    fileUrl = await fileToDataURL(payload.file);
  }

  const handlerPayload = { ...payload, fileUrl };
  delete handlerPayload.file; // File object not needed by handler

  // Production swap: return api.post('/content', formData).then(r => r.data)
  // where formData is a FormData object with the file appended
  return mockUploadContent(token, handlerPayload);
}

export async function getMyContent(token) {
  // Production swap: return api.get('/content/mine').then(r => r.data)
  return mockGetMyContent(token);
}

export async function getAllContent(token) {
  // Production swap: return api.get('/content').then(r => r.data)
  return mockGetAllContent(token);
}

export async function getLiveContent(teacherId) {
  // Production swap: return api.get(`/content/live/${teacherId}`).then(r => r.data)
  return mockGetLiveContent(teacherId);
}
