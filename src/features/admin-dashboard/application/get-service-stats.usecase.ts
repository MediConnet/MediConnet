import type { ServiceStats } from "../domain/service-stats.entity";
import { getServiceStatsMock } from "../infrastructure/stats.mock";

// En el futuro, aquí podríamos cambiar a una llamada real a API
export const getServiceStatsUseCase = async (): Promise<ServiceStats> => {
  return await getServiceStatsMock();
};