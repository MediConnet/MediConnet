import { useState, useEffect } from 'react';
import { getClinicAppointmentsUseCase } from '../../application/get-clinic-appointments.usecase';
import { updateAppointmentStatusUseCase } from '../../application/update-appointment-status.usecase';
import { updateReceptionStatusUseCase } from '../../application/update-reception-status.usecase';
import type { ClinicAppointment, AppointmentStatus } from '../../domain/appointment.entity';

export const useClinicAppointments = (
  clinicId: string,
  date?: string,
  doctorId?: string
) => {
  const [appointments, setAppointments] = useState<ClinicAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClinicAppointmentsUseCase(clinicId, date, doctorId);
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar citas'));
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId: string, status: AppointmentStatus) => {
    setError(null);
    try {
      await updateAppointmentStatusUseCase(clinicId, appointmentId, status);
      await loadAppointments(); // Recargar lista
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
      await loadAppointments(); // Recargar lista
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
  }, [clinicId, date, doctorId]);

  return {
    appointments,
    loading,
    error,
    updateStatus,
    updateReceptionStatus,
    refetch: loadAppointments,
  };
};
