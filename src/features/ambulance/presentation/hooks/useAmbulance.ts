import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  requestAmbulanceUseCase,
  RequestAmbulanceDTO,
} from '../../application/request-ambulance.usecase';
import { trackAmbulanceUseCase } from '../../application/track-ambulance.usecase';
import { AmbulanceRequest } from '../../domain/AmbulanceRequest.entity';
import { cancelAmbulanceAPI } from '../../infrastructure/ambulance.api';

export const useRequestAmbulance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestAmbulanceDTO) => requestAmbulanceUseCase(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['ambulance', data.id], data);
    },
  });
};

export const useTrackAmbulance = (requestId: string) => {
  return useQuery<AmbulanceRequest>({
    queryKey: ['ambulance', requestId],
    queryFn: () => trackAmbulanceUseCase(requestId),
    enabled: !!requestId,
    refetchInterval: 5000, // Refrescar cada 5 segundos
  });
};

export const useCancelAmbulance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => cancelAmbulanceAPI(requestId),
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({ queryKey: ['ambulance', requestId] });
    },
  });
};





