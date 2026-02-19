import { httpClient, extractData } from '../../../shared/lib/http';
import type { PharmacyChain } from '../domain/pharmacy-chain.entity';

/**
 * API: Obtener todas las cadenas de farmacias (Admin)
 * Endpoint: GET /api/admin/pharmacy-chains
 */
export const getPharmacyChainsAPI = async (): Promise<PharmacyChain[]> => {
  const response = await httpClient.get<{ success: boolean; data: PharmacyChain[] }>(
    '/admin/pharmacy-chains'
  );
  return extractData(response);
};

/**
 * API: Crear nueva cadena de farmacias (Admin)
 * Endpoint: POST /api/admin/pharmacy-chains
 */
export const createPharmacyChainAPI = async (
  data: Omit<PharmacyChain, 'id' | 'createdAt' | 'updatedAt'>
): Promise<PharmacyChain> => {
  const response = await httpClient.post<{ success: boolean; data: PharmacyChain }>(
    '/admin/pharmacy-chains',
    data
  );
  return extractData(response);
};

/**
 * API: Actualizar cadena de farmacias (Admin)
 * Endpoint: PUT /api/admin/pharmacy-chains/:id
 */
export const updatePharmacyChainAPI = async (
  id: string,
  data: Partial<Omit<PharmacyChain, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<PharmacyChain> => {
  // Limpiar el ID (remover ":1" o cualquier sufijo después de ":")
  const cleanId = id.split(':')[0].trim();
  const response = await httpClient.put<{ success: boolean; data: PharmacyChain }>(
    `/admin/pharmacy-chains/${cleanId}`,
    data
  );
  return extractData(response);
};

/**
 * API: Eliminar cadena de farmacias (Admin)
 * Endpoint: DELETE /api/admin/pharmacy-chains/:id
 */
export const deletePharmacyChainAPI = async (id: string): Promise<void> => {
  // Limpiar el ID (remover ":1" o cualquier sufijo después de ":")
  const cleanId = id.split(':')[0].trim();
  await httpClient.delete<{ success: boolean }>(`/admin/pharmacy-chains/${cleanId}`);
};

/**
 * API: Obtener cadenas activas (Público - para registro)
 * Endpoint: GET /api/pharmacy-chains
 */
export const getActivePharmacyChainsAPI = async (): Promise<PharmacyChain[]> => {
  const response = await httpClient.get<{ success: boolean; data: PharmacyChain[] }>(
    '/pharmacy-chains'
  );
  return extractData(response);
};
