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
  profile_picture_url?: string | null;
  imageUrl?: string | null;
  preview_images?: string[];
};

const mapBackendToFrontend = (data: BackendAmbulanceProfile): AmbulanceProfile => {
  const logo = (data.profile_picture_url ?? data.logoUrl ?? (data as any).logourl ?? null) as string | null;
  const banner = data.imageUrl ?? data.bannerUrl ?? logo ?? '';

  return {
    id: data.id,
    bannerUrl: banner,
    logoUrl: logo,
    profile_picture_url: data.profile_picture_url ?? logo,
    previewImages: data.preview_images ?? [],
    commercialName: data.name ?? '',
    shortDescription: data.description ?? '',
    address: data.address ?? '',
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    google_maps_url: (data as any).google_maps_url ?? null,
    whatsappContact: data.whatsapp ?? '',
    emergencyPhone: data.phone ?? '',
    isActive: data.isActive ?? true,
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
  const payload: any = {
    name: profile.commercialName,
    description: profile.shortDescription,
    phone: profile.emergencyPhone,
    whatsapp: profile.whatsappContact,
    address: profile.address,
    latitude: profile.latitude,
    longitude: profile.longitude,
    google_maps_url: profile.google_maps_url,
    is_active: profile.isActive,
  };

  // Enviar imagen como base64 si es nueva (el backend la sube a Cloudinary)
  if (profile.bannerUrl) {
    payload.imageUrl = profile.bannerUrl;
  }

  // Enviar profile_picture_url (logo) si se provee
  if (profile.profile_picture_url !== undefined) {
    payload.profile_picture_url = profile.profile_picture_url;
  }

  // Enviar preview_images (galería) si se provee
  if (profile.previewImages !== undefined) {
    payload.preview_images = profile.previewImages;
  }

  const response = await httpClient.put<{ success: boolean; data: BackendAmbulanceProfile }>(
    '/ambulances/profile',
    payload
  );
  const data = extractData(response);
  return mapBackendToFrontend(data);
};
