import type { HomeContent } from '../domain/HomeContent.entity';
import type { Feature } from '../domain/Feature.entity';
import type { FeaturedService } from '../domain/FeaturedService.entity';
import {
  getHomeContentAPI,
  getFeaturesAPI,
  getFeaturedServicesAPI,
} from './home.api';

/**
 * Repository pattern para Home
 * Abstrae la lógica de acceso a datos
 */
export class HomeRepository {
  async getHomeContent(): Promise<HomeContent> {
    return await getHomeContentAPI();
  }

  async getFeatures(): Promise<Feature[]> {
    return await getFeaturesAPI();
  }

  async getFeaturedServices(): Promise<FeaturedService[]> {
    return await getFeaturedServicesAPI();
  }
}

