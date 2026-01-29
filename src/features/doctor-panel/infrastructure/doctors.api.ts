import { extractData, httpClient } from '../../../shared/lib/http';
import type { DoctorDashboard, PaymentMethod, ProfileStatus, WorkSchedule } from '../domain/DoctorDashboard.entity';

// --- INTERFACES INTERNAS (Lo que devuelve el Backend realmente) ---

interface BackendSchedule {
  day_id: number;
  day: string;
  start: string; 
  end: string;   
  is_active: boolean;
}

interface BackendProfileResponse {
  id: string;
  full_name: string;
  email: string;
  specialty?: string; // String formateado "Cardiología, Pediatría"
  specialties_list?: string[]; // Array crudo ["Cardiología", "Pediatría"]
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

// Interface para la lista de especialidades disponibles (Select)
export interface Specialty {
  id: string;
  name: string;
  description?: string;
  color_hex?: string;
}

export interface UpdateDoctorProfileParams {
  name?: string;
  specialties?: string[]; 
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
  const safeSchedules = Array.isArray(backendSchedules) ? backendSchedules : [];
  
  const daysTemplate = [
    { day: "monday", day_id: 1 },
    { day: "tuesday", day_id: 2 },
    { day: "wednesday", day_id: 3 },
    { day: "thursday", day_id: 4 },
    { day: "friday", day_id: 5 },
  ];

  return daysTemplate.map(template => {
    const found = safeSchedules.find(sch => 
      sch.day_id === template.day_id || 
      sch.day.toLowerCase() === template.day
    );

    if (found) {
      // CASO A: El día existe en base de datos. Usamos sus datos reales.
      return {
        day: template.day,
        day_id: template.day_id,
        enabled: found.is_active,
        startTime: found.start ? new Date(found.start).toISOString().substring(11, 16) : "09:00",
        endTime: found.end ? new Date(found.end).toISOString().substring(11, 16) : "17:00",
      };
    } else {
      // CASO B: El día NO vino del backend (hueco). Lo rellenamos como "Cerrado".
      return {
        day: template.day,
        day_id: template.day_id,
        enabled: false, 
        startTime: "09:00",
        endTime: "17:00",
      };
    }
  });
};

// --- API FUNCTIONS ---

/**
 * API: Obtener lista de especialidades disponibles
 * Endpoint: GET /api/specialties
 */
export const getSpecialtiesAPI = async (): Promise<Specialty[]> => {
  const response = await httpClient.get<{ success: boolean; data: Specialty[] }>(
    '/specialties'
  );
  return extractData(response);
};

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
      provider: any; 
    } 
  }>(
    `/doctors/dashboard?userId=${userId}`
  );
  
  const backendData = extractData(response);
  const provider = backendData.provider || {};
  
  // Preferimos la lista de especialidades (array) si existe, sino el string
  const specialtyValue = (provider.specialties_list && provider.specialties_list.length > 0)
    ? provider.specialties_list
    : (provider.specialty || provider.specialties || "Médico");

  return {
    visits: backendData.totalAppointments || 0,
    contacts: 0,
    reviews: backendData.totalReviews || 0,
    rating: backendData.averageRating || 0,
    doctor: {
      name: provider.commercial_name || "Dr. Usuario",
      specialty: specialtyValue, // Puede ser string o array
      email: provider.email || (provider.users && provider.users.email) || "", 
      whatsapp: provider.phone_contact || "", 
      address: provider.address_text || "", 
      price: Number(provider.consultation_fee) || 0,
      description: provider.description || "",
      experience: provider.years_of_experience || 0,
      isActive: provider.verification_status === 'APPROVED',
      profileStatus: provider.is_active ? 'published' : 'draft',
      paymentMethods: mapBackendPaymentsToFrontend(provider.payment_methods || []),
      workSchedule: mapBackendScheduleToFrontend(provider.schedules || []), 
    },
    // ⭐ Información de clínica si el médico está asociado
    clinic: (backendData as any).clinic ? {
      id: (backendData as any).clinic.id,
      name: (backendData as any).clinic.name,
      address: (backendData as any).clinic.address,
      phone: (backendData as any).clinic.phone,
      whatsapp: (backendData as any).clinic.whatsapp,
      logoUrl: (backendData as any).clinic.logoUrl,
    } : null
  };
};

