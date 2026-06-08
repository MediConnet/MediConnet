import { httpClient, extractData } from '../../../shared/lib/http';
import type { PaginatedResponse } from '../../../shared/types/pagination';
import type {
  ClinicInfo,
  ClinicAssociatedDoctorProfile,
  ReceptionMessage,
  DateBlockRequest,
  ClinicAssociatedAppointment
} from '../types/ClinicAssociatedDoctor.entity';
import { normalizeClinicAssociatedList } from './clinic-associated-list.utils';
import { normalizeClinicSchedule } from './clinic-schedule.utils';
import type { ClinicSchedule } from '../../clinic/types/clinic.entity';
import type { DoctorSchedule } from '../../clinic/types/doctor-schedule.entity';
import { normalizeDoctorSchedule } from './clinic-schedule.utils';
import {
  mapClinicAssociatedAppointmentFromApi,
  mapDateBlockFromApi,
  mapReceptionMessageFromApi,
  normalizeClinicAppointmentStatus,
  unwrapSingleApiPayload,
} from './clinic-associated.mappers';

export const getClinicInfoAPI = async (): Promise<ClinicInfo | null> => {
  try {
    const response = await httpClient.get<{ success: boolean; data: ClinicInfo | null }>(
      '/clinics/doctors/me/info'
    );
    const data = extractData(response) as ClinicInfo & { schedule?: ClinicSchedule };
    if (data && data.id) {
      const rawSchedule = data.generalSchedule ?? data.schedule;
      return {
        ...data,
        generalSchedule: rawSchedule ? normalizeClinicSchedule(rawSchedule) : undefined,
      };
    }
    return null;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getClinicAssociatedProfileAPI = async (): Promise<ClinicAssociatedDoctorProfile | null> => {
  try {
    const response = await httpClient.get<{ success: boolean; data: ClinicAssociatedDoctorProfile }>(
      '/clinics/doctors/me/profile'
    );
    return extractData(response);
  } catch (error: any) {
    const status = error?.response?.status ?? error?.status;
    if (status === 404) {
      return null;
    }
    throw error;
  }
};

export const updateClinicAssociatedProfileAPI = async (
  profile: Partial<ClinicAssociatedDoctorProfile>
): Promise<ClinicAssociatedDoctorProfile> => {
  const response = await httpClient.put<{ success: boolean; data: ClinicAssociatedDoctorProfile }>(
    '/clinics/doctors/me/profile',
    profile
  );
  return extractData(response);
};

export const getReceptionMessagesAPI = async (
  params?: { page?: number; limit?: number }
): Promise<ReceptionMessage[]> => {
  const response = await httpClient.get<{
    success: boolean;
    data: PaginatedResponse<Record<string, unknown>> | Record<string, unknown>[];
  }>("/clinics/doctors/me/messages", { params });

  const extracted = extractData(response);
  const items = normalizeClinicAssociatedList(
    extracted,
    mapReceptionMessageFromApi,
    "clinic-reception-messages",
  );
  return items.reverse();
};

export const sendReceptionMessageAPI = async (
  message: string
): Promise<ReceptionMessage> => {
  const response = await httpClient.post<{
    success: boolean;
    data: Record<string, unknown> | { data: Record<string, unknown> };
  }>("/clinics/doctors/me/messages", { message });

  const extracted = extractData(response);
  const raw = unwrapSingleApiPayload(extracted);
  return mapReceptionMessageFromApi({
    ...raw,
    message: raw.message ?? message,
    senderType: raw.senderType ?? "doctor",
  });
};

export const markMessagesAsReadAPI = async (messageIds: string[]): Promise<void> => {
  await httpClient.patch<{ success: boolean }>(
    '/clinics/doctors/me/messages/read',
    { messageIds }
  );
};

export const getDateBlockRequestsAPI = async (
  params?: { page?: number; limit?: number }
): Promise<DateBlockRequest[]> => {
  const response = await httpClient.get<{
    success: boolean;
    data: PaginatedResponse<Record<string, unknown>> | Record<string, unknown>[];
  }>("/clinics/doctors/me/date-blocks", { params });

  const extracted = extractData(response);
  return normalizeClinicAssociatedList(
    extracted,
    mapDateBlockFromApi,
    "clinic-date-blocks",
  );
};

export const requestDateBlockAPI = async (
  startDate: string,
  endDate: string,
  reason: string
): Promise<DateBlockRequest> => {
  const response = await httpClient.post<{
    success: boolean;
    data: Record<string, unknown> | { data: Record<string, unknown> };
  }>("/clinics/doctors/me/date-blocks", { startDate, endDate, reason });

  const extracted = extractData(response);
  const raw = unwrapSingleApiPayload(extracted);

  return mapDateBlockFromApi({
    ...raw,
    startDate: raw.startDate ?? startDate,
    endDate: raw.endDate ?? endDate,
    reason: raw.reason ?? reason,
  });
};

export const getClinicAssociatedAppointmentsAPI = async (
  params?: { page?: number; limit?: number }
): Promise<ClinicAssociatedAppointment[]> => {
  try {
    const response = await httpClient.get<{
      success: boolean;
      data: PaginatedResponse<Record<string, unknown>> | Record<string, unknown>[];
    }>("/clinics/doctors/me/appointments", { params });

    const extracted = extractData(response);
    return normalizeClinicAssociatedList(
      extracted,
      mapClinicAssociatedAppointmentFromApi,
      "clinic-appointments",
    );
  } catch (error: any) {
    const status = error?.response?.status ?? error?.status;
    if (status === 404) {
      return [];
    }
    throw error;
  }
};

export interface ClinicAssociatedScheduleResponse {
  doctorId: string;
  clinicId: string;
  clinicSchedule: ClinicSchedule;
  schedule: ClinicSchedule;
}

export const getClinicAssociatedScheduleAPI = async (): Promise<{
  doctorSchedule: DoctorSchedule;
  clinicSchedule: ClinicSchedule;
}> => {
  const response = await httpClient.get<{
    success: boolean;
    data: ClinicAssociatedScheduleResponse;
  }>('/clinics/doctors/me/schedule');

  const data = extractData(response);
  return {
    clinicSchedule: normalizeClinicSchedule(data.clinicSchedule),
    doctorSchedule: normalizeDoctorSchedule(
      {
        doctorId: data.doctorId,
        clinicId: data.clinicId,
        schedule: data.schedule,
      },
      data.doctorId,
      data.clinicId,
    ),
  };
};

export const updateClinicAssociatedScheduleAPI = async (
  schedule: Record<string, unknown>,
): Promise<{ doctorSchedule: DoctorSchedule; clinicSchedule: ClinicSchedule }> => {
  const response = await httpClient.put<{
    success: boolean;
    data: ClinicAssociatedScheduleResponse;
  }>('/clinics/doctors/me/schedule', { schedule });

  const data = extractData(response);
  return {
    clinicSchedule: normalizeClinicSchedule(data.clinicSchedule),
    doctorSchedule: normalizeDoctorSchedule(
      {
        doctorId: data.doctorId,
        clinicId: data.clinicId,
        schedule: data.schedule,
      },
      data.doctorId,
      data.clinicId,
    ),
  };
};

export const updateClinicAppointmentStatusAPI = async (
  appointmentId: string,
  status: 'COMPLETED' | 'NO_SHOW'
): Promise<Pick<ClinicAssociatedAppointment, 'id' | 'status'>> => {
  const response = await httpClient.patch<{
    success: boolean;
    data: Record<string, unknown> | { data: Record<string, unknown> };
  }>(
    `/clinics/doctors/me/appointments/${appointmentId}/status`,
    { status }
  );

  const extracted = extractData(response);
  const raw = unwrapSingleApiPayload(extracted);
  const normalizedStatus = normalizeClinicAppointmentStatus(
    String(raw.status ?? status),
  );

  return {
    id: String(raw.id ?? appointmentId),
    status: normalizedStatus,
  };
};
