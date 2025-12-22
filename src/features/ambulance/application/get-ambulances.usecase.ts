import type { AmbulanceService } from '../domain/AmbulanceService.entity';
import { AmbulanceRepository } from '../infrastructure/ambulance-service.repository';

const ambulanceRepository = new AmbulanceRepository();

/**
 * Caso de uso: Obtener lista de servicios de ambulancias
 */
export const getAmbulancesUseCase = async (): Promise<AmbulanceService[]> => {
  return await ambulanceRepository.getAmbulances();
};

