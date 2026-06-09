import { isAxiosError, type AxiosError } from 'axios';
/** Mensajes genéricos mostrados al usuario final (nunca técnicos). */
export const USER_MESSAGES = {
  generic: 'No fue posible completar la operación. Intenta nuevamente.',
  load: 'No fue posible cargar la información.',
  empty: 'No hay información disponible.',
  save: 'No fue posible guardar los cambios.',
  network: 'No hay conexión con el servidor. Verifica tu internet e intenta de nuevo.',
  session: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
  forbidden: 'No tienes permiso para realizar esta acción.',
  server: 'El servicio no está disponible en este momento. Intenta más tarde.',
} as const;

const TECHNICAL_PATTERNS = [
  /typeerror/i,
  /referenceerror/i,
  /syntaxerror/i,
  /is not a function/i,
  /is not iterable/i,
  /cannot read propert/i,
  /cannot destructure/i,
  /undefined is not/i,
  /null is not/i,
  /\.map is not a function/i,
  /\.filter is not a function/i,
  /\.forEach is not a function/i,
  /network error/i,
  /request failed with status/i,
  /axios/i,
  /at\s+\w+\s+\(/i,
  /stack:/i,
  /\[object object\]/i,
];

export function isTechnicalMessage(message: string): boolean {
  const trimmed = message.trim();
  if (!trimmed || trimmed.length > 280) return true;
  return TECHNICAL_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function extractRawMessage(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === 'string') return error;
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (typeof data?.message === 'string') return data.message;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return undefined;
}

export interface UserMessageOptions {
  fallback?: string;
  /** Si true, mensajes del backend no técnicos se muestran al usuario (ej. login). */
  allowBackendMessage?: boolean;
}

/**
 * Mensaje seguro para UI. Los detalles técnicos deben ir solo a consola vía logApiError.
 */
export function getUserFriendlyMessage(
  error: unknown,
  options: UserMessageOptions = {},
): string {
  const fallback = options.fallback ?? USER_MESSAGES.generic;
  const raw = extractRawMessage(error);

  if (options.allowBackendMessage && raw && !isTechnicalMessage(raw)) {
    return raw;
  }

  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401) return USER_MESSAGES.session;
    if (status === 403) return USER_MESSAGES.forbidden;
    if (status === 404) return USER_MESSAGES.empty;
    if (status != null && status >= 500) return USER_MESSAGES.server;
    if (!error.response) return USER_MESSAGES.network;
    if (raw && !isTechnicalMessage(raw)) return raw;
  }

  if (raw && !isTechnicalMessage(raw)) {
    return raw;
  }

  return fallback;
}

/**
 * Registra el error completo en consola (desarrolladores).
 */
export function logApiError(scope: string, error: unknown, extra?: Record<string, unknown>): void {
  const prefix = `[${scope}]`;

  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; errors?: unknown }>;
    console.error(`${prefix} Request failed`, {
      url: axiosError.config?.url,
      method: axiosError.config?.method,
      status: axiosError.response?.status,
      responseMessage: axiosError.response?.data?.message,
      responseData: axiosError.response?.data,
      message: axiosError.message,
      stack: axiosError.stack,
      ...extra,
    });
    return;
  }

  if (error instanceof Error) {
    console.error(`${prefix} ${error.message}`, { stack: error.stack, ...extra });
    return;
  }

  console.error(`${prefix} Unknown error`, { error, ...extra });
}

export function sanitizeErrorForUi(
  scope: string,
  error: unknown,
  options?: UserMessageOptions,
): { userMessage: string } {
  logApiError(scope, error);
  return { userMessage: getUserFriendlyMessage(error, options) };
}
