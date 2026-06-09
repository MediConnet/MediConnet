import { extractPaginatedItems } from '../types/pagination';

/**
 * Garantiza que un valor desconocido sea un array (evita `.map is not a function`).
 */
export function ensureArray<T>(value: unknown): T[] {
  return extractPaginatedItems<T>(value);
}

/**
 * Garantiza un objeto plano; devuelve fallback si el valor no es objeto.
 */
export function ensureObject<T extends Record<string, unknown>>(
  value: unknown,
  fallback: T,
): T {
  if (value != null && typeof value === 'object' && !Array.isArray(value)) {
    return value as T;
  }
  return fallback;
}

/**
 * Garantiza string no vacío o devuelve fallback.
 */
export function ensureString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}
