import type { AmbulanceService } from '../domain/AmbulanceService.entity';
import { AmbulanceRepository } from '../infrastructure/ambulance-service.repository';

const ambulanceRepository = new AmbulanceRepository();

/**
 * Caso de uso: Obtener detalle de un servicio de ambulancia
 */
export const getAmbulanceUseCase = async (id: string): Promise<AmbulanceService> => {
  return await ambulanceRepository.getAmbulance(id);
};

