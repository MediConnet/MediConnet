/**
 * Entidad Review - Reseña de laboratorio
 */
export interface Review {
  id: string;
  laboratoryId?: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

