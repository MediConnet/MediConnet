import { Feature } from '../domain/Feature.entity';
import { HomeRepository } from '../infrastructure/home.repository';

const homeRepository = new HomeRepository();

/**
 * Caso de uso: Obtener características de la plataforma
 */
export const getFeaturesUseCase = async (): Promise<Feature[]> => {
  return await homeRepository.getFeatures();
};

