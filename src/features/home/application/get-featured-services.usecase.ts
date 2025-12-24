import type { FeaturedService } from '../domain/FeaturedService.entity';
import { HomeRepository } from '../infrastructure/home.repository';

const homeRepository = new HomeRepository();

/**
 * Caso de uso: Obtener servicios destacados
 */
export const getFeaturedServicesUseCase = async (): Promise<FeaturedService[]> => {
  return await homeRepository.getFeaturedServices();
};

