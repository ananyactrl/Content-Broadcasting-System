import { z } from 'zod';
import { FILE_LIMITS } from './constants';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const uploadSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(120, 'Title must be under 120 characters'),
    subject: z.string().min(1, 'Subject is required'),
    description: z.string().max(500, 'Description must be under 500 characters').optional(),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    rotationDuration: z
      .union([z.number().int().positive('Must be a positive integer'), z.nan(), z.undefined()])
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      return new Date(data.endTime) > new Date(data.startTime);
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  );

export const rejectSchema = z.object({
  reason: z
    .string()
    .min(10, 'Rejection reason must be at least 10 characters')
    .max(500, 'Rejection reason must be under 500 characters'),
});

/**
 * Validates a File object against the platform's file rules.
 * Returns an error string or null.
 */
export function validateFile(file) {
  if (!file) return 'File is required';
  if (!FILE_LIMITS.ACCEPTED_TYPES.includes(file.type)) {
    return `Only ${FILE_LIMITS.ACCEPTED_LABEL} files are allowed`;
  }
  if (file.size > FILE_LIMITS.MAX_SIZE_BYTES) {
    return `File size must not exceed ${FILE_LIMITS.MAX_SIZE_LABEL}`;
  }
  return null;
}
