import { useCallback, useState } from 'react';
import { getUserFriendlyMessage, logApiError, type UserMessageOptions } from '../lib/api-error';

/**
 * Estado de error seguro para UI + logging en consola.
 */
export function useApiErrorHandler(defaultFallback?: string) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleError = useCallback(
    (scope: string, error: unknown, options?: UserMessageOptions) => {
      logApiError(scope, error);
      setErrorMessage(
        getUserFriendlyMessage(error, {
          fallback: defaultFallback,
          ...options,
        }),
      );
    },
    [defaultFallback],
  );

  const clearError = useCallback(() => setErrorMessage(null), []);

  return { errorMessage, setErrorMessage, handleError, clearError };
}
