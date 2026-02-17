import { httpClient, extractData } from '../../../shared/lib/http';
import type { ClinicDoctor, DoctorInvitation } from '../domain/doctor.entity';
import type { DoctorSchedule } from '../domain/doctor-schedule.entity';

/**
 * API: Obtener lista de médicos de la clínica
 * Endpoint: GET /api/clinics/doctors
 */
export const getClinicDoctorsAPI = async (status?: 'active' | 'inactive' | 'all'): Promise<ClinicDoctor[]> => {
  const params = status ? { status } : {};
  const response = await httpClient.get<{ success: boolean; data: ClinicDoctor[] }>(
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
 * Endpoint: POST /api/clinics/doctors/invite/link
 */
export const generateInvitationLinkAPI = async (email: string): Promise<{ invitationLink: string; expiresAt: string }> => {
  const response = await httpClient.post<{ success: boolean; data: { invitationLink: string; expiresAt: string } }>(
    '/clinics/doctors/invite/link',
    { email }
  );
  return extractData(response);
};

/**
 * API: Validar token de invitación (público)
 * Endpoint: GET /api/clinics/invite/:token
 */
export const validateInvitationTokenAPI = async (token: string): Promise<{
  clinic: { id: string; name: string };
  email: string;
  expiresAt: string;
  isValid: boolean;
}> => {
  const response = await httpClient.get<{ success: boolean; data: any }>(
    `/clinics/invite/${token}`
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
  const response = await httpClient.get<{ success: boolean; data: DoctorSchedule }>(
    `/clinics/doctors/${doctorId}/schedule`
  );
  return extractData(response);
};

/**
 * API: Actualizar horarios de un médico
 * Endpoint: PUT /api/clinics/doctors/:doctorId/schedule
 */
export const updateDoctorScheduleAPI = async (
  doctorId: string,
  schedule: Partial<DoctorSchedule>
): Promise<DoctorSchedule> => {
  const response = await httpClient.put<{ success: boolean; data: DoctorSchedule }>(
    `/clinics/doctors/${doctorId}/schedule`,
    schedule
  );
  return extractData(response);
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
