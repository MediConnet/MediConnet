import { useCallback, useEffect, useState } from "react";
import type { ClinicAssociatedAppointment } from "../types/ClinicAssociatedDoctor.entity";
import {
  getClinicAssociatedAppointmentsAPI,
  updateClinicAppointmentStatusAPI,
} from "../api/clinic-associated.api";
import { ensureArray } from "../api/clinic-associated-list.utils";
import { normalizeClinicAppointmentStatus } from "../api/clinic-associated.mappers";

export const useClinicAssociatedAppointments = (clinicId: string) => {
  const [appointments, setAppointments] = useState<ClinicAssociatedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadAppointments = useCallback(async () => {
    if (!clinicId) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getClinicAssociatedAppointmentsAPI();
      setAppointments(ensureArray<ClinicAssociatedAppointment>(data));
    } catch (error) {
      console.error("Error cargando citas:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [clinicId]);

  const updateStatus = async (
    appointmentId: string,
    status: "COMPLETED" | "NO_SHOW",
  ) => {
    setUpdatingStatus(true);
    try {
      const patch = await updateClinicAppointmentStatusAPI(appointmentId, status);
      const normalizedStatus = normalizeClinicAppointmentStatus(patch.status);
      setAppointments((prev) =>
        ensureArray<ClinicAssociatedAppointment>(prev).map((apt) =>
          apt.id === appointmentId ? { ...apt, status: normalizedStatus } : apt,
        ),
      );
      return normalizedStatus;
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return {
    appointments,
    loading,
    updatingStatus,
    loadAppointments,
    updateStatus,
  };
};
