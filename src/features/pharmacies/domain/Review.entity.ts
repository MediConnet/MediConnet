/**
 * Entidad Review - Reseña de farmacia/sucursal
 */
export interface Review {
  id: string;
  pharmacyId?: string;
  branchId?: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

