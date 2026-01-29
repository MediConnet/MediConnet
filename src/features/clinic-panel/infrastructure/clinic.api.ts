import { httpClient, extractData } from '../../../shared/lib/http';
import type { ClinicProfile, ClinicDashboard, ClinicSchedule, DaySchedule } from '../domain/clinic.entity';

/**
 * Normaliza el schedule que viene del backend
 * Maneja tanto objetos como arrays, y diferentes nombres de propiedades
 */
const normalizeSchedule = (schedule: any): ClinicSchedule => {
  const defaultSchedule: ClinicSchedule = {
    monday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    tuesday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    wednesday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    thursday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    friday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    saturday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    sunday: { enabled: false, startTime: "09:00", endTime: "18:00" },
  };

  if (!schedule || typeof schedule !== 'object') {
    return defaultSchedule;
  }

  // Si viene como array (formato del backend con day_of_week)
  if (Array.isArray(schedule)) {
    const normalized: ClinicSchedule = { ...defaultSchedule };
    const dayMap: Record<number, keyof ClinicSchedule> = {
      0: 'monday',
      1: 'tuesday',
      2: 'wednesday',
      3: 'thursday',
      4: 'friday',
      5: 'saturday',
      6: 'sunday',
    };

    schedule.forEach((item: any) => {
      const dayOfWeek = item.day_of_week ?? item.dayOfWeek;
      const dayKey = dayMap[dayOfWeek];
      
      if (dayKey) {
        normalized[dayKey] = {
          enabled: Boolean(item.enabled ?? item.is_active ?? false),
          startTime: item.start_time ? formatTimeFromBackend(item.start_time) : (item.startTime || "09:00"),
          endTime: item.end_time ? formatTimeFromBackend(item.end_time) : (item.endTime || "18:00"),
        };
      }
    });
    return normalized;
  }

  // Si viene como objeto
  const normalized: ClinicSchedule = { ...defaultSchedule };
  const dayKeys: (keyof ClinicSchedule)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  dayKeys.forEach((dayKey) => {
    const dayData = schedule[dayKey];
    if (dayData && typeof dayData === 'object') {
      normalized[dayKey] = {
        enabled: Boolean(dayData.enabled ?? dayData.is_active ?? false),
        startTime: dayData.startTime || (dayData.start_time ? formatTimeFromBackend(dayData.start_time) : "09:00"),
        endTime: dayData.endTime || (dayData.end_time ? formatTimeFromBackend(dayData.end_time) : "18:00"),
      };
    }
  });

  return normalized;
};

/**
 * Convierte tiempo del backend (TIME, TIMESTAMP, etc.) a formato HH:mm
 */
const formatTimeFromBackend = (time: string): string => {
  if (!time) return "09:00";
  // Si viene como "09:00:00" o "09:00:00.000", tomar solo HH:mm
  const match = time.match(/^(\d{2}):(\d{2})/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }
  return time;
};

/**
 * API: Obtener perfil de la clínica
 * Endpoint: GET /api/clinics/profile
 */
export const getClinicProfileAPI = async (): Promise<ClinicProfile> => {
  const response = await httpClient.get<{ success: boolean; data: any }>(
    '/clinics/profile'
  );
  const data = extractData(response);
  
  // Normalizar generalSchedule si existe
  if (data.generalSchedule) {
    data.generalSchedule = normalizeSchedule(data.generalSchedule);
  } else if (data.schedules) {
    // Si el backend envía 'schedules' en lugar de 'generalSchedule'
    data.generalSchedule = normalizeSchedule(data.schedules);
  } else {
    // Si no existe, crear uno por defecto
    data.generalSchedule = normalizeSchedule(null);
  }
  
  return data as ClinicProfile;
};

/**
 * API: Actualizar perfil de la clínica
 * Endpoint: PUT /api/clinics/profile
 */
export const updateClinicProfileAPI = async (profile: Partial<ClinicProfile>): Promise<ClinicProfile> => {
  // Asegurar que generalSchedule esté normalizado antes de enviar
  const profileToSend = { ...profile };
  if (profileToSend.generalSchedule) {
    profileToSend.generalSchedule = normalizeSchedule(profileToSend.generalSchedule);
  }
  
  const response = await httpClient.put<{ success: boolean; data: any }>(
    '/clinics/profile',
    profileToSend
  );
  const data = extractData(response);
  
  // Normalizar la respuesta también
  if (data.generalSchedule) {
    data.generalSchedule = normalizeSchedule(data.generalSchedule);
  } else if (data.schedules) {
    data.generalSchedule = normalizeSchedule(data.schedules);
  } else {
    data.generalSchedule = normalizeSchedule(null);
  }
  
  return data as ClinicProfile;
};

/**
 * API: Subir logo de la clínica
 * Endpoint: POST /api/clinics/upload-logo
 */
export const uploadClinicLogoAPI = async (logoFile: File): Promise<{ logoUrl: string }> => {
  const formData = new FormData();
  formData.append('logo', logoFile);
  
  const response = await httpClient.post<{ success: boolean; data: { logoUrl: string } }>(
    '/clinics/upload-logo',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return extractData(response);
};

/**
 * API: Obtener dashboard de la clínica
 * Endpoint: GET /api/clinics/dashboard
 */
export const getClinicDashboardAPI = async (): Promise<ClinicDashboard> => {
  const response = await httpClient.get<{ success: boolean; data: any }>(
    '/clinics/dashboard'
  );
  const data = extractData(response);
  
  // Normalizar generalSchedule en el perfil de la clínica
  if (data.clinic?.generalSchedule) {
    data.clinic.generalSchedule = normalizeSchedule(data.clinic.generalSchedule);
  } else if (data.clinic?.schedules) {
    data.clinic.generalSchedule = normalizeSchedule(data.clinic.schedules);
  } else if (data.clinic) {
    data.clinic.generalSchedule = normalizeSchedule(null);
  }
  
  return data as ClinicDashboard;
};
