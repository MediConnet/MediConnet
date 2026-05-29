import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import { getAppointmentsAPI } from "../../infrastructure/appointments.api";
import {
  updateAppointmentStatusAPI,
} from "../../infrastructure/doctors.api";
import type { DoctorAppointment } from "../../domain/Appointment.entity";

export const useDoctorAppointments = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const result = await getAppointmentsAPI(undefined, { page, limit });
      setAppointments(result.data);
      setTotal(result.pagination.total);
    } catch (error) {
      console.error("Error cargando citas:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    appointments,
    loading,
    total,
    page,
    setPage,
    limit,
    setLimit,
    refetch: loadData,
  };
};

/**
 * Hook: Actualizar estado de una cita
 * Con invalidación automática del cache de appointments
 */
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: string }) =>
      updateAppointmentStatusAPI(appointmentId, status),
    onSuccess: () => {
      // Invalidar cache para refrescar la lista de appointments
      queryClient.invalidateQueries({ queryKey: ['doctors', 'appointments', user?.id] });
      // También invalidar dashboard que puede mostrar estadísticas
      queryClient.invalidateQueries({ queryKey: ['doctors', 'dashboard', user?.id] });
    },
  });
};
