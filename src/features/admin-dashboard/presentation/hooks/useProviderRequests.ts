import { useQuery } from "@tanstack/react-query";
import { getRequestsUseCase } from "../../../admin-dashboard/application/get-requests.usecase";

export const useProviderRequests = (filters?: {
  status?: "all" | "PENDING" | "APPROVED" | "REJECTED";
  dateFrom?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['provider-requests-list', filters?.status || "all", filters?.dateFrom || "", filters?.page || 1, filters?.limit || 20],
    queryFn: () => getRequestsUseCase(filters),
    staleTime: 1000 * 60 * 5,
  });
};