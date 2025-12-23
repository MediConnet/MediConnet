import type { ServiceCategory } from '../domain/ServiceCategory.entity';
import { HomeRepository } from '../infrastructure/home.repository';

const homeRepository = new HomeRepository();

/**
 * Caso de uso: Obtener el catálogo de categorías de servicios
 */
export const getServiceCategoriesUseCase = async (): Promise<ServiceCategory[]> => {
  return await homeRepository.getServiceCategories();
};