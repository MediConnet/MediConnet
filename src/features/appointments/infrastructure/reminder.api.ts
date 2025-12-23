import type { Reminder, CreateReminderParams } from '../domain/Reminder.entity';

const STORAGE_KEY = 'medify_reminders';

/**
 * API: Obtener lista de recordatorios del usuario
 */
export const getRemindersAPI = async (): Promise<Reminder[]> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

/**
 * API: Crear un nuevo recordatorio
 */
export const createReminderAPI = async (
  params: CreateReminderParams
): Promise<Reminder> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  const reminders = await getRemindersAPI();
  const newReminder: Reminder = {
    id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...params,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  reminders.push(newReminder);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));

  return newReminder;
};

/**
 * API: Eliminar un recordatorio
 */
export const deleteReminderAPI = async (reminderId: string): Promise<void> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  const reminders = await getRemindersAPI();
  const filtered = reminders.filter((rem) => rem.id !== reminderId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

