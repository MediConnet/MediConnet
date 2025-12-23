import { ReminderRepository } from '../infrastructure/reminder.repository';

const reminderRepository = new ReminderRepository();

/**
 * Caso de uso: Eliminar un recordatorio
 */
export const deleteReminderUseCase = async (reminderId: string): Promise<void> => {
  return await reminderRepository.deleteReminder(reminderId);
};

