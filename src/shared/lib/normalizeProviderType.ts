/** Canonical provider type for clinic administrators (auth, routes, menus). */
export const CLINICS_PROVIDER_TYPE = "clinics" as const;

// Legacy values from backend/JWT/localStorage before unification.
const CLINIC_PROVIDER_ALIASES = new Set([
  "clinic",
  "clinica",
  "clinics",
  "clínica",
]);

/**
 * Normalizes provider `tipo` / `serviceType` for auth, routing and navigation.
 * Maps legacy clinic variants (clinica, clinic, etc.) to `clinics`.
 */
export function normalizeProviderType(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  const key = value.trim().toLowerCase();
  if (CLINIC_PROVIDER_ALIASES.has(key)) return CLINICS_PROVIDER_TYPE;
  if (key === "lab") return "laboratory";
  if (key === "estetica" || key === "centro_estetico" || key === "aesthetic") return "aesthetic";
  return key;
}

export function isClinicsProviderType(value: string | null | undefined): boolean {
  return normalizeProviderType(value) === CLINICS_PROVIDER_TYPE;
}
