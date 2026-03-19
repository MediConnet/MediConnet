import { httpClient, extractData } from '../../../shared/lib/http';
import type { PharmacyProfile, WorkSchedule } from '../domain/pharmacy-profile.entity';
import type { PharmacyBranch } from '../domain/pharmacy-branch.entity';
import type { PharmacyReview } from '../domain/pharmacy-review.entity';

// ⭐ Interfaz para la respuesta del backend
// ⚠️ Nota: El backend puede variar nombres de campos (snake_case/camelCase o nested chain).
// Usamos un tipo flexible y normalizamos en el mapper.
type BackendPharmacyProfile = {
  id: string;
  // Nombres posibles de "nombre comercial"
  full_name?: string;
  fullName?: string;
  commercial_name?: string;
  commercialName?: string;
  name?: string;

  profile_picture_url?: string | null;
  profilePictureUrl?: string | null;

  ruc?: string;
  description?: string;
  website_url?: string;
  websiteUrl?: string;
  address?: string;
  status?: "draft" | "published" | "suspended" | string;
  whatsapp?: string;

  chain_id?: string | null;
  chainId?: string | null;
  is_chain_member?: boolean;
  isChainMember?: boolean;
  chain_name?: string;
  chainName?: string;
  chain_logo?: string;
  chainLogo?: string;
  chain_description?: string;
  chainDescription?: string;
  chain?: {
    id?: string;
    name?: string;
    logoUrl?: string;
    logo_url?: string;
    description?: string;
  };

  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  latitude?: number | null;
  longitude?: number | null;
  google_maps_url?: string | null;

  schedule?: WorkSchedule[];
  schedules?: Array<{
    day_id?: number;
    day?: string;
    start?: any;
    end?: any;
    is_active?: boolean;
  }>;
  stats?: {
    profile_views?: number;
    contact_clicks?: number;
    total_reviews?: number;
    average_rating?: number;
    profileViews?: number;
    contactClicks?: number;
    totalReviews?: number;
    averageRating?: number;
  };

  is_active?: boolean;
  isActive?: boolean;
};

