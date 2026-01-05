import { useQuery } from "@tanstack/react-query";
import { getRequestsUseCase } from "../../../admin-dashboard/application/get-requests.usecase";

export const useProviderRequests = () => {
  return useQuery({
    queryKey: ['provider-requests-list'],
    queryFn: getRequestsUseCase,
    staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
  });
};