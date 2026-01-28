import { extractData, httpClient } from "../../../shared/lib/http";
import type { AppointmentStatus, Patient, PaymentMethodType } from "../domain/Patient.entity";

// Interfaces de respuesta del Backend (Raw)
interface BackendAppointment {
  id: string;
  date: string; 
  reason: string;
  status: string;
  payment: {
    amount: number;
    method: string;
    isPaid: boolean;
  };
}

interface BackendPatient {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  birth_date: string | null;
  total_appointments: number;
  last_appointment_date: string | null;
  appointment_history: BackendAppointment[];
  // Si en el futuro el backend envía la foto real, la agregaríamos aquí:
  // profile_picture_url?: string | null; 
}

interface PatientsApiResponse {
  data: BackendPatient[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// --- MAPPERS ---

const mapBackendStatusToFrontend = (status: string): AppointmentStatus => {
  const validStatuses: AppointmentStatus[] = ['CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING'];
  return validStatuses.includes(status as any) ? (status as AppointmentStatus) : 'PENDING';
};

const mapBackendPaymentToFrontend = (method: string): PaymentMethodType => {
  if (!method) return 'UNKNOWN';
  if (method.toUpperCase().includes('CARD') || method.toUpperCase().includes('TARJETA')) return 'CARD';
  return 'CASH';
};

const extractTimeFromISO = (isoDate: string): string => {
  if (!isoDate) return "00:00";
  try {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch (e) {
    return "00:00";
  }
};

const extractDateFromISO = (isoDate: string): string => {
    if (!isoDate) return "";
    return isoDate.split('T')[0]; 
};

// --- API CALL ---

export interface GetPatientsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getPatientsAPI = async ({ page = 1, limit = 10, search = '' }: GetPatientsParams): Promise<{ patients: Patient[], meta: PatientsApiResponse['meta'] }> => {
  
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search
  }).toString();

  const response = await httpClient.get<{ success: boolean; data: PatientsApiResponse }>(
    `/doctors/patients?${query}`
  );

  const { data: backendData, meta } = extractData(response);

  // Mapeo: Backend (Snake) -> Frontend (Camel)
  const mappedPatients: Patient[] = backendData.map(bp => ({
    id: bp.id,
    name: bp.full_name,
    phone: bp.phone,
    email: bp.email,
    birthDate: bp.birth_date,
    
    totalAppointments: bp.total_appointments,
    lastAppointmentDate: bp.last_appointment_date,
    
    profilePicture: null, 
    // Nota: Si en el futuro el backend envía la foto real, usaríamos: 
    // profilePicture: bp.profile_picture_url || null,

    appointments: bp.appointment_history.map(apt => ({
      id: apt.id,
      date: extractDateFromISO(apt.date),
      time: extractTimeFromISO(apt.date),
      reason: apt.reason || "Consulta General",
      status: mapBackendStatusToFrontend(apt.status),
      paymentMethod: mapBackendPaymentToFrontend(apt.payment.method),
      amount: apt.payment.amount
    }))
  }));

  return { patients: mappedPatients, meta };
};