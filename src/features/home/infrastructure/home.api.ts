import { httpClient, extractData } from '../../../shared/lib/http';
import { ROUTES } from '../../../app/config/constants';
import type { Feature } from '../domain/Feature.entity';
import type { FeaturedService } from '../domain/FeaturedService.entity';
import type { HomeContent } from '../domain/HomeContent.entity';
import type { ServiceCategory } from '../domain/ServiceCategory.entity';

/**
 * API: Obtener contenido principal de la página home
 * Endpoint: GET /api/home/content
 */
export const getHomeContentAPI = async (): Promise<HomeContent> => {
  const response = await httpClient.get<{ success: boolean; data: HomeContent }>(
    '/home/content'
  );
  return extractData(response);
};

/**
 * API: Obtener características de la plataforma
 * Endpoint: GET /api/home/features
 */
export const getFeaturesAPI = async (): Promise<Feature[]> => {
  const response = await httpClient.get<{ success: boolean; data: Feature[] }>(
    '/home/features'
  );
  return extractData(response);
};

/**
 * API: Obtener servicios destacados
 * Endpoint: GET /api/home/featured-services
 */
export const getFeaturedServicesAPI = async (): Promise<FeaturedService[]> => {
  const response = await httpClient.get<{ success: boolean; data: FeaturedService[] }>(
    '/home/featured-services'
  );
  return extractData(response);
};

/**
 * API: Obtener catálogo de servicios
 * Endpoint: GET /api/home/service-categories
 * Nota: Este endpoint puede no existir en el backend, por lo que retorna datos estáticos
 */
export const getServiceCategoriesAPI = async (): Promise<ServiceCategory[]> => {
  try {
    const response = await httpClient.get<{ success: boolean; data: ServiceCategory[] }>(
      '/home/service-categories'
    );
    return extractData(response);
  } catch {
    return [];
  }
};
