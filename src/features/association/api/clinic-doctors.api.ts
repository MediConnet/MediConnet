import { httpClient, extractData } from '../../../shared/lib/http';
import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { ClinicDoctor, DoctorInvitation } from '../types/doctor.entity';
import type { DoctorSchedule } from '../types/doctor-schedule.entity';

export const getClinicDoctorsAPI = async (
  params?: { page?: number; limit?: number; status?: 'active' | 'inactive' | 'all' }
): Promise<PaginatedResponse<ClinicDoctor>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<ClinicDoctor> }>(
    '/clinics/doctors',
    { params }
  );
  return extractData(response);
};

export const inviteDoctorByEmailAPI = async (email: string): Promise<DoctorInvitation> => {
  const response = await httpClient.post<{ success: boolean; data: DoctorInvitation }>(
    '/clinics/doctors/invite',
    { email }
  );
  return extractData(response);
};

export const generateInvitationLinkAPI = async (email: string): Promise<{ invitationLink: string; expiresAt: string }> => {
  const response = await httpClient.post<{ success: boolean; data: { invitationLink: string; expiresAt: string } }>(
    '/clinics/doctors/invitation',
    { email }
  );
  return extractData(response);
};

export interface ValidatedClinicInvitation {
  clinic: { id: string; name: string } | null;
  email: string;
  expiresAt: string;
  isValid: boolean;
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

export const rejectInvitationAPI = async (token: string): Promise<void> => {
  await httpClient.post<{ success: boolean }>(
    `/clinics/invite/${token}/reject`
  );
};

export const toggleDoctorStatusAPI = async (doctorId: string, isActive: boolean): Promise<ClinicDoctor> => {
  const response = await httpClient.patch<{ success: boolean; data: ClinicDoctor }>(
    `/clinics/doctors/${doctorId}/status`,
    { isActive }
  );
  return extractData(response);
};

export const assignOfficeAPI = async (doctorId: string, officeNumber: string): Promise<ClinicDoctor> => {
  const response = await httpClient.patch<{ success: boolean; data: ClinicDoctor }>(
    `/clinics/doctors/${doctorId}/office`,
    { officeNumber }
  );
  return extractData(response);
};

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

export const deleteDoctorAPI = async (doctorId: string): Promise<void> => {
  await httpClient.delete<{ success: boolean }>(
    `/clinics/doctors/${doctorId}`
  );
};
