import type { AmbulanceStatus } from './AmbulanceStatus.enum';

/**
 * Entidad AmbulanceRequest
 */
export interface AmbulanceRequest {
  id: string;
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
  status: AmbulanceStatus;
  notes?: string;
  createdAt: Date;
  estimatedArrival?: Date;
}





