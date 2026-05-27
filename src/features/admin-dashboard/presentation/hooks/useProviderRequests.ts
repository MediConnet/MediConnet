import { useQuery } from "@tanstack/react-query";
import { getRequestsUseCase } from "../../../admin-dashboard/application/get-requests.usecase";

export const useProviderRequests = (filters?: {
  status?: "all" | "PENDING" | "APPROVED" | "REJECTED";
  dateFrom?: string;
}) => {
  return useQuery({
    queryKey: ['provider-requests-list', filters?.status || "all", filters?.dateFrom || ""],
    queryFn: () => getRequestsUseCase(filters),
    staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
  });
};