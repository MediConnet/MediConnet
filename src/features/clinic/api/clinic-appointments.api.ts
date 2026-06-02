import { httpClient, extractData } from '../../../shared/lib/http';
import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { ClinicAppointment, AppointmentStatus } from '../types/appointment.entity';

export const getClinicAppointmentsAPI = async (
  params?: { page?: number; limit?: number; date?: string; doctorId?: string; status?: AppointmentStatus }
): Promise<PaginatedResponse<ClinicAppointment>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<ClinicAppointment> }>(
    '/clinics/appointments',
    { params }
  );
  return extractData(response);
};

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

export const getTodayReceptionAppointmentsAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<ClinicAppointment>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<ClinicAppointment> }>(
    '/clinics/reception/today',
    { params }
  );
  return extractData(response);
};

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
