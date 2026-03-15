import { httpClient, extractData } from '../../../shared/lib/http';
import type { AmbulanceProfile } from '../domain/ambulance-profile.entity';

type BackendAmbulanceProfile = {
  id: string;
  name?: string | null;
  description?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  email?: string | null;
  rating?: number | null;
  totalTrips?: number | null;
  logoUrl?: string | null;
  // A veces puede venir con otras variantes por inconsistencias
  logourl?: string | null;
  bannerUrl?: string | null;
  isActive?: boolean | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  google_maps_url?: string | null;
  status?: string | null;
};

const mapBackendToFrontend = (data: BackendAmbulanceProfile): AmbulanceProfile => {
  const logo = (data.logoUrl ?? (data as any).logourl ?? null) as string | null;

  return {
    id: data.id,
    // El frontend usa bannerUrl como imagen de portada; si backend no tiene banner, usamos logo como fallback
    bannerUrl: data.bannerUrl ?? logo ?? '',
    commercialName: data.name ?? '',
    shortDescription: data.description ?? '',
    address: data.address ?? '',
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    google_maps_url: (data as any).google_maps_url ?? null,
    whatsappContact: data.whatsapp ?? '',
    emergencyPhone: data.phone ?? '',
    isActive: data.isActive ?? true,
    // KPIs: el backend hoy no los manda; inicializamos en 0 y usamos rating como averageRating
    stats: {
      profileViews: 0,
      contactClicks: 0,
      averageRating: data.rating ?? 0,
      totalReviews: 0,
    },
  };
};

/**
 * API: Obtener perfil de ambulancia
 * Endpoint: GET /api/ambulances/profile
 */
export const getAmbulanceProfileAPI = async (): Promise<AmbulanceProfile> => {
  const response = await httpClient.get<{ success: boolean; data: BackendAmbulanceProfile }>(
    '/ambulances/profile'
  );
  const data = extractData(response);
  return mapBackendToFrontend(data);
};

/**
 * API: Actualizar perfil de ambulancia
 * Endpoint: PUT /api/ambulances/profile
 */
export const updateAmbulanceProfileAPI = async (
  profile: Partial<AmbulanceProfile>
): Promise<AmbulanceProfile> => {
  const response = await httpClient.put<{ success: boolean; data: BackendAmbulanceProfile }>(
    '/ambulances/profile',
    profile
  );
  const data = extractData(response);
  return mapBackendToFrontend(data);
};
