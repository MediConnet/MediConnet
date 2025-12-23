/**
 * Entidad Reminder
 * Representa un recordatorio de cita médica
 */
export interface Reminder {
  id: string;
  appointmentId?: string; // Opcional, puede ser un recordatorio independiente
  title: string;
  date: string; // Formato: YYYY-MM-DD
  time: string; // Formato: HH:mm
  location?: string;
  notes?: string;
  pushNotificationEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderParams {
  appointmentId?: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
  pushNotificationEnabled: boolean;
}

