import { useQuery } from '@tanstack/react-query';
import { httpClient, extractData } from '../../../shared/lib/http';

export interface PublicDoctorsFilters {
  q?: string;
  search?: string; // Backend soporta ambos
  specialtyId?: string;
  city?: string; // Backend usa 'city' no 'cityId'
  page?: number;
  limit?: number;
}

export interface PublicDoctor {
  id: string;
  name: string;
  specialty: string | string[];
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  consultationFee?: number;
  rating?: number;
  totalReviews?: number;
  profilePictureUrl?: string;
  isVerified?: boolean;
}

export interface PublicDoctorsResponse {
  doctors: PublicDoctor[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Respuesta del backend (usa 'pagination')
interface BackendDoctorsResponse {
  doctors: PublicDoctor[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Hook: Obtener lista de médicos públicos (búsqueda)
 * Ideal para páginas de búsqueda y listados
 */
export const usePublicDoctors = (filters?: PublicDoctorsFilters) => {
  return useQuery<PublicDoctorsResponse>({
    queryKey: ['public', 'doctors', filters],
    queryFn: async () => {
      const response = await httpClient.get<{ success: boolean; data: BackendDoctorsResponse }>(
        '/public/doctors',
        { params: filters }
      );
      const data = extractData(response);
      // Normalizar pagination a meta para compatibilidad
      return {
        doctors: data.doctors || [],
        meta: data.pagination || data.meta || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutos - datos de búsqueda
    enabled: true, // Siempre habilitado (público)
  });
};

/**
 * Hook: Obtener detalle de un médico público
 */
export const usePublicDoctor = (doctorId: string | null) => {
  return useQuery<PublicDoctor>({
    queryKey: ['public', 'doctors', doctorId],
    queryFn: async () => {
      if (!doctorId) throw new Error('Doctor ID is required');
      const response = await httpClient.get<{ success: boolean; data: PublicDoctor }>(
        `/public/doctors/${doctorId}`
      );
      return extractData(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!doctorId,
  });
};
