import type { ActiveService } from "../domain/service-stats.entity";
import { getActiveServicesAPI } from "../infrastructure/dashboard.api";

export const getActiveServicesUseCase = async (): Promise<ActiveService[]> => {
  return await getActiveServicesAPI();
};
