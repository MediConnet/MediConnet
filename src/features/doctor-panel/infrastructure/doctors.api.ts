import { extractData, httpClient } from '../../../shared/lib/http';
import type { DoctorDashboard, PaymentMethod, ProfileStatus, WorkSchedule } from '../domain/DoctorDashboard.entity';

// --- INTERFACES INTERNAS (Lo que devuelve el Backend realmente) ---

interface BackendSchedule {
  day_id: number;
  day: string;
  start: string; // ISO String
  end: string;   // ISO String
  is_active: boolean;
}

interface BackendProfileResponse {
  id: string;
  full_name: string;
  email: string;
  specialty: string;
  category: string;
  years_of_experience: number;
  consultation_fee: number;
  payment_methods: string[]; // ["Efectivo", "Tarjeta..."]
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  status: string; // "APPROVED", "PENDING"
  is_published: boolean;
  schedules: BackendSchedule[];
}

export interface UpdateDoctorProfileParams {
  name?: string;
  specialty?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  price?: number;
  description?: string;
  experience?: number; 
  workSchedule?: WorkSchedule[];
  profileStatus?: ProfileStatus;
  paymentMethods?: PaymentMethod;
  consultationDuration?: number;
  blockedDates?: string[];
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountType: string;
    accountHolder: string;
  };
}

// --- HELPER FUNCTIONS (Mappers) ---

/**
 * Convierte Array del Backend ["Efectivo", "Tarjeta"] -> Frontend 'both' | 'card' | 'cash'
 */
const mapBackendPaymentsToFrontend = (methods: string[]): PaymentMethod => {
  if (!methods) return 'cash';
  const hasCash = methods.some(m => m.toLowerCase().includes('efectivo'));
  const hasCard = methods.some(m => m.toLowerCase().includes('tarjeta'));
  
  if (hasCash && hasCard) return 'both';
  if (hasCard) return 'card';
  return 'cash'; 
};

/**
 * Convierte Frontend 'both' | 'card' | 'cash' -> Array del Backend
 */
const mapFrontendPaymentsToBackend = (method: PaymentMethod): string[] => {
  if (method === 'both') return ["Efectivo", "Tarjeta de Crédito"];
  if (method === 'card') return ["Tarjeta de Crédito"];
  return ["Efectivo"];
};

/**
 * Convierte Horarios del Backend (ISO Strings) -> Frontend (HH:mm)
 */
const mapBackendScheduleToFrontend = (backendSchedules: BackendSchedule[]): WorkSchedule[] => {
  if (!backendSchedules || !Array.isArray(backendSchedules)) return [];
  
  const daysMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  return backendSchedules.map(sch => ({
    day: daysMap[sch.day_id] || sch.day.toLowerCase(), // 'monday'
    day_id: sch.day_id,
    enabled: sch.is_active,
    // Extraer solo la hora HH:mm del ISO String
    startTime: sch.start ? new Date(sch.start).toISOString().substring(11, 16) : "09:00",
    endTime: sch.end ? new Date(sch.end).toISOString().substring(11, 16) : "17:00",
  }));
};

// --- API FUNCTIONS ---

/**
 * API: Obtener dashboard del doctor
 * Endpoint: GET /api/doctors/dashboard
 */
export const getDoctorDashboardAPI = async (userId: string): Promise<DoctorDashboard> => {
  const response = await httpClient.get<{ 
    success: boolean; 
    data: {
      totalAppointments?: number;
      pendingAppointments?: number;
      completedAppointments?: number;
      totalRevenue?: number;
      averageRating?: number;
      totalReviews?: number;
      upcomingAppointments?: any[];
      provider: any; // Usamos any aquí porque el dashboard puede traer una estructura parcial
    } 
  }>(
    `/doctors/dashboard?userId=${userId}`
  );
  
  const backendData = extractData(response);
  const provider = backendData.provider || {};
  
  // Mapeo defensivo para evitar errores si faltan datos
  return {
    visits: backendData.totalAppointments || 0,
    contacts: 0,
    reviews: backendData.totalReviews || 0,
    rating: backendData.averageRating || 0,
    doctor: {
      name: provider.commercial_name || "Dr. Usuario",
      specialty: provider.specialty || "Médico",
      email: "", 
      whatsapp: provider.phone_contact || "", 
      address: provider.address_text || "", 
      price: Number(provider.consultation_fee) || 0,
      description: provider.description || "",
      experience: provider.years_of_experience || 0,
      isActive: provider.verification_status === 'APPROVED',
      profileStatus: provider.is_active ? 'published' : 'draft',
      paymentMethods: mapBackendPaymentsToFrontend(provider.payment_methods || []),
      workSchedule: [], // El dashboard usualmente no trae horarios completos
    },
  };
};

/**
 * API: Obtener perfil del doctor (Edición Completa)
 * Endpoint: GET /api/doctors/profile
 */
