/**
 * Mock API handlers.
 *
 * These are pure async functions that simulate network latency and
 * perform CRUD operations against the in-memory db.
 *
 * Design intent: the service layer calls these functions in development.
 * Swapping to a real backend requires only changing the service files —
 * the handler interface (function signatures + return shapes) stays identical.
 *
 * See Frontend-notes.txt §4 for the full rationale.
 */

import { db, nextContentId } from './db';
import { STATUS } from '../utils/constants';

/** Simulate realistic network latency */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return sleep(300 + Math.random() * 300);
}

/** Generate a simple mock JWT-like token */
function generateToken(userId) {
  return `mock_token_${userId}_${Date.now()}`;
}

/**
 * Resolve a userId from a token.
 *
 * First checks the in-memory session store (set on login).
 * Falls back to parsing the userId directly from the token string —
 * this handles the page-refresh case where db.sessions has been reset
 * but the token is still valid in localStorage/cookies.
 *
 * Format: mock_token_<userId>_<timestamp>
 */
function resolveUserId(token) {
  if (!token) return null;
  // Live session (set during this page load)
  if (db.sessions[token]) return db.sessions[token];
  // Decode from token string (survives page refresh)
  const match = token.match(/^mock_token_(.+)_\d+$/);
  if (match) {
    const userId = match[1];
    // Verify the user actually exists before trusting the token
    const userExists = db.users.some((u) => u.id === userId);
    if (userExists) {
      // Re-register in session store so subsequent calls are fast
      db.sessions[token] = userId;
      return userId;
    }
  }
  return null;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function mockLogin({ email, password }) {
  await randomDelay();
  const user = db.users.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const token = generateToken(user.id);
  db.sessions[token] = user.id;
  const { password: _pw, ...safeUser } = user;
  return { token, user: safeUser };
}

export async function mockGetProfile(token) {
  await randomDelay();
  const userId = resolveUserId(token);
  if (!userId) {
    const err = new Error('Unauthorised');
    err.status = 401;
    throw err;
  }
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

export async function mockLogout(token) {
  await randomDelay();
  delete db.sessions[token];
  return { success: true };
}

// ─── Content ─────────────────────────────────────────────────────────────────

export async function mockUploadContent(token, payload) {
  await randomDelay();
  const userId = resolveUserId(token);
  if (!userId) {
    const err = new Error('Unauthorised');
    err.status = 401;
    throw err;
  }
  const teacher = db.users.find((u) => u.id === userId);

  const newItem = {
    id: nextContentId(),
    teacherId: userId,
    teacherName: teacher?.name ?? 'Unknown',
    title: payload.title,
    subject: payload.subject,
    description: payload.description ?? '',
    // fileUrl is a base64 data URL passed from the service layer (converted
    // from the File object before calling the handler). Falls back to the
    // placeholder if not provided.
    fileUrl: payload.fileUrl ?? '/placeholder-content.png',
    fileName: payload.fileName ?? 'upload.jpg',
    fileSize: payload.fileSize ?? 0,
    fileType: payload.fileType ?? 'image/jpeg',
    status: STATUS.PENDING,
    rejectionReason: null,
    startTime: payload.startTime,
    endTime: payload.endTime,
    rotationDuration: payload.rotationDuration ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.content.unshift(newItem);
  return newItem;
}

export async function mockGetMyContent(token) {
  await randomDelay();
  const userId = resolveUserId(token);
  if (!userId) {
    const err = new Error('Unauthorised');
    err.status = 401;
    throw err;
  }
  return db.content
    .filter((c) => c.teacherId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function mockGetAllContent(token) {
  await randomDelay();
  const userId = resolveUserId(token);
  if (!userId) {
    const err = new Error('Unauthorised');
    err.status = 401;
    throw err;
  }
  return [...db.content].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export async function mockGetLiveContent(teacherId) {
  await randomDelay();
  const now = new Date();
  return db.content.filter((c) => {
    if (c.teacherId !== teacherId) return false;
    if (c.status !== STATUS.APPROVED) return false;
    const start = new Date(c.startTime);
    const end = new Date(c.endTime);
    return now >= start && now <= end;
  });
}

// ─── Approvals ───────────────────────────────────────────────────────────────

export async function mockGetPendingContent(token) {
  await randomDelay();
  const userId = resolveUserId(token);
  if (!userId) {
    const err = new Error('Unauthorised');
    err.status = 401;
    throw err;
  }
  return db.content
    .filter((c) => c.status === STATUS.PENDING)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function mockApproveContent(token, contentId) {
  await randomDelay();
  const userId = resolveUserId(token);
  if (!userId) {
    const err = new Error('Unauthorised');
    err.status = 401;
    throw err;
  }
  const item = db.content.find((c) => c.id === contentId);
  if (!item) {
    const err = new Error('Content not found');
    err.status = 404;
    throw err;
  }
  item.status = STATUS.APPROVED;
  item.rejectionReason = null;
  item.updatedAt = new Date().toISOString();
  return item;
}

export async function mockRejectContent(token, contentId, reason) {
  await randomDelay();
  const userId = resolveUserId(token);
  if (!userId) {
    const err = new Error('Unauthorised');
    err.status = 401;
    throw err;
  }
  const item = db.content.find((c) => c.id === contentId);
  if (!item) {
    const err = new Error('Content not found');
    err.status = 404;
    throw err;
  }
  item.status = STATUS.REJECTED;
  item.rejectionReason = reason;
  item.updatedAt = new Date().toISOString();
  return item;
}
