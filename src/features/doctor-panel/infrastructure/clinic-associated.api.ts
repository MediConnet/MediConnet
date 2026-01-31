import { httpClient, extractData } from '../../../shared/lib/http';
import type { 
  ClinicInfo, 
  ClinicAssociatedDoctorProfile,
  ReceptionMessage,
  DateBlockRequest,
  ClinicAssociatedAppointment
} from '../domain/ClinicAssociatedDoctor.entity';

/**
 * API: Obtener información de la clínica asociada
 * Endpoint: GET /api/doctors/clinic-info
 * ⚠️ NOTA: Si el médico no está asociado, el backend retorna objeto con campos null (no 404)
 */
export const getClinicInfoAPI = async (): Promise<ClinicInfo | null> => {
  try {
    const response = await httpClient.get<{ success: boolean; data: ClinicInfo | null }>(
      '/doctors/clinic-info'
    );
    const data = extractData(response);
    // ⭐ Verificar si todos los campos son null (médico no asociado)
    if (data && data.id) {
      return data;
    }
    return null;
  } catch (error: any) {
    // Si es 404, retornar null (médico no asociado)
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * API: Obtener perfil del médico asociado
 * Endpoint: GET /api/doctors/clinic/profile
 */
export const getClinicAssociatedProfileAPI = async (): Promise<ClinicAssociatedDoctorProfile> => {
  const response = await httpClient.get<{ success: boolean; data: ClinicAssociatedDoctorProfile }>(
    '/doctors/clinic/profile'
  );
  return extractData(response);
};

/**
 * API: Actualizar perfil del médico asociado
 * Endpoint: PUT /api/doctors/clinic/profile
 */
export const updateClinicAssociatedProfileAPI = async (
  profile: Partial<ClinicAssociatedDoctorProfile>
): Promise<ClinicAssociatedDoctorProfile> => {
  const response = await httpClient.put<{ success: boolean; data: ClinicAssociatedDoctorProfile }>(
    '/doctors/clinic/profile',
    profile
  );
  return extractData(response);
};

/**
 * API: Obtener mensajes con recepción
 * Endpoint: GET /api/doctors/clinic/reception/messages
 */
export const getReceptionMessagesAPI = async (): Promise<ReceptionMessage[]> => {
  const response = await httpClient.get<{ success: boolean; data: ReceptionMessage[] }>(
    '/doctors/clinic/reception/messages'
  );
  return extractData(response);
};

/**
 * API: Enviar mensaje a recepción
 * Endpoint: POST /api/doctors/clinic/reception/messages
 */
export const sendReceptionMessageAPI = async (
  message: string
): Promise<ReceptionMessage> => {
  const response = await httpClient.post<{ success: boolean; data: ReceptionMessage }>(
    '/doctors/clinic/reception/messages',
    { message }
  );
  return extractData(response);
};

/**
 * API: Marcar mensajes como leídos
 * Endpoint: PATCH /api/doctors/clinic/reception/messages/read
 */
export const markMessagesAsReadAPI = async (messageIds: string[]): Promise<void> => {
  await httpClient.patch<{ success: boolean }>(
    '/doctors/clinic/reception/messages/read',
    { messageIds }
  );
};

/**
 * API: Obtener solicitudes de bloqueo de fecha
 * Endpoint: GET /api/doctors/clinic/date-blocks
 */
export const getDateBlockRequestsAPI = async (): Promise<DateBlockRequest[]> => {
  const response = await httpClient.get<{ success: boolean; data: DateBlockRequest[] }>(
    '/doctors/clinic/date-blocks'
  );
  return extractData(response);
};

/**
 * API: Solicitar bloqueo de fecha
 * Endpoint: POST /api/doctors/clinic/date-blocks/request
 */
export const requestDateBlockAPI = async (
  startDate: string,
  endDate: string,
  reason: string
): Promise<DateBlockRequest> => {
  const response = await httpClient.post<{ success: boolean; data: DateBlockRequest }>(
    '/doctors/clinic/date-blocks/request',
    { startDate, endDate, reason }
  );
  return extractData(response);
};

/**
 * API: Obtener citas del médico asociado (solo confirmadas)
 * Endpoint: GET /api/doctors/clinic/appointments
 */
export const getClinicAssociatedAppointmentsAPI = async (): Promise<ClinicAssociatedAppointment[]> => {
  const response = await httpClient.get<{ success: boolean; data: ClinicAssociatedAppointment[] }>(
    '/doctors/clinic/appointments'
  );
  return extractData(response);
};

/**
 * API: Actualizar estado de cita (marcar como atendida/no asistió)
 * Endpoint: PATCH /api/doctors/clinic/appointments/:appointmentId/status
 */
export const updateClinicAppointmentStatusAPI = async (
  appointmentId: string,
  status: 'COMPLETED' | 'NO_SHOW'
): Promise<ClinicAssociatedAppointment> => {
  const response = await httpClient.patch<{ success: boolean; data: ClinicAssociatedAppointment }>(
    `/doctors/clinic/appointments/${appointmentId}/status`,
    { status }
  );
  return extractData(response);
};