export const getDoctorProfileAPI = async (): Promise<DoctorDashboard> => {
  // Solicitamos al endpoint que acabamos de probar en Thunder Client
  const response = await httpClient.get<{ success: boolean; data: BackendProfileResponse }>(
    '/doctors/profile'
  );
  
  const backendData = extractData(response);

  // Transformamos la respuesta plana del backend a la estructura anidada del frontend
  return {
    visits: 0, 
    contacts: 0,
    reviews: 0,
    rating: 0,
    doctor: {
      id: backendData.id,
      name: backendData.full_name || "",
      email: backendData.email || "",
      specialty: backendData.specialty || "",
      whatsapp: backendData.whatsapp || backendData.phone || "",
      address: backendData.address || "",
      price: Number(backendData.consultation_fee) || 0,
      description: backendData.description || "",
      experience: backendData.years_of_experience || 0,
      
      // Mapeo de Estado
      isActive: backendData.status === 'APPROVED',
      profileStatus: backendData.is_published ? 'published' : 'draft',
      
      // Mapeo de Arrays y Enums
      paymentMethods: mapBackendPaymentsToFrontend(backendData.payment_methods || []),
      workSchedule: mapBackendScheduleToFrontend(backendData.schedules || [])
    }
  };
};

/**
 * API: Actualizar perfil del doctor
 * Endpoint: PUT /api/doctors/profile
 */
export const updateDoctorProfileAPI = async (
  params: UpdateDoctorProfileParams
): Promise<DoctorDashboard> => {
  
  // 1. Convertimos los datos del Formulario (Frontend) -> JSON para Backend
  const backendPayload = {
    full_name: params.name,
    bio: params.description,
    address: params.address,
    phone: params.whatsapp, // Asumimos whatsapp como contacto principal
    whatsapp: params.whatsapp,
    years_of_experience: params.experience,
    consultation_fee: params.price,
    
    // Transformar booleano de publicación
    is_published: params.profileStatus === 'published',
    
    // Transformar enum de pagos a array de strings
    payment_methods: params.paymentMethods 
      ? mapFrontendPaymentsToBackend(params.paymentMethods) 
      : undefined,
      
    // Nota: El horario (schedule) se suele actualizar en un endpoint aparte o 
    // requiere una lógica más compleja de transformación si se envía aquí.
  };

  const response = await httpClient.put<{ success: boolean; data: BackendProfileResponse }>(
    '/doctors/profile',
    backendPayload
  );
  
  const backendData = extractData(response);

  // 2. Convertimos la respuesta del Backend -> Estructura Frontend (para actualizar la UI)
  return {
    visits: 0, 
    contacts: 0,
    reviews: 0,
    rating: 0,
    doctor: {
      id: backendData.id,
      name: backendData.full_name,
      email: backendData.email,
      specialty: backendData.specialty,
      whatsapp: backendData.whatsapp,
      address: backendData.address,
      price: Number(backendData.consultation_fee),
      description: backendData.description,
      experience: backendData.years_of_experience,
      isActive: backendData.status === 'APPROVED',
      profileStatus: backendData.is_published ? 'published' : 'draft',
      paymentMethods: mapBackendPaymentsToFrontend(backendData.payment_methods || []),
      workSchedule: mapBackendScheduleToFrontend(backendData.schedules || [])
    }
  };
};

/**
 * API: Obtener citas del doctor
 * Endpoint: GET /api/doctors/appointments
 */
export const getDoctorAppointmentsAPI = async (): Promise<any[]> => {
  const response = await httpClient.get<{ success: boolean; data: any[] }>(
    '/doctors/appointments'
  );
  return extractData(response);
};

/**
 * API: Actualizar estado de cita
 * Endpoint: PUT /api/doctors/appointments/:id/status
 */
export const updateAppointmentStatusAPI = async (
  appointmentId: string,
  status: string
): Promise<any> => {
  const response = await httpClient.put<{ success: boolean; data: any }>(
    `/doctors/appointments/${appointmentId}/status`,
    { status }
  );
  return extractData(response);
};

/**
 * API: Crear diagnóstico
 * Endpoint: POST /api/doctors/appointments/:id/diagnosis
 */
export const createDiagnosisAPI = async (
  appointmentId: string,
  diagnosisData: any
): Promise<any> => {
  const response = await httpClient.post<{ success: boolean; data: any }>(
    `/doctors/appointments/${appointmentId}/diagnosis`,
    diagnosisData
  );
  return extractData(response);
};

/**
 * API: Obtener pagos del doctor
 * Endpoint: GET /api/doctors/payments
 */
export const getDoctorPaymentsAPI = async (): Promise<any[]> => {
  const response = await httpClient.get<{ success: boolean; data: any[] }>(
    '/doctors/payments'
  );
  return extractData(response);
};

/**
 * API: Obtener horario del doctor
 * Endpoint: GET /api/doctors/schedule
 */
export const getDoctorScheduleAPI = async (): Promise<WorkSchedule[]> => {
  // Nota: Si el backend devuelve el horario dentro de /profile, podrías reutilizar getDoctorProfileAPI
  // O crear un endpoint específico en el backend. Por ahora asumo que existe la ruta.
  const response = await httpClient.get<{ success: boolean; data: any[] }>(
    '/doctors/schedule'
  );
  const data = extractData(response);
  // Reutilizamos el mapper para consistencia
  return mapBackendScheduleToFrontend(data);
};

/**
 * API: Actualizar horario del doctor
 * Endpoint: PUT /api/doctors/schedule
 */
export const updateDoctorScheduleAPI = async (
  schedule: WorkSchedule[]
): Promise<WorkSchedule[]> => {
  const response = await httpClient.put<{ success: boolean; data: any[] }>(
    '/doctors/schedule',
    { schedule }
  );
  const data = extractData(response);
  return mapBackendScheduleToFrontend(data);
};