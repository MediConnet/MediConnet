/**
 * Parsea una coordenada en cualquier formato a número decimal.
 *
 * Acepta:
 *  - Decimal simple:        "-0.23524"  →  -0.23524
 *  - Con coma decimal:      "0,23524"   →  0.23524
 *  - Con símbolo y letra:   "0,23524° S" → -0.23524
 *  - Formato completo:      "0,23524° S, 79,18234° O" → lat=-0.23524, lng=-79.18234
 */
export function parseCoordinate(value: string): number | null {
  if (!value || value.trim() === '') return null;

  // Reemplazar coma decimal por punto
  let clean = value.trim().replace(',', '.');

  // Extraer el número
  const numMatch = clean.match(/-?\d+\.?\d*/);
  if (!numMatch) return null;

  let num = parseFloat(numMatch[0]);
  if (isNaN(num)) return null;

  // Si tiene S (Sur) u O/W (Oeste), el número es negativo
  const upper = clean.toUpperCase();
  if (upper.includes('S') || upper.includes('O') || upper.includes('W')) {
    num = -Math.abs(num);
  }

  return num;
}

/**
 * Parsea una cadena que puede contener lat y lng juntos.
 * Ej: "0,23524° S, 79,18234° O"
 * Retorna { lat, lng } o null si no se puede parsear.
 */
export function parseCoordinatePair(value: string): { lat: number; lng: number } | null {
  // Intentar separar por coma que divide lat y lng (no la coma decimal)
  // Formato: "0,23524° S, 79,18234° O"
  const parts = value.split(/(?<=°\s*[NSEWnsew]?)\s*,\s*/);

  if (parts.length === 2) {
    const lat = parseCoordinate(parts[0]);
    const lng = parseCoordinate(parts[1]);
    if (lat !== null && lng !== null) return { lat, lng };
  }

  return null;
}
