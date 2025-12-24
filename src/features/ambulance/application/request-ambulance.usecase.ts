import { requestAmbulanceAPI } from '../infrastructure/ambulance.api';
import type { AmbulanceRequest } from '../domain/AmbulanceRequest.entity';

export interface RequestAmbulanceDTO {
  patientName: string;
  phone: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  destination?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  urgency: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
}

export const requestAmbulanceUseCase = async (
  data: RequestAmbulanceDTO
): Promise<AmbulanceRequest> => {
  return await requestAmbulanceAPI(data);
};

