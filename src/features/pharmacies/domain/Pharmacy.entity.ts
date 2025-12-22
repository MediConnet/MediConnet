/**
 * Entidad Pharmacy - Farmacia
 */
export interface Pharmacy {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  totalBranches: number;
  rating?: number;
  totalReviews?: number;
}

