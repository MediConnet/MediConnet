import type { DashboardStats } from "../domain/dashboard-stats.entity";
import { getDashboardStatsAPI } from "../infrastructure/dashboard.api";

export const getDashboardStatsUseCase = async (): Promise<DashboardStats> => {
  return await getDashboardStatsAPI();
};