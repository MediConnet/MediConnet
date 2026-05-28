import { useQuery } from "@tanstack/react-query";
import { getHistoryUseCase } from "../../application/get-history.usecase";

export const useHistoryRequests = (params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['provider-history-list', params?.status || '', params?.page || 1, params?.limit || 20, params?.search || ''],
    queryFn: () => getHistoryUseCase(params),
    staleTime: 1000 * 60 * 5,
  });
};
