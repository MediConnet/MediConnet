import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointmentsUseCase } from '../../application/get-appointments.usecase';
import { createAppointmentUseCase, type CreateAppointmentParams } from '../../application/create-appointment.usecase';
import { deleteAppointmentUseCase } from '../../application/delete-appointment.usecase';
import type { Appointment } from '../../domain/Appointment.entity';

/**
 * Hook: Obtener lista de citas del usuario
 */
export const useAppointments = () => {
  return useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: () => getAppointmentsUseCase(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * Hook: Crear una nueva cita
 */
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateAppointmentParams) => createAppointmentUseCase(params),
    onSuccess: () => {
      // Invalidar y refrescar las citas después de crear una nueva
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.refetchQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      console.error('Error en useCreateAppointment:', error);
    },
  });
};

/**
 * Hook: Eliminar una cita
 */
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => deleteAppointmentUseCase(appointmentId),
    onSuccess: () => {
      // Invalidar y refrescar las citas después de eliminar
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.refetchQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      console.error('Error en useDeleteAppointment:', error);
    },
  });
};

