import { httpClient, extractData } from '../../../shared/lib/http';
import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { 
  ClinicInfo, 
  ClinicAssociatedDoctorProfile,
  ReceptionMessage,
  DateBlockRequest,
  ClinicAssociatedAppointment
} from '../domain/ClinicAssociatedDoctor.entity';

/**
 * API: Obtener información de la clínica asociada
 * Endpoint: GET /api/clinics/doctors/me/info
 * ⚠️ NOTA: Si el médico no está asociado, el backend retorna objeto con campos null (no 404)
 */
export const getClinicInfoAPI = async (): Promise<ClinicInfo | null> => {
  try {
    const response = await httpClient.get<{ success: boolean; data: ClinicInfo | null }>(
      '/clinics/doctors/me/info'
    );
    const data = extractData(response);
    if (data && data.id) {
      return data;
    }
    return null;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * API: Obtener perfil del médico asociado
 * Endpoint: GET /api/clinics/doctors/me/profile
 */
export const getClinicAssociatedProfileAPI = async (): Promise<ClinicAssociatedDoctorProfile> => {
  const response = await httpClient.get<{ success: boolean; data: ClinicAssociatedDoctorProfile }>(
    '/clinics/doctors/me/profile'
  );
  return extractData(response);
};

/**
 * API: Actualizar perfil del médico asociado
 * Endpoint: PUT /api/clinics/doctors/me/profile
 */
export const updateClinicAssociatedProfileAPI = async (
  profile: Partial<ClinicAssociatedDoctorProfile>
): Promise<ClinicAssociatedDoctorProfile> => {
  const response = await httpClient.put<{ success: boolean; data: ClinicAssociatedDoctorProfile }>(
    '/clinics/doctors/me/profile',
    profile
  );
  return extractData(response);
};

/**
 * API: Obtener mensajes con recepción
 * Endpoint: GET /api/clinics/doctors/me/messages
 */
export const getReceptionMessagesAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<ReceptionMessage>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<ReceptionMessage> }>(
    '/clinics/doctors/me/messages',
    { params }
  );
  return extractData(response);
};

/**
 * API: Enviar mensaje a recepción
 * Endpoint: POST /api/clinics/doctors/me/messages
 */
export const sendReceptionMessageAPI = async (
  message: string
): Promise<ReceptionMessage> => {
  const response = await httpClient.post<{ success: boolean; data: ReceptionMessage }>(
    '/clinics/doctors/me/messages',
    { message }
  );
  return extractData(response);
};

/**
 * API: Marcar mensajes como leídos
 * Endpoint: PATCH /api/clinics/doctors/me/messages/read
 */
export const markMessagesAsReadAPI = async (messageIds: string[]): Promise<void> => {
  await httpClient.patch<{ success: boolean }>(
    '/clinics/doctors/me/messages/read',
    { messageIds }
  );
};

/**
 * API: Obtener solicitudes de bloqueo de fecha
 * Endpoint: GET /api/clinics/doctors/me/date-blocks
 */
export const getDateBlockRequestsAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<DateBlockRequest>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<DateBlockRequest> }>(
    '/clinics/doctors/me/date-blocks',
    { params }
  );
  return extractData(response);
};

/**
 * API: Solicitar bloqueo de fecha
 * Endpoint: POST /api/clinics/doctors/me/date-blocks
 */
export const requestDateBlockAPI = async (
  startDate: string,
  endDate: string,
  reason: string
): Promise<DateBlockRequest> => {
  const response = await httpClient.post<{ success: boolean; data: DateBlockRequest }>(
    '/clinics/doctors/me/date-blocks',
    { startDate, endDate, reason }
  );
  return extractData(response);
};

/**
 * API: Obtener citas del médico asociado (solo confirmadas)
 * Endpoint: GET /api/clinics/doctors/me/appointments
 */
export const getClinicAssociatedAppointmentsAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<ClinicAssociatedAppointment>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<ClinicAssociatedAppointment> }>(
    '/clinics/doctors/me/appointments',
    { params }
  );
  return extractData(response);
};

/**
 * API: Actualizar estado de cita (marcar como atendida/no asistió)
 * Endpoint: PATCH /api/clinics/doctors/me/appointments/:appointmentId/status
 */
export const updateClinicAppointmentStatusAPI = async (
  appointmentId: string,
  status: 'COMPLETED' | 'NO_SHOW'
): Promise<ClinicAssociatedAppointment> => {
  const response = await httpClient.patch<{ success: boolean; data: ClinicAssociatedAppointment }>(
    `/clinics/doctors/me/appointments/${appointmentId}/status`,
    { status }
  );
  return extractData(response);
};
