import type { ActiveService } from "../domain/service-stats.entity";
import { getActiveServicesAPI } from "../infrastructure/dashboard.api";
import type { PaginatedResponse } from "../../../shared/types/pagination";

export const getActiveServicesUseCase = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}): Promise<PaginatedResponse<ActiveService>> => {
  return await getActiveServicesAPI(params);
};
