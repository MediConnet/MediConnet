/**
 * Entidad Review - Reseña de tienda de insumos
 */
export interface Review {
  id: string;
  supplyStoreId?: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

