import { httpClient, extractData } from '../../../shared/lib/http';
import type { PharmacyProfile, WorkSchedule } from '../domain/pharmacy-profile.entity';
import type { PharmacyBranch } from '../domain/pharmacy-branch.entity';
import type { PharmacyReview } from '../domain/pharmacy-review.entity';

/**
 * API: Obtener perfil de farmacia
 * Endpoint: GET /api/pharmacies/profile
 */
export const getPharmacyProfileAPI = async (): Promise<PharmacyProfile> => {
  const response = await httpClient.get<{ success: boolean; data: PharmacyProfile }>(
    '/pharmacies/profile'
  );
  return extractData(response);
};

/**
 * API: Actualizar perfil de farmacia
 * Endpoint: PUT /api/pharmacies/profile
 */
export const updatePharmacyProfileAPI = async (
  data: Partial<PharmacyProfile>
): Promise<PharmacyProfile> => {
  const response = await httpClient.put<{ success: boolean; data: PharmacyProfile }>(
    '/pharmacies/profile',
    data
  );
  return extractData(response);
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
