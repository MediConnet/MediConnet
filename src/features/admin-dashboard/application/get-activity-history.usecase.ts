import type { ActivityHistory } from "../domain/activity-history.entity";
import { getActivityHistoryAPI } from "../infrastructure/dashboard.api";

export const getActivityHistoryUseCase = async (): Promise<ActivityHistory[]> => {
  return await getActivityHistoryAPI();
};