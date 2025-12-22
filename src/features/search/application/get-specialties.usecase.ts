import { Specialty } from '../domain/specialty.entity';
import { MOCK_SPECIALTIES } from '../infrastructure/specialties.mock';

/**
 * Caso de uso para obtener el listado de especialidades.
 * Actualmente devuelve datos mockeados con un pequeño delay simulado.
 */
export const getSpecialtiesUseCase = async (): Promise<Specialty[]> => {
  
  return MOCK_SPECIALTIES;
}