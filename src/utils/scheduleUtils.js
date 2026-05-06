import { SCHEDULE_STATUS } from './constants';

/**
 * Returns true if the current time falls between start and end.
 * Pure function — no side effects, easily testable.
 */
export function isActive(start, end) {
  if (!start || !end) return false;
  const now = Date.now();
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  return now >= startMs && now <= endMs;
}

/**
 * Returns true if the broadcast hasn't started yet.
 */
export function isScheduled(start) {
  if (!start) return false;
  return Date.now() < new Date(start).getTime();
}

/**
 * Returns true if the broadcast has already ended.
 */
export function isExpired(end) {
  if (!end) return false;
  return Date.now() > new Date(end).getTime();
}

/**
 * Derives the schedule status label from start/end times.
 * Returns one of SCHEDULE_STATUS values.
 */
export function getScheduleStatus(start, end) {
  if (isActive(start, end)) return SCHEDULE_STATUS.ACTIVE;
  if (isScheduled(start)) return SCHEDULE_STATUS.SCHEDULED;
  return SCHEDULE_STATUS.EXPIRED;
}
