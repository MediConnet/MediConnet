import { extractData, httpClient } from '../../../shared/lib/http';
import type { DoctorAppointment } from '../domain/Appointment.entity';
import type { AppointmentStatus } from '../domain/Patient.entity';

// --- Interfaces de Respuesta del Backend (Raw Data) ---
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
  scheduled_for: string; // ISO String "2026-01-27T15:00:00.000Z"
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

// --- Mapper: Convierte Backend -> Frontend ---
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
    
    // Aplanamos el objeto patients
    patientName: appt.patients?.full_name || 'Paciente Desconocido',
    patientPhone: appt.patients?.phone || '',
    patientEmail: appt.patients?.email || undefined,
    patientAvatar: appt.patients?.profile_picture_url || undefined,
    
    date: ecuadorDate,
    time: time, // Ojo: verifica que esto coincida con la hora local de tu usuario
    
    reason: appt.reason,
    notes: appt.notes || undefined,
    status: appt.status,
    
    // Usamos payment_details que ya viene calculado del backend
    paymentMethod: appt.payment_details.method_label, // "Efectivo" / "Tarjeta"
    paymentMethodRaw: appt.payment_method, // "CASH" / "CARD"
    
    price: appt.payment_details.amount,
    isPaid: appt.payment_details.is_paid,
    locationAddress: appt.provider_branch?.address || undefined,
    locationGoogleMapsUrl: appt.provider_branch?.google_maps_url || undefined,
    locationLatitude: appt.provider_branch?.latitude ?? undefined,
    locationLongitude: appt.provider_branch?.longitude ?? undefined,
  };
};

// --- API Functions ---

export const getAppointmentsAPI = async (status?: string): Promise<DoctorAppointment[]> => {
  // Construimos la URL con query params si existen
  const url = status 
    ? `/doctors/appointments?status=${status}&limit=100` 
    : '/doctors/appointments?limit=100';

  const response = await httpClient.get<{ success: boolean; data: AppointmentsResponse }>(url);
  
  // Extraemos la data y mapeamos
  const backendData = extractData(response); // Esto devuelve el objeto { appointments: [], pagination: {} }
  
  return backendData.appointments.map(mapBackendToFrontend);
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