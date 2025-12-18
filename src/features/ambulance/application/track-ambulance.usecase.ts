import { trackAmbulanceAPI } from '../infrastructure/ambulance.api';
import { AmbulanceRequest } from '../domain/AmbulanceRequest.entity';

export const trackAmbulanceUseCase = async (
  requestId: string
): Promise<AmbulanceRequest> => {
  return await trackAmbulanceAPI(requestId);
};

