/**
 * Entidad Review - Reseña de servicio de ambulancia
 */
export interface Review {
  id: string;
  ambulanceId?: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

