import { httpClient, extractData } from '../../../shared/lib/http';
import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { ReceptionMessage } from '../domain/reception-message.entity';

/**
 * API: Obtener mensajes con un médico específico
 * Endpoint: GET /api/clinics/reception/messages
 */
export const getReceptionMessagesAPI = async (
  params?: { page?: number; limit?: number; doctorId?: string }
): Promise<PaginatedResponse<ReceptionMessage>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<ReceptionMessage> }>(
    '/clinics/reception/messages',
    { params }
  );
  return extractData(response);
};

/**
 * API: Enviar mensaje a un médico
 * Endpoint: POST /api/clinics/reception/messages
 */
export const sendReceptionMessageAPI = async (
  doctorId: string,
  message: string
): Promise<ReceptionMessage> => {
  const response = await httpClient.post<{ success: boolean; data: ReceptionMessage }>(
    '/clinics/reception/messages',
    { doctorId, message }
  );
  return extractData(response);
};

/**
 * API: Marcar mensajes como leídos
 * Endpoint: PATCH /api/clinics/reception/messages/read
 */
export const markMessagesAsReadAPI = async (messageIds: string[]): Promise<void> => {
  await httpClient.patch<{ success: boolean }>(
    '/clinics/reception/messages/read',
    { messageIds }
  );
};
