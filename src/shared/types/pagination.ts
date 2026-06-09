export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export { ensureArray } from '../lib/normalize';

/**
 * Extrae el array de ítems de una respuesta paginada o de un array directo.
 * Evita errores cuando un hook asigna el objeto completo en lugar de `data`.
 */
export function extractPaginatedItems<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload != null && typeof payload === "object" && "data" in payload) {
    const inner = (payload as PaginatedResponse<T>).data;
    if (Array.isArray(inner)) {
      return inner;
    }
  }
  return [];
}
