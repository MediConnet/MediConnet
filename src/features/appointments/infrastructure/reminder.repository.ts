import type { Reminder, CreateReminderParams } from '../domain/Reminder.entity';
import {
  getRemindersAPI,
  createReminderAPI,
  deleteReminderAPI,
} from './reminder.api';

/**
 * Repository: Abstracción de acceso a datos de recordatorios
 */
export class ReminderRepository {
  async getReminders(): Promise<Reminder[]> {
    return await getRemindersAPI();
  }

  async createReminder(params: CreateReminderParams): Promise<Reminder> {
    return await createReminderAPI(params);
  }

  async deleteReminder(reminderId: string): Promise<void> {
    return await deleteReminderAPI(reminderId);
  }
}

