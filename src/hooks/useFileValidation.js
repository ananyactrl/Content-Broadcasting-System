/**
 * useFileValidation — validates a File object against platform rules.
 *
 * Returns { error, validate } where validate(file) sets the error state.
 * Designed to be called on file select so errors surface immediately,
 * before the user attempts to submit the form.
 */

import { useState, useCallback } from 'react';
import { validateFile } from '@/src/utils/validators';

export function useFileValidation() {
  const [error, setError] = useState(null);

  const validate = useCallback((file) => {
    const err = validateFile(file);
    setError(err);
    return err === null; // returns true if valid
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { error, validate, clearError };
}
