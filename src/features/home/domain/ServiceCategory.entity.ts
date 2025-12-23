/**
 * Entidad ServiceCategory
 * Representa las tarjetas de servicios (Médicos, Farmacias, etc.)
 */
export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;       // Nombre del ícono para el IconMapper
  route: string;      // A dónde navega al dar click
  color: string;      // Color de fondo (ej: #2563eb)
  shadowColor: string; // Color para la sombra (ej: rgba(37, 99, 235, 0.3))
}