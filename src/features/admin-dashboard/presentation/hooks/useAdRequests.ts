import { useQuery } from "@tanstack/react-query";
import { getAdRequestsUseCase } from "../../application/get-ad-requests.usecase";

export const useAdRequests = (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['ad-requests-list', params?.status || 'PENDING', params?.page || 1, params?.limit || 20],
    queryFn: () => getAdRequestsUseCase(params),
    staleTime: 1000 * 60 * 5,
  });
};

