import type { Laboratory } from '../domain/laboratory.model';
import { LaboratoryRepository } from '../infrastructure/laboratory.repository';

const laboratoryRepository = new LaboratoryRepository();

/**
 * Caso de uso: Obtener lista de laboratorios
 */
export const getLaboratoriesUseCase = async (): Promise<Laboratory[]> => {
  return await laboratoryRepository.getLaboratories();
};

