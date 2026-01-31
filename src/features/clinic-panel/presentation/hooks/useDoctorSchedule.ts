import { useState, useEffect } from 'react';
import { getDoctorScheduleUseCase } from '../../application/get-doctor-schedule.usecase';
import { updateDoctorScheduleUseCase } from '../../application/update-doctor-schedule.usecase';
import type { DoctorSchedule, DaySchedule } from '../../domain/doctor-schedule.entity';

// ⭐ Función para normalizar el schedule del doctor
const normalizeDoctorSchedule = (schedule: any, doctorId: string): DoctorSchedule => {
  const defaultSchedule: DoctorSchedule = {
    id: schedule?.id || '',
    doctorId: schedule?.doctorId || doctorId,
    clinicId: schedule?.clinicId || '',
    monday: { enabled: false, startTime: '09:00', endTime: '18:00' },
    tuesday: { enabled: false, startTime: '09:00', endTime: '18:00' },
    wednesday: { enabled: false, startTime: '09:00', endTime: '18:00' },
    thursday: { enabled: false, startTime: '09:00', endTime: '18:00' },
    friday: { enabled: false, startTime: '09:00', endTime: '18:00' },
    saturday: { enabled: false, startTime: '09:00', endTime: '18:00' },
    sunday: { enabled: false, startTime: '09:00', endTime: '18:00' },
    createdAt: schedule?.createdAt || new Date().toISOString(),
    updatedAt: schedule?.updatedAt,
  };

  if (!schedule || typeof schedule !== 'object') {
    return defaultSchedule;
  }

  // Si viene como array, convertir a objeto
  if (Array.isArray(schedule)) {
    const normalized: DoctorSchedule = { ...defaultSchedule };
    schedule.forEach((item: any) => {
      const dayKey = item.day?.toLowerCase() || item.dayOfWeek?.toLowerCase();
      if (dayKey && normalized[dayKey as keyof DoctorSchedule]) {
        normalized[dayKey as keyof DoctorSchedule] = {
          enabled: item.enabled ?? item.is_active ?? false,
          startTime: item.startTime || item.start_time || '09:00',
          endTime: item.endTime || item.end_time || '18:00',
          breakStart: item.breakStart || item.break_start,
          breakEnd: item.breakEnd || item.break_end,
        };
      }
    });
    return normalized;
  }

  // Si viene como objeto, asegurar que todos los días existan
  const normalized: DoctorSchedule = { ...defaultSchedule };
  const dayKeys: (keyof DoctorSchedule)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  dayKeys.forEach((dayKey) => {
    const dayData = schedule[dayKey] || schedule.schedule?.[dayKey];
    if (dayData && typeof dayData === 'object') {
      normalized[dayKey] = {
        enabled: dayData.enabled ?? dayData.is_active ?? false,
        startTime: dayData.startTime || dayData.start_time || '09:00',
        endTime: dayData.endTime || dayData.end_time || '18:00',
        breakStart: dayData.breakStart || dayData.break_start,
        breakEnd: dayData.breakEnd || dayData.break_end,
      };
    }
  });

  return normalized;
};

export const useDoctorSchedule = (doctorId: string) => {
  const [schedule, setSchedule] = useState<DoctorSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDoctorScheduleUseCase(doctorId);
      // ⭐ Normalizar la respuesta del backend
      const normalized = normalizeDoctorSchedule(data, doctorId);
      setSchedule(normalized);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar horarios'));
      // Si no existe, crear estructura por defecto normalizada
      const defaultSchedule = normalizeDoctorSchedule(null, doctorId);
      setSchedule(defaultSchedule);
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (updatedSchedule: Partial<DoctorSchedule>) => {
    if (!schedule) return;
    
    setError(null);
    try {
      const result = await updateDoctorScheduleUseCase(doctorId, updatedSchedule);
      setSchedule(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al actualizar horarios');
      setError(error);
      throw error;
    }
  };

  useEffect(() => {
    if (doctorId) {
      loadSchedule();
    }
  }, [doctorId]);

  return {
    schedule,
    loading,
    error,
    updateSchedule,
    refetch: loadSchedule,
  };
};
