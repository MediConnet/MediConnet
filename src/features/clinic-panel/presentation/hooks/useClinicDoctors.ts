import { useState, useEffect } from 'react';
import { getClinicDoctorsUseCase } from '../../application/get-clinic-doctors.usecase';
import { inviteDoctorUseCase } from '../../application/invite-doctor.usecase';
import { toggleDoctorStatusUseCase } from '../../application/toggle-doctor-status.usecase';
import { assignOfficeUseCase } from '../../application/assign-office.usecase';
import { deleteDoctorUseCase } from '../../application/delete-doctor.usecase';
import type { ClinicDoctor, DoctorInvitation } from '../../domain/doctor.entity';

export const useClinicDoctors = (clinicId: string) => {
  const [doctors, setDoctors] = useState<ClinicDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClinicDoctorsUseCase(clinicId);
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar médicos'));
    } finally {
      setLoading(false);
    }
  };

  const inviteDoctor = async (email: string): Promise<DoctorInvitation> => {
    setError(null);
    try {
      const invitation = await inviteDoctorUseCase(clinicId, email);
      await loadDoctors(); // Recargar lista
      return invitation;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al invitar médico');
      setError(error);
      throw error;
    }
  };

  const toggleStatus = async (doctorId: string) => {
    setError(null);
    try {
      await toggleDoctorStatusUseCase(clinicId, doctorId);
      await loadDoctors(); // Recargar lista
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al cambiar estado');
      setError(error);
      throw error;
    }
  };

  const assignOffice = async (doctorId: string, officeNumber: string) => {
    setError(null);
    try {
      await assignOfficeUseCase(clinicId, doctorId, officeNumber);
      await loadDoctors(); // Recargar lista
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al asignar consultorio');
      setError(error);
      throw error;
    }
  };

  const deleteDoctor = async (doctorId: string) => {
    setError(null);
    try {
      await deleteDoctorUseCase(clinicId, doctorId);
      await loadDoctors(); // Recargar lista
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al eliminar médico');
      setError(error);
      throw error;
    }
  };

  const updateConsultationFee = async (doctorId: string, consultationFee: number) => {
    setError(null);
    try {
      // Por ahora usamos el mock directamente
      const { updateDoctorConsultationFeeMock } = await import('../../infrastructure/doctors.mock');
      await updateDoctorConsultationFeeMock(clinicId, doctorId, consultationFee);
      await loadDoctors(); // Recargar lista
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al actualizar precio');
      setError(error);
      throw error;
    }
  };

  useEffect(() => {
    if (clinicId) {
      loadDoctors();
    }
  }, [clinicId]);

  return {
    doctors,
    loading,
    error,
    inviteDoctor,
    toggleStatus,
    assignOffice,
    deleteDoctor,
    updateConsultationFee,
    refetch: loadDoctors,
  };
};
