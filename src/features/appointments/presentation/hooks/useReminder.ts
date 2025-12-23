import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRemindersUseCase } from '../../application/get-reminders.usecase';
import { createReminderUseCase } from '../../application/create-reminder.usecase';
import { deleteReminderUseCase } from '../../application/delete-reminder.usecase';
import type { Reminder, CreateReminderParams } from '../../domain/Reminder.entity';

/**
 * Hook: Obtener lista de recordatorios del usuario
 */
export const useReminders = () => {
  return useQuery<Reminder[]>({
    queryKey: ['reminders'],
    queryFn: () => getRemindersUseCase(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * Hook: Crear un nuevo recordatorio
 */
export const useCreateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateReminderParams) => createReminderUseCase(params),
    onSuccess: () => {
      // Invalidar y refrescar los recordatorios después de crear uno nuevo
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      queryClient.refetchQueries({ queryKey: ['reminders'] });
    },
    onError: (error) => {
      console.error('Error en useCreateReminder:', error);
    },
  });
};

/**
 * Hook: Eliminar un recordatorio
 */
export const useDeleteReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reminderId: string) => deleteReminderUseCase(reminderId),
    onSuccess: () => {
      // Invalidar y refrescar los recordatorios después de eliminar
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      queryClient.refetchQueries({ queryKey: ['reminders'] });
    },
    onError: (error) => {
      console.error('Error en useDeleteReminder:', error);
    },
  });
};

