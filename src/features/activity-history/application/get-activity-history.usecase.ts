import type { ActivityHistory } from "../domain/activity-history.entity";
import { getActivityHistoryMock } from "../infrastructure/activity.mock";

export const getActivityHistoryUseCase = async (): Promise<ActivityHistory[]> => {
  return await getActivityHistoryMock();
};