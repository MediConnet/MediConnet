/**
 * Entidad PharmacyBranch - Sucursal de farmacia
 */
export interface PharmacyBranch {
  id: string;
  pharmacyId: string;
  name: string;
  address: string;
  phone: string;
  schedule: string; // Ej: "Lun-Dom 8:30-21:00"
  latitude?: number;
  longitude?: number;
  image?: string;
  hasDelivery: boolean;
  rating?: number;
  totalReviews?: number;
}

