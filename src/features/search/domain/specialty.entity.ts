import type { ReactNode } from 'react';

/**
 * Representa una especialidad médica en el sistema.
 * Actualizado: 'icon' ahora recibe un ReactNode para usar íconos de librerías (MUI).
 */
export interface Specialty {
  id: string;
  name: string;
  icon: ReactNode; 
  colorClass: string; 
}