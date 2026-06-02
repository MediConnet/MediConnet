import { createLogger } from "../../../shared/lib/logger";
import { ensureArray } from "../../../shared/lib/normalize";
import { extractPaginatedItems } from "../../../shared/types/pagination";

const listLog = createLogger("ClinicAssociatedList");

/**
 * Normaliza respuestas del backend de clínica-asociado a un array tipado.
 * El API suele devolver `{ data: T[], pagination }`; los hooks no deben asignar el objeto completo.
 */
export function normalizeClinicAssociatedList<T>(
  payload: unknown,
  mapItem: (raw: Record<string, unknown>) => T,
  context: string,
): T[] {
  if (import.meta.env.DEV && payload != null && !Array.isArray(payload)) {
    listLog.debug(`${context}: payload no es array directo`, {
      type: typeof payload,
      isArray: Array.isArray(payload),
      hasDataKey:
        typeof payload === "object" && payload !== null && "data" in payload,
      dataIsArray:
        typeof payload === "object" &&
        payload !== null &&
        "data" in payload &&
        Array.isArray((payload as { data: unknown }).data),
      hasPagination:
        typeof payload === "object" &&
        payload !== null &&
        "pagination" in payload,
    });
  }

  const raws = extractPaginatedItems<Record<string, unknown>>(payload);
  return raws.map(mapItem);
}

export { ensureArray } from "../../../shared/lib/normalize";
