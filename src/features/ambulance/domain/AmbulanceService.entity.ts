/**
 * Entidad AmbulanceService - Servicio de ambulancia
 */
export interface AmbulanceService {
  id: string;
  name: string;
  address: string;
  phone: string;
  image: string;
  available24_7: boolean;
  sponsored?: boolean;
}

