/**
 * Entidad Feature - Características de la plataforma
 */
export interface Feature {
  id: string;
  icon: string; // Nombre del ícono de Material UI
  title: string;
  description: string;
  order: number; // Orden de visualización
}

