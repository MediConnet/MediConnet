import { httpClient, extractData } from '../../../shared/lib/http';
import type { ClinicProfile, ClinicDashboard, ClinicSchedule } from '../types/clinic.entity';

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

const formatTimeFromBackend = (time: string): string => {
  if (!time) return "09:00";
  const match = time.match(/^(\d{2}):(\d{2})/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }
  return time;
};

export const getClinicProfileAPI = async (): Promise<ClinicProfile> => {
  const response = await httpClient.get<{ success: boolean; data: any }>(
    '/clinics/profile'
  );
  const data = extractData(response);

  if (data.generalSchedule) {
    data.generalSchedule = normalizeSchedule(data.generalSchedule);
  } else if (data.schedules) {
    data.generalSchedule = normalizeSchedule(data.schedules);
  } else {
    data.generalSchedule = normalizeSchedule(null);
  }

  return data as ClinicProfile;
};

export const updateClinicScheduleAPI = async (schedule: ClinicSchedule): Promise<ClinicSchedule> => {
  const response = await httpClient.put<{ success: boolean; data: any }>(
    '/clinics/schedule',
    { schedule }
  );
  const data = extractData(response);

  return data.schedule || data;
};

export const updateClinicProfileAPI = async (profile: Partial<ClinicProfile>): Promise<ClinicProfile> => {
  const { generalSchedule: _gs, createdAt: _ca, updatedAt: _ua, id: _id, ...profileToSend } = profile as any;

  const response = await httpClient.put<{ success: boolean; data: any }>(
    '/clinics/profile',
    profileToSend
  );
  const data = extractData(response);

  if (data.generalSchedule) {
    data.generalSchedule = normalizeSchedule(data.generalSchedule);
  } else if (data.schedules) {
    data.generalSchedule = normalizeSchedule(data.schedules);
  } else {
    data.generalSchedule = normalizeSchedule(null);
  }

  return data as ClinicProfile;
};

export const uploadClinicLogoAPI = async (base64: string): Promise<{ logoUrl: string }> => {
  const response = await httpClient.post<{ success: boolean; data: { logoUrl: string } }>(
    '/clinics/upload-logo',
    { logoUrl: base64 }
  );
  return extractData(response);
};

export const getClinicDashboardAPI = async (): Promise<ClinicDashboard> => {
  const response = await httpClient.get<{ success: boolean; data: any }>(
    '/clinics/dashboard'
  );
  const data = extractData(response);

  if (data.clinic?.generalSchedule) {
    data.clinic.generalSchedule = normalizeSchedule(data.clinic.generalSchedule);
  } else if (data.clinic?.schedules) {
    data.clinic.generalSchedule = normalizeSchedule(data.clinic.schedules);
  } else if (data.clinic) {
    data.clinic.generalSchedule = normalizeSchedule(null);
  }

  return data as ClinicDashboard;
};
