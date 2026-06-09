import type { ActivityHistory } from "../domain/activity-history.entity";
import type { PaginatedResponse } from "../../../shared/types/pagination";
import { getActivityHistoryAPI } from "../infrastructure/dashboard.api";

export const getActivityHistoryUseCase = async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<ActivityHistory>> => {
  return await getActivityHistoryAPI(params);
};
