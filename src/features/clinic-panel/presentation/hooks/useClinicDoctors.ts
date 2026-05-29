import { useState, useEffect, useCallback } from 'react';
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
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadDoctors = useCallback(async () => {
    if (!clinicId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getClinicDoctorsUseCase(clinicId, { page, limit });
      setDoctors(result.data);
      setTotal(result.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar médicos'));
    } finally {
      setLoading(false);
    }
  }, [clinicId, page, limit]);

  const inviteDoctor = async (email: string): Promise<DoctorInvitation> => {
    setError(null);
    try {
      const invitation = await inviteDoctorUseCase(clinicId, email);
      await loadDoctors();
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
      await loadDoctors();
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
      await loadDoctors();
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
      await loadDoctors();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al eliminar médico');
      setError(error);
      throw error;
    }
  };

  const updateConsultationFee = async (doctorId: string, consultationFee: number) => {
    setError(null);
    try {
      const response = await fetch(`/api/clinics/${clinicId}/doctors/${doctorId}/consultation-fee`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultationFee }),
      });
      if (!response.ok) throw new Error('Error al actualizar precio');
      await loadDoctors();
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
  }, [clinicId, page, limit]);

  return {
    doctors,
    loading,
    error,
    total,
    page,
    setPage,
    limit,
    setLimit,
    inviteDoctor,
    toggleStatus,
    assignOffice,
    deleteDoctor,
    updateConsultationFee,
    refetch: loadDoctors,
  };
};
