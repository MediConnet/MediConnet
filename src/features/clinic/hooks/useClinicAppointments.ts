import { useState, useEffect, useCallback } from 'react';
import { getClinicAppointmentsUseCase } from '../services/get-clinic-appointments.usecase';
import { updateAppointmentStatusUseCase } from '../services/update-appointment-status.usecase';
import { updateReceptionStatusUseCase } from '../services/update-reception-status.usecase';
import type { ClinicAppointment, AppointmentStatus } from '../types/appointment.entity';
import { onRealtimeEvent } from '../../../shared/realtime/realtimeEvents';

export const useClinicAppointments = (
  clinicId: string,
  date?: string,
  doctorId?: string
) => {
  const [appointments, setAppointments] = useState<ClinicAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadAppointments = useCallback(async () => {
    if (!clinicId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getClinicAppointmentsUseCase(clinicId, { page, limit, date, doctorId });
      setAppointments(result.data);
      setTotal(result.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar citas'));
    } finally {
      setLoading(false);
    }
  }, [clinicId, date, doctorId, page, limit]);

  const updateStatus = async (appointmentId: string, status: AppointmentStatus) => {
    setError(null);
    try {
      await updateAppointmentStatusUseCase(clinicId, appointmentId, status);
      await loadAppointments();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al actualizar estado');
      setError(error);
      throw error;
    }
  };

  const updateReceptionStatus = async (
    appointmentId: string,
    receptionStatus: 'arrived' | 'not_arrived' | 'attended',
    notes?: string
  ) => {
    setError(null);
    try {
      await updateReceptionStatusUseCase(clinicId, appointmentId, receptionStatus, notes);
      await loadAppointments();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al actualizar estado de recepción');
      setError(error);
      throw error;
    }
  };

  useEffect(() => {
    if (clinicId) {
      loadAppointments();
    }
  }, [clinicId, date, doctorId, page, limit]);

  useEffect(() => {
    if (!clinicId) return;
    return onRealtimeEvent(({ name }) => {
      if (name === "appointment:created" || name === "appointment:updated") {
        loadAppointments();
      }
    });
  }, [clinicId, date, doctorId]);

  return {
    appointments,
    loading,
    error,
    total,
    page,
    setPage,
    limit,
    setLimit,
    updateStatus,
    updateReceptionStatus,
    refetch: loadAppointments,
  };
};
