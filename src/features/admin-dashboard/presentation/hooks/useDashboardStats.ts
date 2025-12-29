import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsUseCase } from "../../application/get-stats.usecase";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: getDashboardStatsUseCase
  });
};