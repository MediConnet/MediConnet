import type { HomeContent } from '../domain/HomeContent.entity';
import { HomeRepository } from '../infrastructure/home.repository';

const homeRepository = new HomeRepository();

/**
 */
export const getHomeContentUseCase = async (): Promise<HomeContent> => {
  return await homeRepository.getHomeContent();
};

