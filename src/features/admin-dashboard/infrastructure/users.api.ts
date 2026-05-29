import { httpClient, extractData } from '../../../shared/lib/http';
import type { User } from '../domain/user.entity';
import type { PaginatedResponse } from '../../../shared/types/pagination';

/**
 * API: Obtener lista de usuarios (admins, providers, clinics, patients)
 * Endpoint: GET /api/admin/users
 */
export const getUsersAPI = async (params?: {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<User>> => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params?.page || 1));
  searchParams.set("limit", String(params?.limit || 20));
  if (params?.role) searchParams.set("role", params.role);
  if (params?.search) searchParams.set("search", params.search);

  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<User> }>(
    `/admin/users?${searchParams.toString()}`
  );
  return extractData(response);
};

/**
 * API: Obtener detalle de un usuario
 * Endpoint: GET /api/admin/users/:id
 */
export const getUserByIdAPI = async (userId: string): Promise<User> => {
  const response = await httpClient.get<{ success: boolean; data: User }>(
    `/admin/users/${userId}`
  );
  return extractData(response);
};

/**
 * API: Activar/Desactivar usuario
 * Endpoint: PATCH /api/admin/users/:id/status
 */
export const toggleUserStatusAPI = async (userId: string, isActive: boolean): Promise<void> => {
  await httpClient.patch<{ success: boolean }>(`/admin/users/${userId}/status`, { isActive });
};

/**
 * API: Editar usuario
 * Endpoint: PUT /api/admin/users/:id
 */
export const updateUserAPI = async (userId: string, data: Partial<User>): Promise<User> => {
  const response = await httpClient.put<{ success: boolean; data: User }>(
    `/admin/users/${userId}`,
    data
  );
  return extractData(response);
};

/**
 * API: Eliminar usuario
 * Endpoint: DELETE /api/admin/users/:id
 */
export const deleteUserAPI = async (userId: string): Promise<void> => {
  await httpClient.delete<{ success: boolean }>(`/admin/users/${userId}`);
};
