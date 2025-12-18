import { httpClient } from '../../../shared/lib/http';
import { AmbulanceRequest } from '../domain/AmbulanceRequest.entity';
import { RequestAmbulanceDTO } from '../application/request-ambulance.usecase';

export const requestAmbulanceAPI = async (
  data: RequestAmbulanceDTO
): Promise<AmbulanceRequest> => {
  const response = await httpClient.post<AmbulanceRequest>(
    '/ambulance/request',
    data
  );
  return response.data;
};

export const trackAmbulanceAPI = async (
  requestId: string
): Promise<AmbulanceRequest> => {
  const response = await httpClient.get<AmbulanceRequest>(
    `/ambulance/track/${requestId}`
  );
  return response.data;
};

export const cancelAmbulanceAPI = async (
  requestId: string
): Promise<void> => {
  await httpClient.delete(`/ambulance/request/${requestId}`);
};





