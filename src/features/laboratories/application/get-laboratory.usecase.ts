import type { Laboratory } from '../domain/laboratory.model';
import { LaboratoryRepository } from '../infrastructure/laboratory.repository';

const laboratoryRepository = new LaboratoryRepository();

/**
 * Caso de uso: Obtener detalle de un laboratorio
 */
export const getLaboratoryUseCase = async (id: string): Promise<Laboratory> => {
  return await laboratoryRepository.getLaboratory(id);
};

