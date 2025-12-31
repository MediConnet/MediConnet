import { getSupplyDashboardAPI } from "../infrastructure/supplies.repository";
import type { SupplyDashboard } from "../domain/SupplyDashboard.entity";

export const getSupplyDashboardUseCase = async (userId: string): Promise<SupplyDashboard> => {
  return await getSupplyDashboardAPI(userId);
};

