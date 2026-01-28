import { useState, useEffect } from 'react';
import { getDoctorScheduleUseCase } from '../../application/get-doctor-schedule.usecase';
import { updateDoctorScheduleUseCase } from '../../application/update-doctor-schedule.usecase';
import type { DoctorSchedule, DaySchedule } from '../../domain/doctor-schedule.entity';

export const useDoctorSchedule = (doctorId: string) => {
  const [schedule, setSchedule] = useState<DoctorSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDoctorScheduleUseCase(doctorId);
      setSchedule(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar horarios'));
      // Si no existe, crear estructura por defecto
      setSchedule({
        id: '',
        doctorId,
        clinicId: '',
        monday: { enabled: false, startTime: '09:00', endTime: '18:00' },
        tuesday: { enabled: false, startTime: '09:00', endTime: '18:00' },
        wednesday: { enabled: false, startTime: '09:00', endTime: '18:00' },
        thursday: { enabled: false, startTime: '09:00', endTime: '18:00' },
        friday: { enabled: false, startTime: '09:00', endTime: '18:00' },
        saturday: { enabled: false, startTime: '09:00', endTime: '18:00' },
        sunday: { enabled: false, startTime: '09:00', endTime: '18:00' },
        createdAt: new Date().toISOString(),
      });
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
