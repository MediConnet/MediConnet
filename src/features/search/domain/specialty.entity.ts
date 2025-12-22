/**
 * Representa una especialidad médica en el sistema.
 * Usamos clases de Tailwind para los colores por practicidad en el frontend.
 */
export interface Specialty {
  id: string;
  name: string;
  icon: string; // Por ahora usaremos emojis, luego pueden ser SVGs o URLs
  colorClass: string; 
}