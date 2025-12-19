/**
 * Entidad FeaturedService - Servicios destacados
 */
export interface FeaturedService {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  rating: number;
  totalReviews: number;
  category: 'doctor' | 'pharmacy' | 'laboratory' | 'ambulance';
  location: {
    address: string;
    city: string;
  };
  isPremium: boolean;
  order: number; // Orden de visualización
}

