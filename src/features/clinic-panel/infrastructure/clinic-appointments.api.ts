import { httpClient, extractData } from '../../../shared/lib/http';
import type { ClinicAppointment, AppointmentStatus } from '../domain/appointment.entity';

/**
 * API: Obtener citas de la clínica
 * Endpoint: GET /api/clinics/appointments
 */
export const getClinicAppointmentsAPI = async (
  date?: string,
  doctorId?: string,
  status?: AppointmentStatus
): Promise<ClinicAppointment[]> => {
  const params: any = {};
  if (date) params.date = date;
  if (doctorId) params.doctorId = doctorId;
  if (status) params.status = status;

  const response = await httpClient.get<{ success: boolean; data: ClinicAppointment[] }>(
    '/clinics/appointments',
    { params }
  );
  return extractData(response);
};

/**
 * API: Actualizar estado de cita
 * Endpoint: PATCH /api/clinics/appointments/:appointmentId/status
 */
export const updateAppointmentStatusAPI = async (
  appointmentId: string,
  status: AppointmentStatus
): Promise<ClinicAppointment> => {
  const response = await httpClient.patch<{ success: boolean; data: ClinicAppointment }>(
    `/clinics/appointments/${appointmentId}/status`,
    { status }
  );
  return extractData(response);
};

/**
 * API: Obtener citas del día para recepción
 * Endpoint: GET /api/clinics/reception/today
 */
export const getTodayReceptionAppointmentsAPI = async (): Promise<ClinicAppointment[]> => {
  const response = await httpClient.get<{ success: boolean; data: ClinicAppointment[] }>(
    '/clinics/reception/today'
  );
  return extractData(response);
};

/**
 * API: Actualizar estado de recepción
 * Endpoint: PATCH /api/clinics/appointments/:appointmentId/reception
 */
export const updateReceptionStatusAPI = async (
  appointmentId: string,
  receptionStatus: 'arrived' | 'not_arrived' | 'attended',
  receptionNotes?: string
): Promise<ClinicAppointment> => {
  const response = await httpClient.patch<{ success: boolean; data: ClinicAppointment }>(
    `/clinics/appointments/${appointmentId}/reception`,
    { receptionStatus, receptionNotes }
  );
  return extractData(response);
};
