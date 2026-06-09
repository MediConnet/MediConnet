import type { ClinicSchedule, DaySchedule } from '../../clinic-panel/domain/clinic.entity';
import type { DoctorSchedule } from '../../clinic-panel/domain/doctor-schedule.entity';

const WEEK_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

type WeekDay = (typeof WEEK_DAYS)[number];

const defaultClinicSchedule = (): ClinicSchedule => ({
  monday: { enabled: false, startTime: '09:00', endTime: '18:00' },
  tuesday: { enabled: false, startTime: '09:00', endTime: '18:00' },
  wednesday: { enabled: false, startTime: '09:00', endTime: '18:00' },
  thursday: { enabled: false, startTime: '09:00', endTime: '18:00' },
  friday: { enabled: false, startTime: '09:00', endTime: '18:00' },
  saturday: { enabled: false, startTime: '09:00', endTime: '13:00' },
  sunday: { enabled: false, startTime: '09:00', endTime: '13:00' },
});

export const normalizeClinicSchedule = (schedule: unknown): ClinicSchedule => {
  const base = defaultClinicSchedule();
  if (!schedule || typeof schedule !== 'object') {
    return base;
  }

  const source = schedule as Record<string, DaySchedule>;
  WEEK_DAYS.forEach((day) => {
    const dayData = source[day];
    if (dayData && typeof dayData === 'object') {
      base[day] = {
        enabled: Boolean(dayData.enabled),
        startTime: dayData.startTime || '09:00',
        endTime: dayData.endTime || '18:00',
      };
    }
  });

  return base;
};

export const normalizeDoctorSchedule = (
  payload: {
    doctorId?: string;
    clinicId?: string;
    schedule?: unknown;
  } | null,
  doctorId = '',
  clinicId = '',
): DoctorSchedule => {
  const defaultDay = (endTime: string) => ({
    enabled: false,
    startTime: '09:00',
    endTime,
    breakStart: undefined as string | undefined,
    breakEnd: undefined as string | undefined,
  });

  const result: DoctorSchedule = {
    id: '',
    doctorId: payload?.doctorId || doctorId,
    clinicId: payload?.clinicId || clinicId,
    monday: defaultDay('17:00'),
    tuesday: defaultDay('17:00'),
    wednesday: defaultDay('17:00'),
    thursday: defaultDay('17:00'),
    friday: defaultDay('17:00'),
    saturday: defaultDay('13:00'),
    sunday: defaultDay('13:00'),
    createdAt: new Date().toISOString(),
  };

  const schedule = payload?.schedule;
  if (!schedule || typeof schedule !== 'object') {
    return result;
  }

  const source = schedule as Record<string, DoctorSchedule[WeekDay]>;
  WEEK_DAYS.forEach((day) => {
    const dayData = source[day];
    if (dayData && typeof dayData === 'object') {
      result[day] = {
        enabled: Boolean(dayData.enabled),
        startTime: dayData.startTime || '09:00',
        endTime: dayData.endTime || '17:00',
        breakStart: dayData.breakStart ?? undefined,
        breakEnd: dayData.breakEnd ?? undefined,
      };
    }
  });

  return result;
};

export const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(':').map((n) => parseInt(n, 10));
  return h * 60 + m;
};

const dayLabels: Record<WeekDay, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

export const validateDoctorScheduleAgainstClinic = (
  doctorSchedule: DoctorSchedule,
  clinicSchedule: ClinicSchedule,
): string | null => {
  for (const day of WEEK_DAYS) {
    const doctorDay = doctorSchedule[day];
    const clinicDay = clinicSchedule[day];
    const label = dayLabels[day];

    if (!doctorDay.enabled) continue;

    if (!clinicDay.enabled) {
      return `No puedes habilitar ${label}: la clínica está cerrada ese día.`;
    }

    const ds = timeToMinutes(doctorDay.startTime);
    const de = timeToMinutes(doctorDay.endTime);
    const cs = timeToMinutes(clinicDay.startTime);
    const ce = timeToMinutes(clinicDay.endTime);

    if (ds >= de) {
      return `El horario de ${label} debe terminar después de iniciar.`;
    }

    if (ds < cs || de > ce) {
      return `El horario de ${label} debe estar entre ${clinicDay.startTime} y ${clinicDay.endTime} (horario de la clínica).`;
    }

    const hasBreakStart = Boolean(doctorDay.breakStart);
    const hasBreakEnd = Boolean(doctorDay.breakEnd);
    if (hasBreakStart !== hasBreakEnd) {
      return `Completa el almuerzo en ${label}.`;
    }
    if (hasBreakStart && hasBreakEnd) {
      const bs = timeToMinutes(doctorDay.breakStart!);
      const be = timeToMinutes(doctorDay.breakEnd!);
      if (bs >= be || bs < ds || be > de) {
        return `El almuerzo de ${label} debe estar dentro de tu horario de atención.`;
      }
    }
  }

  return null;
};

export const doctorScheduleToApiPayload = (schedule: DoctorSchedule): Record<string, DaySchedule & { breakStart?: string | null; breakEnd?: string | null }> => {
  const payload: Record<string, DaySchedule & { breakStart?: string | null; breakEnd?: string | null }> = {};
  WEEK_DAYS.forEach((day) => {
    const d = schedule[day];
    payload[day] = {
      enabled: d.enabled,
      startTime: d.startTime,
      endTime: d.endTime,
      breakStart: d.breakStart ?? null,
      breakEnd: d.breakEnd ?? null,
    };
  });
  return payload;
};
