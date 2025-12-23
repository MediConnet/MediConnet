import type { Reminder, CreateReminderParams } from '../domain/Reminder.entity';
import { ReminderRepository } from '../infrastructure/reminder.repository';

const reminderRepository = new ReminderRepository();

/**
 * Caso de uso: Crear un nuevo recordatorio
 */
export const createReminderUseCase = async (
  params: CreateReminderParams
): Promise<Reminder> => {
  return await reminderRepository.createReminder(params);
};

