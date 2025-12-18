import { Doctor } from './Doctor.entity';
import { Availability } from './Availability.entity';

/**
 * Regla de negocio: Verificar si se puede reservar un doctor
 */
export const canBookDoctor = (
  doctor: Doctor,
  availability: Availability
): { canBook: boolean; reason?: string } => {
  if (!availability.isAvailable) {
    return { canBook: false, reason: 'El horario no está disponible' };
  }

  if (new Date(availability.date) < new Date()) {
    return { canBook: false, reason: 'La fecha ya pasó' };
  }

  return { canBook: true };
};