// ⭐ Función para mapear la respuesta del backend al formato del frontend
const mapBackendToFrontend = (backend: BackendPharmacyProfile): PharmacyProfile => {
  const chainId =
    backend.chain_id ??
    backend.chainId ??
    backend.chain?.id ??
    undefined;

  const chainName =
    backend.chain_name ??
    backend.chainName ??
    backend.chain?.name ??
    undefined;

  const chainLogo =
    backend.chain_logo ??
    backend.chainLogo ??
    backend.chain?.logoUrl ??
    backend.chain?.logo_url ??
    undefined;

  const chainDescription =
    backend.chain_description ??
    backend.chainDescription ??
    backend.chain?.description ??
    undefined;

  const isChainMember =
    backend.is_chain_member === true ||
    backend.isChainMember === true ||
    !!chainId ||
    !!chainName;

  const commercialName =
    backend.full_name ??
    backend.fullName ??
    backend.commercial_name ??
    backend.commercialName ??
    backend.name ??
    "";

  const profilePicture =
    backend.profile_picture_url ??
    backend.profilePictureUrl ??
    "";

  const stats = backend.stats ?? {};

  return {
    id: backend.id,
    commercialName,
    logoUrl: chainLogo || profilePicture || "",
    ruc: backend.ruc || "",
    description: chainDescription || backend.description || "",
    websiteUrl: backend.website_url ?? backend.websiteUrl ?? "",
    address: backend.address || "",
    status: (backend.status as any) || "draft",
    whatsapp: backend.whatsapp || "",
    chainId: chainId || undefined,

    isChainMember,
    chainName,
    chainLogo,
    chainDescription,

    location: backend.location ?? (
      backend.latitude && backend.longitude
        ? { latitude: backend.latitude, longitude: backend.longitude, address: backend.address || '' }
        : undefined
    ),
    latitude: backend.latitude ?? backend.location?.latitude ?? null,
    longitude: backend.longitude ?? backend.location?.longitude ?? null,
    google_maps_url: backend.google_maps_url ?? null,
    schedule: (() => {
      const DAY_MAP: Record<number, string> = { 0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday' };
      const ALL_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

      if (backend.schedules && backend.schedules.length > 0) {
        // Construir mapa de días abiertos usando day_id (número) — evita problemas de idioma
        const openByDayKey = new Map<string, { start: any; end: any }>();
        for (const s of backend.schedules) {
          let dayKey: string | undefined;
          if (s.day_id !== undefined) {
            dayKey = DAY_MAP[s.day_id];
          }
          if (dayKey) {
            openByDayKey.set(dayKey, { start: s.start, end: s.end });
          }
        }

        const extractTime = (t: any): string => {
          if (!t) return '09:00';
          const str = String(t);
          const match = str.match(/(\d{2}:\d{2})/);
          return match ? match[1] : '09:00';
        };

        return ALL_DAYS.map(day => {
          const found = openByDayKey.get(day);
          return {
            day,
            isOpen: !!found,
            startTime: found ? extractTime(found.start) : '09:00',
            endTime: found ? extractTime(found.end) : '18:00',
          };
        });
      }

      if (backend.schedule && backend.schedule.length > 0) return backend.schedule;
      return [];
    })(),
    stats: {
      profileViews: stats.profile_views ?? stats.profileViews ?? 0,
      contactClicks: stats.contact_clicks ?? stats.contactClicks ?? 0,
      totalReviews: stats.total_reviews ?? stats.totalReviews ?? 0,
      averageRating: stats.average_rating ?? stats.averageRating ?? 0,
    },
    isActive: backend.is_active ?? backend.isActive ?? true,
  };
};

/**
 * API: Obtener perfil de farmacia
 * Endpoint: GET /api/pharmacies/profile
 */
export const getPharmacyProfileAPI = async (): Promise<PharmacyProfile> => {
  const response = await httpClient.get<{ success: boolean; data: BackendPharmacyProfile }>(
    '/pharmacies/profile'
  );
  const backendData = extractData(response);
  return mapBackendToFrontend(backendData);
};

/**
 * API: Actualizar perfil de farmacia
 * Endpoint: PUT /api/pharmacies/profile
 */
export const updatePharmacyProfileAPI = async (
  data: Partial<PharmacyProfile>
): Promise<PharmacyProfile> => {
  // ⭐ Si isChainMember === true, NO enviar full_name, profile_picture_url ni description
  const payload: any = { ...data };
  
  // Remover campos de solo lectura
  delete payload.isChainMember;
  delete payload.chainName;
  delete payload.chainLogo;
  delete payload.chainDescription;
  
  if (data.isChainMember) {
    // ⭐ Remover campos bloqueados cuando es miembro de cadena
    delete payload.commercialName; // No enviar como full_name
    delete payload.logoUrl; // No enviar como profile_picture_url
    delete payload.description; // No enviar description
  }
  
  // Mapear nombres de campos del frontend al backend
  const backendPayload: any = {
    ...(payload.address && { address: payload.address }),
    ...(payload.whatsapp && { whatsapp: payload.whatsapp }),
    ...(payload.websiteUrl && { website_url: payload.websiteUrl }),
    ...(payload.ruc && { ruc: payload.ruc }),
    ...(payload.status && { status: payload.status }),
    ...(payload.isActive !== undefined && { is_active: payload.isActive }),
    ...(payload.chainId && { chain_id: payload.chainId }),
    ...(payload.latitude !== undefined && { latitude: payload.latitude }),
    ...(payload.longitude !== undefined && { longitude: payload.longitude }),
    ...(payload.google_maps_url !== undefined && { google_maps_url: payload.google_maps_url || null }),
  };

  // Mapear schedule del frontend (WorkSchedule[]) al formato del backend (workSchedule)
  if (payload.schedule && Array.isArray(payload.schedule)) {
    backendPayload.workSchedule = payload.schedule.map((s: any) => ({
      day: s.day,
      enabled: s.isOpen ?? s.enabled ?? false,
      startTime: s.startTime || '09:00',
      endTime: s.endTime || '18:00',
    }));
  }
  
  // ⭐ Solo incluir full_name, profile_picture_url y description si NO es miembro de cadena
  if (!data.isChainMember) {
    if (payload.commercialName) backendPayload.full_name = payload.commercialName;
    if (payload.logoUrl) backendPayload.imageUrl = payload.logoUrl; // base64 → Cloudinary en backend
    if (payload.description) backendPayload.description = payload.description;
  }
  
  const response = await httpClient.put<{ success: boolean; data: BackendPharmacyProfile }>(
    '/pharmacies/profile',
    backendPayload
  );
  const backendData = extractData(response);
  return mapBackendToFrontend(backendData);
};

/**
 * API: Obtener sucursales de farmacia
 * Endpoint: GET /api/pharmacies/branches
 */
export const getPharmacyBranchesAPI = async (): Promise<PharmacyBranch[]> => {
  const response = await httpClient.get<{ success: boolean; data: PharmacyBranch[] }>(
    '/pharmacies/branches'
  );
  return extractData(response);
};

/**
 * API: Crear sucursal de farmacia
 * Endpoint: POST /api/pharmacies/branches
 */
export const createPharmacyBranchAPI = async (
  data: Omit<PharmacyBranch, 'id'>
): Promise<PharmacyBranch> => {
  const response = await httpClient.post<{ success: boolean; data: PharmacyBranch }>(
    '/pharmacies/branches',
    data
  );
  return extractData(response);
};

/**
 * API: Actualizar sucursal de farmacia
 * Endpoint: PUT /api/pharmacies/branches/:id
 */
export const updatePharmacyBranchAPI = async (
  id: string,
  data: Partial<PharmacyBranch>
): Promise<PharmacyBranch> => {
  const response = await httpClient.put<{ success: boolean; data: PharmacyBranch }>(
    `/pharmacies/branches/${id}`,
    data
  );
  return extractData(response);
};

/**
 * API: Eliminar sucursal de farmacia
 * Endpoint: DELETE /api/pharmacies/branches/:id
 */
export const deletePharmacyBranchAPI = async (id: string): Promise<void> => {
  await httpClient.delete(`/pharmacies/branches/${id}`);
};

/**
 * API: Obtener reseñas de farmacia
 * Endpoint: GET /api/pharmacies/reviews
 */
export const getPharmacyReviewsAPI = async (): Promise<PharmacyReview[]> => {
  const response = await httpClient.get<{ success: boolean; data: PharmacyReview[] }>(
    '/pharmacies/reviews'
  );
  return extractData(response);
};
