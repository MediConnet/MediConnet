import { extractData, httpClient } from '../../../shared/lib/http';
import type { PaginatedResponse, PaginationMeta } from '../../../shared/types/pagination';
import type { DoctorAppointment } from '../types/Appointment.entity';
import type { AppointmentStatus } from '../types/Patient.entity';

interface BackendPatient {
  id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  profile_picture_url: string | null;
}

interface BackendPaymentDetails {
  method_label: string;
  amount: number;
  is_paid: boolean;
}

interface BackendAppointment {
  id: string;
  patient_id: string;
  scheduled_for: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string | null;
  payment_method: 'CASH' | 'CARD';
  cost: string | number;
  is_paid: boolean;
  patients: BackendPatient | null;
  provider_branch?: {
    id: string;
    name?: string | null;
    address?: string | null;
    google_maps_url?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
  payment_details: BackendPaymentDetails;
}

interface AppointmentsResponse {
  appointments: BackendAppointment[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

const mapBackendToFrontend = (appt: BackendAppointment): DoctorAppointment => {
  const dateObj = new Date(appt.scheduled_for);
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Guayaquil",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(dateObj);
  const year = dateParts.find((p) => p.type === "year")?.value || "1970";
  const month = dateParts.find((p) => p.type === "month")?.value || "01";
  const day = dateParts.find((p) => p.type === "day")?.value || "01";
  const ecuadorDate = `${year}-${month}-${day}`;
  const time = new Intl.DateTimeFormat("es-EC", {
    timeZone: "America/Guayaquil",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateObj);

  return {
    id: appt.id,
    patientId: appt.patient_id,

    patientName: appt.patients?.full_name || 'Paciente Desconocido',
    patientPhone: appt.patients?.phone || '',
    patientEmail: appt.patients?.email || undefined,
    patientAvatar: appt.patients?.profile_picture_url || undefined,

    date: ecuadorDate,
    time: time,

    reason: appt.reason,
    notes: appt.notes || undefined,
    status: appt.status,

    paymentMethod: appt.payment_details.method_label,
    paymentMethodRaw: appt.payment_method,

    price: appt.payment_details.amount,
    isPaid: appt.payment_details.is_paid,
    locationAddress: appt.provider_branch?.address || undefined,
    locationGoogleMapsUrl: appt.provider_branch?.google_maps_url || undefined,
    locationLatitude: appt.provider_branch?.latitude ?? undefined,
    locationLongitude: appt.provider_branch?.longitude ?? undefined,
  };
};

export const getAppointmentsAPI = async (
  status?: string,
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<DoctorAppointment>> => {
  const queryParams: Record<string, any> = { ...params };
  if (status) queryParams.status = status;

  const response = await httpClient.get<{ success: boolean; data: AppointmentsResponse }>(
    '/doctors/appointments',
    { params: queryParams }
  );

  const result = extractData(response);
  const rawAppointments = result.data ?? result.appointments ?? [];
  const data = rawAppointments.map(mapBackendToFrontend);

  const pag: any = result.pagination || { total: rawAppointments.length, limit: 50, offset: 0 };
  const pagination: PaginationMeta = {
    total: pag.total,
    limit: pag.limit,
    page: Math.floor((pag.offset || 0) / pag.limit) + 1,
    totalPages: Math.ceil(pag.total / pag.limit),
  };

  return { data, pagination };
};

export const updateAppointmentStatusAPI = async (
  appointmentId: string,
  newStatus: AppointmentStatus
): Promise<boolean> => {
  const response = await httpClient.put<{ success: boolean; data: any }>(
    `/doctors/appointments/${appointmentId}/status`,
    { status: newStatus }
  );

  return response.data.success;
};