/**
 * API: Obtener perfil del doctor (Edición Completa)
 * Endpoint: GET /api/doctors/profile
 */
export const getDoctorProfileAPI = async (): Promise<DoctorDashboard> => {
  const response = await httpClient.get<{ success: boolean; data: BackendProfileResponse }>(
    '/doctors/profile'
  );
  
  const backendData = extractData(response);

  // --- CORRECCIÓN AQUÍ: Prioridad correcta para especialidades ---
  // Si backendData.specialties_list existe y tiene datos, úsalo.
  // Si no, usa backendData.specialty (string).
  // Si no, usa un array vacío.
  let specialtyValue: string | string[] = [];
  
  if (backendData.specialties_list && backendData.specialties_list.length > 0) {
      specialtyValue = backendData.specialties_list;
  } else if (backendData.specialty) {
      specialtyValue = backendData.specialty; // Puede ser un string "Cardiología, Pediatría"
  }

  return {
    visits: 0, 
    contacts: 0,
    reviews: 0,
    rating: 0,
    doctor: {
      id: backendData.id,
      
      // Mapeo correcto de nombres snake_case -> camelCase
      name: backendData.full_name || "",  
      email: backendData.email || "",
      
      specialty: specialtyValue as any, 
      
      whatsapp: backendData.whatsapp || backendData.phone || "",
      address: backendData.address || "",
      
      // Conversión numérica segura
      price: Number(backendData.consultation_fee) || 0,
      
      description: backendData.description || "",
      
      // ESTE ERA EL ERROR PRINCIPAL: years_of_experience -> experience
      experience: Number(backendData.years_of_experience) || 0,
      
      isActive: backendData.status === 'APPROVED',
      profileStatus: backendData.is_published ? 'published' : 'draft',
      
      paymentMethods: mapBackendPaymentsToFrontend(backendData.payment_methods || []),
      workSchedule: mapBackendScheduleToFrontend(backendData.schedules || [])
    },
    // ⭐ Información de clínica si el médico está asociado
    clinic: (backendData as any).clinic ? {
      id: (backendData as any).clinic.id,
      name: (backendData as any).clinic.name,
      address: (backendData as any).clinic.address,
      phone: (backendData as any).clinic.phone,
      whatsapp: (backendData as any).clinic.whatsapp,
      logoUrl: (backendData as any).clinic.logoUrl,
    } : null
  };
};

/**
 * API: Actualizar perfil del doctor
 * Endpoint: PUT /api/doctors/profile
 */
export const updateDoctorProfileAPI = async (
  params: UpdateDoctorProfileParams
): Promise<DoctorDashboard> => {
  
  const backendPayload = {
    full_name: params.name,
    bio: params.description,
    address: params.address,
    phone: params.whatsapp,
    whatsapp: params.whatsapp,
    years_of_experience: params.experience,
    consultation_fee: params.price,
    
    is_published: params.profileStatus === 'published',
    
    specialties: params.specialties,
    
    payment_methods: params.paymentMethods 
      ? mapFrontendPaymentsToBackend(params.paymentMethods) 
      : undefined,

    workSchedule: params.workSchedule,
  };

  const response = await httpClient.put<{ success: boolean; data: BackendProfileResponse }>(
    '/doctors/profile',
    backendPayload
  );
  
  const backendData = extractData(response);

  // Mapeamos la respuesta actualizada
  const specialtyValue = (backendData.specialties_list && backendData.specialties_list.length > 0) 
    ? backendData.specialties_list 
    : (backendData.specialty || "");

  return {
    visits: 0, 
    contacts: 0,
    reviews: 0,
    rating: 0,
    doctor: {
      id: backendData.id,
      name: backendData.full_name,
      email: backendData.email,
      specialty: specialtyValue as any,
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
  const response = await httpClient.get<{ success: boolean; data: any[] }>(
    '/doctors/schedule'
  );
  const data = extractData(response);
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