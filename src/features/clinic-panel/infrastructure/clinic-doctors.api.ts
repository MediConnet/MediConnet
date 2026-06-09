import { httpClient, extractData } from '../../../shared/lib/http';
import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { ClinicDoctor, DoctorInvitation } from '../domain/doctor.entity';
import type { DoctorSchedule } from '../domain/doctor-schedule.entity';

/**
 * API: Obtener lista de médicos de la clínica
 * Endpoint: GET /api/clinics/doctors
 */
export const getClinicDoctorsAPI = async (
  params?: { page?: number; limit?: number; status?: 'active' | 'inactive' | 'all' }
): Promise<PaginatedResponse<ClinicDoctor>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<ClinicDoctor> }>(
    '/clinics/doctors',
    { params }
  );
  return extractData(response);
};

/**
 * API: Invitar médico por email
 * Endpoint: POST /api/clinics/doctors/invite
 * El médico completará su nombre y especialidad al aceptar la invitación
 */
export const inviteDoctorByEmailAPI = async (email: string): Promise<DoctorInvitation> => {
  const response = await httpClient.post<{ success: boolean; data: DoctorInvitation }>(
    '/clinics/doctors/invite',
    { email }
  );
  return extractData(response);
};

/**
 * API: Generar link de invitación
 * Endpoint: POST /api/clinics/doctors/invitation
 * Nota: Este endpoint genera el link Y envía el email automáticamente
 */
export const generateInvitationLinkAPI = async (email: string): Promise<{ invitationLink: string; expiresAt: string }> => {
  const response = await httpClient.post<{ success: boolean; data: { invitationLink: string; expiresAt: string } }>(
    '/clinics/doctors/invitation',
    { email }
  );
  return extractData(response);
};

/**
 * API: Validar token de invitación (público)
 * Endpoint: GET /api/clinics/invite/:token
 */
export interface ValidatedClinicInvitation {
  clinic: { id: string; name: string } | null;
  email: string;
  expiresAt: string;
  isValid: boolean;
  /** true si el correo ya tiene cuenta de médico en la plataforma */
  doctorExiste?: boolean;
}

export const validateInvitationTokenAPI = async (
  token: string,
): Promise<ValidatedClinicInvitation> => {
  const response = await httpClient.get<{ success: boolean; data: ValidatedClinicInvitation }>(
    `/clinics/invite/${token}`
  );
  return extractData(response);
};

/**
 * API: Asociar médico autenticado a clínica tras aceptar invitación (usuario existente).
 * Endpoint: POST /api/clinics/invite/:token/associate
 */
export const associateClinicInvitationAPI = async (
  token: string,
): Promise<{
  message: string;
  clinicId: string;
  clinicName?: string;
  userId: string;
}> => {
  const response = await httpClient.post<{ success: boolean; data: any }>(
    `/clinics/invite/${token}/associate`,
    {},
  );
  return extractData(response);
};

/**
 * API: Aceptar invitación
 * Endpoint: POST /api/clinics/invite/:token/accept
 */
export const acceptInvitationAPI = async (
  token: string,
  data: {
    name: string;
    specialty: string;
    password: string;
    phone: string;
    whatsapp: string;
  }
): Promise<{
  userId: string;
  email: string;
  token: string;
  doctor: ClinicDoctor;
}> => {
  const response = await httpClient.post<{ success: boolean; data: any }>(
    `/clinics/invite/${token}/accept`,
    data
  );
  return extractData(response);
};

/**
 * API: Rechazar invitación
 * Endpoint: POST /api/clinics/invite/:token/reject
 */
export const rejectInvitationAPI = async (token: string): Promise<void> => {
  await httpClient.post<{ success: boolean }>(
    `/clinics/invite/${token}/reject`
  );
};

/**
 * API: Activar/desactivar médico
 * Endpoint: PATCH /api/clinics/doctors/:doctorId/status
 */
export const toggleDoctorStatusAPI = async (doctorId: string, isActive: boolean): Promise<ClinicDoctor> => {
  const response = await httpClient.patch<{ success: boolean; data: ClinicDoctor }>(
    `/clinics/doctors/${doctorId}/status`,
    { isActive }
  );
  return extractData(response);
};

/**
 * API: Asignar consultorio
 * Endpoint: PATCH /api/clinics/doctors/:doctorId/office
 */
export const assignOfficeAPI = async (doctorId: string, officeNumber: string): Promise<ClinicDoctor> => {
  const response = await httpClient.patch<{ success: boolean; data: ClinicDoctor }>(
    `/clinics/doctors/${doctorId}/office`,
    { officeNumber }
  );
  return extractData(response);
};

/**
 * API: Obtener horarios de un médico
 * Endpoint: GET /api/clinics/doctors/:doctorId/schedule
 */
export const getDoctorScheduleAPI = async (doctorId: string): Promise<DoctorSchedule> => {
  const response = await httpClient.get<{
    success: boolean;
    data: DoctorSchedule & { schedule?: DoctorSchedule };
  }>(`/clinics/doctors/${doctorId}/schedule`);

  const data = extractData(response);
  if (data.schedule && typeof data.schedule === 'object') {
    return {
      ...data,
      ...data.schedule,
      doctorId: data.doctorId ?? doctorId,
      clinicId: data.clinicId ?? '',
    } as DoctorSchedule;
  }
  return data;
};

/**
 * API: Actualizar horarios de un médico
 * Endpoint: PUT /api/clinics/doctors/:doctorId/schedule
 */
const weekDayKeys = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const toSchedulePayload = (schedule: Partial<DoctorSchedule>) => {
  const payload: Record<string, unknown> = {};
  weekDayKeys.forEach((day) => {
    if (schedule[day]) {
      payload[day] = schedule[day];
    }
  });
  return payload;
};

export const updateDoctorScheduleAPI = async (
  doctorId: string,
  schedule: Partial<DoctorSchedule>
): Promise<DoctorSchedule> => {
  const response = await httpClient.put<{
    success: boolean;
    data: DoctorSchedule & { schedule?: DoctorSchedule };
  }>(`/clinics/doctors/${doctorId}/schedule`, {
    schedule: toSchedulePayload(schedule),
  });

  const data = extractData(response);
  if (data.schedule && typeof data.schedule === 'object') {
    return {
      ...data,
      ...data.schedule,
      doctorId: data.doctorId ?? doctorId,
      clinicId: data.clinicId ?? '',
    } as DoctorSchedule;
  }
  return data;
};

/**
 * API: Eliminar médico de la clínica
 * Endpoint: DELETE /api/clinics/doctors/:doctorId
 */
export const deleteDoctorAPI = async (doctorId: string): Promise<void> => {
  await httpClient.delete<{ success: boolean }>(
    `/clinics/doctors/${doctorId}`
  );
};
