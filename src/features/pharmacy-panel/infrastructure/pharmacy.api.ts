import { httpClient, extractData } from '../../../shared/lib/http';
import type { PharmacyProfile, WorkSchedule } from '../domain/pharmacy-profile.entity';
import type { PharmacyBranch } from '../domain/pharmacy-branch.entity';
import type { PharmacyReview } from '../domain/pharmacy-review.entity';

// ⭐ Interfaz para la respuesta del backend
interface BackendPharmacyProfile {
  id: string;
  full_name: string; // ⭐ Nombre de la cadena si isChainMember === true
  profile_picture_url?: string | null;
  ruc: string;
  description: string; // ⭐ Descripción de la cadena si isChainMember === true
  website_url?: string;
  address: string;
  status: "draft" | "published" | "suspended";
  whatsapp: string;
  chain_id?: string | null;
  is_chain_member?: boolean; // ⭐ Nuevo campo
  chain_name?: string; // ⭐ Nuevo campo
  chain_logo?: string; // ⭐ Nuevo campo
  chain_description?: string; // ⭐ Nuevo campo
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  schedule: WorkSchedule[];
  stats: {
    profile_views?: number;
    contact_clicks?: number;
    total_reviews?: number;
    average_rating?: number;
  };
  is_active?: boolean;
}

// ⭐ Función para mapear la respuesta del backend al formato del frontend
const mapBackendToFrontend = (backend: BackendPharmacyProfile): PharmacyProfile => {
  return {
    id: backend.id,
    commercialName: backend.full_name || "", // ⭐ Usar full_name (viene de la cadena si isChainMember)
    logoUrl: backend.chain_logo || backend.profile_picture_url || "", // ⭐ Priorizar chainLogo
    ruc: backend.ruc || "",
    description: backend.chain_description || backend.description || "", // ⭐ Priorizar chainDescription
    websiteUrl: backend.website_url || "",
    address: backend.address || "",
    status: backend.status || "draft",
    whatsapp: backend.whatsapp || "",
    chainId: backend.chain_id || undefined,
    
    // ⭐ Nuevos campos
    isChainMember: backend.is_chain_member || false,
    chainName: backend.chain_name,
    chainLogo: backend.chain_logo,
    chainDescription: backend.chain_description,
    
    location: backend.location,
    schedule: backend.schedule || [],
    stats: {
      profileViews: backend.stats?.profile_views || 0,
      contactClicks: backend.stats?.contact_clicks || 0,
      totalReviews: backend.stats?.total_reviews || 0,
      averageRating: backend.stats?.average_rating || 0,
    },
    isActive: backend.is_active ?? true,
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
  };
  
  // ⭐ Solo incluir full_name, profile_picture_url y description si NO es miembro de cadena
  if (!data.isChainMember) {
    if (payload.commercialName) backendPayload.full_name = payload.commercialName;
    if (payload.logoUrl) backendPayload.profile_picture_url = payload.logoUrl;
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
