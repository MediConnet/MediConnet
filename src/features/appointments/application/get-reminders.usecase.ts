import type { Reminder } from '../domain/Reminder.entity';
import { ReminderRepository } from '../infrastructure/reminder.repository';

const reminderRepository = new ReminderRepository();

/**
 * Caso de uso: Obtener lista de recordatorios del usuario
 */
export const getRemindersUseCase = async (): Promise<Reminder[]> => {
  return await reminderRepository.getReminders();
};

