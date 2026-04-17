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
  payment_method: 'CASH' | 'CARD';
  cost: string | number;
  is_paid: boolean;
  patients: BackendPatient | null;
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
  
  // Extraer fecha YYYY-MM-DD
  const date = dateObj.toISOString().split('T')[0];
  
  // Extraer hora HH:mm (Asegúrate de manejar la zona horaria si es necesario)
  // Opción simple usando métodos UTC o locales según tu necesidad:
  const time = dateObj.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false });

  return {
    id: appt.id,
    patientId: appt.patient_id,
    
    // Aplanamos el objeto patients
    patientName: appt.patients?.full_name || 'Paciente Desconocido',
    patientPhone: appt.patients?.phone || '',
    patientEmail: appt.patients?.email || undefined,
    patientAvatar: appt.patients?.profile_picture_url || undefined,
    
    date: date,
    time: time, // Ojo: verifica que esto coincida con la hora local de tu usuario
    
    reason: appt.reason,
    status: appt.status,
    
    // Usamos payment_details que ya viene calculado del backend
    paymentMethod: appt.payment_details.method_label, // "Efectivo" / "Tarjeta"
    paymentMethodRaw: appt.payment_method, // "CASH" / "CARD"
    
    price: appt.payment_details.amount,
    isPaid: appt.payment_details.is_paid
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